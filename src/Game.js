// create the game scene using phaser scene class
var Game = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize: function Game() {
        Phaser.Scene.call(this, {
            key: "Game"
        });

    },
    // create preload function to load the tiles
    preload: function () {
        //load the tiles to the memory to be able to use it in the game and as a spritesheet to add options for animation
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            //set the size of the tiles to correct canvas/window size
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });
        //load button spritesheet to the game memory
        this.load.spritesheet("buttons", "assets/sprites/buttons.png", {
            //set the size of the tiles to correct canvas/window size
            frameWidth: gameOptions.btnWidth,
            frameHeight: gameOptions.btnHeight
        });
        //load music file to memory
        //Downloaded from: https://www.dl-sounds.com/royalty-free/ambient-piano/
        this.load.audio("piano", "assets/sound/AmbientPiano.wav");
    },
    // create create function to use the canvas as a grid and start the game adding the first tiles to it
    create: function () {
        //position buttons on the canvas and set to interactive to be able to act as button
        this.NGbtn = this.add.sprite(this.buttonCoordinate(1, 1), 55, "buttons").setInteractive();
        this.Sbtn = this.add.sprite(this.buttonCoordinate(1, 3), 55, "buttons").setInteractive();
        this.by3btn = this.add.sprite(this.buttonCoordinate(2, 1), 160, "buttons").setInteractive();
        this.by4btn = this.add.sprite(this.buttonCoordinate(2, 2), 160, "buttons").setInteractive();
        this.by5btn = this.add.sprite(this.buttonCoordinate(2, 3), 160, "buttons").setInteractive();
        //call setCurrentButtons to set the frames to the game's current status
        this.setCurrentButtons();
        //add sound
        piano = this.sound.add("piano");
        if(musicState()){
            piano.play();
        }
        //add scoretext
        scoreText = this.add.text(this.buttonCoordinate(1, 2), 50, 'Score: 0', {
            fontSize: '32px',
            fill: '#facc78'
        });
        //add best scoretext
        bestScore = this.add.text(this.buttonCoordinate(1, 2), 15, 'Best: '+ this.getBest(), {
            fontSize: '32px',
            fill: '#facc78'
        });


        //Create array to store the tile position and tile values
        this.playFieldArray = [];
        this.playFieldGroup = this.add.group();
        // use for loop to iterate through the playFieldSize*playFieldSize array and give initial objects in the array items
        for (var i = 0; i < gameOptions.playFieldSize; i++) {
            this.playFieldArray[i] = [];
            for (var j = 0; j < gameOptions.playFieldSize; j++) {
                //allocate a sprite object using tileCoordinate function to determine the tile's location on the canvas
                //also give 200px space on the top for menu
                var emptyTile = this.add.sprite(this.tileCoordinate(j), this.tileCoordinate(i) + 200, "tiles");
                //set the tile to invisible
                emptyTile.alpha = 0;
                emptyTile.visible = 0;
                //add the tile to the group
                this.playFieldGroup.add(emptyTile);
                //add the tile/sprite object to the array current position and give initial value
                this.playFieldArray[i][j] = {
                    //set initial value
                    tileValue: 0,
                    tileSprite: emptyTile,
                    //declare that the tile is not on maximum level/value;
                    upgradeable: true
                }

            }
        }
        //on btn click call restart function to setet the game
        this.NGbtn.on("pointerdown", function (pointer) {
            this.saveBest();
            score = 0;
            this.scene.restart();
        }, this);
        this.by3btn.on("pointerdown", function (pointer) {
            this.saveBest();
            score = 0;
            var size = 3;
            var n = size.toString();
            sessionStorage.setItem("playFieldSize", n);
            location.reload();
        }, this);
        this.by4btn.on("pointerdown", function (pointer) {
            this.saveBest();
            score = 0;
            var size = 4;
            var n = size.toString();
            sessionStorage.setItem("playFieldSize", n);
            location.reload();
        }, this);
        this.by5btn.on("pointerdown", function (pointer) {
            this.saveBest();
            score = 0;
            var size = 5;
            var n = size.toString();
            sessionStorage.setItem("playFieldSize", n);
            location.reload();
        }, this);
        this.Sbtn.on("pointerdown", function (pointer) {
            if (musicState()) {
                var music = 0;
                var m = music.toString();
                sessionStorage.setItem("musicState", m);
                piano.stop();
                this.Sbtn.setFrame(2);
            } else {
                var music = 1;
                var m = music.toString();
                sessionStorage.setItem("musicState", m);
                piano.play();
                this.Sbtn.setFrame(1);
            }
        }, this);
        //call keyInput function to handle all permitted keystrokes
        this.input.keyboard.on("keydown", this.keyInput, this);
        //add input listener for pointer
        this.input.on("pointerup", this.mouseInput, this);
        //add the first two tiles to the playfield
        this.addTile();
        this.addTile();

    },
    
    //create saveBest function to save best score to session storage
    saveBest: function(){
        if(score>sessionStorage.getItem("best")){
            var n = score.toString();
            sessionStorage.setItem("best", n);
    
        }
    },
    //create getBest function to read bst score from session storage
    getBest: function(){
        if(sessionStorage.getItem("best")>0){
            var n = sessionStorage.getItem("best");
            return parseInt(n);
        }
        else{
            return 0;
        }
    },
    //to set the buttons state need to check the playfieldsize and musicstate in session storage
    //the new game button is the same everytime
    //to handle each button type separate, create setSoundBtn and setSizeBtn functions 
    setCurrentButtons: function () {
        //new game button always the same
        this.NGbtn.setFrame(0);
        //call setSoundBtn function to set music on or off button
        this.setSoundBtn();
        //call setSizeBtn function to set current play filed size button
        this.setSizeBtn();
    },
    setSoundBtn: function () {
        //check music state
        if (musicState()) {
            this.Sbtn.setFrame(1);
        } else {
            this.Sbtn.setFrame(2);
        }

    },
    setSizeBtn: function () {
        //check current play field size
        var size = playSize();
        if (size == 3) {
            this.by3btn.setFrame(4);
            this.by4btn.setFrame(5);
            this.by5btn.setFrame(7);

        } else if (size == 4) {
            this.by3btn.setFrame(3);
            this.by4btn.setFrame(6);
            this.by5btn.setFrame(7);

        }
        if (size == 5) {
            this.by3btn.setFrame(3);
            this.by4btn.setFrame(5);
            this.by5btn.setFrame(8);

        }

    },
    //create button coordinate function return an x coordinate based on row and position
    //2 rows for menu and 1-3 positions
    buttonCoordinate: function (row, pos) {
        //get canvas width
        var w = document.querySelector("canvas").width;
        //for the top row elements
        if (row == 1) {
            if (pos == 1) {
                return w / 8 + 20;
            } else if (pos == 2) {
                return w / 3 + 30;
            } else if (pos == 3) {
                return w / 8 * 7 - 20;
            }
        } else if (row == 2) {
            if (pos == 1) {
                return w / 8 + 20;
            } else if (pos == 2) {
                return w / 2;
            } else if (pos == 3) {
                return w / 8 * 7 - 20;
            }

        }
    },
    //create tileCoordinate function to get a tile horizontal or vertical positon on the canvas calculating from tile size, spacing and using the its relative position on the grid
    tileCoordinate: function (relativePosition) {
        return relativePosition * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSize / 2 + gameOptions.tileSpacing;
    },
    //create addTile function to add a not empty tile to the field
    addTile: function () {
        //Need to determine the empty tiles positions to randomly put a number 2 on one of them
        //create emptyTiles array to store row and coloumn informations
        var emptyTiles = [];
        //iterate through the playFieldArray to check if the tile value is 0
        for (var i = 0; i < gameOptions.playFieldSize; i++) {
            for (var j = 0; j < gameOptions.playFieldSize; j++) {
                if (this.playFieldArray[i][j].tileValue == 0) {
                    //tile value is 0, so need to add to the array
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }


        //Now have the array of the position of the empty tiles
        //create randomTile variable and using Ph;ser random utility get a random tile info
        var randomTile = Phaser.Utils.Array.GetRandom(emptyTiles);
        //now need to change the playfield array ;iven tile's attributes
        //set tilevalue to 1 as this is the numbe; two is the first level
        this.playFieldArray[randomTile.row][randomTile.col].tileValue = 1;
        //make it visible
        this.playFieldArray[randomTile.row][randomTile.col].tileSprite.visible = true;
        this.playFieldArray[randomTile.row][randomTile.col].tileSprite.alpha = 1;
        //choose the first frame of the spritesheet(starting at 0)
        this.playFieldArray[randomTile.row][randomTile.col].tileSprite.setFrame(0);
        //add fullFilled function tocheck possible moves if emptyTiles has only one element(so the playfield is full)
        if (emptyTiles.length == 1) {
            console.log("Playfield full, check for possible movement ...");
            this.fullFilled();
        }
    },
    //create keyInput to simplify keyboard inputs and to call th moveTiles function later on
    keyInput: function (event) {
        //use switch to handle the four cases
        switch (event.code) {
            //If the user pressed a or the left arrow
            case "KeyA":
            case "ArrowLeft":
                this.moveTiles("left");
                break;
            case "KeyS":
            case "ArrowDown":
                this.moveTiles("down");
                break;
            case "KeyD":
            case "ArrowRight":
                this.moveTiles("right");
                break;
            case "KeyW":
            case "ArrowUp":
                this.moveTiles("up");
                break;

        }

    },
    //create mouseInput function to call move tiles upon mouse or swipe input
    mouseInput: function (event) {
        //using vectorial calculation to determine the movement direction
        //need to store the start and end coordinates
        var startX = event.downX;

        var startY = event.downY;

        var endX = event.upX;

        var endY = event.upY;

        //need two things: the steepness and the difference of the end and start coordinates
        //if the delta X is 0 can not divide with it; that is a vertical movement up or down
        var deltaX = endX - startX;
        var steepness = (endY - startY) / (endX - startX);

        if (deltaX == 0) {
            //if delta Y =0 too, there was no movement just click or touch, nothing to happen
            var deltaY = endY - startY;
            if (deltaY == 0) {
                return;
            }
            //if delta y less than 0 then it's an upwards movement
            else if (deltaY < 0) {
                this.moveTiles("down");
                return;
            }
            //if delta y more than 0 then it's an downwards movement
            else {
                this.moveTiles("up");
                return;
            }
        }
        //have 2*3 cases if delta x not 0
        else {
            //if delta x positive
            if (deltaX > 0) {
                if (steepness > 1) {
                    this.moveTiles("down");
                    return;
                } else if (steepness > -1) {
                    this.moveTiles("right");
                    return;
                } else {
                    this.moveTiles("up");
                    return;
                }
            } //if delta x negative 
            else {
                if (steepness <= -1) {
                    this.moveTiles("down");
                    return;
                } else if (steepness < 1) {
                    this.moveTiles("left");
                    return;
                } else {
                    this.moveTiles("up");
                    return;
                }
            }
        }

    },

    //create moveTiles function to move tiles upon user input
    moveTiles: function (str) {

        //create wasMove variable to check if any tiles moved or upgraded
        var wasMove = false;
        //create tileInWay variable to mintor if there is a tile in the way to upgradeable
        var tileInWay = false;
        //to decide if tiles can move, need to go through the playFieldArray 
        //opposite way as the user input and check tile by tile if that can 
        //move to an empty tile or to upgrade an existing tile or it can't move
        switch (str) {
            case "left":
                //iterate througproph the playfield, start from the second col as first can't move
                for (var j = 0; j < gameOptions.playFieldSize; j++) {
                    for (var i = 0; i < gameOptions.playFieldSize; i++) {
                        //check if the tile empty
                        if (!this.playFieldArray[i][j].tileValue == 0) {
                            //check all the tiles on the left start with the biggest distance
                            for (var k = 0; k < j; k++) {
                                //if there is an empty tile
                                if (this.playFieldArray[i][k].tileValue == 0) {
                                    //call moveTile function
                                    this.moveTile("left", i, j, k);
                                    wasMove = true;
                                    //move on to the next not empty tile
                                    break;
                                } else {
                                    //if there is no empty tile but there is an upgradeable one, call upgradeTile
                                    if (this.playFieldArray[i][j].tileValue == this.playFieldArray[i][k].tileValue && this.playFieldArray[i][k].upgradeable) {
                                        tileInWay = false;
                                        for (var l = k + 1; l < j; l++) {
                                            if (this.playFieldArray[i][l].tileValue != 0) {
                                                tileInWay = true;
                                                break;
                                            }
                                        }
                                        if (!tileInWay) {
                                            this.upgradeTile("left", i, j, k);
                                            wasMove = true;
                                            //move on to the next not enmpty tile
                                            break;
                                        }
                                    }

                                }
                            }
                        }

                    }
                }
                break;
            case "down":
                //stat from second to last row
                for (var i = gameOptions.playFieldSize - 2; i > -1; i--) {
                    for (var j = 0; j < gameOptions.playFieldSize; j++) {

                        if (!this.playFieldArray[i][j].tileValue == 0) {
                            for (var k = gameOptions.playFieldSize - 1; k > i; k--) {

                                if (this.playFieldArray[k][j].tileValue == 0) {
                                    this.moveTile("down", i, j, k);
                                    wasMove = true;
                                    break;
                                }
                                //if the previous tile is not empty
                                else {
                                    //check if they are the same value and if the previous one upgradeable
                                    if (this.playFieldArray[k][j].tileValue == this.playFieldArray[i][j].tileValue && this.playFieldArray[k][j].upgradeable) {
                                        tileInWay = false;
                                        for (var l = k - 1; l > i; l--) {
                                            if (this.playFieldArray[l][j].tileValue != 0) {
                                                tileInWay = true;
                                                break;
                                            }
                                        }
                                        if (!tileInWay) {
                                            this.upgradeTile("down", i, j, k);
                                            wasMove = true;
                                            break;
                                        }
                                    }
                                    // any other case doesn't affect this tile
                                }
                            }
                        }

                    }
                }
                break;
            case "right":


                for (var j = gameOptions.playFieldSize - 2; j > -1; j--) {

                    for (var i = 0; i < gameOptions.playFieldSize; i++) {

                        if (!this.playFieldArray[i][j].tileValue == 0) {
                            for (var k = gameOptions.playFieldSize - 1; k > j; k--) {
                                //if the previus tile empty, move the tile to that position
                                if (this.playFieldArray[i][k].tileValue == 0) {
                                    this.moveTile("right", i, j, k);
                                    wasMove = true;
                                    break;
                                }
                                //if the previous tile is not empty
                                else {
                                    //check if they are the same value and if the previous one upgradeable
                                    if (this.playFieldArray[i][j].tileValue == this.playFieldArray[i][k].tileValue && this.playFieldArray[i][k].upgradeable) {
                                        tileInWay = false;
                                        for (var l = k - 1; l > j; l--) {
                                            if (this.playFieldArray[i][l].tileValue != 0) {
                                                tileInWay = true;
                                                break;
                                            }
                                        }
                                        if (!tileInWay) {
                                            this.upgradeTile("right", i, j, k);
                                            wasMove = true;
                                            break;
                                        }
                                    }
                                    // any other case doesn't affect this tile
                                }
                            }
                        }

                    }
                }
                break;
            case "up":


                for (var i = 1; i < gameOptions.playFieldSize; i++) {
                    for (var j = 0; j < gameOptions.playFieldSize; j++) {

                        if (!this.playFieldArray[i][j].tileValue == 0) {
                            for (var k = 0; k < i; k++) {
                                //if the previus tile empty, move the tile to that position
                                if (this.playFieldArray[k][j].tileValue == 0) {
                                    this.moveTile("up", i, j, k);
                                    wasMove = true;
                                    break;
                                }
                                //if the previous tile is not empty check if it's not upgradeable
                                else {
                                    //check if they are the same value and if the previous one upgradeable
                                    if (this.playFieldArray[k][j].tileValue == this.playFieldArray[i][j].tileValue && this.playFieldArray[k][j].upgradeable) {
                                        tileInWay = false;
                                        for (var l = k + 1; l < i; l++) {
                                            if (this.playFieldArray[l][j].tileValue != 0) {
                                                tileInWay = true;
                                                break;
                                            }
                                        }
                                        if (!tileInWay) {
                                            this.upgradeTile("up", i, j, k);
                                            wasMove = true;
                                            break;
                                        }
                                    }
                                    // any other case doesn't affect this tile
                                }
                            }
                        }

                    }
                }
                break;
        }
        //end of the turn, add a new tile and set every tile to ugrade to true
        if (wasMove) {
            console.log(" moved");
            this.addTile();
            for (var i = 0; i < gameOptions.playFieldSize; i++) {
                for (var j = 0; j < gameOptions.playFieldSize; j++) {
                    this.playFieldArray[i][j].upgradeable = true;
                }
            }
        }


    },
    //create moveTile to move individual tiles taking a direction string and the end position
    moveTile: function (str, i, j, k) {
        //four directions
        switch (str) {
            case "left":
                //copy the tile to the empty tile
                this.playFieldArray[i][k].tileValue = this.playFieldArray[i][j].tileValue;
                this.playFieldArray[i][k].tileSprite.visible = true;
                this.playFieldArray[i][k].tileSprite.alpha = 1;
                this.playFieldArray[i][k].tileSprite.setFrame(this.playFieldArray[i][j].tileValue - 1);
                break;

            case "down":
                //copy the tile to the empty tile
                this.playFieldArray[k][j].tileValue = this.playFieldArray[i][j].tileValue;
                this.playFieldArray[k][j].tileSprite.visible = true;
                this.playFieldArray[k][j].tileSprite.alpha = 1;
                this.playFieldArray[k][j].tileSprite.setFrame(this.playFieldArray[i][j].tileValue - 1);
                break;
            case "right":
                //copy the tile to the empty tile
                this.playFieldArray[i][k].tileValue = this.playFieldArray[i][j].tileValue;
                this.playFieldArray[i][k].tileSprite.visible = true;
                this.playFieldArray[i][k].tileSprite.alpha = 1;
                this.playFieldArray[i][k].tileSprite.setFrame(this.playFieldArray[i][j].tileValue - 1);
                break;
            case "up":
                //copy the tile to the empty tile
                this.playFieldArray[k][j].tileValue = this.playFieldArray[i][j].tileValue;
                this.playFieldArray[k][j].tileSprite.visible = true;
                this.playFieldArray[k][j].tileSprite.alpha = 1;
                this.playFieldArray[k][j].tileSprite.setFrame(this.playFieldArray[i][j].tileValue - 1);
                break;
        }
        this.playFieldArray[i][j].tileValue = 0;
        this.playFieldArray[i][j].tileSprite.visible = false;
        this.playFieldArray[i][j].tileSprite.alpha = 0;

    },
    //create upgradeTile function to upgrade two tiles in movement taking a direction string and 
    upgradeTile: function (str, i, j, k) {
        //four directions
        switch (str) {
            case "left":
                //copy the tile to the empty tile
                this.playFieldArray[i][k].tileValue += 1;

                this.playFieldArray[i][k].tileSprite.setFrame(this.playFieldArray[i][k].tileValue - 1);
                this.playFieldArray[i][k].tileSprite.visible = true;
                this.playFieldArray[i][k].tileSprite.alpha = 1;
                this.playFieldArray[i][k].upgradeable = false;
                break;

            case "down":
                //copy the tile to the empty tile
                this.playFieldArray[k][j].tileValue += 1;
                this.playFieldArray[k][j].tileSprite.visible = true;
                this.playFieldArray[k][j].tileSprite.alpha = 1;
                this.playFieldArray[k][j].tileSprite.setFrame(this.playFieldArray[k][j].tileValue - 1);
                this.playFieldArray[k][j].upgradeable = false;
                break;
            case "right":
                //copy the tile to the empty tile
                this.playFieldArray[i][k].tileValue += 1;
                this.playFieldArray[i][k].tileSprite.visible = true;
                this.playFieldArray[i][k].tileSprite.alpha = 1;
                this.playFieldArray[i][k].tileSprite.setFrame(this.playFieldArray[i][k].tileValue - 1);
                this.playFieldArray[i][k].upgradeable = false;
                break;
            case "up":
                //copy the tile to the empty tile
                this.playFieldArray[k][j].tileValue += 1;
                this.playFieldArray[k][j].tileSprite.visible = true;
                this.playFieldArray[k][j].tileSprite.alpha = 1;
                this.playFieldArray[k][j].tileSprite.setFrame(this.playFieldArray[k][j].tileValue - 1);
                this.playFieldArray[k][j].upgradeable = false;
                break;
        }
        this.playFieldArray[i][j].tileValue = 0;
        this.playFieldArray[i][j].tileSprite.visible = false;
        this.playFieldArray[i][j].tileSprite.alpha = 0;

        score += 10;
        scoreText.setText('Score: ' + score);

    },
    //create fullFilled function to check if theres a possible move when the playfield is full
    fullFilled: function () {
        //this function returns true if Game Over because the playfield 
        //is full and there is no possible move

        //need to check the tiles if their neighbour's tileValue is the same
        //to avoid double check, check only the right side and the one below

        for (var i = 0; i < gameOptions.playFieldSize; i++) {
            for (var j = 0; j < gameOptions.playFieldSize; j++) {
                var k = j + 1;
                var l = i + 1;
                // if bottom right corner reached, there is no possible move, return true
                //exceptions the bottom line and the right side colas there is either right or down side missing
                //bottom line
                if ((i == (gameOptions.playFieldSize - 1)) && (j == gameOptions.playFieldSize - 1)) {
                    console.log("No Possible Moves");
                    console.log("GAME OVER");
                    return true;
                } else if (this.playFieldArray[i][j].tileValue == 0) {
                    console.log("there is an empty tile " + i + " , " + j);
                    console.log(this.playFieldArray);
                    console.log(this.playFieldArray[i][j].tileValue);


                    return false;
                }
                //bottom row
                else if (i == gameOptions.playFieldSize - 1) {
                    if (this.playFieldArray[i][j].tileValue == this.playFieldArray[i][j + 1].tileValue) {
                        console.log("bottom line possible move");
                        return false;
                    }
                }
                //right col
                else if (j == gameOptions.playFieldSize - 1) {
                    if (this.playFieldArray[i][j].tileValue == this.playFieldArray[i + 1][j].tileValue) {
                        console.log("right col possible move");
                        return false;
                    }

                }
                //for the other tiles need to check both
                else if ((this.playFieldArray[i][j].tileValue == this.playFieldArray[i][k].tileValue) || (this.playFieldArray[i][j].tileValue == this.playFieldArray[l][j].tileValue)) {
                    console.log("main area possible move");
                    return false;
                }
            }

        }

    }
});