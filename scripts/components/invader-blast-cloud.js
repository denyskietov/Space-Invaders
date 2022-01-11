class InvaderBlastCloud {

    invaderBlasts

    constructor() {
        this.invaderBlasts = []
    }

    draw(offsetY) {
        this.invaderBlasts = this.invaderBlasts.filter(invaderBlast => !invaderBlast.destroyed)
        for (let i = 0; i < this.invaderBlasts.length; i++) {
            this.invaderBlasts[i].draw(offsetY)
        }
    }

    get invaderBlasts() {
        return this.invaderBlasts
    }

    extends(invaderBlasts) {
        this.invaderBlasts.push(...invaderBlasts)
    }
}

class InvaderBlastCloudProvider {

    constructor() {
        // TODO Nothing goes here
    }

    provide() {
        return new InvaderBlastCloud()
    }
}

export {InvaderBlastCloud, InvaderBlastCloudProvider}
