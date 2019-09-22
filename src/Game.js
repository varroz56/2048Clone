/***************Game.js file structure
 * Sections:
 * Declaration of Game scene Phaser class
 *      This class declaration includes all functions related to gameplay
 * Preload section to load media to memory 
 * Create section holds the functions for interaction in the game
 *      Load and Position media on the scene
 *      Check and set current Button and Score states regarding to canvas size and saved state
 *      Create Playfield and give relative position to tiles
 *      Handle button click to store session data and to recall them with new config sttings 
 *      Handle user interaction to the playfield
 *          Trigger move or upgrade method
 *          Execute move / or upgrade     
 *      Check if the user has possible movements on a full playfield 
 * 
 * 
 */

//------------------------Game Scene Class--------------------------

// create the game scene using phaser scene class
var Game = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize: function Game() {
        Phaser.Scene.call(this, {
            key: "Game",
        });

    },
    //-----------------------Preload Section
    // create preload function to load the tiles
    preload: function () {
        //load the tiles to the memory to be able to use it in the game and as a spritesheet to add options for animation
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            //set the size of the tiles to correct canvas/window size
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });
        //load button spritesheets to the game memory
        this.load.spritesheet("sizeButtons", "assets/sprites/sizeBtns.png", {
            //set the size of the tiles to correct canvas/window size
            frameWidth: gameOptions.sizeBtnWidth,
            frameHeight: gameOptions.sizebtnHeight
        });
        this.load.spritesheet("musicButtons", "assets/sprites/musicBtns.png", {
            //set the size of the tiles to correct canvas/window size
            frameWidth: gameOptions.musicBtnWidth,
            frameHeight: gameOptions.musicBtnHeight
        });
        this.load.image("resetButton", "assets/sprites/resetBtn.png", {
            frameWidth: gameOptions.resetBtnWidth,
            frameHeight: gameOptions.resetBtnHeight
        });
        this.load.image("infoButton", "assets/sprites/infoBtn.png", {
            frameWidth: gameOptions.infoBtnWidth,
            frameHeight: gameOptions.infoBtnHeight
        });

        //load music file to memory
        //Downloaded from: https://www.dl-sounds.com/royalty-free/ambient-piano/
        this.load.audio("piano", "assets/sound/AmbientPiano.wav");
    },

    //----------------------Create section-----------------------------
    // create create function to use the canvas as a grid and start the game adding the first tiles to it
    create: function () {
        //----------------------Load and Position media on the scene------------------
        //position buttons on the canvas and set to interactive to be able to act as button
        this.Rbtn = this.add.image(this.buttonCoordinate(1, 1), 55, "resetButton").setInteractive();
        this.Ibtn = this.add.image((this.buttonCoordinate(1, 1) + 110), 55, "infoButton").setInteractive();
        this.Mbtn = this.add.sprite(this.buttonCoordinate(1, 3), 55, "musicButtons").setInteractive();
        this.by3btn = this.add.sprite(this.buttonCoordinate(2, 1), 160, "sizeButtons").setInteractive();
        this.by4btn = this.add.sprite(this.buttonCoordinate(2, 2), 160, "sizeButtons").setInteractive();
        this.by5btn = this.add.sprite(this.buttonCoordinate(2, 3), 160, "sizeButtons").setInteractive();
        //---------------------Check and set current Button and Score states regarding to canvas size and saved state--------------
        //call setCurrentButtons to set the frames to the game's current status
        this.setCurrentButtons();
        //add sound and if the sound was on before, play the music 
        piano = this.sound.add("piano");
        if (musicState()) {

            piano.play({
                //lower the default volume and loop the track
                volume: .5,
                loop: true
            });
        }
        //add scoretext
        scoreText = this.add.text(this.buttonCoordinate(1, 2), 50, 'Score: 0', {
            fontSize: '32px',
            fill: '#facc78'
        });
        //add best scoretext, the function getBest calls the saved value 
        bestScore = this.add.text(this.buttonCoordinate(1, 2), 15, 'Best: ' + this.getBest(), {
            fontSize: '32px',
            fill: '#facc78'
        });

        //-----------------Create Playfield and give relative position to tiles-----------------

        //Create array to store the tile position and tile values
        this.playFieldArray = [];
        this.playFieldGroup = this.add.group();
        // use for loop to iterate through the playFieldSize*playFieldSize array and give initial objects in the array items
        for (var i = 0; i < gameOptions.playFieldSize; i++) {
            this.playFieldArray[i] = [];
            for (var j = 0; j < gameOptions.playFieldSize; j++) {
                //allocate a sprite object using tileCoordinate function to determine the tile's location on the canvas
                //also give 210px space on the top for menu
                var emptyTile = this.add.sprite(this.tileCoordinate(j), this.tileCoordinate(i) + 210, "tiles");
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

        //--------------------Handle button click to store session data and to recall them with new config sttings------
        //on btn click call restart function to reset the game to the given size
        this.Rbtn.on("pointerdown", function (pointer) {
            this.saveBest();
            score = 0;
            won = false;
            piano.stop();
            this.scene.restart();
        }, this);
        this.by3btn.on("pointerdown", function (pointer) {
            this.saveBest();
            score = 0;
            won = false;
            var size = 3;
            var n = size.toString();
            sessionStorage.setItem("playFieldSize", n);
            location.reload();
        }, this);
        this.by4btn.on("pointerdown", function (pointer) {
            this.saveBest();
            score = 0;
            won = false;
            var size = 4;
            var n = size.toString();
            sessionStorage.setItem("playFieldSize", n);
            location.reload();
        }, this);
        this.by5btn.on("pointerdown", function (pointer) {
            this.saveBest();
            score = 0;
            won = false;
            var size = 5;
            var n = size.toString();
            sessionStorage.setItem("playFieldSize", n);
            location.reload();
        }, this);
        //Start or stop the music
        this.Mbtn.on("pointerdown", function (pointer) {
            if (musicState()) {
                var music = 0;
                var m = music.toString();
                sessionStorage.setItem("musicState", m);
                piano.stop();
                this.Mbtn.setFrame(1);
            } else {
                var music = 1;
                var m = music.toString();
                sessionStorage.setItem("musicState", m);
                piano.play();
                this.Mbtn.setFrame(0);
            }
        }, this);
        //add info button click to show info modal
        this.Ibtn.on("pointerdown", function (pointer) {
            $("#infoModal").modal();
        }, this);


        //------------------------Handle user interaction to the playfield------------------

        //call keyInput function to handle all permitted keystrokes
        this.input.keyboard.on("keydown", this.keyInput, this);
        //add input listener for pointer
        this.input.on("pointerup", this.mouseInput, this);
        //add the first two tiles to the playfield

        //-------------------Add  new tile with a value of 2 to the playfield to a random position
        this.addTile();
        this.addTile();

    },
    //-------------------Check and set current Button and Score states regarding to canvas size and saved state----------------------
    //create saveBest function to save best score to session storage
    saveBest: function () {
        //get the playfield size
        var s = playSize();
        //check the size and then check if the session storage has anything stored, and if it has
        // compare the two scores and save the bigger one
        if (s == 3) {
            if (score > sessionStorage.getItem("bestOn3")) {
                //session storage can store string
                var n = score.toString();
                //save to session storage
                sessionStorage.setItem("bestOn3", n);
            }

        } else if (s == 4) {
            if (score > sessionStorage.getItem("bestOn4")) {
                var n = score.toString();
                sessionStorage.setItem("bestOn4", n);
            }

        } else {
            if (score > sessionStorage.getItem("bestOn5")) {
                var n = score.toString();
                sessionStorage.setItem("bestOn5", n);
            }

        } 
    },
    //create getBest function to read bst score from session storage
    getBest: function () {
        //get the playfield size
        var s = playSize();
        //check the size and then check if the session storage has anything stored, and if it has
        // compare the two scores and return the bigger one
        if (s == 3) {
            //compare the current and the saved one
            if (sessionStorage.getItem("bestOn3") > 0) {
                var n = sessionStorage.getItem("bestOn3");
                return parseInt(n);
            } else {
                return 0;
            }

        } else if (s == 4) {
            if (sessionStorage.getItem("bestOn4") > 0) {
                var n = sessionStorage.getItem("bestOn4");
                return parseInt(n);
            } else {
                return 0;
            }

        } else if (s == 5) {
            if (sessionStorage.getItem("bestOn5") > 0) {
                var n = sessionStorage.getItem("bestOn5");
                return parseInt(n);
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    },
    //to set the buttons state need to check the playfieldsize and musicstate in session storage
    //the new game button is the same everytime
    //to handle each button type separate, create setSoundBtn and setSizeBtn functions 
    setCurrentButtons: function () {
        //new game button always the same
        this.Rbtn.setFrame(0);
        //call setSoundBtn function to set music on or off button
        this.setSoundBtn();
        //call setSizeBtn function to set current play filed size button
        this.setSizeBtn();
    },
    setSoundBtn: function () {
        //check music state
        if (musicState()) {
            this.Mbtn.setFrame(0);
        } else {
            this.Mbtn.setFrame(1);
        }

    },
    setSizeBtn: function () {
        //check current play field size
        var size = playSize();
        //set everything to not active color
        this.by3btn.setFrame(1);
        this.by4btn.setFrame(3);
        this.by5btn.setFrame(5);
        //set the current one to active color
        if (size == 3) {
            this.by3btn.setFrame(0);

        } else if (size == 4) {
            this.by4btn.setFrame(2);

        }
        if (size == 5) {
            this.by5btn.setFrame(4);
        }

    },
    //create button coordinate function return an x coordinate based on row and position
    //2 rows for menu and 1-3 positions
    buttonCoordinate: function (row, pos) {
        //get canvas width
        var w = document.querySelector("canvas").width;
        //for better experience, handle the 3 differnt play field size 
        //if the siz is 3 by 3
        if (playSize() == 3) {
            if (row == 1) {
                if (pos == 1) {
                    return w / 8;
                } else if (pos == 2) {
                    return w / 3 + 30;
                } else if (pos == 3) {
                    return w / 8 * 7 - 25;
                }
                //for the bottom row elemnts
            } else if (row == 2) {
                if (pos == 1) {
                    return w / 8 + 25;
                } else if (pos == 2) {
                    return w / 2;
                } else if (pos == 3) {
                    return w / 8 * 7 - 25;
                }

            }

        }
        // if its a 5by5
        else if (playSize() == 5) {
            //for the top row elements
            if (row == 1) {
                if (pos == 1) {
                    return w / 10 - 25;
                } else if (pos == 2) {
                    return w / 2 - 95;
                } else if (pos == 3) {
                    return w / 10 * 9;
                }
                //for the bottom row elemnts
            } else if (row == 2) {
                if (pos == 1) {
                    return w / 3 - 30;
                } else if (pos == 2) {
                    return w / 2;
                } else if (pos == 3) {
                    return w / 3 * 2 + 30;
                }

            }

        }
        //if its 4by4 or the first game default 4by4
        else {
            if (row == 1) {
                if (pos == 1) {
                    return w / 8 - 25;
                } else if (pos == 2) {
                    return w / 2 - 95;
                } else if (pos == 3) {
                    return w / 8 * 7;
                }
                //for the bottom row elemnts
            } else if (row == 2) {
                if (pos == 1) {
                    return w / 4;
                } else if (pos == 2) {
                    return w / 2;
                } else if (pos == 3) {
                    return w / 4 * 3;
                }

            }

        }
    },

    //----------------------------Create Playfield and give relative position to tiles----------------

    //create tileCoordinate function to get a tile horizontal or vertical positon on the canvas calculating from tile size, spacing and using the its relative position on the grid
    tileCoordinate: function (relativePosition) {
        return relativePosition * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSize / 2 + gameOptions.tileSpacing;
    },

    //------------------------------Add  new tile with a value of 2 to the playfield to a random position---------------

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
            this.fullFilled();
        }
    },

    //-----------------------------------Handle user interaction to the playfield---------------------------

    //create keyInput to simplify keyboard inputs and to call th moveTiles function later on
    keyInput: function (event) {
        //check if won var is true, than don't move, just open the already won modal
        if (won) {
            $("#alreadyWonModal").modal();
            return;

        }


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
        //check if won var is true, than don't move, just open the already won modal
        if (won) {
            $("#alreadyWonModal").modal();
            return;

        }

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

    //--------------------------------Trigger move or upgrade method-----------------------


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
            this.addTile();
            for (var i = 0; i < gameOptions.playFieldSize; i++) {
                for (var j = 0; j < gameOptions.playFieldSize; j++) {
                    this.playFieldArray[i][j].upgradeable = true;
                }
            }
        }


    },

    //---------------------------Execute move / or upgrade--------------------

    //create moveTile to move individual tiles taking a direction string and the end position
    moveTile: function (str, i, j, k) {
        //four directions
        switch (str) {
            case "left":
            case "right":
                //copy the tile to the empty tile
                this.playFieldArray[i][k].tileValue = this.playFieldArray[i][j].tileValue;
                this.playFieldArray[i][k].tileSprite.visible = true;
                this.playFieldArray[i][k].tileSprite.alpha = 1;
                this.playFieldArray[i][k].tileSprite.setFrame(this.playFieldArray[i][j].tileValue - 1);
                break;

            case "up":
            case "down":
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
    //create upgradeTile function to upgrade two tiles in movement taking a direction string and and three coordinates
    upgradeTile: function (str, i, j, k) {
        //four directions
        switch (str) {
            case "left":
            case "right":
                //copy the tile to the empty tile
                this.playFieldArray[i][k].tileValue += 1;
                this.playFieldArray[i][k].tileSprite.visible = true;
                this.playFieldArray[i][k].tileSprite.alpha = 1;
                this.playFieldArray[i][k].tileSprite.setFrame(this.playFieldArray[i][k].tileValue - 1);
                this.playFieldArray[i][k].upgradeable = false;
                break;

            case "up":
            case "down":
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
        //earn 10 points with the upgrade
        score += 10;
        scoreText.setText('Score: ' + score);
        //if the player reaches the 2048 tile, the player wins!



        //if any 

        if (this.playFieldArray[i][k].tileValue == 11 || this.playFieldArray[i][j].tileValue == 11) {
            won = true;
            //open winner meassage
            $("#winModal").modal();
        }


    },


    //-----------------------------Check if the user has possible movements on a full playfield---------

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
                    //player lost, open loser modal, amend score display field
                    $("#loseModal").modal();
                    scoreText.visible = false;
                    overText = this.add.text(this.buttonCoordinate(1, 2) - 25, 55, 'Game Over! ', {
                        fontSize: '35px',
                        fill: '#CC3425',
                    });
                    bestScore = this.add.text(this.buttonCoordinate(1, 2), 15, 'Best: ' + this.getBest(), {
                        fontSize: '32px',
                        fill: '#facc78'
                    });

                    return true;
                } else if (this.playFieldArray[i][j].tileValue == 0) {
                    return false;
                }
                //bottom row
                else if (i == gameOptions.playFieldSize - 1) {
                    if (this.playFieldArray[i][j].tileValue == this.playFieldArray[i][j + 1].tileValue) {
                        return false;
                    }
                }
                //right col
                else if (j == gameOptions.playFieldSize - 1) {
                    if (this.playFieldArray[i][j].tileValue == this.playFieldArray[i + 1][j].tileValue) {
                        return false;
                    }

                }
                //for the other tiles need to check both
                else if ((this.playFieldArray[i][j].tileValue == this.playFieldArray[i][k].tileValue) || (this.playFieldArray[i][j].tileValue == this.playFieldArray[l][j].tileValue)) {
                    return false;
                }
            }

        }

    }
});