let store = {
    user: { name: "Student" },
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

const root = document.getElementById('root')

const renderCameraList = async (store) => {
    const cameraOptions = document.getElementById('cameraOptions')
    cameraOptions.innerHTML = `<p>${store.selectedRover.rover}</p>`
}

const renderPhotos = async (store) => {
    const photos = document.getElementById('photos')
    photos.innerHTML = Photos(store)
}

const renderRoverOptions = async (store) => {
    const roverOptions = document.getElementById('roverOptions')
    roverOptions.innerHTML = RoverOptions(store)

    const curiosity = document.getElementById('Curiosity')
    curiosity.addEventListener('click', () => {
        getCameras('Curiosity')
        getLatestPhotos('Curiosity')
    })

    const opportunity = document.getElementById('Opportunity')
    opportunity.addEventListener('click', () => {
        getCameras('Opportunity')
        getLatestPhotos('Opportunity')
    })

    const spirit = document.getElementById('Spirit')
    spirit.addEventListener('click', () => {
        getCameras('Spirit')
        getLatestPhotos('Spirit')
    })
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    renderRoverOptions(store)
})

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const  RoverOptions = (state) => {
    let { rovers } = state
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

const Photos = (store) => {
    let photoItems = "<h3>Latest Photos!</h3>"

    for (photo of store.photos.photos) {
        photoItems += `
            <p>Camera Type: ${photo.camera.full_name} (${photo.camera.name})</p>
            <p>Earth Date: ${photo.earth_date}</p>
            <p>Sol: ${photo.sol}</p>
            <p>==========</p>
        `
    }

    return photoItems
}

const updateStore = async (oldStore, newState) => {
    store = Object.assign(oldStore, newState)
    renderCameraList(store)
}

const updateStoreWithPhotos = async (oldStore, newState) => {
    store = Object.assign(oldStore, newState)
    renderPhotos(store)
}

const getCameras = async (roverName) => {
    fetch(`http://localhost:3000/${roverName}/cameras`)
        .then(res => res.json())
        .then(selectedRover => updateStore(store, { selectedRover }))
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
        .then(photos => updateStoreWithPhotos(store, { photos }))
}