import {Canvas} from './components/canvas.js'
import {InvaderProvider} from './components/invader.js'
import {ShipProvider} from './components/ship.js'
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    COOL,
    Direction,
    INTERVAL,
    INVADER_BLAST_OFFSET_Y,
    INVADER_OFFSET_STEP_X,
    INVADER_OFFSET_STEP_Y,
    PATH_SCORES,
    SHIP_BLAST_MAX,
    SHIP_BLAST_OFFSET_Y,
    SHIP_OFFSET_STEP_X,
    SIZE,
    State,
    STATUS_BAR_OFFSET_X,
    STATUS_BAR_OFFSET_Y,
    TIMEOUT
} from './constants.js'
import {InvaderBlastProvider} from './components/invader-blast.js'
import {ShipBlastProvider} from './components/ship-blast.js'
import {InvaderColumnProvider} from './components/invader-column.js'
import {InvaderGridProvider} from './components/invader-grid.js'
import {InvaderBlastCloudProvider} from './components/invader-blast-cloud.js'
import {ShipBlastCloudProvider} from './components/ship-blast-cloud.js'
import {ShipEventListenerProvider} from './components/ship-event-listener.js'
import {InvaderImpactResolverProvider} from './components/invader-impact-resolver.js'
import {ShipImpactResolverProvider} from './components/ship-impact-resolver.js'
import {TopStatusBarProvider} from './components/top-status-bar.js'
import {MiddleStatusBarProvider} from './components/middle-status-bar.js'
import {BottomStatusBarProvider} from './components/bottom-status-bar.js'
import {CollisionImpactResolverProvider} from './components/collision-impact-resolver.js'

class Game {

    // Level
    cool
    timeout
    interval
    active
    music
    effect
    level

    // Events
    backgroundAudioEvent
    shipBlastAudioEvent
    shipDamageAudioEvent
    // invaderBlastAudioEvent
    invaderDamageAudioEvent

    // Config
    config

    // Ship
    shipOffsetX
    shipDirectionX

    // Ship blast
    shipBlastOffsetY

    // Invader
    invaderOffsetX
    invaderOffsetY
    invaderDirectionX

    // Invader blast
    invaderBlastOffsetY

    // Other
    canvas
    topStatusBar
    middleStatusBar
    bottomStatusBar
    ship
    shipEventListener
    invaderGrid
    invaderBlastCloud
    shipBlastCloud
    invaderImpactResolver
    shipImpactResolver
    collisionImpactResolver

    constructor() {
        // Game related
        this.cool = 0
        this.timeout = 0
        this.interval = 0
        this.active = false
        this.music = State.ON
        this.effect = State.ON

        // Level related
        this.level = {
            value: 1,
            adjuster: 1
        }

        // Events
        const backgroundAudio = new Audio('./assets/audios/background.mp3')
        const backgroundAudioEventListener = () => {
            backgroundAudio.play().then(() => {
                backgroundAudio.addEventListener('ended', () => audio.play())
            })
        }
        this.backgroundAudioEvent = new Event('background-audio')
        document.addEventListener('background-audio', backgroundAudioEventListener)

        this.shipBlastAudioEvent = new Event('ship-blast-audio')
        document.addEventListener('ship-blast-audio', () => new Audio('./assets/audios/ship-blast.mp3').play())

        this.shipDamageAudioEvent = new Event('ship-damage-audio')
        document.addEventListener('ship-damage-audio', () => new Audio('./assets/audios/ship-damage.mp3').play())

        // this.invaderBlastAudioEvent = new Event('invader-blast-audio')
        // document.addEventListener('invader-blast-audio', () => new Audio('./assets/audios/invader-blast.mp3').play())

        this.invaderDamageAudioEvent = new Event('invader-damage-audio')
        document.addEventListener('invader-damage-audio', () => new Audio('./assets/audios/invader-damage.mp3').play())

        document.addEventListener('keydown', (e) => {
            e.preventDefault()
            // Music on/off
            if (e.key === 'm') {
                if (this.music === State.ON) {
                    this.music = State.OFF
                    backgroundAudio.pause()
                } else if (this.music === State.OFF) {
                    this.music = State.ON
                    backgroundAudio.play().then(() => {
                        backgroundAudio.addEventListener('ended', () => audio.play())
                    })
                }
            }
            // Effect on/off
            if (e.key === 'f') {
                if (this.effect === State.ON) {
                    this.effect = State.OFF
                } else if (this.effect === State.OFF) {
                    this.effect = State.ON
                }
            }
        })

        // Ship
        this.shipOffsetX = 0
        this.shipDirectionX = Direction.NONE

        // Ship blast
        this.shipBlastOffsetY = SHIP_BLAST_OFFSET_Y

        // Invader
        this.invaderOffsetX = INVADER_OFFSET_STEP_X
        this.invaderOffsetY = INVADER_OFFSET_STEP_Y
        this.invaderDirectionX = Direction.RIGHT

        // Invader blast
        this.invaderBlastOffsetY = INVADER_BLAST_OFFSET_Y

        // Other
        this.canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT)

        // Ship event listener
        const shipEventListenerProvider = new ShipEventListenerProvider(() => {
            if (this.active && this.ship.x > SHIP_OFFSET_STEP_X) {
                this.shipOffsetX = SHIP_OFFSET_STEP_X
                this.shipDirectionX = Direction.LEFT
            }
        }, () => {
            if (this.active && this.ship.x + this.ship.width + SHIP_OFFSET_STEP_X < CANVAS_WIDTH) {
                this.shipOffsetX = SHIP_OFFSET_STEP_X
                this.shipDirectionX = Direction.RIGHT
            }
        }, () => {
            if (this.active && 0 < this.config.ship.blast.count.value) {
                this.config.ship.blast.count.value--
                this.shipBlastCloud.extends([this.ship.blast()])
            }
        })
        this.shipEventListener = shipEventListenerProvider.provide()

        // Top status bar
        const topStatusBarProvider = new TopStatusBarProvider(this.canvas, './assets/images/invader-status.png')
        this.topStatusBar = topStatusBarProvider.provide(STATUS_BAR_OFFSET_X, STATUS_BAR_OFFSET_Y)

        // Middle status bar
        const middleStatusBarProvider = new MiddleStatusBarProvider(this.canvas, './assets/images/invader-status.png')
        this.middleStatusBar = middleStatusBarProvider.provide(STATUS_BAR_OFFSET_X, STATUS_BAR_OFFSET_Y)

        // Bottom status bar
        const bottomStatusBarProvider = new BottomStatusBarProvider(this.canvas, './assets/images/ship-status.png', './assets/images/ship-blast-status.png')
        this.bottomStatusBar = bottomStatusBarProvider.provide(STATUS_BAR_OFFSET_X, STATUS_BAR_OFFSET_Y)

        // Init
        this.init()
    }

    init() {
        this.active = false

        // Config related
        this.config = {
            ship: {
                // interval: {
                //     value: INTERVAL,
                //     refresh: INTERVAL * 100,
                // },
                blast: {
                    interval: {
                        value: INTERVAL,
                        refresh: INTERVAL * 2
                    },
                    timeout: {
                        value: TIMEOUT,
                        refresh: TIMEOUT * 20
                    },
                    count: {
                        value: SHIP_BLAST_MAX,
                        max: SHIP_BLAST_MAX
                    }
                }
            },
            invader: {
                interval: {
                    value: INTERVAL,
                    refresh: INTERVAL * 10 / (this.level.value * this.level.adjuster)
                },
                blast: {
                    interval: {
                        value: INTERVAL,
                        refresh: INTERVAL * 2
                    },
                    timeout: {
                        value: TIMEOUT,
                        refresh: TIMEOUT * 20 * 3
                    },
                    count: {
                        value: 1 + (this.level.value * this.level.adjuster)
                    }
                }
            }
        }

        // Ship
        const shipBlastProvider = new ShipBlastProvider(
            this.canvas,
            ['./assets/images/ship-blast-0.png', './assets/images/ship-blast-1.png', './assets/images/ship-blast-2.png'],
            () => {
                if (this.effect === State.ON) {
                    document.dispatchEvent(this.shipBlastAudioEvent)
                }
            }
        )
        const shipProvider = new ShipProvider(
            this.canvas,
            ['./assets/images/ship-0.png', './assets/images/ship-1.png', './assets/images/ship-2.png'],
            ['./assets/images/ship-damage-0.png', './assets/images/ship-damage-1.png', './assets/images/ship-damage-2.png'],
            ['./assets/images/ship-destroy-0.png', './assets/images/ship-destroy-1.png', './assets/images/ship-destroy-2.png'],
            shipBlastProvider)
        this.ship = shipProvider.provide(this.canvas.width / 2, this.canvas.height - this.bottomStatusBar.height)

        // Ship blasts
        const shipBlastCloudProvider = new ShipBlastCloudProvider()
        this.shipBlastCloud = shipBlastCloudProvider.provide()

        // Invader
        const invaderBlastProvider = new InvaderBlastProvider(
            this.canvas,
            ['./assets/images/invader-blast-0.png', './assets/images/invader-blast-1.png', './assets/images/invader-blast-2.png'],
            // () => {
            //     if (this.effect === State.ON) {
            //         document.dispatchEvent(this.invaderBlastAudioEvent)
            //     }
            // }
        )
        const invaderProvider = new InvaderProvider(
            this.canvas,
            ['./assets/images/invader-0.png', './assets/images/invader-1.png', './assets/images/invader-2.png'],
            ['./assets/images/invader-damage-0.png', './assets/images/invader-damage-1.png', './assets/images/invader-damage-2.png'],
            invaderBlastProvider
        )
        const invaderColumnProvider = new InvaderColumnProvider(invaderProvider)
        const invaderGridProvider = new InvaderGridProvider(invaderColumnProvider)
        this.invaderGrid = invaderGridProvider.provide(this.invaderOffsetX - this.invaderOffsetX, this.topStatusBar.height - this.invaderOffsetY)

        // Invader blasts
        const invaderBlastCloudProvider = new InvaderBlastCloudProvider()
        this.invaderBlastCloud = invaderBlastCloudProvider.provide()

        // Ship impact resolver
        const shipImpactResolverProvider = new ShipImpactResolverProvider(
            this.ship, this.invaderBlastCloud, this.bottomStatusBar,
            () => {
                if (this.effect === State.ON) {
                    document.dispatchEvent(this.shipDamageAudioEvent)
                }
            }
        )
        this.shipImpactResolver = shipImpactResolverProvider.provide()

        // Invader impact resolver
        const invaderImpactResolverProvider = new InvaderImpactResolverProvider(
            this.invaderGrid, this.shipBlastCloud, this.topStatusBar,
            () => {
                if (this.effect === State.ON) {
                    document.dispatchEvent(this.invaderDamageAudioEvent)
                }
            }
        )
        this.invaderImpactResolver = invaderImpactResolverProvider.provide()

        // Collision impact resolver
        const collisionImpactResolverProvider = new CollisionImpactResolverProvider(
            this.ship, this.invaderGrid, this.bottomStatusBar,
            () => {
                if (this.effect === State.ON) {
                    document.dispatchEvent(this.shipDamageAudioEvent)
                }
            }
        )
        this.collisionImpactResolver = collisionImpactResolverProvider.provide()
    }

    start() {
        this.active = false

        this.canvas.write('Space Invaders', SIZE, 'center', this.canvas.width / 2, this.canvas.height / 2 - SIZE / 2)
        this.canvas.write('... press \'space\' to start ...', SIZE / 2, 'center', this.canvas.width / 2, this.canvas.height / 2 + SIZE / 2)
        this.canvas.write('\'m\' - on/off music     \'f\' - on/off effects', SIZE / 2, 'center', this.canvas.width / 2, this.canvas.height - SIZE / 2)

        const keyupEventListener = (e) => {
            e.preventDefault()
            if (e.key === ' ') {
                this.ready()
                document.dispatchEvent(this.backgroundAudioEvent)
                document.removeEventListener('keyup', keyupEventListener)
            }
        }

        document.addEventListener('keyup', keyupEventListener)
    }

    ready() {
        this.active = false

        this.canvas.clear()

        this.canvas.write(`Level ${this.level.value}`, SIZE, 'center', this.canvas.width / 2, this.canvas.height / 2)

        this.timeout = setTimeout(() => this.launch(), TIMEOUT * 100)
    }

    launch() {
        this.active = false

        this.interval = setInterval(() => window.requestAnimationFrame(() => this.animate()), INTERVAL)
    }

    animate() {
        this.active = true

        if (this.invaderGrid.destroyed) {
            this.next()
        } else if (this.ship.destroyed && COOL < this.cool++) {
            this.over()
        } else {
            this.canvas.clear()

            // Ship
            this.ship.draw(this.shipOffsetX, 0, this.shipDirectionX)
            this.shipBlastCloud.draw(this.shipBlastOffsetY)
            // Ship blast
            if (this.config.ship.blast.count.value < this.config.ship.blast.count.max) {
                this.config.ship.blast.timeout.value += TIMEOUT
                if (this.config.ship.blast.timeout.refresh <= this.config.ship.blast.timeout.value) {
                    this.config.ship.blast.count.value++
                    this.config.ship.blast.timeout.value = TIMEOUT
                }
            } else {
                this.config.ship.blast.timeout.value = TIMEOUT
            }

            // Invaders
            this.invaderGrid.draw(this.invaderOffsetX, this.invaderOffsetY, this.invaderDirectionX)
            this.invaderBlastCloud.draw(this.invaderBlastOffsetY)
            // Invaders blast
            this.config.invader.blast.timeout.value += TIMEOUT
            if (this.config.invader.blast.timeout.refresh <= this.config.invader.blast.timeout.value) {
                this.config.invader.blast.timeout.value = TIMEOUT
                this.invaderBlastCloud.extends(this.invaderGrid.blast(this.config.invader.blast.count.value))
            }

            // Update top status bar
            this.topStatusBar.level = this.level.value
            this.topStatusBar.draw()

            // Update bottom status bar
            this.bottomStatusBar.blast = this.config.ship.blast.count.value
            this.bottomStatusBar.draw()

            // Ship impact resolver
            this.shipImpactResolver.resolve()

            // Invader impact resolver
            this.invaderImpactResolver.resolve()

            // Collision impact resolver
            this.collisionImpactResolver.resolve()

            // Update ship
            if (!this.ship.destroyed) {
                this.shipOffsetX = 0
                this.shipDirectionX = Direction.NONE
                // Update ship blast intervals
                this.config.ship.blast.interval.value += INTERVAL
                if (this.config.ship.blast.interval.refresh <= this.config.ship.blast.interval.value) {
                    this.config.ship.blast.interval.value = INTERVAL
                    this.shipBlastOffsetY = SHIP_BLAST_OFFSET_Y
                } else {
                    this.shipBlastOffsetY = 0
                }
            }

            // Update invaders
            if (!this.invaderGrid.destroyed) {
                const invaderDirectionX = this.invaderDirectionX
                // If invaders reached right side, change direction to left
                if (CANVAS_WIDTH - this.invaderOffsetX <= this.invaderGrid.x + this.invaderGrid.width) {
                    this.invaderDirectionX = Direction.LEFT
                }
                // If invaders reached left side, change direction to right
                if (this.invaderGrid.x <= this.invaderOffsetX) {
                    this.invaderDirectionX = Direction.RIGHT
                }
                // If invaders direction x changes, increase invaders y offset
                if (invaderDirectionX === this.invaderDirectionX) {
                    this.invaderOffsetY = 0
                } else {
                    this.invaderOffsetY = INVADER_OFFSET_STEP_Y
                }
                // Update invader intervals
                this.config.invader.interval.value += INTERVAL
                if (this.config.invader.interval.refresh <= this.config.invader.interval.value) {
                    this.config.invader.interval.value = INTERVAL
                    this.invaderOffsetX = INVADER_OFFSET_STEP_X
                } else {
                    this.invaderOffsetX = 0
                }
                // Update invader blast intervals
                this.config.invader.blast.interval.value += INTERVAL
                if (this.config.invader.blast.interval.refresh <= this.config.invader.blast.interval.value) {
                    this.config.invader.blast.interval.value = INTERVAL
                    this.invaderBlastOffsetY = INVADER_BLAST_OFFSET_Y
                } else {
                    this.invaderBlastOffsetY = 0
                }
            }
        }
    }

    next() {
        this.active = false

        this.cool = 0
        clearInterval(this.interval)

        this.level.value++
        this.config.ship.blast.count.value = SHIP_BLAST_MAX

        this.middleStatusBar.reset()
        this.bottomStatusBar.reset()

        this.init()
        this.ready()
    }

    over() {
        this.active = false

        this.cool = 0
        clearInterval(this.interval)

        this.canvas.write('Game Over', SIZE, 'center', this.canvas.width / 2, this.canvas.height / 2)

        this.timeout = setTimeout(() => this.end(), TIMEOUT * 300)
    }

    end() {
        this.active = false

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: this.topStatusBar.destroy
        }

        fetch(PATH_SCORES, request)
            .then((response) => response.text())
            .then((text) => JSON.parse(text))
            .then((scores) => this.middleStatusBar.scores = scores)
            .catch(() => this.middleStatusBar.scores = [this.topStatusBar.destroy].concat(...new Array(9).fill(0)))
            .finally(() => {
                this.middleStatusBar.draw()

                const keyupEventListener = (e) => {
                    e.preventDefault()
                    if (e.key === ' ') {
                        this.level.value = 1
                        this.config.ship.blast.count.value = SHIP_BLAST_MAX

                        this.topStatusBar.reset()
                        this.middleStatusBar.reset()
                        this.bottomStatusBar.reset()

                        this.init()
                        this.ready()
                        document.removeEventListener('keyup', keyupEventListener)
                    }
                }

                document.addEventListener('keyup', keyupEventListener)
            })
    }
}

export {Game}
