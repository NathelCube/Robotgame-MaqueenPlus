/**
 * Datenaufbau Motordaten Transceiver->Roboter:
 * 
 * [Anzahl-Roboter,Roboter1-GeschwindigkeitLinks,Roboter1-GeschwindigkeitRechts,Roboter2-GeschwindigkeitLinks,Roboter2-GeschwindigkeitRechts,...]
 * 
 * Beispiel mit 2 Robotern:
 * 
 * [3,255,255,60,30,180,200]
 * 
 * Datenaufbau Sendebefehl Transceiver-> Roboter:
 * 
 * ["send"+nummer des Roboters]
 * 
 * Beispiel für Roboter 1:
 * 
 * [send1]
 * 
 * Datenaufbau Roboter->Transceiver:
 * 
 * ["R"+name des Roboters, Sensorwert von Sensor L1, Sensorwert von Sensor R1]
 * 
 * Beispiel für Roboter2:
 * 
 * [R2,2757,2856]
 */
/**
 * Wenn 200-400millisekunden lang, keine neuen Motorbefehle kommen, bleibt der Roboter stehen
 */
/**
 * Motor Richtung:
 * 
 * Wahr - Vorwärts oder Stillstand
 * 
 * Falsch - Rückwärts
 */
function FunkDatenVerarbeiten (FunkDaten: string) {
    if (FunkDaten.substr(0, 1) == "R") {
        DatenArt = "Fremde Sensordaten"
    } else if (FunkDaten.substr(0, 4) == "send") {
        if (FunkDaten.substr(0, 5) == "send1") {
            DatenArt = "Sendeaufforderung"
            Sensordaten = "" + DFRobotMaqueenPlus.readPatrolVoltage(Patrol.L1) + "," + DFRobotMaqueenPlus.readPatrolVoltage(Patrol.R1)
            radio.sendString("R1," + convertToText(Sensordaten))
            serial.writeValue("R1," + convertToText(Sensordaten), 0)
        } else {
            DatenArt = "Fremde Sendeaufforderung"
        }
    } else {
        DatenArt = "MotorBefehle"
        VerbindungOK = true
        FunkverbindungZähler = 0
        Empfangenes_Array = FunkDaten.split(",")
        AnzahlRoboter = parseFloat(Empfangenes_Array[0])
        if (RoboterNummer > AnzahlRoboter) {
            RoboterAktiv = false
            DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 0)
        } else {
            RoboterAktiv = true
            Received1 = parseFloat(Empfangenes_Array[1])
            Received2 = parseFloat(Empfangenes_Array[2])
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
            }
        }
    }
}
// Zum testen
radio.onReceivedString(function (receivedString) {
    FunkDatenVerarbeiten(receivedString)
})
let Motor_Rechts = 0
let Motor_Rechts_Richtung = false
let Motor_Links = 0
let Motor_Links_Richtung = false
let Received2 = 0
let Received1 = 0
let AnzahlRoboter = 0
let Empfangenes_Array: string[] = []
let FunkverbindungZähler = 0
let VerbindungOK = false
let Sensordaten = ""
let DatenArt = ""
let RoboterNummer = 0
let RoboterAktiv = false
DFRobotMaqueenPlus.I2CInit()
radio.setGroup(1)
serial.redirectToUSB()
RoboterAktiv = true
RoboterNummer = 1
let MotordatenSendeGeschwindigkeit = 50
basic.forever(function () {
	
})
loops.everyInterval(200, function () {
    if (FunkverbindungZähler >= 2) {
        VerbindungOK = false
        DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 0)
    }
    FunkverbindungZähler += 1
})
