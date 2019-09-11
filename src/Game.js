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
    },
    // create create function to use the canvas as a grid and start the game adding the first tiles to it
    create: function () {
        //Create array to store the tile position and tile values
        this.playFieldArray = [];
        this.playFieldGroup = this.add.group();
        // use for loop to iterate through the playFieldSize*playFieldSize array and give initial objects in the array items
        for (var i = 0; i < gameOptions.playFieldSize; i++) {
            this.playFieldArray[i] = [];
            for (var j = 0; j < gameOptions.playFieldSize; j++) {
                //allocate a sprite object using tileCoordinate function to determine the tile's location on the canvas
                var emptyTile = this.add.sprite(this.tileCoordinate(j), this.tileCoordinate(i), "tiles");
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
                    //declare that the tile is not on maximum level/value
                    upgradeable: true
                }

            }
        }
        //call keyInput function to handle all permitted keystrokes
        this.input.keyboard.on("keydown", this.keyInput, this);
        //add input listener for pointer
        this.input.on("pointerup", this.mouseInput, this);
        //add the first two tiles to the playfield
        this.addTile();
        this.addTile();



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
        //create randomTile variable and using Phaser random utility get a random tile info
        var randomTile = Phaser.Utils.Array.GetRandom(emptyTiles);
        //now need to change the playfield array given tile's attributes
        //set tilevalue to 1 as this is the number two is the first level
        this.playFieldArray[randomTile.row][randomTile.col].tileValue = 1;
        //make it visible
        this.playFieldArray[randomTile.row][randomTile.col].tileSprite.visible = true;
        this.playFieldArray[randomTile.row][randomTile.col].tileSprite.alpha = 1;
        //choose the first frame of the spritesheet(starting at 0)
        this.playFieldArray[randomTile.row][randomTile.col].tileSprite.setFrame(0);
    },
    //create keyInput to simplify keyboard inputs and to call th moveTiles function later on
    keyInput: function (event) {
        //use switch to handle the four cases
        switch (event.code) {
            //If the user pressed a or the left arrow
            case "KeyA":
            case "ArrowLeft":
                console.log("left");
                this.addTile();
                this.moveTiles("left");
                break;
            case "KeyS":
            case "ArrowDown":
                console.log("down");
                this.addTile();
                break;
            case "KeyD":
            case "ArrowRight":
                console.log("right");
                this.addTile();
                break;
            case "KeyW":
            case "ArrowUp":
                console.log("up");
                this.addTile();
                break;

        }

    },
    //create mouseInput function to call move tiles upon mouse or swipe input
    mouseInput: function (event) {
        //using vectorial calculation to determine the movement direction
        //need to store the start and end coordinates
        var startX = event.downX;
        console.log(startX);
        var startY = event.downY;
        console.log(startY);
        var endX = event.upX;
        console.log(endX);
        var endY = event.upY;
        console.log(endY);
        //need two things: the steepness and the difference of the end and start coordinates
        //if the delta X is 0 can not divide with it; that is a vertical movement up or down
        var deltaX = endX - startX;
        var steepness = (endY - startY) / (endX - startX);

        if (deltaX == 0) {
            //if delta Y =0 too, there was no movement just click or touch, nothing to happen
            var deltaY = endY - startY;
            if (deltaY == 0) {
                console.log("no movement");
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
        switch (str) {
            case "left":
                console.log("moving left");
                break;
            case "down":
                console.log("moving down");
                break;
            case "right":
                console.log("moving right");
                break;
            case "up":
                console.log("moving up");
                break;
        }
    }
});