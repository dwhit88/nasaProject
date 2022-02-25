require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

const nasaPathMarsPhotos = "https://api.nasa.gov/mars-photos/api/v1"

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/:rover/cameras', async (req, res) => {
    try {
        let response = await fetch(`${nasaPathMarsPhotos}/rovers/${req.param('rover')}?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({
            rover: response.rover.name,
            cameras: response.rover.cameras,
            maxSol: response.rover.max_sol
        })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/:rover/cameras/:sol', async (req, res) => {
    try {
        let response = await fetch(`${nasaPathMarsPhotos}/rovers/${req.param('rover')}/photos?sol=${req.param('sol')}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({
            photos: response.photos
        })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))