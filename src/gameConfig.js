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
}
//create resize function to calibrate the canvas size to any window size
function resize() {
    //select canvas element of the window
    var canvas = document.querySelector("canvas");
    var header = document.getElementById("header");
    var footer = document.getElementById("footer");
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
        header.style.width = windowWidth + "px";
        header.style.height = (windowHeight-(windowWidth / gameRatio))/2 + "px";
        footer.style.width = windowWidth + "px";
        footer.style.height =  (windowHeight-(windowWidth / gameRatio))/2 + "px";
        addContentHF();
    }
    //if the browser's window size more than the game size, set the canvas to the game size using the game ratio
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
        rmContentHF();
    }
}
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
//to add content to the top on mobile but to the side on desktop
function addContentHF(){
    document.getElementById("htitle").innerHTML="2048 Game";
    document.getElementById("h1p").innerHTML="Pull the tiles from side to side to add same values to the next power of 2!";
    document.getElementById("h2p").innerHTML="Reach 2048, and You Win!";
    document.getElementById("f1p").innerHTML="In the Menu you can choose to play on different sizes of grids listen to music!";
    document.getElementById("f2p").innerHTML="Just click on the options and have fun!";
}
function rmContentHF(){
    document.getElementById("htitle").innerHTML="";
    document.getElementById("h1p").innerHTML="";
    document.getElementById("h2p").innerHTML="";
    document.getElementById("f1p").innerHTML="";
    document.getElementById("f2p").innerHTML="";
}