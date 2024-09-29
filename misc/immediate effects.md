# Immediate Effects

| Spell Number | Name        | Element   | Effect Name                      |
| ------------ | ----------- | --------- | -------------------------------- |
| 9            | Lapis Vires | Fire      | TakeCrystalEffect                |
| 10           | Eversor     | Fire      | DestroySpellEffect               |
| 11           | Vitium      | Fire      | CrushCrystalsSpellEffect         |
| 22           | Lapis Vires | Earth     | TakeCrystalEffect                |
| 35           | Lapis Vires | Water     | TakeCrystalEffect                |
| 36           | SPECULUM    | Water     | CopyImmediateSpellSpellEffect    |
| 48           | Lapis Vires | Air       | TakeCrystalEffect                |
| 49           | Mutare      | Air       | ExchangeWithSpellPoolSpellEffect |
| 53           | Velocitatis | Universal | PlayTwoSpellsSpellEffect         |
| 54           | ADDITICIUS  | Universal | AddFromSpellPoolSpellEffect      |
| 55           | SUOERIACIO  | Overload  | OverloadEffect                   |

# Processing each effect

| Effect Name                      | Details                                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| TakeCrystalEffect                | Just add extra crystal from pile to player, no extra states needed                                                                                |
| DestroySpellEffect               | Extra step needed to select a spell on enemy board                                                                                                |
| CrushCrystalsSpellEffect         | Just get 1 crystal from each player back to pile                                                                                                  |
| CopyImmediateSpellSpellEffect    | Extra step needed to select a spell. From anywhere, be it your board, enemies' board or spell pool.                                               |
| ExchangeWithSpellPoolSpellEffect | Extra step needed to pick a spell from your board and from spell pool. Potentially another one if it's Univeral to select the column              |
| PlayTwoSpellsSpellEffect         | No extra step needed, but conditions for round preparation must be changed to allow to play another spell without swapping hands between players. |
| AddFromSpellPoolSpellEffect      | Extra step needed to select a spell and potentially another one if it's Universal to select the column                                            |
| OverloadEffect                   | Extra step to select card from spell pool and potential extra one if it's Universal to select the column.                                         |
