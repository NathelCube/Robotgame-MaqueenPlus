/**
 * Zum testen
 */
radio.onReceivedString(function (receivedString) {
    Empfangenes_Array = receivedString.split(",")
    EmpfangenSignal = true
})
/**
 * Motor Richtung:
 * 
 * Wahr - Vorwärts oder Stillstand
 * 
 * Falsch - Rückwärts
 */
let Motor_Rechts = 0
let Motor_Rechts_Richtung = false
let Motor_Links = 0
let Motor_Links_Richtung = false
let Received2 = 0
let Received1 = 0
let EmpfangenSignal = false
let Empfangenes_Array: string[] = []
DFRobotMaqueenPlus.I2CInit()
radio.setGroup(1)
let LinetrackingL1 = DFRobotMaqueenPlus.readPatrol(Patrol.L1)
let LinetrackingR1 = DFRobotMaqueenPlus.readPatrol(Patrol.R1)
serial.redirectToUSB()
basic.forever(function () {
    if (EmpfangenSignal) {
        Received1 = parseFloat(Empfangenes_Array[0])
        Received2 = parseFloat(Empfangenes_Array[1])
        serial.writeValue("Links", Received1)
        serial.writeValue("Rechts", Received2)
        if (Received1 <= 126) {
            Motor_Links_Richtung = false
            Motor_Links = Math.map(Received1, 126, 0, 0, 255)
        } else if (Received1 == 127) {
            Motor_Links_Richtung = true
            Motor_Links = 0
        } else {
            Motor_Links_Richtung = true
            Motor_Links = Math.map(Received1, 128, 255, 0, 255)
        }
        if (Received2 <= 126) {
            Motor_Rechts_Richtung = false
            Motor_Rechts = Math.map(Received2, 126, 0, 0, 255)
        } else if (Received2 == 127) {
            Motor_Rechts_Richtung = true
            Motor_Rechts = 0
        } else {
            Motor_Rechts_Richtung = true
            Motor_Rechts = Math.map(Received2, 128, 255, 0, 255)
            if (Motor_Links_Richtung) {
                DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CW, Motor_Links)
            } else {
                DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CCW, Motor_Links)
            }
            if (Motor_Rechts_Richtung) {
                DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CW, Motor_Rechts)
            } else {
                DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CCW, Motor_Rechts)
            }
            if (input.buttonIsPressed(Button.A)) {
                DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 76)
            }
            if (input.buttonIsPressed(Button.B)) {
                DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 0)
            }
            EmpfangenSignal = false
        }
    }
})
