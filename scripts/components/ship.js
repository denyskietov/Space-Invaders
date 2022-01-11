import {Direction, SCALE, SHIP_DESTROY_MAX} from '../constants.js'

class Ship {

    #DAMAGE
    #DESTROY

    canvas

    images
    imageWidth
    imageHeight

    damageImages
    damageImageWidth
    damageImageHeight

    destroyImages
    destroyImageWidth
    destroyImageHeight

    shipBlastProvider

    x
    y

    damage
    destroy

    blasters
    blasterProvider

    constructor(
        canvas,
        images, imageWidth, imageHeight,
        damageImages, damageImageWidth, damageImageHeight,
        destroyImages, destroyImageWidth, destroyImageHeight,
        shipBlastProvider, x, y
    ) {
        this.#DAMAGE = 5
        this.#DESTROY = SHIP_DESTROY_MAX

        this.canvas = canvas

        this.images = images
        this.imageWidth = imageWidth
        this.imageHeight = imageHeight

        this.damageImages = damageImages
        this.damageImageWidth = damageImageWidth
        this.damageImageHeight = damageImageHeight

        this.destroyImages = destroyImages
        this.destroyImageWidth = destroyImageWidth
        this.destroyImageHeight = destroyImageHeight

        this.shipBlastProvider = shipBlastProvider

        this.x = x - this.width / 2
        this.y = y - this.height

        this.damage = 0
        this.destroy = 0

        this.blasters = [Direction.LEFT, Direction.RIGHT]
        this.blasterProvider = {
            [Direction.LEFT]: (x) => {
                return x
            },
            [Direction.RIGHT]: (x) => {
                return x + this.width
            },
            provide: (blaster) => {
                return this.blasterProvider[blaster]
            }
        }
    }

    draw(offsetX, offsetY, directionX) {
        if (directionX === Direction.RIGHT) {
            this.x += offsetX
        }

        if (directionX === Direction.LEFT) {
            this.x -= offsetX
        }

        this.y += offsetY

        if (this.destroy < this.#DESTROY) {
            if (this.damage === 0) {
                this.images.push(this.images.shift())
                this.canvas.draw(this.images[0], this.x, this.y, this.width, this.height)
            }
            if (0 < this.damage && this.damage < this.#DAMAGE) {
                this.damageImages.push(this.damageImages.shift())
                this.canvas.draw(this.damageImages[0], this.x, this.y, this.width, this.height)
                this.damage++
            }

            // Restore damaged ship
            if (this.#DAMAGE <= this.damage) {
                this.damage = 0
            }
        } else {
            this.destroyImages.push(this.destroyImages.shift())
            this.canvas.draw(this.destroyImages[0], this.x, this.y, this.width, this.height)
            this.destroy++
        }
    }

    blast() {
        this.blasters.push(this.blasters.shift())
        return this.shipBlastProvider.provide(this.blasterProvider.provide(this.blasters[0])(this.x), this.y + this.height / 2)
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

    get destroy() {
        return this.destroy
    }

    set destroy(destroy) {
        this.destroy = destroy
    }

    get damaged() {
        return this.damage > 0
    }

    get destroyed() {
        return this.#DESTROY <= this.destroy
    }
}

class ShipProvider {

    canvas

    images
    imageWidth
    imageHeight

    damageImages
    damageImageWidth
    damageImageHeight

    destroyImages
    destroyImageWidth
    destroyImageHeight

    shipBlastProvider

    constructor(canvas, imageSrcs, damageImageSrcs, destroyImageSrcs, shipBlastProvider) {
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

        this.destroyImages = destroyImageSrcs.map((destroyImageSrc) => {
            const destroyImage = new Image()
            destroyImage.src = destroyImageSrc

            return destroyImage
        })
        this.destroyImages.sort(() => .5 - Math.random())

        this.destroyImageWidth = this.destroyImages[0].width
        this.destroyImageHeight = this.destroyImages[0].height

        this.shipBlastProvider = shipBlastProvider
    }

    provide(x, y) {
        return new Ship(
            this.canvas,
            this.images, this.imageWidth, this.imageHeight,
            this.damageImages, this.damageImageWidth, this.damageImageHeight,
            this.destroyImages, this.destroyImageWidth, this.destroyImageHeight,
            this.shipBlastProvider, x, y
        )
    }
}

export {Ship, ShipProvider}
