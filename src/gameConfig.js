//configure game variable 
var game;
//create score and scoretext global var to set to update in pgrade function
var score=0;
var scoreText;
//to be able to change later on easely

var gameOptions = {
    //set tile size and spacing
    tileSize: 200,
    tileSpacing: 10,
    //as the game playfield is square need only one
    playFieldSize: playSize(),
    //add menu button size
    topBtnSize : 200,
    byBtnSize :300
}

//set the configuration of the canvas when the window loads
window.onload = function () {
    //create gameConfig to set the basic parameters for the canvas and to be able to change later on if needed 
    var gameConfig = {
        //Choosing Phaser canvas to use as a html canvas element
        type: Phaser.CANVAS,
        //set the square canvas size, given the size of the tiles and spacing around them
        //give 200px to the height for menu buttons
        width: gameOptions.tileSize * gameOptions.playFieldSize + gameOptions.tileSpacing * (gameOptions.playFieldSize + 1),
        height: gameOptions.tileSize * gameOptions.playFieldSize + gameOptions.tileSpacing * (gameOptions.playFieldSize + 1)+200,
        //set backgroung color
        backgroundColor: 0x6c7177,
        //point to the Game scene located in the Game.js
        scene: [Game]
    };
    
    console.log(sessionStorage.getItem("playFieldSize"));
    console.log(gameOptions.playFieldSize);
    game = new Phaser.Game(gameConfig);
    //make sure the game object is frontmost
    window.focus();
    //call resize function to set the canvas size to fit to the browser's window
    resize();
    // add event listener to follow window resize and call resize function
    window.addEventListener("resize", resize, false);
}
//create resize function to calibrate the canvas size to any window size
function resize() {
    //select canvas element of the window
    var canvas = document.querySelector("canvas");
    //create window width and height using the browser's actual window size 
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    //declare window ratio using width and height
    var windowRatio = windowWidth / windowHeight;
    //declare game ratio using the game configuration
    var gameRatio = game.config.width / game.config.height;
    //if the browser's window size less than the game size, set the canvas to the window size
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    //if the browser's window size more than the game size, set the canvas to the game size using the game ratio
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
function playSize(){
    var size = parseInt(sessionStorage.getItem("playFieldSize"));
    if(size>0){
        return size;
    }
    else{
        return 4;
    }
}