class ShipBlastCloud {

    shipBlasts

    constructor() {
        this.shipBlasts = []
    }

    draw(offsetY) {
        this.shipBlasts = this.shipBlasts.filter(shipBlast => !shipBlast.destroyed)
        for (let i = 0; i < this.shipBlasts.length; i++) {
            this.shipBlasts[i].draw(offsetY)
        }
    }

    get shipBlasts() {
        return this.shipBlasts
    }

    extends(shipBlasts) {
        this.shipBlasts.push(...shipBlasts)
    }
}

class ShipBlastCloudProvider {

    constructor() {
        // TODO Nothing goes here
    }

    provide() {
        return new ShipBlastCloud()
    }
}

export {ShipBlastCloud, ShipBlastCloudProvider}
