class InvaderImpactResolver {

    invaderGrid
    shipBlastCloud
    topStatusBar

    audioCallback

    constructor(invaderGrid, shipBlastCloud, topStatusBar, audioCallback) {
        this.invaderGrid = invaderGrid
        this.shipBlastCloud = shipBlastCloud
        this.topStatusBar = topStatusBar

        this.audioCallback = audioCallback
    }

    resolve() {
        const invaders = this.invaderGrid.invaders
        const shipBlasts = this.shipBlastCloud.shipBlasts
            .filter(shipBlast => !shipBlast.destroyed)
        // TODO Somewhere in filters below we have a bug
        // .filter(shipBlast => this.invaderGrid.y < (shipBlast.y + shipBlast.height) && shipBlast.y < (this.invaderGrid.y + this.invaderGrid.height))
        // .filter(shipBlast => this.invaderGrid.x < (shipBlast.x + shipBlast.width) && shipBlast.x < (this.invaderGrid.x + this.invaderGrid.width))

        for (let i = 0; i < invaders.length; i++) {
            const invader = invaders[i]
            for (let j = 0; j < shipBlasts.length; j++) {
                const shipBlast = shipBlasts[j];
                if (!invader.damaged
                    && invader.y < (shipBlast.y + shipBlast.height) && shipBlast.y < (invader.y + invader.height)
                    && invader.x < (shipBlast.x + shipBlast.width) && shipBlast.x < (invader.x + invader.width)
                ) {
                    invader.damage = invader.damage + 1
                    this.audioCallback()

                    this.topStatusBar.destroy = this.topStatusBar.destroy + 1

                    shipBlast.destroyed = true
                }
            }
        }
    }
}

class InvaderImpactResolverProvider {

    invaderGrid
    shipBlastCloud
    topStatusBar

    audioCallback

    constructor(invaderGrid, shipBlastCloud, topStatusBar, audioCallback) {
        this.invaderGrid = invaderGrid
        this.shipBlastCloud = shipBlastCloud
        this.topStatusBar = topStatusBar

        this.audioCallback = audioCallback
    }

    provide() {
        return new InvaderImpactResolver(this.invaderGrid, this.shipBlastCloud, this.topStatusBar, this.audioCallback)
    }
}

export {InvaderImpactResolver, InvaderImpactResolverProvider}
