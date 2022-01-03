radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 50) {
        DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 50)
    }
    if (receivedNumber == 10) {
        DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 0)
    }
})
DFRobotMaqueenPlus.I2CInit()
radio.setGroup(1)
let LinetrackingL1 = DFRobotMaqueenPlus.readPatrol(Patrol.L1)
let LinetrackingR1 = DFRobotMaqueenPlus.readPatrol(Patrol.R1)
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 76)
    }
    if (input.buttonIsPressed(Button.B)) {
        DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 0)
    }
})
