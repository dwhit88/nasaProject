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
const curiosity = document.getElementById('Curiosity')

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

curiosity.addEventListener('click', () => {
    render(root, store)
})

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
    console.log(store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            <section>
                <h3>Select a rover!</h3>
                ${Rovers(rovers)}
                <p>Here is an example section.</p>
            </section>
        </main>
        <footer></footer>
    `
}

const Rovers = (rovers) => {
    return `
        <ul>
            <li><a id="${rovers[0]}" href=''>${rovers[0]}</a></li>
            <li>${rovers[1]}</li>
            <li>${rovers[2]}</li>
        </ul>
    `
}

const Cameras = (rovers) => {
    return `
        <p>${getCameras(rovers[0])}</p>
    `
}

const getCameras = (state) => {
    let { selectedRover } = state

    fetch(`http://localhost:3000/${selectedRover}/cameras`)
        .then(res => res.json())
        .then(selectedRover => updateStore(store, { selectedRover }))

    // return data
}