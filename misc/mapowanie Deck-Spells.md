W domenie gry mamy Spells, czyli zagrywane karty z efektami, wzmocnieniami itp.

W silniku BGA mamy Deck. Mapowanie wg poniższego schematu:

| Pole w pojedynczym obiekcie wewnątrz Deck | Domena Elementum                    | Wyjaśnienie                                                                                                                                                                                                                                                               |
| ----------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                        | -                                   | zwykłe bazodanowe, autogenerowane id                                                                                                                                                                                                                                      |
| location, varchar(16)                     | karta gracza, talia, spell pool itp | miejsce, gdzie znajduje się ta karta, np hand, deck, discard itp                                                                                                                                                                                                          |
| location_arg, int(11)                     | -                                   | dodatkowe dostrojenie lokacji, np jeśli `hand` to czyjego gracza jest to ręka? Tutaj często będziemy wrzucać `$player_id`                                                                                                                                                 |
| type, varchar(16)                         | żywioł                              | rodzaj, do którego karta należy, np zwykłe karty są pik, karo itp, w elementum są za to 4 żywioły                                                                                                                                                                         |
| type_arg, int(11)                         | nr karty                            | np wartość karty w ramach danego rodzaju, np `5 pik` to `type=pik` i `type_arg=5`. Dla Elementum każda karta ma swój numer i chyba po prostu ten numer tutaj wsadzę, czyli typ powie jaki to żywioł, a type_arg będzie numerem karty ogółem, w ramach wszystkich żywiołów |

# Wszystkie obsługiwane lokacje

1. standardowy deck
2. standardowy `hand` per gracz, nowe karty dochodzą na początku rundy
3. domenowy _spell pool_

# Co będzie poza lokacjami i komponentem Deck

1. Sam board, gdzie gracze wykładają karty, będzie poza deckiem. Tam mamy konkretne wiersze i kolumny, a nie talia kart do shufflowania, przekładania itp.
