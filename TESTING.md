# Testing the 2048Clone

- [Testing the 2048Clone](#testing-the-2048clone)
  * [Technologies and methods](#technologies-and-methods)
  * [Console.log()](#consolelog--)
  * [Layout testing](#layout-testing)
  * [Game testing](#game-testing)
  * [Different User Tests](#different-user-tests)
    + [Test focus](#test-focus)
    + [Tester feedback](#tester-feedback)
      - [Colours:](#colours-)
      - [Platform](#platform)
      - [Usability](#usability)
      - [Readability](#readability)
      - [Game control](#game-control)
      - [Game experience](#game-experience)
      - [Other](#other)
  * [Solutions](#solutions)
  * [Have not solved yet](#have-not-solved-yet)

## Technologies and methods



The test phase started from the very beginning of the development both to review the outlook of the web site and, when new functions implemented their functionality. The test was not automatised, usually made by using javascript console.log() and compared the results to the established ideas, calculations. 

As it was discussed in the Deployment section of the [README](README.md) file, python SimpleHTTPServer and the published Github page made the tests and reviews available.

The console also helped with the warnings and errors to resolve issues related to syntax, name or when a function has been called outside of its scope.

## Console.log()

Example of the usage of console.log() from the [add moveTiles call to keyInput and remove consolelogs](https://github.com/varroz56/2048Clone/commit/4ae65af3a812f391a7a238370870d97fb180b38c) commit:

```javascript
 //If the user pressed a or the left arrow
            case "KeyA":
            case "ArrowLeft":
                console.log("left");
                this.addTile();
                this.moveTiles("left");
                break;
```

```javascript
  moveTile: function (str, i, j, k) {
        console.log("moveTile " + str + " to " + k);
        //four directions
        switch(str){
        switch (str) {
            case "left":
```

- In this case the logged "left" was there to give peace of mind that the keyboard input has been captured and translated as it was expected, also later on to check back the moveTile function, that from the user input the right case has been called , and later on that the expected movement happened.

This is a fast and easy way and if needed capable to check complex chain functions and their behaviour.

## Layout testing

From the [fix height error with empty tile, improve buttoncoordinates for different sizes](https://github.com/varroz56/2048Clone/commit/090538d76da5b38ee7f31098354697ad4287101e) commit:

- A simple change after testing the layout showed that the top menu looks better if has a little bit space.

from :

```javascript
//also give 200px space on the top for menu
                var emptyTile = this.add.sprite(this.tileCoordinate(j), this.tileCoordinate(i) + 200, "tiles");
```

to:

```javascript
              //also give 210px space on the top for menu
                var emptyTile = this.add.sprite(this.tileCoordinate(j), this.tileCoordinate(i) + 210, "tiles");
```



The buttonCoordinate function was written to return an x coordinate, given the position in the row and column of the button. When tested different game modes, it turned out that some button's position need one more variable, the game mode, as it determines the size of the canvas. Because of this, had to add an extra attribute to the function call and not just amend some values,

```javascript
            if (pos == 1) {
change from       return w / 8 + 20;
       to         return w / 10 ;
```

but had to write extra if statements and handle the modes individually:

```
 //if the siz is 3 by 3
        if (playSize() == 3) {...}
 // if its a 5by5
        else if(playSize()==5){..}
 //if its 4by4 or the first game default 4by4
        else{..}
```

## Game testing

After the layout and the basic functions have been tested, the game logic came next. 

Examples:

- The tiles had to move to left
- - Could any move to left?
  - Did they move to left?
  - Was there any upgrade
  - - Did the upgrade happened as expected

These tests were both logical and visual tests, as did not just have to check if the logic was good, but if it looked like it happened as expected.

The [following code](https://github.com/varroz56/2048Clone/commit/f202e47c6a1d2ccba2cf151a9fdffbba359d20fe) was used at the game testing phase, when it looked good, but at 1024 or a bit later the user got the win modal message and it was a really big issue.

the original code:

```javascript
if (this.playFieldArray[i][k].tileValue == 10 || this.playFieldArray[i][j].tileValue == 10) {           
            //open winner meassage
            $("#winModal").modal();            
        }
```



the debug code:

```
f (this.playFieldArray[i][k].tileValue == 11 || this.playFieldArray[i][j].tileValue == 11) {
            for(var m=0; m<gameOptions.playFieldSize; m++){
                for(var n=0; n<gameOptions.playFieldSize;n++){
                    console.log("row: "+m+ " col: "+n+" " +this.playFieldArray[m][n].tileValue);
                }
            }

            won = true;
            //open winner meassage
            $("#winModal").modal();        
```

There were two semantic error in this code. The first the tileValue ==10 ==> 11(That is why it stopped at 1024 and not 2048) as the 2048 tile was the 10 in the array. 

the second problem was that because there was no variable, or anything to store or trigger something to stop user input after he/she won, the if statement triggered the won modal and not every time, just in certain cases. Had to create the won variable to do not let the user to proceed after won the game.

Also later on as there were no movements had to created the already won modal to let the user know that he/she already won needs to start a new game.

This was the start of the testing with different users.

## Different User Tests

The link has been sent to 10 individuals from different age and sex, and asked them to play around the game, try to find anything what was not work as expected and any other request if they did or did not like something.

### Test focus

The following main points have been asked with stating that the order not important:

- Colours
- Platform
- Usability
- Readability
- Game control
- Game experience
- Other

### Tester feedback

After the reviews and feedback, the following changes have been implemented:

#### Colours: 

Mainly had positive feedback about the colours, the only issue was the red background, that it is too strong.

#### Platform

Here had the most problems and still have problems, what will be discussed later on. On desktop(Windows, Linux, Mac, there was no issue) the game works fine,regardless of the browser, no issues with scaling, fully responsive the canvas, and it is true to mobile devices too. 

However, on Firefox mobile the address bar visible/hide function made the game experience bad. 

On other browsers, chrome, duck-duck,  adblocker browsers the game has no issues with scrolling.

#### Usability

On Desktop there was no issue, the keyboard and mouse inputs works fine, however got feedback that the game captures mouse clicks as directional move in the menu area.

On mobile the swipe works fine, no issues even on Firefox (apart from the bad user experience from the scrolling), and the buttons work fine unless the user choose the 3 by 3 game mode. In this case the buttons behave strange, sometimes react only on multiple touch.

####  Readability

There was no issues regarding to the game itself. The modals have been too small and difficult to read.

#### Game control

The game control feedback was good(apart from the 3 by 3 issue), but Music On/OFF button was not clear to use and understand, as it was showing the state and not the target.

#### Game experience

Although, the testers had positive feedback about the game, but they did not have a completely good user experience.

#### Other

A user requested individual best score to game modes, as the size matters that much, so the after 5 by 5 game the 3 by 3 game would not give enough score to compare.

## Solutions

After receiving testers' feedback, the following changes have been made to the game:

[The background have been changed to a darker colour .](https://github.com/varroz56/2048Clone/commit/ddf325315d551ed920f9f411388e05e62ae92295)

[Created individual best score to the game modes.](https://github.com/varroz56/2048Clone/commit/4dcbca1b503b2d376469c6fe50569c814a4bbc30)

[Text size changed on modals.](https://github.com/varroz56/2048Clone/commit/98bb753213456a7004edd54ac620626e5afa9980)

[Changed the Music On/Off button to Turn MusicOn/Off.](https://github.com/varroz56/2048Clone/commit/f0366aa3efd76258e337ae6ac14f50e69e0ded71)

[Changed font size on mobile devices.](https://github.com/varroz56/2048Clone/commit/762382b95b0ce2b6f3b9f0b3e3ae2404d90005cb)

[Prevented user input to being translated to movement in the menu area.](https://github.com/varroz56/2048Clone/commit/0669bc42cc05a2e299b4591e677c303c9885ff0d)

## Have not solved yet

After a solution implemented to prevent scrolling on mobile device, it turned out that did not work on Firefox, and since that a correct solution awaits to be found.

The 3 by 3 game mode issue have not been discovered as could not find a way to see what is wrong with it. The developer thinks there is an issue with the button sizes(overlap or overhang) and the canvas size on mobile, however, this issue have not been resolved yet.