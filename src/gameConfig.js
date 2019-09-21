/***************gameConfig.js file structure
 * Sections:
 * Declaration of Global variables
 * 
 * Window.onload function to calculate initial game scale and to initialize Phaser Game and to point to the Game scene
 * 
 * Content Scale with resize function 
 *
 *  Session storage section to store and read session storage variables to prevent data loss due refresh of the page
 */

//------------------------Global Variables--------------------------

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
    btnWidth : 200,
    btnHeight :100
}

//-----------------------Window.onload----------------------------------

//set the configuration of the canvas when the window loads
window.onload = function () {
    //create gameConfig to set the basic parameters for the canvas and to be able to change later on if needed 
    var gameConfig = {
        //Choosing Phaser canvas to use as a html canvas element
        type: Phaser.CANVAS,
        //set the square canvas size, given the size of the tiles and spacing around them
        //give 200px to the height for menu buttons
        width: gameOptions.tileSize * gameOptions.playFieldSize + gameOptions.tileSpacing * (gameOptions.playFieldSize + 1),
        height: gameOptions.tileSize * gameOptions.playFieldSize + gameOptions.tileSpacing * (gameOptions.playFieldSize + 1)+210,
        //set backgroung color
        backgroundColor: 0x6c7177,
        //point to the Game scene located in the Game.js
        scene: [Game]
    };
    game = new Phaser.Game(gameConfig);
    //make sure the game object is frontmost
    window.focus();
    //call resize function to set the canvas size to fit to the browser's window
    resize();
    // add event listener to follow window resize and call resize function
    window.addEventListener("resize", resize, false);
    if(!infoShown()){
        $("#infoModal").modal();
        sessionStorage.setItem("infoShown", true);
    }
}

//------------------------Content Scale-------------------------------

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
//------------------------------Session Storage-------------------------------------

//check if there is a saved value in the session storage for the size of the play field
// if not return 4 as the default
function playSize(){
    var size = parseInt(sessionStorage.getItem("playFieldSize"));
    if(size>0){
        return size;
    }
    else{
        return 4;
    }
}
//create musicState function to check if there is a stored value 1 or 2 in session storage
//for default returns 0 as the music is off
function musicState(){
    var state = parseInt(sessionStorage.getItem("musicState"));
    if(state>0){
        return 1;
    }
    else{
        return 0;
    }

}
//create infoShown function to check session storage, unless this is the first time
//the website was opened in this session the function returns true
function infoShown(){
    return sessionStorage.getItem("infoShown");
}