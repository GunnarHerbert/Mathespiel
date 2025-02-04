TODO:
- neue Datenbank userGameProfile für die User (userId, userName, currentTaskId, isCurrentTaskSolved, unsolvedTasks) anlegen.
- bei Registrierung:
    - speichere für jeden User in userGameProfile unsolvedTasks als Reihenfolge zufälliger taskIDs (z.B. als String: "12;20,3;67...;42")
    - rufe setNewCurrentTask() auf -> setze currentTask auf die erste taskID
- wenn user Training betritt:
    - schicke aus Backend die Aufgabe mit taskID = currentTask
    - falls isCurrentTaskSolved=true: disable answerButtons
    - wenn User Antwort schickt:
        - setze isCurrentTaskSolved auf true
        - prüfe ob Antwort korrekt (taskSolution von currentTask in tasksXX == userAnswer)
        - coloriere Buttons in entsprechender Farbe und zeige solution
        - setzte Text in nextTaskButton auf "Aufgabe"
        - disable answerButtons
    - bei klick auf solutionButton:
        - toggle Text im Button zwischen "Lösung" und "Aufgabe"
        - zeige solutionImg bzw taskImg
    - bei klick auf nextTastButton:
        - rufe setNewCurrentTask() auf -> setze currentTask auf die nächste taskID
        - lade neue Aufgabe
        - enable answerButtons
        - coloriere Buttons in default Farbe

setNewCurrentTask():
- suche newTaskID=erste taskID in unsolvedTasks
- entferne newTaskID aus unsolvedTasks
- setze currentTask=newTaskID
- setze isCurrentTaskSolved=false

- Datenbanken tasks34 & tasks56 & tasks78 befüllen
- Konvertiere .gif in .webp


Projektstruktur:
Für jede Jahrgangsgruppe (34, 56, 78) eigene Datenbank.
Darin jeweils für jede AufgabenID den Lösungsbuchstaben (A-E), die Schwierigkeitsstufe (3-5) und das Jahr der Veröffentlichung speichern
