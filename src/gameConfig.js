//configure game variable 
var game;
//to be able to change later on easely
var gameOptions = {
//set tile size and spacing
    tileSize: 150,
    tileSpacing: 30,
    //as the game playfield is square
    playfieldSize: 4
}
//set the configuration of the canvas when the window loads
window.onload = function(){
//create gameConfig to set the basic parameters for the canvas and to be able to change later on if needed 
    var gameConfig = {
//Choosing Phaser canvas to use as a html canvas element
        type: Phaser.CANVAS,
//set the square canvas size, given the size of the tiles and spacing around them
        width: gameOptions.tileSize * gameOptions.playfieldSize + gameOptions.tileSpacing * (gameOptions.playfieldSize+1),
        height: gameOptions.tileSize * gameOptions.playfieldSize + gameOptions.tileSpacing * (gameOptions.playfieldSize+1),
//set backgroung color
        backgroundColor: 0x6c7177,
//point to the Game scene located in the Game.js
        scene: [Game]
    };
    game = new Phaser.Game(gameConfig);
    //make sure the game object is frontmost
    window.focus();

}

