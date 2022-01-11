import {SCALE, TOP_STATUS_BAR_SCALE} from '../constants.js'

class TopStatusBar {

    canvas

    invaderImage
    invaderImageWidth
    invaderImageHeight

    offsetX
    offsetY

    destroy
    level

    constructor(
        canvas,
        invaderImage, invaderImageWidth, invaderImageHeight,
        offsetX, offsetY
    ) {
        this.canvas = canvas

        this.invaderImage = invaderImage
        this.invaderImageWidth = invaderImageWidth
        this.invaderImageHeight = invaderImageHeight

        this.offsetX = offsetX
        this.offsetY = offsetY

        this.destroy = 0
        this.level = 0
    }

    reset() {
        this.destroy = 0
        this.level = 0
    }

    draw() {
        this.drawInvader()
        this.drawDestroy()
        this.drawLevel()
    }

    drawInvader() {
        this.canvas.draw(this.invaderImage, this.offsetX, this.offsetY, this.scaleInvaderImageWidth, this.scaleInvaderImageHeight)
    }

    drawDestroy() {
        const size = this.scaleInvaderImageHeight
        const x = 2 * this.offsetX + this.scaleInvaderImageWidth
        const y = this.offsetY + this.scaleInvaderImageHeight

        this.canvas.write(this.destroy, size, 'left', x, y)
    }

    drawLevel() {
        const size = this.scaleInvaderImageHeight
        const x = this.canvas.width - this.offsetX
        const y = this.offsetY + this.scaleInvaderImageHeight

        this.canvas.write(`Level ${this.level}`, size, 'right', x, y)
    }

    get scaleInvaderImageWidth() {
        return TOP_STATUS_BAR_SCALE * SCALE * this.invaderImageWidth
    }

    get scaleInvaderImageHeight() {
        return TOP_STATUS_BAR_SCALE * SCALE * this.invaderImageHeight
    }

    get invaderImageWidth() {
        return this.invaderImageWidth
    }

    get invaderImageHeight() {
        return this.invaderImageHeight
    }

    get height() {
        return 2 * this.offsetY + this.scaleInvaderImageHeight
    }

    get destroy() {
        return this.destroy
    }

    set destroy(destroy) {
        this.destroy = destroy
    }

    get level() {
        return this.level
    }

    set level(level) {
        this.level = level
    }
}

class TopStatusBarProvider {

    canvas

    invaderImage
    invaderImageWidth
    invaderImageHeight

    constructor(canvas, invaderImageSrc) {
        this.canvas = canvas

        this.invaderImage = new Image()
        this.invaderImage.src = invaderImageSrc

        this.invaderImageWidth = this.invaderImage.width
        this.invaderImageHeight = this.invaderImage.height
    }

    provide(offsetX, offsetY) {
        return new TopStatusBar(this.canvas,
            this.invaderImage, this.invaderImageWidth, this.invaderImageHeight,
            offsetX, offsetY
        )
    }
}

export {TopStatusBar, TopStatusBarProvider}
