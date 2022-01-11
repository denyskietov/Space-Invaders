import {SHIP_DESTROY_MAX} from '../constants.js'

class CollisionImpactResolver {

    ship
    invaderGrid
    bottomStatusBar

    audioCallback

    constructor(ship, invaderGrid, bottomStatusBar, audioCallback) {
        this.ship = ship
        this.invaderGrid = invaderGrid
        this.bottomStatusBar = bottomStatusBar

        this.audioCallback = audioCallback
    }

    resolve() {
        if (this.ship.y < this.invaderGrid.y + this.invaderGrid.height) {
            this.ship.destroy = SHIP_DESTROY_MAX

            setTimeout(() => this.audioCallback(), 50)
            setTimeout(() => this.audioCallback(), 100)
            setTimeout(() => this.audioCallback(), 150)
            setTimeout(() => this.audioCallback(), 200)
            setTimeout(() => this.audioCallback(), 250)

            this.bottomStatusBar.destroy = 0
        }
    }
}

class CollisionImpactResolverProvider {

    ship
    invaderGrid
    bottomStatusBar

    audioCallback

    constructor(ship, invaderGrid, bottomStatusBar, audioCallback) {
        this.ship = ship
        this.invaderGrid = invaderGrid
        this.bottomStatusBar = bottomStatusBar
        this.audioCallback = audioCallback
    }

    provide() {
        return new CollisionImpactResolver(this.ship, this.invaderGrid, this.bottomStatusBar, this.audioCallback)
    }
}

export {CollisionImpactResolver, CollisionImpactResolverProvider}
