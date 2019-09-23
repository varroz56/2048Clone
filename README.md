# **2048 Game clone**

A simple and fun game to leave stress and other commitments behind for a couple of minutes. Because of its simplicity, it is a perfect logic game from younger to elder people. Its goal to pull tiles with the same value on each other to double them and reach 2048.

## Table of content

  * [UX design](#ux-design)
    + [Initial design wire-frames / mock-ups:](#initial-design-wire-frames---mock-ups-)
    + [User stories](#user-stories)
  * [Features](#features)
    + [Existing Features](#existing-features)
      - [Menu Area](#menu-area)
      - [Game area](#game-area)
      - [Not area related features](#not-area-related-features)
      - [Future ideas](#future-ideas)
    + [Features left to implement](#features-left-to-implement)
  * [Technologies Used](#technologies-used)
  * [Testing](#testing)
  * [Deployment](#deployment)
  * [Credits](#credits)
    + [Content](#content)
    + [Media](#media)
    + [Acknowledgement](#acknowledgement)
    + [License](#license)


## UX design

The design primarily focus on simplicity, usability responsiveness to provide good user experience to young and old people using wide range of devices.

The goal was to be able to play on touch-enabled devices with a single touch and swipe and on other devices using mouse or keyboard.

### Initial design wire-frames / mock-ups:

- [Strategy Plane](assets/documentation/strategyPlane.pdf)
- [Importance to Viability assessment](assets/documentation/ImportancetoViability.pdf)
- [Scope Plane](assets/documentation/ScopePlane.pdf)
- [Structure Plane](assets/documentation/StructurePlane.pdf)
- [Skeleton Plane for mobile](assets/documentation/SkeletonPlaneMobile.pdf)
- [Skeleton Plane for desktop](assets/documentation/SkeletonPlaneDesktop.pdf)

Had to deviate from the initial design concept of the skeleton and structure planes, as the minimal text content did not fit to all devices and the new design gives the user a better user experience. The final planes (the changed ones) are the following:

- [Final Structure Plane](assets/documentation/FinalStructurePlane.pdf)
- [Final Skeleton plane for mobile](assets/documentation/FinalSkeletonMobile.pdf)

- [Final Skeleton plane for desktop](assets/documentation/FinalSkeletonDesktop.pdf) 

### User stories

- User A  as a new user opens the web page and the information modal shows up, A reads it through and closes the modal either clicking on the top right corner X  or the close button and the game with the default game size starts.
- User A  as a new user opens the web page and the information modal shows up, A reads it through, but accidentally clicks outside of the modal and the modal closes, the game with the default game size starts.
- User A  as a new user opens the web page and the information modal shows up, A accidentally clicks outside of the modal  or the close buttons  located on the modal before can read through, and the modal closes, and the game with the default game size starts. In this case, A can reopen the information modal by clicking on the "?" mark button next to the Reset button.
- User A as a returning user forgets about something from the game information, A can reopen the modal at any time during the game with clicking on the "?" mark button without losing the game state.
- User B as a returning user playing the game wants to start a new game in the current game mode (the size of the grid), B can either click on the Reset button located on the top left corner or on the button showing the same size as the current one in the second row from the menu. The current size button has different colour from the other two options to help the user.
- User B as a new or returning user playing the game and just want to try a different game mode during the game, can click on the desired mode button located in the second row of the menu. The current one has different colour from the other two options to help the user.
- User B as a new or returning user playing the game and either wins or loses and want play again on a same size game, needs to close the winner or loser modal showing up at the and of the game clicking on the close or X buttons on the modal or just clicking outside of the modal and then can click on the Reset button located on the top left corner of the menu or the desired size button located in the second row of the menu has different colour from the other two options to help the user.
- User B as a returning user playing the game and either wins or loses and want try a different size game, needs to close the winner or loser modal showing up at the and of the game clicking on the close or X buttons on the modal or just clicking outside of the modal and then can click on the desired size button located in the second row of the menu. The current one has different colour from the other two options to help the user.
- User C as a new or returning user wants to listen to music during the game, to turn on music, C needs to click on the Turn Music On button located on the top right corner of the menu, and it starts to play the music and the  button text turns to Turn Music Off and changes its colour.
- User D as a returning user wants to see his/her score/best score, he/she can see the current score and top score for the current game mode in the middle of the menu top row. 
- User D as a returning user wants to see his/her best score for a different game mode, he/she can see them in the middle of the menu top row by clicking to the desired game mode button.

## Features

### Existing Features

#### Menu Area

Every button images can be found in the [sprites](assets/sprites) folder in png format, and where the button has more than one state e.g current and not current, and all the game mode images are stored in the same file and the used frame is called when wanted to being showed. The images loaded to the memory in [Game.js](src/Game.js) preload section and added to the canvas in the create section. 

All button click events handled in the "Handle button click to store session data and to recall them with new config settings" section. When a button clicked (except "?" and Music) the current score going to be checked against the best score to set it again if needed, the current score going to be 0, the won global variable going to be false regardless its previous state (if it is true, the already won modal will show up and the user will be not permitted to make moves on the grid).

 Any additional will be stated below in each case.

- Reset Button: Allows users to restart the current game mode by clicking on it. The game will restart, not triggering page reload. File location: [sprites](assets/sprites/resetBtn.png).
- "?" button: Allows users to see the game information by clicking on it. when the user clicked on it, the game information modal will be showed in front of the game canvas. The html code of the modal can be found in the [index](index.html) file modal section. File location: [sprites](assets/sprites/infoBtn.png).
- Best: Shows the user's best score for the current game mode. The best score being stored in the session storage of the browser, so as long as the user does not end that session the information remain and can be viewed even after refreshing the page. The code for the "saveBest" and "getBest" functions what handles the best score can be find in [Game.js](src/Game.js) in the "Check and set current Button and Score states regarding to canvas size and saved state" section. The code to add the best score text to canvas can be find in the "Check and set current Button and Score states regarding to canvas size and saved state" section.
- Score:  Shows the user's current score and updating at every upgrade (addition). The addition can be find in the  [Game.js](src/Game.js) "Execute move / or upgrade" section "upgradeTile" function.  The code to add the score text to canvas can be find in the "Check and set current Button and Score states regarding to canvas size and saved state" section.
- Turn Music On/Off button: Allows the user to turn on/off music and this state will be saved to the session storage to remember when the page is refreshed. File location: [sprites](assets/sprites/musicBtns.png). The code located in [gameConfig](src/gameConfig.js) "Session Storage" section.
- 3x3, 4x4,5x5 buttons: Allows the user to change (or restart if the current one) the current game mode to another one. In this case the game mode going to be saved to the session storage, as the game mode change comes with the canvas size change too and for this the page is going to be reloaded. File location: [sprites](assets/sprites/sizeBtns.png).

#### Game area

The game area where the user can play the game, using the "wasd" or arrow keys, mouse or swipe on touch-enabled devices. The images for the game tiles are located in the [sprites](assets/sprites/tiles.png) folder. There are event listeners to handle user inputs and call the appropriate functions to trigger actions. The event listeners are located in [Game.js](src/Game.js) "Handle user interaction to the play field" section. 

- Keyboard inputs allows the user to interact with the game. Each input (w or arrow up, a or arrow left, s or arrow down, d or arrow right), if there is a possible move, move the tiles in the given direction. When there is no possible movement into that direction, nothing happen.
- Mouse or touch movements allows the user to move the tiles in the direction the pointer was moved. with mouse this happens when the user clicks and holds the left button on the mouse while move the mouse. On touch devices this happens when the user swipes in a direction. To handle this motions, the game uses vectors to determine the movement direction on a 360 degree and triggers the direction best describes the direction of the user input.

#### Not area related features

- If the page opened at first time, the game information modal shows the user the game rules and information about the game controls, options, additional information about the original game. To prevent the modal to show up again and again when the user plays the game, the state the it has been showed saved to the session storage.  The code located in [gameConfig](src/gameConfig.js) "Session Storage" section.
- When the user won or lost the game, the game area input methods disabled and a win or lose modal shows up to let the user know that he/she won or lost and allow the user to click on one of the game options in the menu. When the user won and still wants to interact with the game area (as there should be empty space) another modal shows up to let the user know that he/she already won, need to start a new game.
- The game canvas allows the user change the window size at any time during the game and change its size immediately to allow the user to play on the biggest possible canvas. 

#### Future ideas

A user database would be good to keep track of user number, activity, preferred game mode, and to allow users to share and compare their best scores online and immediately.

### Features left to implement

A better music selection and option to change tile colours.

## Technologies Used

[Html](https://whatwg.org/) : To display the document in the web browser

[SCSS](https://sass-lang.com/documentation/syntax) : To customise the document layout.

[jQuery](https://jquery.com/) : To simplify DOM manipulation.

[Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) : To use Phaser3 API and to implement interactive web page.

[Phaser3 API](https://phaser.io/phaser3) : To use as the game's framework.

[Git](https://git-scm.com/) : For version control.

[Github](https://github.com/) : To publish the website .

[VsCode](https://code.visualstudio.com/) : For code editing.

[Libreoffice](https://www.libreoffice.org/): For creating initial planes.

[Typora](https://typora.io/): To edit the markdown files.

## Testing

The html and css files have been checked against the [w3](https://www.w3.org/) validator producing no errors, no warnings. The  links to the check results:

[index.html](https://validator.w3.org/nu/?doc=https%3A%2F%2Fvarroz56.github.io%2F2048Clone%2F) , [style.css](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fvarroz56.github.io%2F2048Clone%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)

The site have been tested by users and the developer, the testing section can be found in the [TESTING](TESTING.md) file due to its size.

## Deployment

The deployment process was implemented in one way from the developer's computer to [Github pages](https://github.com/) using git for version control and commits. The deployed and development version has no differences.

In the event of future upgrades, amendments to the code will be delivered either to the same branch or if the code deviate from the original to provide different functions to a different branch what will be created during the further development.

Detailes of the used deployment procedures can be found clicking on the links below.

 The initial repository has been created on Github pages using its GUI, and used command line on the local computer's code editor terminal to add the existing local files to the [repository](https://github.com/varroz56/2048Clone) following the [method](https://help.github.com/en/articles/adding-an-existing-project-to-github-using-the-command-line) provided by Github pages. Later on the project have been [published](https://help.github.com/en/articles/configuring-a-publishing-source-for-github-pages) to be available to anyone using the [link](https://varroz56.github.io/2048Clone/)  generated by Github.

During development, the code has been reviewed either, if it has been uploaded to the online repository on the published site, either the local files using [python SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html) from command line.

To be able to run the code locally, the user needs two things, the files [downloaded](https://help.github.com/en/articles/fork-a-repo) from the online [repository](https://github.com/varroz56/2048Clone) and to run a local web server. For this there are many ways, one from them is to [install and set up](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server) python SimpleHTTPServer, and run it from the downloaded folder.



## Credits

### Content

The game information modal contains notation from the original game description from [Wikipedia](https://en.wikipedia.org/wiki/2048_(video_game)) and the developer of the original game, [Gabriele Cirulli](https://gabrielecirulli.com/).

### Media

The images have been created using a website free, online service, called [Da Button Factory](https://dabuttonfactory.com/).

The images have been processed with the [Inkscape](https://inkscape.org/) program.

The music have been downloaded from the [DL-Sounds](https://www.dl-sounds.com/royalty-free/?_sfm_mood=Calm&_sfm_media_type=Loop&_sfm_bpm=0+1000) web site which offers free to use music.

### Acknowledgement

For the development and how to use Phaser 3 API the developer used various channels, tutorials, including 

[Phaser examples](https://phaser.io/examples), [Emanuel Feronato's](https://www.emanueleferonato.com/) tutorials (the core of the resize function for the canvas and to set up the group for the grid). Later on , when there was a working framework, the the functions and the logic behind them are the developer's ideas using examples and tutorials to debug.

<a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a>

### License

The 2048Clone have been created by [Zoltan Varro](https://www.linkedin.com/in/zoltanlvarro/) and it is subject to the [MIT license](https://opensource.org/licenses/MIT).