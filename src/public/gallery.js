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
            const photos = document.getElementById('photos')
            photos.innerHTML = Photos(store)
            break;
        default:
            console.log('Event not recognized')
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

const updateStore = async (oldStore, newState, event) => {
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