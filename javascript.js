let xSpeed = 0
let ySpeed = 0
let zSpeed = 0
let testSpeed = 300
let mode = 0
let direction = 0
let lastDirection = 0
// basic but could be with movement ne and nv, ie up to many directions
let stopped = 0
let forward = 1
let right = 2
let backward = 3
let left = 4
let standby = 5
let mode = 0
let standbyBit = 0
let remoteBit = 1
let controlBit = 2
let updateScreen = 0
let driveDirection = 0
let lastDriveDirection = 0
let controlDirection = 0
let P0 = 0
let P16 = 0
let P8 = 0
let P12 = 0

mode = standbyBit
updateScreen = 1
direction = 0
lastDirection = direction

input.onButtonPressed(Button.A, () => {
    // Sets micro:bit in remote control mode 
    // Press A one the micro:bit you use to control the car
    mode = remoteBit
})

input.onButtonPressed(Button.B, () => {
    // Sets micro:bit in car control mode.
    // press B on the micro:bit placed in the buggy
    // z movement stops and starts buggy
    mode = controlBit
})

input.onButtonPressed(Button.AB, () => {
    // Enter standby mode. 
    // to avoid the car driving while waiving the controller around. 
    // After pressing A+B you have to reconfigure the micro:bit's as described above.
    // pressing on either bit causes standby
    mode = standbyBit
    radio.sendNumber(standby) // this resets both bits
    updateScreen = 1
})

radio.onDataReceived(() => {
    lastDriveDirection = driveDirection
    driveDirection = radio.receiveNumber()

    if (mode === remoteBit) {
        P0 = 0
        P16 = 0
        P8 = 0
        P12 = 0
        if (driveDirection === stopped) {
        } else if (driveDirection === forward) {
            P16 = 1
            P12 = 1
        } else if (driveDirection === right) {
            P16 = 1
        } else if (driveDirection === backward) {
            P0 = 1
            P8 = 1
        } else if (driveDirection === left) {
            P12 = 1
        } else if (driveDirection === standby) {
        }
        pins.digitalWritePin(DigitalPin.P0, P0)
        pins.digitalWritePin(DigitalPin.P16, P16)
        pins.digitalWritePin(DigitalPin.P8, P8)
        pins.digitalWritePin(DigitalPin.P12, P12)
    } else if (mode === controlBit) {
        // do nothing
    }
    if (driveDirection === standby) {
        mode = standby
    }
    if (driveDirection !== lastDriveDirection) {
        updateScreen = 1
    }
})

basic.forever(() => {
    xSpeed = input.acceleration(Dimension.X);
    ySpeed = input.acceleration(Dimension.Y);
    zSpeed = input.acceleration(Dimension.Z);

    lastDirection = direction;

    // not tested IRL
    if (ySpeed < -testSpeed) {
        direction = forward
    } else if (xSpeed > testSpeed) {
        direction = right
    } else if (ySpeed > testSpeed) {
        direction = backward;
    } else if (xSpeed < -testSpeed) {
        direction = left
    } else {
        direction = 0;
    }

    // not tested IRL
    if (mode === controlBit) {
        if (zSpeed > testSpeed) {
            direction = forward
        } else if (zSpeed < -testSpeed) {
            direction = stopped
        }
    }

    radio.sendNumber(direction)

    if (direction !== lastDirection) {
        updateScreen = 1;
    }

    if (updateScreen == 1) {
        updateScreen = 0
        if (direction === stopped) {
            basic.showLeds(`
                    . # # # .
                    # . . . #
                    # . . . #
                    # . . . #
                    . # # # .
                    `)
        } else if (direction === forward) {
            basic.showLeds(`
                    . . # . .
                    . # # # .
                    # . # . #
                    . . # . .
                    . . # . .
                    `)
        } else if (direction === right) {
            basic.showLeds(`
                    . . # . .
                    . . . # .   
                    # # # # #
                    . . . # .
                    . . # . .
                    `)
        } else if (direction === backward) {
            basic.showLeds(`
                    . . # . .
                    . . # . .
                    # . # . #
                    . # # # .
                    . . # . .
                    `)
        } else if (direction === 4) {
            basic.showLeds(`
                    . . # . .
                    . # . . .
                    # # # # #
                    . # . . .
                    . . # . .
                    `)
        } else if (direction === standby) {
            basic.showLeds(`
                    . . # . .
                    . # . # .
                    # # # # #
                    . # . # .
                    . . # . .
                    `)
        }
        basic.pause(10); // if necessary
    }
}
)
