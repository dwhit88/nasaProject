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
// const curiosity = document.getElementById('Curiosity')

const renderCameraList = (cameraList, store) => {
    console.log(store)
    cameraList.innerHTML = store.selectedRover.name
    render(root, store)
}

const displayCameras = (roverName) => {
    const cameraList = document.getElementById('cameraList')
    getCameras(roverName)
        .then(() => {
            renderCameraList(cameraList, store)
        })
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
        .then(() => {
            const curiosity = document.getElementById('Curiosity')
            curiosity.addEventListener('click', () => {
                displayCameras('Curiosity')
            })
        })
})

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const App = (state) => {
    let { rovers, selectedRover } = state

    return `
        <header></header>
        <main>
            <section>
                <h3>Select a rover!</h3>
                ${Rovers(rovers)}
                ${Cameras(selectedRover)}
                <p id="cameraList"></p>
                <p>Here is an example section.</p>
            </section>
        </main>
        <footer></footer>
    `
}

const clickRover = (rover) => {
    var cameraList = document.getElementById('cameras')
    console.log("hey hey")
    // getCameras(store)

    // cameraList.innerHTML = Cameras
}

const Rovers = (rovers) => {
    return `
        <button type="button" id="${rovers[0]}">${rovers[0]}</button>
        <button type="button" id="${rovers[1]}">${rovers[1]}</button>
        <button type="button" id="${rovers[2]}">${rovers[2]}</button>
    `
}

const Cameras = (rover) => {
    return `
        <p>${rover.name}</p>
    `
}

// const Cameras = (rovers) => {
//     return `
//         <p>${getCameras(rovers[0])}</p>
//     `
// }

const updateStore = (oldStore, newState) => {
    store = Object.assign(oldStore, newState)
    // render(root, store)
    // console.log(store)
}

const getCameras = async (roverName) => {
    // let { selectedRover } = state

    fetch(`http://localhost:3000/${roverName}/cameras`)
        .then(res => res.json())
        .then(selectedRover => updateStore(store, { selectedRover }))

    // return data
}