let store = Immutable.Map({
    rovers: ['Curiosity', 'Opportunity', 'Spirit']
})

window.addEventListener('load', () => {
    const roverOptions = document.getElementById('roverOptions')
    roverOptions.innerHTML = RoverOptions()

    const roverButtons = store.get('rovers').reduce((total, curr) => {
        total.push(document.getElementById(curr))
        return total
    }, [])

    setListener(roverButtons, (button) => {
        getRoverInfo(button.textContent)
        getLatestPhotos(button.textContent)
    })
})

const root = document.getElementById('root')

const roverInfoRetrieved = (roverInfo) => {
    const retrievedRoverInfo = roverInfo.get('roverData')
    roverInfo.innerHTML = RoverInfo(retrievedRoverInfo)
}

const roverPhotosRetrieved = (fetchedPhotos) => {
    const cameraOptions = document.getElementById('cameraOptions')
    const retrievedPhotos = fetchedPhotos.get('photos').photos
    cameraOptions.innerHTML = CameraOptions(availableCameras(retrievedPhotos))
    const cameraButtons = document.querySelectorAll('.camera')
    
    setListener(cameraButtons, (button) => {
        let filteredPhotos = retrievedPhotos.filter(photo => photo.camera.full_name == button.textContent)
        document.getElementById('photos').innerHTML = Photos(filteredPhotos)
    })

    const photos = document.getElementById('photos')
    photos.innerHTML = Photos(retrievedPhotos)
}

const setListener = (buttons, action) => {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            action(button)
        })
    })
}

const RoverOptions = () => {
    let roverButtons = "<h3>Select a rover!</h3>"
    for (rover of store.get('rovers')) {
        roverButtons += `<button type="button" id="${rover}">${rover}</button>`
    }

    return `
        <section>
            ${roverButtons}
        </section>
    `
}

const RoverInfo = (selectedRover) => {
    return `
        <h3>You selected ${selectedRover.rover}!</h3>
        <p>Launch Date: ${selectedRover.launchDate}</p>
        <p>Landing Date: ${selectedRover.landingDate}</p>
        <p>Status: ${selectedRover.status}</p>
    `
}

const Photos = (photos) => {
    let photoItems = "<h3>Latest Photos!</h3>"
    for (photo of photos) {
        photoItems += `
            <img src="${photo.img_src}" style="max-width: 100%">
            <p>Camera Type: ${photo.camera.full_name} (${photo.camera.name})</p>
            <p>Earth Date: ${photo.earth_date}</p>
            <p>Sol: ${photo.sol}</p>
            <p>==========</p>
        `
    }

    return photoItems
}

const CameraOptions = (cameras) => {
    let cameraOptions = "<h3>Filter by camera</h3>"
    for (camera of cameras) {
        cameraOptions += `<button type="button" id="${camera}" class="camera">${camera}</button>`
    }

    return `
        <section>
            ${cameraOptions}
        </section>
    `
}

const availableCameras = (photos) => {
    return photos.reduce((total, currValue) => {
        if (!total.includes(currValue.camera.full_name)) {
            total.push(currValue.camera.full_name)
        }
        return total
    }, [])
}

const photosByCameraType = (cameraType, retrievedPhotos) => {
    let filteredPhotos = retrievedPhotos.filter(photo => photo.camera.full_name == cameraType)
    document.getElementById('photos').innerHTML = Photos(filteredPhotos)
}

function setNewStore(prop) {
    return store.merge(Immutable.Map(prop))
}

const getRoverInfo = async (roverName) => {
    fetch(`http://localhost:3000/${roverName}/cameras`)
        .then(res => res.json())
        .then(roverData => roverInfoRetrieved(setNewStore({ roverData })))
}

const getLatestPhotos = async (roverName) => {
    const maxSol = () => {
        switch (roverName) {
            case 'Opportunity':
                return 5111
            case 'Spirit':
                return 2208
            case 'Curiosity':
                return 3395
        }
    }

    fetch(`http://localhost:3000/${roverName}/cameras/${maxSol(roverName)}`)
        .then(res => res.json())
        .then(photos => roverPhotosRetrieved(setNewStore({ photos })))
}