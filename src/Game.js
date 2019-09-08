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
        for (var i = 0; i < playFieldSize; i++) {
            this.playFieldArray[i] = [];
            for (var j = 0; j < playFieldSize; j++) {
                //allocate a sprite object using tileCoordinate function to determine the tile's location on the canvas
                var emptyTile = this.add.sprite(this.tileCoordinate(j), this.tileCoordinate(i), "tiles");
                //set the tile to invisible
                emptyTile.alpha = 0;
                emptyTile.visible = 0;
                //add the tile to the group
                this.playFieldGroup.add(emptyTile);
                //add the tile/sprite object to the array current position and give initial value
                this.playFieldArray[i][j] = {
                    tileValue: 0,
                    tileSprite: emptyTile,
                    //declare that the tile is not on maximum level/value
                    upgradeable : true
                }

            }
        }

    },
    //create tileCoordinate function to get a tile horizontal or vertical positon on the canvas calculating from tile size, spacing and using the its relative position on the grid
    tileCoordinate: function (relativePosition) {
        return relativePosition * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSize / 2 + gameOptions.tileSpacing;
    }
});