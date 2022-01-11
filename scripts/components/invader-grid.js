import {COLS, INVADER_BETWEEN_DISTANCE_X} from '../constants.js'

class InvaderGrid {

    invaderColumns

    constructor(invaderColumnProvider, x, y) {
        this.invaderColumns = []

        let localX = x
        for (let i = 0; i < COLS; i++) {
            const invaderColumn = invaderColumnProvider.provide(localX, y)
            this.invaderColumns.push(invaderColumn)
            localX += invaderColumn.width + INVADER_BETWEEN_DISTANCE_X
        }
    }

    draw(offsetX, offsetY, directionX) {
        // Remove left most destroyed invader columns
        while (this.invaderColumns.length && this.invaderColumns[0].destroyed) {
            this.invaderColumns.shift()
        }
        // Remove right most destroyed invader columns
        while (this.invaderColumns.length && this.invaderColumns[this.invaderColumns.length - 1].destroyed) {
            this.invaderColumns.pop()
        }

        for (let i = 0; i < this.invaderColumns.length; i++) {
            this.invaderColumns[i].draw(offsetX, offsetY, directionX)
        }
    }

    blast(size) {
        const invaders = [...this.invaders]

        const invaderBlasts = []
        while (invaders.length && size--) {
            invaderBlasts.push(invaders.splice(Math.floor(Math.random() * invaders.length), 1)[0].blast())
        }
        return invaderBlasts
    }

    get invaders() {
        const invaders = [];
        for (let i = 0; i < this.invaderColumns.length; i++) {
            invaders.push(...this.invaderColumns[i].invaders)
        }
        return invaders
    }

    get width() {
        if (this.invaderColumns.length) {
            return this.invaderColumns[0].width * this.invaderColumns.length + INVADER_BETWEEN_DISTANCE_X * (this.invaderColumns.length - 1)
        } else {
            return 0
        }
    }

    get height() {
        let maxInvaderColumnHeight = 0;
        for (let i = 0; i < this.invaderColumns.length; i++) {
            maxInvaderColumnHeight = Math.max(maxInvaderColumnHeight, this.invaderColumns[i].height)
        }

        return maxInvaderColumnHeight
    }

    get x() {
        if (this.invaderColumns.length) {
            return this.invaderColumns[0].x
        } else {
            return 0
        }
    }

    get y() {
        if (this.invaderColumns.length) {
            return this.invaderColumns[0].y
        } else {
            return 0
        }
    }

    get destroyed() {
        return this.invaderColumns.length === 0 || this.invaderColumns.every(invaderColumn => invaderColumn.destroyed)
    }
}

class InvaderGridProvider {

    invaderColumnProvider

    constructor(invaderColumnProvider) {
        this.invaderColumnProvider = invaderColumnProvider
    }

    provide(x, y) {
        return new InvaderGrid(this.invaderColumnProvider, x, y)
    }
}

export {InvaderGrid, InvaderGridProvider}
