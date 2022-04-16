let store = Immutable.Map({
    rovers: ['Curiosity', 'Opportunity', 'Spirit']
})

window.addEventListener('load', () => {
    renderHTML('roverOptions', RoverOptions())

    const roverButtons = store.get('rovers').reduce((total, curr) => {
        total.push(document.getElementById(curr))
        return total
    }, [])

    setListener(roverButtons, (button) => {
        getRoverInfo(button.textContent)
        getLatestPhotos(button.textContent)
    })
})

const roverInfoRetrieved = (updatedStore) => {
    const retrievedRoverInfo = updatedStore.get('roverData').roverData
    renderHTML('roverInfo', RoverInfo(retrievedRoverInfo))
}

const roverPhotosRetrieved = (updatedStore) => {
    const retrievedPhotos = updatedStore.get('photos').photos
    renderHTML('cameraOptions', CameraOptions(availableCameras(retrievedPhotos)))
    const cameraButtons = document.querySelectorAll('.camera')

    setListener(cameraButtons, (button) => {
        let filteredPhotos = retrievedPhotos.filter(photo => photo.camera.full_name == button.textContent)
        renderHTML('photos', Photos(filteredPhotos))
    })

    renderHTML('photos', Photos(retrievedPhotos))
}

const setListener = (buttons, action) => {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            action(button)
        })
    })
}

const renderHTML = (htmlTag, action) => {
    document.getElementById(htmlTag).innerHTML = action
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

const processData = (data, action) => {
    let newStore = store.merge(Immutable.Map(data))
    action(newStore)
}

const getRoverInfo = async (roverName) => {
    fetch(`http://localhost:3000/${roverName}/cameras`)
        .then(res => res.json())
        .then(roverData => processData({ roverData }, roverInfoRetrieved))
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
        .then(photos => processData({ photos }, roverPhotosRetrieved))
}