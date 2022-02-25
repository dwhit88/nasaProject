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
    console.log(store)
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
    })

    const spirit = document.getElementById('Spirit')
    spirit.addEventListener('click', () => {
        getCameras('Spirit')
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
    return `
        <section>
            <h3>Select a rover!</h3>
            <button type="button" id="${rovers[0]}">${rovers[0]}</button>
            <button type="button" id="${rovers[1]}">${rovers[1]}</button>
            <button type="button" id="${rovers[2]}">${rovers[2]}</button>
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
    console.log(store)
}

const updateStoreWithPhotos = async (oldStore, newState) => {
    store = Object.assign(oldStore, newState)
    console.log(store)
    renderPhotos(store)
}

const getCameras = async (roverName) => {
    fetch(`http://localhost:3000/${roverName}/cameras`)
        .then(res => res.json())
        .then(selectedRover => updateStore(store, { selectedRover }))
}

const getLatestPhotos = async (roverName, maxSol = 3395) => {
    fetch(`http://localhost:3000/${roverName}/cameras/${maxSol}`)
        .then(res => res.json())
        .then(photos => updateStoreWithPhotos(store, { photos }))
}