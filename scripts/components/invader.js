import {Direction, SCALE} from '../constants.js'

class Invader {

    #DAMAGE

    canvas

    images
    imageWidth
    imageHeight

    damageImages
    damageImageWidth
    damageImageHeight

    invaderBlastProvider

    x
    y

    damage

    constructor(
        canvas,
        images, imageWidth, imageHeight,
        damageImages, damageImageWidth, damageImageHeight,
        invaderBlastProvider, x, y
    ) {
        this.#DAMAGE = 5

        this.canvas = canvas

        this.images = images
        this.imageWidth = imageWidth
        this.imageHeight = imageHeight

        this.damageImages = damageImages
        this.damageImageWidth = damageImageWidth
        this.damageImageHeight = damageImageHeight

        this.invaderBlastProvider = invaderBlastProvider

        this.x = x
        this.y = y

        this.damage = 0
    }

    draw(offsetX, offsetY, directionX) {
        if (directionX === Direction.RIGHT) {
            this.x += offsetX
        }

        if (directionX === Direction.LEFT) {
            this.x -= offsetX
        }

        this.y += offsetY

        if (this.damage === 0) {
            this.images.push(this.images.shift())
            this.canvas.draw(this.images[0], this.x, this.y, this.width, this.height)
        }
        if (0 < this.damage && this.damage < this.#DAMAGE) {
            this.damageImages.push(this.damageImages.shift())
            this.canvas.draw(this.damageImages[0], this.x, this.y, this.width, this.height)
            this.damage++
        }
    }

    blast() {
        return this.invaderBlastProvider.provide(this.x + this.width / 2, this.y + this.height)
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

    get damage() {
        return this.damage
    }

    set damage(damage) {
        this.damage = damage
    }

    get damaged() {
        return this.damage > 0
    }

    get destroyed() {
        return this.#DAMAGE <= this.damage
    }
}

class InvaderProvider {

    canvas

    images
    imageWidth
    imageHeight

    damageImages
    damageImageWidth
    damageImageHeight

    invaderBlastProvider

    constructor(canvas, imageSrcs, damageImageSrcs, invaderBlastProvider) {
        this.canvas = canvas

        this.images = imageSrcs.map((imageSrc) => {
            const image = new Image()
            image.src = imageSrc

            return image
        })
        this.images.sort(() => .5 - Math.random())

        this.imageWidth = this.images[0].width
        this.imageHeight = this.images[0].height

        this.damageImages = damageImageSrcs.map((damageImageSrc) => {
            const damageImage = new Image()
            damageImage.src = damageImageSrc

            return damageImage
        })
        this.damageImages.sort(() => .5 - Math.random())

        this.damageImageWidth = this.damageImages[0].width
        this.damageImageHeight = this.damageImages[0].height

        this.invaderBlastProvider = invaderBlastProvider
    }

    provide(x, y) {
        return new Invader(
            this.canvas,
            this.images, this.imageWidth, this.imageHeight,
            this.damageImages, this.damageImageWidth, this.damageImageHeight,
            this.invaderBlastProvider, x, y
        )
    }
}

export {Invader, InvaderProvider}
