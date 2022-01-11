class ShipEventListener {

    arrowLeftCallback
    arrowRightCallback
    spaceCallback

    constructor(arrowLeftCallback, arrowRightCallback, spaceCallback) {
        this.arrowLeftCallback = arrowLeftCallback
        this.arrowRightCallback = arrowRightCallback
        this.spaceCallback = spaceCallback

        const keyupEventListener = (e) => {
            e.preventDefault()
            if (e.key === ' ') {
                this.spaceCallback()
            }
        }

        const keydownEventListener = (e) => {
            e.preventDefault()
            if (e.key === 'ArrowLeft') {
                this.arrowLeftCallback()
            }
            if (e.key === 'ArrowRight') {
                this.arrowRightCallback()
            }
        }

        document.addEventListener('keyup', keyupEventListener)
        document.addEventListener('keydown', keydownEventListener)
    }
}

class ShipEventListenerProvider {

    arrowLeftCallback
    arrowRightCallback
    spaceCallback

    constructor(arrowLeftCallback, arrowRightCallback, spaceCallback) {
        this.arrowLeftCallback = arrowLeftCallback
        this.arrowRightCallback = arrowRightCallback
        this.spaceCallback = spaceCallback
    }

    provide() {
        return new ShipEventListener(this.arrowLeftCallback, this.arrowRightCallback, this.spaceCallback)
    }
}

export {ShipEventListener, ShipEventListenerProvider}
