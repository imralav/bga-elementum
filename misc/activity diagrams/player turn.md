```mermaid
activityDiagram
    title Player Turn

    Player ->> Game: Take Turn
    Game ->> Player: Update Board
    Player ->> Game: Submit Move
    Game ->> Player: Update Board
```
