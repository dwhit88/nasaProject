let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    selectedRover: {
        name: '',
        cameras: []
    }
}

const root = document.getElementById('root')

const renderCameraList = async (store) => {
    const cameraOptions = document.getElementById('cameraOptions')
    cameraOptions.innerHTML = `<p>${store.selectedRover.rover}</p>`
}

const renderRoverOptions = async (store) => {
    const roverOptions = document.getElementById('roverOptions')
    roverOptions.innerHTML = RoverOptions(store)

    const curiosity = document.getElementById('Curiosity')
    curiosity.addEventListener('click', () => {
        getCameras('Curiosity')
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

const Cameras = (rover) => {
    return `
        <p>${rover.name}</p>
    `
}

const updateStore = async (oldStore, newState) => {
    store = Object.assign(oldStore, newState)
    renderCameraList(store)
}

const getCameras = async (roverName) => {
    fetch(`http://localhost:3000/${roverName}/cameras`)
        .then(res => res.json())
        .then(selectedRover => updateStore(store, { selectedRover }))
}