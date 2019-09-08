// create the game scene using phaser scene class
var Game = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:
    function Game(){
        Phaser.Scene.call(this, {key: "Game"});

    },
// create preload function to load the tiles
preload: function(){
//load the tiles to the memory to be able to use it in the game and as a spritesheet to add options for animation
    this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
//set the size of the tiles to correct canvas/window size
        frameWidth: gameOptions.tileSize,
        frameHeight: gameOptions.tileSize
        });
    }

});