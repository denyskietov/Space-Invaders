import {INVADER_BETWEEN_DISTANCE_Y, ROWS} from '../constants.js'

class InvaderColumn {

    invaders

    constructor(invaderProvider, x, y) {
        this.invaders = []

        let localY = y
        for (let i = 0; i < ROWS; i++) {
            const invader = invaderProvider.provide(x, localY)
            this.invaders.push(invader)
            localY += invader.height + INVADER_BETWEEN_DISTANCE_Y
        }
    }

    draw(offsetX, offsetY, directionX) {
        this.invaders = this.invaders.filter(invader => !invader.destroyed)
        for (let i = 0; i < this.invaders.length; i++) {
            this.invaders[i].draw(offsetX, offsetY, directionX)
        }
    }

    get invaders() {
        return this.invaders
    }

    get width() {
        if (this.invaders.length) {
            return this.invaders[0].width
        } else {
            return 0
        }
    }

    get height() {
        if (this.invaders.length) {
            return this.invaders[0].height * this.invaders.length + INVADER_BETWEEN_DISTANCE_Y * (this.invaders.length - 1)
        } else {
            return 0
        }
    }

    get x() {
        if (this.invaders.length) {
            return this.invaders[0].x
        } else {
            return 0
        }
    }

    get y() {
        if (this.invaders.length) {
            return this.invaders[0].y
        } else {
            return 0
        }
    }

    get destroyed() {
        return this.invaders.length === 0 || this.invaders.every(invader => invader.destroyed)
    }
}

class InvaderColumnProvider {

    invaderProvider

    constructor(invaderProvider) {
        this.invaderProvider = invaderProvider
    }

    provide(x, y) {
        return new InvaderColumn(this.invaderProvider, x, y)
    }
}

export {InvaderColumn, InvaderColumnProvider}
