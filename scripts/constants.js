const PATH_SCORES = '/scores'

const COOL = 5
const SCALE = 0.8
const INTERVAL = 50
const TIMEOUT = 5
const SIZE = 42

const ROWS = 5
const COLS = 11

const CANVAS_WIDTH = 1400
const CANVAS_HEIGHT = 800

const STATUS_BAR_OFFSET_X = 10
const STATUS_BAR_OFFSET_Y = 10

const BOTTOM_STATUS_BAR_SCALE = 0.5
const TOP_STATUS_BAR_SCALE = 1

// Ship
const SHIP_OFFSET_STEP_X = 10
const SHIP_OFFSET_STEP_Y = 10
const SHIP_DESTROY_MAX = 5
const SHIP_BLAST_MAX = 29

// Ship blast
const SHIP_BLAST_OFFSET_Y = 5

// Invader
const INVADER_BETWEEN_DISTANCE_X = 30 * SCALE
const INVADER_BETWEEN_DISTANCE_Y = 20 * SCALE

const INVADER_OFFSET_STEP_X = 20
const INVADER_OFFSET_STEP_Y = 20

// Invader blast
const INVADER_BLAST_OFFSET_Y = 5

const Direction = {
    NONE: 'None',
    UP: 'Up',
    DOWN: 'Down',
    LEFT: 'Left',
    RIGHT: 'Right'
}

const State = {
    ON: 'on',
    OFF: 'off'
}

export {
    PATH_SCORES,
    COOL,
    SCALE,
    INTERVAL,
    TIMEOUT,
    SIZE,
    ROWS,
    COLS,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    STATUS_BAR_OFFSET_X,
    STATUS_BAR_OFFSET_Y,
    BOTTOM_STATUS_BAR_SCALE,
    TOP_STATUS_BAR_SCALE,
    SHIP_OFFSET_STEP_X,
    SHIP_OFFSET_STEP_Y,
    SHIP_DESTROY_MAX,
    SHIP_BLAST_MAX,
    SHIP_BLAST_OFFSET_Y,
    INVADER_BETWEEN_DISTANCE_X,
    INVADER_BETWEEN_DISTANCE_Y,
    INVADER_OFFSET_STEP_X,
    INVADER_OFFSET_STEP_Y,
    INVADER_BLAST_OFFSET_Y,
    Direction,
    State
}
