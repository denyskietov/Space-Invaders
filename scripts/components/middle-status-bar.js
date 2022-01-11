import {SCALE, SIZE, TOP_STATUS_BAR_SCALE} from '../constants.js'

class MiddleStatusBar {

    canvas

    invaderImage
    invaderImageWidth
    invaderImageHeight

    offsetX
    offsetY

    scores

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

        this.score = 0
    }

    reset() {
        this.score = 0
    }

    draw() {
        let x = this.offsetX + this.canvas.width / 2
        let y = ((this.canvas.height / (this.offsetY + this.scaleInvaderImageHeight) - (this.scores.length + 2)) / 2) * (this.offsetY + this.scaleInvaderImageHeight)

        // Clear area for the scores board
        this.canvas.clear(0, y - this.offsetY, this.canvas.width, (this.scores.length + 2) * (this.offsetY + this.scaleInvaderImageHeight) + (2 * this.offsetY))

        // TODO Adjust x manually
        x = x - 10 * this.offsetX

        this.canvas.write('High Scores', this.scaleInvaderImageHeight, 'center', this.canvas.width / 2, y + this.scaleInvaderImageHeight)
        y = y + (2 * this.offsetY + this.scaleInvaderImageHeight)

        for (let i = 0; i < this.scores.length; i++) {
            this.drawInvader(x, y)
            this.drawScore(x, y, this.scores[i])
            y = y + (this.offsetY + this.scaleInvaderImageHeight)
        }

        this.canvas.write('... press space to restart ...', SIZE / 2, 'center', this.canvas.width / 2, y + this.scaleInvaderImageHeight)
    }

    drawInvader(x, y) {
        this.canvas.draw(this.invaderImage, x, y, this.scaleInvaderImageWidth, this.scaleInvaderImageHeight)
    }

    drawScore(x, y, score) {
        const size = this.scaleInvaderImageHeight
        const adjustedX = x + this.offsetX + this.scaleInvaderImageWidth
        const adjustedY = y + this.scaleInvaderImageHeight

        this.canvas.write(score, size, 'left', adjustedX, adjustedY)
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

    get scores() {
        return this.scores
    }

    set scores(scores) {
        this.scores = scores
    }
}

class MiddleStatusBarProvider {

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
        return new MiddleStatusBar(this.canvas,
            this.invaderImage, this.invaderImageWidth, this.invaderImageHeight,
            offsetX, offsetY
        )
    }
}

export {MiddleStatusBar, MiddleStatusBarProvider}
