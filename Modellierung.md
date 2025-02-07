TODO:
- **fix: Aufgabenbilder falsch sortiert!!** Aufgabenbilder richtig in Datenbank einsortieren: Lösungsbuchstabe E falsch und letztes Aufgabenbild an erster Stelle
- wenn user Training betritt:
    - DONE: schicke aus Backend die Aufgabe mit taskID = currentTask
    - falls isCurrentTaskSolved=true: disable answerButtons
    - wenn User Antwort schickt:
        - setze isCurrentTaskSolved auf true
        - prüfe ob Antwort korrekt (taskSolution von currentTask in tasksXX == userAnswer)
        - koloriere Buttons in entsprechender Farbe und zeige solution
        - setzte Text in nextTaskButton auf "Aufgabe"
        - disable answerButtons
    - bei Klick auf solutionButton:
        - toggle Text im Button zwischen "Lösung" und "Aufgabe"
        - zeige solutionImg bzw taskImg
    - bei klick auf nextTaskButton:
        - rufe setNewCurrentTask() auf → setze currentTask auf die nächste taskID
        - lade neue Aufgabe
        - enable answerButtons
        - koloriere Buttons in default Farbe

setNewCurrentTask():
- suche newTaskID=erste taskID in unsolvedTasks
- entferne newTaskID aus unsolvedTasks
- setze currentTask=newTaskID
- setze isCurrentTaskSolved=false

- Datenbanken tasks34 & tasks56 & tasks78 befüllen
- Konvertiere .gif in .webp
- Performance verbessern:
    - in training.ts: currentTaskId nicht bei jedem Seitenaufruf laden, sondern in Session speichern


Projektstruktur:
Für jede Jahrgangsgruppe (34, 56, 78) eigene Datenbank.
Darin jeweils für jede AufgabenID den Lösungsbuchstaben (A-E), die Schwierigkeitsstufe (3-5) und das Jahr der Veröffentlichung speichern


Erledigt:
- neue Datenbank userGameProfile für die User (userId, userName, currentTaskId, isCurrentTaskSolved, unsolvedTasks) anlegen.
- bei Registrierung:
    - speichere für jeden User in userGameProfile unsolvedTasks als Reihenfolge zufälliger taskIDs (z.B. als String: "12;20,3;67...;42")
    - setze currentTask auf die erste taskID
