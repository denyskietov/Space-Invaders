import {SCALE} from '../constants.js'

class InvaderBlast {

    canvas

    images
    imageWidth
    imageHeight

    x
    y

    destroyed

    constructor(canvas, images, imageWidth, imageHeight, x, y) {
        this.canvas = canvas

        this.images = images
        this.imageWidth = imageWidth
        this.imageHeight = imageHeight

        // Adjust x according to the bullet width
        this.x = x - this.width / 2
        this.y = y

        this.destroyed = false
    }

    draw(offsetY) {
        this.y += offsetY

        if (this.canvas.height < this.y) {
            this.destroyed = true
        } else {
            this.images.push(this.images.shift())
            this.canvas.draw(this.images[0], this.x, this.y, this.width, this.height)
        }
    }

    get width() {
        return SCALE * this.imageWidth
    }

    get height() {
        return SCALE * this.imageHeight
    }

    get x() {
        return this.x
    }

    get y() {
        return this.y
    }

    get destroyed() {
        return this.destroyed
    }

    set destroyed(destroyed) {
        this.destroyed = destroyed
    }
}

class InvaderBlastProvider {

    canvas

    images
    imageWidth
    imageHeight

    audioCallback

    constructor(canvas, imageSrcs, audioCallback) {
        this.canvas = canvas

        this.images = imageSrcs.map((imageSrc) => {
            const image = new Image()
            image.src = imageSrc

            return image
        })
        this.images.sort(() => .5 - Math.random())

        this.imageWidth = this.images[0].width
        this.imageHeight = this.images[0].height

        this.audioCallback = audioCallback
    }

    provide(x, y) {
        // Play audio
        // this.audioCallback()

        return new InvaderBlast(this.canvas, this.images, this.imageWidth, this.imageHeight, x, y)
    }
}

export {InvaderBlast, InvaderBlastProvider}
