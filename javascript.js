let P12 = 0
let P8 = 0
let stopped = 0
let direction = 0
let P16 = 0
let lastDirection = 0
let left = 0
let P0 = 0
let zSpeed = 0
let backward = 0
let standby = 0
let setRemoteBit = 0
let ySpeed = 0
let right = 0
let driveDirection = 0
let standbyBit = 0
let xSpeed = 0
let forward = 0
let lastDriveDirection = 0
let updateScreen = 0
let controlBit = 0
let remoteBit = 0
let testSpeed = 0
let radioReceived = 0
let mode = 0
input.onButtonPressed(Button.A, () => {
    // change to left
    mode = remoteBit
})
input.onButtonPressed(Button.B, () => {
    // change to right
    mode = controlBit
})
input.onButtonPressed(Button.AB, () => {
    if (mode == standbyBit) {
        mode = controlBit
        radio.sendNumber(setRemoteBit)
    } else {
        mode = standbyBit
        radio.sendNumber(standby)
    }
    updateScreen = 1
})
radio.onDataReceived(() => {
    radioReceived = radio.receiveNumber()
    lastDriveDirection = driveDirection
    if (radioReceived == standby) {
        mode = standbyBit
    } else if (radioReceived == setRemoteBit) {
        mode = remoteBit
    } else if (mode == remoteBit) {
        driveDirection = radioReceived
        P0 = 0
        P16 = 0
        P8 = 0
        P12 = 0
        if (driveDirection == stopped) {

        } else if (driveDirection == forward) {
            P16 = 1
            P12 = 1
        } else if (driveDirection == right) {
            P16 = 1
        } else if (driveDirection == backward) {
            P0 = 1
            P8 = 1
        } else if (driveDirection == left) {
            P12 = 1
        }
        pins.digitalWritePin(DigitalPin.P0, P0)
        pins.digitalWritePin(DigitalPin.P16, P16)
        pins.digitalWritePin(DigitalPin.P8, P8)
        pins.digitalWritePin(DigitalPin.P12, P12)
    } else if (mode == controlBit) {

    }
    if (driveDirection != lastDriveDirection) {
        updateScreen = 1
    }
})
basic.forever(() => {
    if (mode == standbyBit) {
        updateScreen = 1
    } else {
        xSpeed = input.acceleration(Dimension.X)
        ySpeed = input.acceleration(Dimension.Y)
        zSpeed = input.acceleration(Dimension.Z)
        lastDirection = direction
        // not tested IRL
        if (ySpeed < 0 - testSpeed) {
            direction = forward
        } else if (xSpeed > testSpeed) {
            direction = right
        } else if (ySpeed > testSpeed) {
            direction = backward
        } else if (xSpeed < 0 - testSpeed) {
            direction = left
        } else {
            direction = stopped
        }
        // not tested IRL
        if (mode == controlBit) {
            if (zSpeed > testSpeed) {
                direction = forward
            } else if (zSpeed < 0 - testSpeed) {
                direction = stopped
            }
        }
        radio.sendNumber(direction)
    }
    if (updateScreen == 1) {
        updateScreen = 0
        if (mode == standbyBit) {
            basic.showLeds(`
                . . # . .
                . # . # .
                # # # # #
                . # . # .
                . . # . .
                `)
        } else if (direction == stopped) {
            basic.showLeds(`
                . # # # .
                # . . . #
                # # # # #
                # . . . #
                . # # # .
                `)
        } else if (direction == forward) {
            basic.showArrow(ArrowNames.North)
        } else if (direction == right) {
            basic.showArrow(ArrowNames.East)
        } else if (direction == backward) {
            basic.showArrow(ArrowNames.South)
        } else if (direction == 4) {
            basic.showArrow(ArrowNames.West)
        }
        basic.pause(10)
    }
})
testSpeed = 300
forward = 1
right = 2
backward = 3
left = 4
standby = 5
setRemoteBit = 6
remoteBit = 1
controlBit = 2
mode = standbyBit
updateScreen = 1
direction = standby
lastDirection = standby
radio.sendNumber(standby)
