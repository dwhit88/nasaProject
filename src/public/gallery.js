// let store = {
//     user: { name: "Student" },
//     rovers: ['Curiosity', 'Opportunity', 'Spirit'],
// }

// const Immutable = require('immutable');
import { Map } from 'immutable';

const store = Map({
    user: { name: "Student" },
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
})

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(store, 'load')
})

const root = document.getElementById('root')

const render = async (store, event) => {
    switch (event) {
        case 'load':
            const roverOptions = document.getElementById('roverOptions')
            roverOptions.innerHTML = RoverOptions(store)

            store.rovers.forEach(rover => {
                const el = document.getElementById(rover)
                el.addEventListener('click', () => {
                    getRoverInfo(rover)
                    getLatestPhotos(rover)
                })
            });
            break;
        case 'roverInfoRetrieved':
            const roverInfo = document.getElementById('roverInfo')
            roverInfo.innerHTML = RoverInfo(store)
            break;
        case 'roverPhotosRetrieved':
            const cameraOptions = document.getElementById('cameraOptions')
            cameraOptions.innerHTML = CameraOptions(store)

            const cameraButtons = document.querySelectorAll('.camera')
            cameraButtons.forEach(button => {
                button.addEventListener('click', () => {
                    photosByCameraType(button.innerHTML)
                })
            })

            const photos = document.getElementById('photos')
            photos.innerHTML = Photos(store)
            break;
        case 'filteredByCamera':
            document.getElementById('photos').innerHTML = Photos(store)
            break;
        default:
            console.log(`${event} Event not recognized`)
            break;
    }
}

const RoverOptions = (state) => {
    let roverButtons = "<h3>Select a rover!</h3>"

    for (rover of state.rovers) {
        roverButtons += `<button type="button" id="${rover}">${rover}</button>`
    }

    return `
        <section>
            ${roverButtons}
        </section>
    `
}

const RoverInfo = (state) => {
    return `
        <h3>You selected ${state.selectedRover.rover}!</h3>
        <p>Launch Date: ${state.selectedRover.launchDate}</p>
        <p>Landing Date: ${state.selectedRover.landingDate}</p>
        <p>Status: ${state.selectedRover.status}</p>
    `
}

const Photos = (store) => {
    let photoItems = "<h3>Latest Photos!</h3>"

    for (photo of store.photos.photos) {
        photoItems += `
            <img src="${photo.img_src}" @media>
            <p>Camera Type: ${photo.camera.full_name} (${photo.camera.name})</p>
            <p>Earth Date: ${photo.earth_date}</p>
            <p>Sol: ${photo.sol}</p>
            <p>==========</p>
        `
    }

    return photoItems
}

const CameraOptions = (state) => {
    let cameraOptions = "<h3>Filter by camera</h3>"

    for (camera of availableCameras(state.photos.photos)) {
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

const photosByCameraType = (cameraType) => {

    let photos = {
        photos: store.photos.photos.filter(photo => photo.camera.full_name == cameraType)
    }

    updateStore(store, { photos }, 'filteredByCamera')
}

const updateStore = async (oldStore, newState, event) => {
    //Need to do Immutable state here
    const updatedStore = store.merge(newState)
    // store = Object.assign(oldStore, newState)
    render(updatedStore, event)
    // render(store, event)
}

const getRoverInfo = async (roverName) => {
    fetch(`http://localhost:3000/${roverName}/cameras`)
        .then(res => res.json())
        .then(selectedRover => updateStore({ selectedRover }, 'roverInfoRetrieved'))
        // .then(selectedRover => updateStore(store, { selectedRover }, 'roverInfoRetrieved'))
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

    fetch(`http://localhost:3000/${roverName}/cameras/${maxSol()}`)
        .then(res => res.json())
        .then(photos => updateStore({ photos }, 'roverPhotosRetrieved'))
        // .then(photos => updateStore(store, { photos }, 'roverPhotosRetrieved'))
}