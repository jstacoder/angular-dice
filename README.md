##The Game Of 10,000


###Rules
* roll 6 dice
* if you have any 1's, 5's, 3 or more of a kind, or 1-6 you can choose to either hold them for points 
  - or if you have at least 1000 points you can stop your turn and keep any point accumulated so far this turn
* if you dont hold any dice you lose all points for the turn and your turn is over

###score table

|  num on dice  | rolled 1  | rolled 2  | rolled 3  | rolled 4  | rolled 5  |  rolled 6  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| 1 | 100  | 200  | 1000  | 2000  | 4000  | 8000  |
| 2  | 0  | 0  | 200  | 400  | 800  | 1600  |
| 3  | 0  | 0  | 300  | 600  | 1200  | 2400  |
| 4  | 0  | 0  | 400  | 800  | 1600  | 3200  |
| 5  | 50  | 100  | 500  | 1000  | 2000  | 4000  |
| 6  | 0  | 0  | 600  | 1200  | 2400  | 4800  |




to run yourself just create a virtualenv
```bash
$ virtualenv venv
```
then install the dependencies
```bash
$ ./venv/bin/pip install -r requirements.txt
```
then run 
```bash
$ ./venv/bin/honcho start
```
or just check out the [demo](http://angular-dice.herokuapp.com/play)




