class ShipImpactResolver {

    ship
    invaderBlastCloud
    bottomStatusBar

    audioCallback

    constructor(ship, invaderBlastCloud, bottomStatusBar, audioCallback) {
        this.ship = ship
        this.invaderBlastCloud = invaderBlastCloud
        this.bottomStatusBar = bottomStatusBar

        this.audioCallback = audioCallback
    }

    resolve() {
        const ship = this.ship
        const invaderBlasts = this.invaderBlastCloud.invaderBlasts
            .filter(invaderBlast => !invaderBlast.destroyed)
        // TODO Somewhere in filters below we have a bug
        // .filter(invaderBlast => this.ship.y < (invaderBlast.y + invaderBlast.height) && invaderBlast.y < (this.ship.y + this.ship.height))
        // .filter(invaderBlast => this.ship.x < (invaderBlast.x + invaderBlast.width) && invaderBlast.x < (this.ship.x + this.ship.width))

        for (let i = 0; i < invaderBlasts.length; i++) {
            const invaderBlast = invaderBlasts[i]
            if (!ship.damaged
                && ship.y < (invaderBlast.y + invaderBlast.height) && invaderBlast.y < (ship.y + ship.height)
                && ship.x < (invaderBlast.x + invaderBlast.width) && invaderBlast.x < (ship.x + ship.width)
            ) {
                ship.damage = ship.damage + 1
                this.audioCallback()

                ship.destroy = ship.destroy + 1
                if (ship.destroyed) {
                    setTimeout(() => this.audioCallback(), 50)
                    setTimeout(() => this.audioCallback(), 100)
                    setTimeout(() => this.audioCallback(), 150)
                    setTimeout(() => this.audioCallback(), 200)
                    setTimeout(() => this.audioCallback(), 250)
                }

                this.bottomStatusBar.destroy = this.bottomStatusBar.destroy - 1

                invaderBlast.destroyed = true
            }
        }
    }
}

class ShipImpactResolverProvider {

    ship
    invaderBlastCloud
    bottomStatusBar

    audioCallback

    constructor(ship, invaderBlastCloud, bottomStatusBar, audioCallback) {
        this.ship = ship
        this.invaderBlastCloud = invaderBlastCloud
        this.bottomStatusBar = bottomStatusBar
        this.audioCallback = audioCallback
    }

    provide() {
        return new ShipImpactResolver(this.ship, this.invaderBlastCloud, this.bottomStatusBar, this.audioCallback)
    }
}

export {ShipImpactResolver, ShipImpactResolverProvider}
