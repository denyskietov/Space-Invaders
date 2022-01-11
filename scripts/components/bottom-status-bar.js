import {BOTTOM_STATUS_BAR_SCALE, SCALE, SHIP_DESTROY_MAX} from '../constants.js'

class BottomStatusBar {

    canvas

    shipImage
    shipImageWidth
    shipImageHeight

    blastImage
    blastImageWidth
    blastImageHeight

    offsetX
    offsetY

    destroy
    blast

    constructor(
        canvas,
        shipImage, shipImageWidth, shipImageHeight,
        blastImage, blastImageWidth, blastImageHeight,
        offsetX, offsetY
    ) {
        this.canvas = canvas

        this.shipImage = shipImage
        this.shipImageWidth = shipImageWidth
        this.shipImageHeight = shipImageHeight

        this.blastImage = blastImage
        this.blastImageWidth = blastImageWidth
        this.blastImageHeight = blastImageHeight

        this.offsetX = offsetX
        this.offsetY = offsetY

        this.destroy = SHIP_DESTROY_MAX
        this.blast = 0
    }

    reset() {
        this.destroy = SHIP_DESTROY_MAX
        this.blast = 0
    }

    draw() {
        this.drawShip()
        this.drawBlast()
    }

    drawShip() {
        let x = this.offsetX
        for (let i = 0; i < this.destroy; i++) {
            this.canvas.draw(
                this.shipImage, x, this.offsetY + this.canvas.height - this.height,
                this.scaleShipImageWidth, this.scaleShipImageHeight
            )
            x = x + (this.scaleShipImageWidth + this.offsetX)
        }
    }

    drawBlast() {
        let x = this.canvas.width - (this.scaleBlastImageWidth + this.offsetX)
        for (let i = 0; i < this.blast; i++) {
            this.canvas.draw(
                this.blastImage, x, this.offsetY + this.canvas.height - this.height,
                this.scaleBlastImageWidth, this.scaleBlastImageHeight
            )
            x = x - (this.scaleBlastImageWidth + this.offsetX)
        }
    }

    get scaleShipImageWidth() {
        return BOTTOM_STATUS_BAR_SCALE * SCALE * this.shipImageWidth
    }

    get scaleShipImageHeight() {
        return BOTTOM_STATUS_BAR_SCALE * SCALE * this.shipImageHeight
    }

    get shipImageWidth() {
        return this.shipImageWidth
    }

    get shipImageHeight() {
        return this.shipImageHeight
    }

    get scaleBlastImageWidth() {
        return BOTTOM_STATUS_BAR_SCALE * SCALE * (this.shipImageHeight / this.blastImageHeight) * this.blastImageWidth
    }

    get scaleBlastImageHeight() {
        return BOTTOM_STATUS_BAR_SCALE * SCALE * (this.shipImageHeight / this.blastImageHeight) * this.blastImageHeight
    }

    get blastImageWidth() {
        return this.blastImageWidth
    }

    get blastImageHeight() {
        return this.blastImageHeight
    }

    get height() {
        return 2 * this.offsetY + this.scaleShipImageHeight
    }

    get destroy() {
        return this.destroy
    }

    set destroy(destroy) {
        this.destroy = destroy
    }

    get blast() {
        return this.blast
    }

    set blast(blast) {
        this.blast = blast
    }
}

class BottomStatusBarProvider {

    canvas

    shipImage
    shipImageWidth
    shipImageHeight

    blastImage
    blastImageWidth
    blastImageHeight

    constructor(canvas, shipImageSrc, blastImageSrc) {
        this.canvas = canvas

        this.shipImage = new Image()
        this.shipImage.src = shipImageSrc

        this.shipImageWidth = this.shipImage.width
        this.shipImageHeight = this.shipImage.height

        this.blastImage = new Image()
        this.blastImage.src = blastImageSrc

        this.blastImageWidth = this.blastImage.width
        this.blastImageHeight = this.blastImage.height
    }

    provide(offsetX, offsetY) {
        return new BottomStatusBar(this.canvas,
            this.shipImage, this.shipImageWidth, this.shipImageHeight,
            this.blastImage, this.blastImageWidth, this.blastImageHeight,
            offsetX, offsetY
        )
    }
}

export {BottomStatusBar, BottomStatusBarProvider}
