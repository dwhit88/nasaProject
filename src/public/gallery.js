let store = {
    user: { name: "Student" },
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(store, 'load')
})

const root = document.getElementById('root')

const render = async (store, event) => {
    switch (event) {
        case 'load':
            const roverOptions = document.getElementById('roverOptions')
            roverOptions.innerHTML = RoverOptions(store.rovers)

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
            roverInfo.innerHTML = RoverInfo(store.selectedRover)
            break;
        case 'roverPhotosRetrieved':
            const cameraOptions = document.getElementById('cameraOptions')
            cameraOptions.innerHTML = CameraOptions(store.photos.photos)
            const cameraButtons = document.querySelectorAll('.camera')
            cameraButtons.forEach(button => {
                button.addEventListener('click', () => {
                    photosByCameraType(button.innerHTML)
                })
            })

            const photos = document.getElementById('photos')
            photos.innerHTML = Photos(store.photos.photos)
            break;
        case 'filteredByCamera':
            // Store = filteredPhotos
            document.getElementById('photos').innerHTML = Photos(store)
            break;
        default:
            console.log('Event not recognized')
            break;
    }
}

const RoverOptions = (rovers) => {
    let roverButtons = "<h3>Select a rover!</h3>"
    for (rover of rovers) {
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

const CameraOptions = (photos) => {
    let cameraOptions = "<h3>Filter by camera</h3>"
    for (camera of availableCameras(photos)) {
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
    let filteredPhotos = store.photos.photos.filter(photo => photo.camera.full_name == cameraType)
    render(filteredPhotos, 'filteredByCamera')
}

const updateStore = async (oldStore, newState, event) => {
    //Need to do Immutable state here
    store = Object.assign(oldStore, newState)
    render(store, event)
}

const getRoverInfo = async (roverName) => {
    fetch(`http://localhost:3000/${roverName}/cameras`)
        .then(res => res.json())
        .then(selectedRover => updateStore(store, { selectedRover }, 'roverInfoRetrieved'))
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
        .then(photos => updateStore(store, { photos }, 'roverPhotosRetrieved'))
}