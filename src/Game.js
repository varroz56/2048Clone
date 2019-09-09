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

});