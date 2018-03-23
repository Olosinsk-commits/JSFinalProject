/**
 * @author Noah Greer <Noah.Greer@gmail.com>
 * 02/19/2018
 * Winter 2018
 * CSD 122 - JavaScript & jQuery
 * Group Project - Group 3 (Olga Osinskaya, Noah Greer, and Topher Gidos)
 *
 * Code to play a game of Asteroids.
 */

// Array of keycode values to map them to key names
const KEY_CODES = {27: 'escape', 32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down'};
// 20px font size for the heads up display (score and lives)
const HUD_FONT_SIZE = 20;
// 40px font size for menu headings (Asteroids title, lost, and pause menus).
const MENU_FONT_SIZE = 40;
// Black background color for the game
const BG_COLOR = '#000000';
 // White main color for the game
const MAIN_COLOR = '#FFFFFF';
// Yellow color for the thruster color
const THRUST_COLOR = '#FFFF00';
// Width and height of the ship for drawing the avatar.
const SHIP_WIDTH = 5;
const SHIP_HEIGHT = 10;
// Acceleration rate of the player's ship.
const PLAYER_SHIP_ACCELLERATION = 2;
// Max acceleration of the player's ship.
const PLAYER_MAX_ACCELERATION = 3;
// Jerk rate (increase in acceleration speed) of the player's ship
const PLAYER_SHIP_JERK = 0.005;
// Rotation rate of the player's ship. 3 degrees in Radians.
const PLAYER_SHIP_ROTATION_SPEED = 3 * (Math.PI / 180);
// Rotation rate of Asteroids in the game. 0.5 of a degree in Radians.
const ASTEROID_ROTATION_SPEED = 0.5 * (Math.PI / 180);

// When the page is ready
$(document).ready(function() {
    // Set the keydown and keyup handlers for the window to the getInput() function
    $(window).keydown(function(e) {
      getInput(e);
    }).keyup(function(e) {
      getInput(e);
    });
    // Start the game manager
    gameManager.start();
  });

// Game manager object to set up and maintain the state of the game
var gameManager = {
    // Variable to store a reference to the game canvas
    canvas: null,
    // Initializes the game state and starts the main game update and draw loop
    start: function () {
        // If we do not already have a reference to the canvas
        if (!this.canvas) {
          // Get a reference to the canvas
          this.canvas = $("#gameCanvas").get(0);
        }
        // Check whether canvas is available in the browser
        if (this.canvas.getContext) {
          // If we do not already have a reference to the context
          if (!this.context) {
            // Get a reference to the context.
            this.context = this.canvas.getContext('2d');
          }
          // Array to store the controls states to be checked by the update loop to determine what action to do.
          this.CONTROLS_STATE = [];
          // Array to store whether the control is being held down to avoid unwanted repeated inputs.
          this.CONTROLS_HELD = [];
          // Initialize both the state and held arrays for each key with the status set to false
          for (let keyCode in KEY_CODES) {
            this.CONTROLS_STATE[KEY_CODES[keyCode]] = false;
            this.CONTROLS_HELD[KEY_CODES[keyCode]] = false;
          }
          // Whether we are just beginning the game (stops the update loop and shows the start menu)
          this.gameBegin = true;
          // Whether the game is over (stops the update loop and shows the game over menu)
          this.gameOver = false;
          // Whether the game is paused (stops the update loop and shows the pause menu)
          this.gamePaused = false;
          // Start the player with 3 lives. If the player runs out of lives, the game is over.
          this.playerLives = 3;
          // Start the player with a score of 0.
          this.playerScore = 0;
          // Fire rate of 125ms for the player ship's weapon
          this.fireRate = 125;
          /* Stores the next time when the ship can fire again.
           * The game loop updates this when the player fires
           * to the current time in ms plus fireRate and checks
           * whether the current time is greater than nextFire
           * before letting the ship fire again.
           */
          this.nextFire = 0;
          // Debug flag to draw a circle representing the collider of a GameObject.
          this.showColliders = false;
          /* Array of the active GameObjects in the game.
           * The game will loop over all of the GameObjects to update and draw each one.
           * When a game object is destroyed, it is removed from this array so that it is
           * no longer updated or drawn, and it will be garbage collected
           * since there is no longer a reference to it.w
           */
          this.gameObjects = [];
          /* Create and store a reference to a PlayerShip object
           * spawned at the center of the canvas, facing up,
           * with zero velocity and acceleration, and a collisionRadius of 12.
           */
          this.playerShip = new PlayerShip(new Vector2(this.canvas.width/2, this.canvas.height/2), // position
                                           Vector2.up(), // direction
                                           Vector2.zero(), // velocity
                                           Vector2.zero(), // acceleration
                                           12); // collisionRadius
          // Add the playerShip to the array of gameObjects so that it gets updated and drawn.
          this.gameObjects.push(this.playerShip);
          // Start the update loop for the game.
          requestAnimationFrame(update);
        }
        // Othwerise, the canvas context was unavailable, so we cannot run the game.
        else {
          // Log that we could not get a reference to the context.
          console.log("Could not get canvas context. Browser does not support HTML5 canvas.");
        }
    },
    /* Function to reset all of the state variables of the game.
     * This will be used when the player has lost and wants to start a new game.
     */
    reset: function () {
      // Reset array to store the controls states to be checked by the update loop to determine what action to do.
      this.CONTROLS_STATE = [];
      // Reset array to store whether the control is being held down to avoid unwanted repeated inputs
      this.CONTROLS_HELD = [];
      // Re-initialize both the state and held arrays for each key with the status set to false
      for (let keyCode in KEY_CODES) {
        this.CONTROLS_STATE[KEY_CODES[keyCode]] = false;
        this.CONTROLS_HELD[KEY_CODES[keyCode]] = false;
      }
      // Reset whether we are just beginning the game (stops the update loop and shows the start menu)
      this.gameBegin = true;
      // Reset whether the game is over (stops the update loop and shows the game over menu)
      this.gameOver = false;
      // Reset whether the game is paused (stops the update loop and shows the pause menu)
      this.gamePaused = false;
      // Resset the player with 3 lives. If the player runs out of lives, the game is over.
      this.playerLives = 3;
      // Restart the player with a score of 0.
      this.playerScore = 0;
      // Reset the next fire time to 0
      this.nextFire = 0;
      // Reset the array of GameObjects
      this.gameObjects = [];
      // Reset the playerShip's atributes to it's starting point
      this.playerShip.position = new Vector2(this.canvas.width/2, this.canvas.height/2); // position
      this.playerShip.direction = Vector2.up(); // direction
      this.playerShip.velocity = Vector2.zero(); // velocity
      this.playerShip.acceleration = Vector2.zero(); // acceleration
      // Re-add the playerShip to the array of gameObjects so that it gets updated and drawn.
      this.gameObjects.push(this.playerShip);
      // Reset the asteroidManager's number of asteroids to spawn to 3.
      this.asteroidManager.numAsteroidsSpawn = 3;
    },
    /* A child object of the gameManager to manage spawning the asteroids
     * for each wave and creating smaller children when a
     * medium or large asteroid is destroyed.
     */
    asteroidManager: {
      // The number of asteroids to spawn.
      numAsteroidsSpawn: 3,
      /* Function to spawn a new wave of asteroids.
       * This will be called in the by onAsteroidDestroy from the update loop
       * when all asteroids on the field are destroyed.
       */
      spawnWave: function () {
        // Loop 'numAsteroidsSpawn' times
        for (let i = 0; i < this.numAsteroidsSpawn; i++) {
          // Create a new large Asteroid
          let as = Asteroid.createLarge();
          // Set the new asteroid's position to a random location within the bounds of the canvas.
          as.position = new Vector2(Math.random() * gameManager.canvas.width,
                                    Math.random() * gameManager.canvas.height);
          // Set the new asteroid's velocity to a random unit vector.
          as.velocity = Vector2.random();
          // Add the new asteroid to the gameObjects array so that it gets updated and drawn.
          gameManager.gameObjects.push(as);
        }
      },
      /**
       * Function to handle when an Asteroid gets destroyed that
       * checks whether child asteroids or a new wave needs to be spawned,
       * and removes the input asteroid from the gameObjects array.
       * @param {Asteroid} as The Asteroid instance to destroy.
       */
      onAsteroidDestroy: function (as) {
        // *** BEGIN INPUT VALIDATION ***
        try {
          // If no input was received for the 'as' parameter.
          if (as === undefined) throw "The 'as' parameter is required!";
          // If the 'as' parameter is not an Asteroid.
          if (!(as instanceof Asteroid)) throw "The 'as' parameter must be a Asteroid object.";
        }
        catch (e) {
          console.log(e);
        }
        // *** END INPUT VALIDATION ***

        // If the asteroid being destroyed is not the smallest asteroid size
        if (as.numSides !== Asteroid.smallNumSides) {
          // Create two smaller asteroids
          for (let i = 0; i < 2; i++) {
            // Reference variable for a new asteroid
            let newAsteroid = null;
            // If the asteroid was a large asteroid
            if (as.numSides === Asteroid.largeNumSides) {
              // Create a new medium asteroid
              newAsteroid = Asteroid.createMedium();
            }
            // If the asteroid was a medium asteroid
            else if (as.numSides === Asteroid.mediumNumSides) {
              // Create a new small asteroid
              newAsteroid = Asteroid.createSmall();
            }
            // Set the new asteroid's position to the original asteroid's position.
            newAsteroid.position = new Vector2(as.position.x, as.position.y);
            // And give it a new random velocity
            newAsteroid.velocity = Vector2.random();
            // Add the new asteroid to the gameObjects array so that it gets updated and drawn
            gameManager.gameObjects.push(newAsteroid);
          }
        }

        // Counter for the number of asteroids in the gameObjects array.
        let asteroidCount = 0;
        // Loop over all GameObjects in the gameManager array
        for (let i = 0; i < gameManager.gameObjects.length; i++) {
          // Get the current GameObject from the gameManager array
          let go = gameManager.gameObjects[i];
          // If the game object was an instance of an Asteroid
          if (go instanceof Asteroid) {
            // Increment the asteroid count.
            asteroidCount++;
          }
        }
        // If this was the last Asteroid
        if (asteroidCount === 0) {
          // Increase the number of asteroids in the next wave
          this.numAsteroidsSpawn++;
          // Spawn a new wave of asteroids.
          this.spawnWave();
        }
      }
    }
};

/**
 * Updates the game state and draws each game element based on the current state.
 * @param {number} time The amount of time that has elapsed since the last update.
 * The 'time' parameter is used to determine how quickly the player may fire.
 */
function update(time) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'time' parameter.
    if (time === undefined) throw "The 'time' parameter is required!";
    // If the 'time' parameter is not a number.
    if (typeof time !== 'number') throw "The 'time' parameter must be a number.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  /* The input states are set by the getInput() handler which is called by the browser outside of this loop.
   * hndleInput is called in this loop to perform the correct action based on the input states.
   */
  handleInput(time);

  // Draw the black background of the game (doubles as clearing the canvas).
  drawBackground();

  // Loop over all GameObjects in the gameManager array
  for (let i = 0; i < gameManager.gameObjects.length; i++) {
    // Get the current GameObject from the gameManager array
    let go = gameManager.gameObjects[i];
    // If the game is not paused
    if (!gameManager.gamePaused && !gameManager.gameBegin && !gameManager.gameOver) {
      // Update the position of the current GameObject.
      go.update();
      // Check the collisions of the current GameObject.
      checkCollisions(go);
    }
    go.draw();

    // If the showCollider's flag is set, draw the collider for this GameObject for debugging.
    if (gameManager.showColliders) {
      // Draw this GameObject's collider
      go.drawCollider();
    }
  }

  // Draw the heading and numeric representation for the player's current score.
  drawScore();

  // Draw the heading and graphical representation for the number of lives the player has left.
  drawLives();

  // If this is the beginning of the game
  if (gameManager.gameBegin) {
    // Draw the start menu
    drawStartMenu();
  }

  // If the game is paused
  if (gameManager.gamePaused) {
    // Draw the pause menu
    drawPauseMenu();
  }

  // If the game is over
  if (gameManager.gameOver) {
    // Draw the game over menu.
    drawGameLostMenu();
  }

  // Request the next frame to keep the update loop going.
  requestAnimationFrame(update);
}

/**
 * Draws the black background for the game
 * This also serves the purpose of clearing the entire canvas
 */
function drawBackground() {
  let context = gameManager.context;
  let canvas = gameManager.canvas;
  context.fillStyle = BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Checks the collisions of the input game object and handles
* the outcome based on the GameObject's instance type.
 * @param {GameObject} go The GameObject to check the collisions for.
 */
function checkCollisions(go) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'go' parameter
    if (go === undefined) throw "The 'go' parameter is required!";
    // If the 'go' parameter is not a GameObject
    if (!(go instanceof GameObject)) throw "The 'go' parameter must be a GameObject object.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // If the GameObject being checked is an Asteroid
  if (go instanceof Asteroid) {
    // Get the Projectile this collided with (if any)
    let collidedWithProjectile = go.checkCollisionWith(Projectile);
    // If a projectile collided with this object
    if (collidedWithProjectile) {
      // Reduce the Asteroid's health by one
      go.health--;

      // If this Asteroid has run out of health
      if (go.health <= 0) {
        // Remove this Asteroid from the array of gameObjects
        let index = gameManager.gameObjects.indexOf(go);
        gameManager.gameObjects.splice(index, 1);

        // Tell the asteroidManager that the asteroid was destroyed.
        gameManager.asteroidManager.onAsteroidDestroy(go);
        // Increase the player's score by this Asteroid's score value
        gameManager.playerScore += go.scoreValue;
      }

      // Remove the projectile the Asteroid collided with from the array of gameObjects
      let index = gameManager.gameObjects.indexOf(collidedWithProjectile);
      gameManager.gameObjects.splice(index, 1);
    }
  }

  // If the GameObject being checked is a PlayerShip
  if (go instanceof PlayerShip) {
    // Get the Asteroid this collided with (if any)
    let collidedWithAsteroid = go.checkCollisionWith(Asteroid);
    // If an Asteroid collided with this object
    if (collidedWithAsteroid) {
      // Move the player ship to the starting position and state and remove a life
      go.position.x = gameManager.canvas.width/2;
      go.position.y = gameManager.canvas.height/2;
      go.direction = Vector2.up();
      go.velocity = Vector2.zero();
      go.acceleration = Vector2.zero();
      // Decrease the player's lives by 1
      gameManager.playerLives--;

      // If the player is out of lives
      if (gameManager.playerLives <= 0) {
        // Set the gameOver flag in the gameManager to end the game.
        gameManager.gameOver = true;
      }
    }
  }
}

/**
 * Draws the player's available lives
 */
function drawLives() {
  let context = gameManager.context;
  context.font = HUD_FONT_SIZE + "px Arial";
  context.fillStyle = MAIN_COLOR;
  context.textAlign = "left";
  let livesText = "Lives: ";
  // Get the width of the text to calculate spacing below
  let textWidth = context.measureText(livesText).width;
  context.fillText(livesText, 2, HUD_FONT_SIZE * 2);

  // Loop 'playerLives' times to draw the ship avatar once per life.
  for (let i = 0; i < gameManager.playerLives; i++) {
    context.save();
    // Offset the position from the lives text by a multiple of the ship's width to space them out evenly.
    context.translate(textWidth + (2 * SHIP_WIDTH) + (4 * SHIP_WIDTH * i), HUD_FONT_SIZE * 2);
    context.beginPath();
    context.moveTo(0, -SHIP_HEIGHT);
    context.lineTo(SHIP_WIDTH, SHIP_HEIGHT);
    context.lineTo(0, SHIP_WIDTH);
    context.lineTo(-SHIP_WIDTH, SHIP_HEIGHT);
    context.lineTo(0, -SHIP_HEIGHT);
    context.lineWidth = 2;
    context.strokeStyle = MAIN_COLOR;
    context.stroke();
    context.restore();
  }
}

/**
 * Draws the player's current score.
 */
function drawScore() {
  let context = gameManager.context;
  context.font = HUD_FONT_SIZE + "px Arial";
  context.fillStyle = MAIN_COLOR;
  context.textAlign = "left";
  let scoreText = "Score: " + gameManager.playerScore;
  context.fillText(scoreText, 0, HUD_FONT_SIZE);
}

/**
 * Draws the game's start menu.
 */
 function drawStartMenu() {
   let context = gameManager.context;
   let canvas = gameManager.canvas;
   context.save();
   context.globalAlpha = 0.6;
   drawBackground();
   context.globalAlpha = 1;
   context.font = MENU_FONT_SIZE + "px Arial";
   context.fillStyle = MAIN_COLOR;
   context.textAlign = "center";
   context.translate(canvas.width/2, canvas.height/4);
   let menuText = "Asteroids";
   context.fillText(menuText, 0, MENU_FONT_SIZE);
   context.font = HUD_FONT_SIZE + "px Arial";
   context.translate(0, canvas.height/6);
   menuText = "Controls:";
   context.fillText(menuText, 0, 0);
   context.translate(0, canvas.height/16);
   menuText = "Pause: [Escape]";
   context.fillText(menuText, 0, 0);
   context.translate(0, canvas.height/16);
   menuText = "Turn Left / Right : ← / →";
   context.fillText(menuText, 0, 0);
   context.translate(0, canvas.height/16);
   menuText = "Move forward: ↑";
   context.fillText(menuText, 0, 0);
   context.translate(0, canvas.height/16);
   menuText = "Fire weapon: [Space Bar]";
   context.fillText(menuText, 0, 0);
   context.translate(0, canvas.height/8);
   menuText = "Press [Space Bar] to begin game!";
   context.fillText(menuText, 0, 0);
   context.restore();
 }

/**
 * Draws the game's pause menu.
 */
function drawPauseMenu() {
  let context = gameManager.context;
  let canvas = gameManager.canvas;
  context.save();
  context.globalAlpha = 0.6;
  drawBackground();
  context.globalAlpha = 1;
  context.font = MENU_FONT_SIZE + "px Arial";
  context.fillStyle = MAIN_COLOR;
  context.textAlign = "center";
  context.translate(canvas.width/2, canvas.height/4);
  let menuText = "Paused";
  context.fillText(menuText, 0, MENU_FONT_SIZE);
  context.translate(0, canvas.height/8);
  context.font = HUD_FONT_SIZE + "px Arial";
  menuText = "(Press Escape to resume)";
  context.fillText(menuText, 0, 0);
  context.translate(0, canvas.height/8);
  menuText = "Controls:";
  context.fillText(menuText, 0, 0);
  context.translate(0, canvas.height/16);
  menuText = "Pause: [Escape]";
  context.fillText(menuText, 0, 0);
  context.translate(0, canvas.height/16);
  menuText = "Turn Left / Right : ← / →";
  context.fillText(menuText, 0, 0);
  context.translate(0, canvas.height/16);
  menuText = "Move forward: ↑";
  context.fillText(menuText, 0, 0);
  context.translate(0, canvas.height/16);
  menuText = "Fire weapon: [Space Bar]";
  context.fillText(menuText, 0, 0);
  context.restore();
}

/**
 * Draws the game's game lost menu.
 */
function drawGameLostMenu() {
  let context = gameManager.context;
  let canvas = gameManager.canvas;
  context.save();
  context.globalAlpha = 0.6;
  drawBackground();
  context.globalAlpha = 1;
  context.font = MENU_FONT_SIZE + "px Arial";
  context.fillStyle = MAIN_COLOR;
  context.textAlign = "center";
  context.translate(canvas.width/2, canvas.height/4);
  let menuText = "You lost!";
  context.fillText(menuText, 0, MENU_FONT_SIZE);
  context.font = HUD_FONT_SIZE + "px Arial";
  context.translate(0, canvas.height/8);
  menuText = "(Press Escape to start new game)";
  context.fillText(menuText, 0, 0);
  context.restore();
}

/**
 * Gets input from the browser and stores the relevent key states
 */
function getInput(e) {
  // If the key code of the event is in our key codes array.
  if (KEY_CODES[e.keyCode]) {
    // Prevent the default so that the page does not scroll or lose focus.
    e.preventDefault();
    // Convert from the key code to the control and set the state based on whether the type of the even was keydown.
    if (e.type === "keydown") {
      gameManager.CONTROLS_STATE[KEY_CODES[e.keyCode]] = true;
    }
    // Else if the key even was a keyup
    else if (e.type === "keyup") {
      // Reset both the control state and held states to false
      gameManager.CONTROLS_STATE[KEY_CODES[e.keyCode]] = false;
      gameManager.CONTROLS_HELD[KEY_CODES[e.keyCode]] = false;
    }
  }
}

/**
 * Handles the player's inputs based on the constrols state in the gameManager.
 * Updates ship movement and menu controls.
 * @param {number} time The elapsed time since the game started.
 */
function handleInput(time) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'time' parameter.
    if (time === undefined) throw "The 'time' parameter is required!";
    // If the 'time' parameter is not a number.
    if (typeof time !== 'number') throw "The 'time' parameter must be a number.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // Get a reference to the playerShip from the gameManager.
  let ship = gameManager.playerShip;

  // If the escape key was pressed and it is not being held down
  if (gameManager.CONTROLS_STATE.escape && !gameManager.CONTROLS_HELD.escape) {
    // Mark the key as being held down
    gameManager.CONTROLS_HELD.escape = true;
    // If the game is not just beginning and it is not the end of the game.
    if (!gameManager.gameBegin && !gameManager.gameOver) {
      // Pause the game.
      gameManager.gamePaused = !gameManager.gamePaused;
    }
    // Otherwise, if the game is over.
    else if (gameManager.gameOver) {
      // Reset the game.
      gameManager.reset();
    }
  }
  // If the game is not paused
  if (!gameManager.gamePaused) {
    // If the game has not just begun and is not over
    if (!gameManager.gameBegin && !gameManager.gameOver) {
      // If the 'up' control was pressed
      if (gameManager.CONTROLS_STATE.up) {
        // Accellerate the ship in the direction it is currently facing.
        ship.acceleration = Vector2.lerp(ship.acceleration, Vector2.multiply(ship.direction, PLAYER_SHIP_ACCELLERATION), PLAYER_SHIP_JERK);
        ship.acceleration.clampMagnitude(PLAYER_MAX_ACCELERATION);
      }
      // If the 'left' control was pressed
      if (gameManager.CONTROLS_STATE.left) {
        // Rotate the ship counter clockwise at a rate of PLAYER_SHIP_ROTATION_SPEED.
        ship.direction.rotate(-PLAYER_SHIP_ROTATION_SPEED);
      }
      // If the 'right' control was pressed
      if (gameManager.CONTROLS_STATE.right) {
        // Rotate the ship clockwise at a rate of PLAYER_SHIP_ROTATION_SPEED.
        ship.direction.rotate(PLAYER_SHIP_ROTATION_SPEED);
      }
    }
    // If the 'space' control was pressed
    if (gameManager.CONTROLS_STATE.space) {
      // If this is the beginning of the game, space starts the game.
      if (gameManager.gameBegin) {
        gameManager.CONTROLS_HELD.space = true;
        gameManager.gameBegin = false;
        gameManager.asteroidManager.spawnWave();
      }
      // If enough time has passed between the last fire and this one
      else if (time > gameManager.nextFire && !gameManager.CONTROLS_HELD.space) {
            gameManager.nextFire = time + gameManager.fireRate;
            let projectileVelocity = 3;
            let proj = new Projectile(Vector2.add(ship.position, Vector2.multiply(ship.direction, ship.collisionRadius)), // position
                                      new Vector2(ship.direction.x, ship.direction.y), // direction
                                      Vector2.multiply(ship.direction, projectileVelocity + ship.velocity.magnitude()), // velocity
                                      Vector2.zero(), // acceleration
                                      1); // collisionRadius
            gameManager.gameObjects.push(proj);
      }
    }
  }
  // Otherwise, reset the state of the controls.
  else {
    if (gameManager.CONTROLS_STATE.up) {gameManager.CONTROLS_STATE.up = false;}
    if (gameManager.CONTROLS_STATE.left) {gameManager.CONTROLS_STATE.left = false;}
    if (gameManager.CONTROLS_STATE.right) {gameManager.CONTROLS_STATE.right = false;}
    if (gameManager.CONTROLS_STATE.space) {gameManager.CONTROLS_STATE.space = false;}
  }
}

/**
 * Creates an instance of a Vector2 with an x and y component.
 * The Vector2 class will be used for storing and manipulating GameObject's
 * position, velocity, accelleration, and direction.
 * @constructor
 * @param {number} x The Vector2's x component.
 * @param {number} y The Vector2's y component.
 * @return {Vector2} The new Vector2 object.
 */
function Vector2(x, y) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'x' parameter.
    if (x === undefined) throw "The 'x' parameter is required!";
    // If the 'x' parameter is not a number.
    if (typeof x !== 'number') throw "The 'x' parameter must be a number.";
    // If no input was received for the 'y' parameter.
    if (y === undefined) throw "The 'y' parameter is required!";
    // If the 'y' parameter is not a number.
    if (typeof y !== 'number') throw "The 'y' parameter must be a number.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // Set the new GameObject's properties.
  this.x = x;
  this.y = y;
}

/**
 * Creates a new Vector2 object with the default values for zero.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.zero = function () {
  return new Vector2(0, 0);
};

/**
 * Creates a new Vector2 object with the default values for down.
 * This lets us instantiate a named configuration so it's easier
 * to see what the components mean and allows for easier simple code reuse.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.down = function () {
  return new Vector2(0, 1);
};

/**
 * Creates a new Vector2 object with the default values for left.
 * This lets us instantiate a named configuration so it's easier
 * to see what the components mean and allows for easier simple code reuse.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.left = function () {
  return new Vector2(-1, 0);
};

/**
 * Creates a new Vector2 object with the default values for right.
 * This lets us instantiate a named configuration so it's easier
 * to see what the components mean and allows for easier simple code reuse.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.right = function () {
  return new Vector2(1, 0);
};

/**
 * Creates a new Vector2 object with the default values for up.
 * This lets us instantiate a named configuration so it's easier
 * to see what the components mean and allows for easier simple code reuse.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.up = function () {
  return new Vector2(0, -1);
};

/**
 * Creates a randomized new Vector2 object with magnitude 1.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.random = function () {
  let newVector = Vector2.up();
  // Rotate by some random angle between 0 and 360 degrees / 2 pi radians.
  newVector.rotate((Math.random() + 1) * 2 * Math.PI);
  return newVector;
};

/**
 * Calculates the whole clockwise angle (from 0-2PI radians) between two vectors.
 * @param {Vector2} fromV The vector to calculate the angle from.
 * @param {Vector2} toV The vector to calculate the angle to.3
 * @static
 */
Vector2.angleBetween = function (fromV, toV) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'fromV' parameter.
    if (fromV === undefined) throw "The 'fromV' parameter is required!";
    // If the 'fromV' parameter is not a Vector2.
    if (!(fromV instanceof Vector2)) throw "The 'fromV' parameter must be a Vector2 object.";
    // If no input was received for the 'toV' parameter.
    if (toV === undefined) throw "The 'toV' parameter is required!";
    // If the 'toV' parameter is not a Vector2.
    if (!(toV instanceof Vector2)) throw "The 'toV' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // Calculate the dot product.
  let dot = fromV.x * toV.x + fromV.y * toV.y;
  // Calculate the determinant.
  let det = fromV.x * toV.y - fromV.y * toV.x;
  // Calculate the angle using atan2
  let angle = Math.atan2(det, dot);
  return angle;
};

/**
 * Multiplies a vector's components by a scalar value.
 * @param {Vector2} vector The vector to be multiplied.
 * @param {number} scalar The scalar to multiply the vector by.
 * @return {Vector2} The new scaled vector.
 * @static
 */
Vector2.multiply = function (vector, scalar) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'vector' parameter.
    if (vector === undefined) throw "The 'vector' parameter is required!";
    // If the 'vector' parameter is not a Vector2.
    if (!(vector instanceof Vector2)) throw "The 'vector' parameter must be a Vector2 object.";
    // If no input was received for the 'scalar' parameter.
    if (scalar === undefined) throw "The 'scalar' parameter is required!";
    // If the 'scalar' parameter is not a number.
    if (typeof scalar !== 'number') throw "The 'scalar' parameter must be a number.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  return new Vector2 (vector.x * scalar, vector.y * scalar);
};

/**
 * Adds a vector's components to another vector's components
 * and returns a new Vector2 object with the result.
 * @param {Vector2} vectorA The first vector to be added.
 * @param {Vector2} vectorB The second vector to be added.
 * @return {Vector2} The new vector with the sum of the input's components.
 * @static
 */
Vector2.add = function (vectorA, vectorB) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'vectorA' parameter.
    if (vectorA === undefined) throw "The 'vectorA' parameter is required!";
    // If the 'vectorA' parameter is not a Vector2.
    if (!(vectorA instanceof Vector2)) throw "The 'vectorA' parameter must be a Vector2 object.";
    // If no input was received for the 'vectorB' parameter.
    if (vectorB === undefined) throw "The 'vectorB' parameter is required!";
    // If the 'vectorB' parameter is not a Vector2.
    if (!(vectorB instanceof Vector2)) throw "The 'vectorB' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // Return a new vector with components equal to the sum of the two input vector's components.
  return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
};

/**
 * Subtracts s vector's components from another vector's components
 * and returns a new Vector2 object with the result.
 * @param {Vector2} vectorA The first vector to be subtracted.
 * @param {Vector2} vectorB The second vector to be subtracted.
 * @return {Vector2} The new vector with the difference of the input's components.
 */
Vector2.subtract = function (vectorA, vectorB) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'vectorA' parameter.
    if (vectorA === undefined) throw "The 'vectorA' parameter is required!";
    // If the 'vectorA' parameter is not a Vector2.
    if (!(vectorA instanceof Vector2)) throw "The 'vectorA' parameter must be a Vector2 object.";
    // If no input was received for the 'vectorB' parameter.
    if (vectorB === undefined) throw "The 'vectorB' parameter is required!";
    // If the 'vectorB' parameter is not a Vector2.
    if (!(vectorB instanceof Vector2)) throw "The 'vectorB' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // Return a new vector with components equal to the difference of the two input vector's components.
  return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
};

/**
 * Returns a normalized version of a vector to have a magnitude (length) of 1, while keeping the same direction.
 * @param {Vector2} vector The vector to be normalized.
 * @static
 */
Vector2.normalize = function (vector) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'vector' parameter.
    if (vector === undefined) throw "The 'vector' parameter is required!";
    // If the 'vector' parameter is not a Vector2.
    if (!(vector instanceof Vector2)) throw "The 'vector' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  let result = vector;
  let m = vector.magnitude();
  if (m > 0) {
    result = Vector2.multiply(vector, 1/m);
  }
  return result;
};

/**
 * Returns a new vector that has been interpolated by the percent amount between the two input vectors
 * @param {Vector2} fromV The vector to interpolate from
 * @param {Vector2} toV The vector to interpolate to
 * @param {number} percent The percent to interpolate by
 * @static
 */
Vector2.lerp = function (fromV, toV, percent) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'fromV' parameter.
    if (fromV === undefined) throw "The 'fromV' parameter is required!";
    // If the 'fromV' parameter is not a Vector2.
    if (!(fromV instanceof Vector2)) throw "The 'fromV' parameter must be a Vector2 object.";
    // If no input was received for the 'toV' parameter.
    if (toV === undefined) throw "The 'toV' parameter is required!";
    // If the 'toV' parameter is not a Vector2.
    if (!(toV instanceof Vector2)) throw "The 'toV' parameter must be a Vector2 object.";
    // If no input was received for the 'percent' parameter.
    if (percent === undefined) throw "The 'percent' parameter is required!";
    // If the 'percent' parameter is not a number.
    if (typeof percent !== 'number') throw "The 'percent' parameter must be a number.";
    // If the 'percent' parameter is not between 0 and 1 (inclusive).
    if (percent < 0 || percent > 1) throw "The 'percent' parameter must be between 0 and 1 (inclusive).";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  /**
   * Calculate a linearly interpolated vector
   * between the fromV and toV using the formula
   * fromV + percent * (toV - fromV)
   */
  let distance = Vector2.subtract(toV, fromV);
  distance.multiply(percent);
  let result = Vector2.add(fromV, distance);
  return result;
};

/**
 * Adds another vector's components to this vector's components
 * and keeps the result in this vector.
 * @param {Vector2} otherVector The other vector to be added to this vector.
 */
Vector2.prototype.add = function (otherVector) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'otherVector' parameter.
    if (otherVector === undefined) throw "The 'otherVector' parameter is required!";
    // If the 'otherVector' parameter is not a Vector2.
    if (!(otherVector instanceof Vector2)) throw "The 'otherVector' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  this.x += otherVector.x;
  this.y += otherVector.y;
};

/**
 * Subtracts another vector's components from this vector's components
 * and keeps the result in this vector.
 * @param {Vector2} otherVector The other vector to be subtracted from this vector.
 */
Vector2.prototype.subtract = function (otherVector) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'otherVector' parameter.
    if (otherVector === undefined) throw "The 'otherVector' parameter is required!";
    // If the 'otherVector' parameter is not a Vector2.
    if (!(otherVector instanceof Vector2)) throw "The 'otherVector' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  this.x -= otherVector.x;
  this.y -= otherVector.y;
};

/**
 * Multiplies this vector's components by a scalar value
 * and keeps the result in this vector.
 * @param {number} scalar The scalar multiplier.
 */
Vector2.prototype.multiply = function (scalar) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'scalar' parameter.
    if (scalar === undefined) throw "The 'scalar' parameter is required!";
    // If the 'scalar' parameter is not a number.
    if (typeof scalar !== 'number') throw "The 'scalar' parameter must be a number.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  this.x *= scalar;
  this.y *= scalar;
};

/**
 * Rotates this vector by an angle (radian) value.
 * @param {number} angle The angle to rotate this vector by.
 */
Vector2.prototype.rotate = function (angle) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'angle' parameter.
    if (angle === undefined) throw "The 'angle' parameter is required!";
    // If the 'angle' parameter is not a number.
    if (typeof angle !== 'number') throw "The 'angle' parameter must be a number.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  /**
   * Store the result of the cosine and sine of the angle
   * so that the calculation only needs to be done once each
   * before being used in the final formula twice.
   */
  let cosAngle = Math.cos(angle);
  let sinAngle = Math.sin(angle);

  /**
   * Calculate and store the new component values with the rotation applied.
   */
  let newX = this.x * cosAngle - this.y * sinAngle;
  let newY = this.x * sinAngle + this.y * cosAngle;

  /**
   * Set this vector's new components.
   */
  this.x = newX;
  this.y = newY;
};

/**
 * Calculates the magnitude (length) of this vector.
 * @return {number} The magnitude (length) of this vector.
 */
Vector2.prototype.magnitude = function () {
  // Return the magnitude of the vector calculated using the pythagorean theorem.
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * Normalizes this vector to have a magnitude (length) of 1,
 * while keeping the same direction,
 * and keeps the result in this vector.
 */
Vector2.prototype.normalize = function () {
  let m = this.magnitude();
  if (m > 0) {
    this.multiply(1/m);
  }
};

/**
 * Clamps the magnitude of this vector.
 * @param {number} max The maximum magnitude that the vector should be clamped to.
 */
Vector2.prototype.clampMagnitude = function (max) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If the 'max' parameter is not a number.
    if (typeof max !== 'number') throw "The 'max' parameter must be a number.";
    // If the 'max' parameter is less than or equal to 0.
    if (max < 0) throw "The 'max' parameter must be a positive number greater than zero.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  if (this.magnitude() > max) {
    this.normalize();
    this.multiply(max);
  }
};

/**
 * Sets this vector's components to new interpolated values between
 * it and the to vector by the provided percent.
 * This function lets us smoothly transition from one vector's coordinates to another.
 * This is useful for transitioning accelleration and velocity vectors.
 * @param {Vector2} toV The vector to interpolate to
 * @param {number} percent The percent to interpolate by (0-1) inclusive
 * @static
 */
Vector2.prototype.lerp = function (toV, percent) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'toV' parameter.
    if (toV === undefined) throw "The 'toV' parameter is required!";
    // If the 'toV' parameter is not a Vector2.
    if (!(toV instanceof Vector2)) throw "The 'toV' parameter must be a Vector2 object.";
    // If no input was received for the 'percent' parameter.
    if (percent === undefined) throw "The 'percent' parameter is required!";
    // If the 'percent' parameter is not a number.
    if (typeof percent !== 'number') throw "The 'percent' parameter must be a number.";
    // If the 'percent' parameter is not between 0 and 1 (inclusive).
    if (percent < 0 || percent > 1) throw "The 'percent' parameter must be between 0 and 1 (inclusive).";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  /**
   * Calculate a linearly interpolated vector
   * between this vector and toV using the formula
   * fromV + percent * (toV - fromV)
   */
  let distance = Vector2.subtract(toV, this);
  distance.multiply(percent);
  let result = Vector2.add(this, distance);

  this.x = result.x;
  this.y = result.y;
};

/**
 * Creates an instance of a GameObject.
 * This constructor is only so that subclasses can call it and set all the same properties.
 * The GameObject class describes an entity in the game that has a position, direction,
 * velocity, acceleration, and collision radius.
 * These properties are used by its update method to make the object follow an
 * approximation of how physics would interact with an object with the same properties.
 * @constructor
 * @abstract
 * @param {Vector2} position The GameObject's position vector.
 * @param {Vector2} direction The GameObject's direction vector.
 * @param {Vector2} velocity The GameObject's velocity vector.
 * @param {Vector2} acceleration The GameObject's acceleration vector.
 * @param {number} collisionRadius The GameObject's collisionRadius.
 * @return {GameObject} The new GameObject object.
 */
function GameObject(position, direction, velocity, acceleration, collisionRadius) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'position' parameter.
    if (position === undefined) throw "The 'position' parameter is required!";
    // If the 'position' parameter is not a Vector2.
    if (!(position instanceof Vector2)) throw "The 'position' parameter must be a Vector2 object.";
    // If no input was received for the 'direction' parameter.
    if (direction === undefined) throw "The 'direction' parameter is required!";
    // If the 'direction' parameter is not a Vector2.
    if (!(direction instanceof Vector2)) throw "The 'direction' parameter must be a Vector2 object.";
    // If no input was received for the 'velocity' parameter.
    if (velocity === undefined) throw "The 'velocity' parameter is required!";
    // If the 'velocity' parameter is not a Vector2.
    if (!(velocity instanceof Vector2)) throw "The 'velocity' parameter must be a Vector2 object.";
    // If no input was received for the 'acceleration' parameter.
    if (acceleration === undefined) throw "The 'acceleration' parameter is required!";
    // If the 'acceleration' parameter is not a Vector2.
    if (!(acceleration instanceof Vector2)) throw "The 'acceleration' parameter must be a Vector2 object.";
    // If no input was received for the 'collisionRadius' parameter.
    if (collisionRadius === undefined) throw "The 'collisionRadius' parameter is required!";
    // If the 'collisionRadius' parameter is not a number.
    if (typeof collisionRadius !== 'number') throw "The 'collisionRadius' parameter must be a number.";
    // If the 'collisionRadius' parameter is less than or equal to 0.
    if (collisionRadius <= 0) throw "The 'collisionRadius' parameter must be a positive number greater than zero.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // Set the new GameObject's properties.
  this.position = position;
  this.direction = direction;
  this.velocity = velocity;
  this.acceleration = acceleration;
  this.collisionRadius = collisionRadius;
}

/**
 * Abstract update method for the GameObject base class.
 * Must be overriden in a subclass to update any atributes of the GameObject instance.
 */
GameObject.prototype.update = function () {
  try {
    throw "Cannot instantiate abstract class";
  }
  catch (e) {
    console.log(e);
  }
};

/**
 * Abstract draw method for the GameObject base class.
 * Must be overriden in a subclass to draw the graphical
 * representation of the GameObject at it's current position and rotation.
 */
GameObject.prototype.draw = function () {
  try {
    throw "Cannot instantiate abstract class";
  }
  catch (e) {
    console.log(e);
  }
};

/**
 * Checks whether this game object collided with another game object that matches otherObjectType.
 * Returns null if it has not collided with another object
 * or returns a reference to the object that it collided with.
 * @param {GameObject} otherObjectType Takes the constructor name of the object to check for a collision with.
 * @return {?GameObject} The matching object that collided with this one (if found).
 */
GameObject.prototype.checkCollisionWith = function (otherObjectType) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'otherObjectType' parameter.
    if (otherObjectType === undefined) throw "The 'otherObjectType' parameter is required!";
    // If the 'otherObjectType' parameter is not a GameObject.
    if (!(otherObjectType.prototype instanceof GameObject)) throw "The 'otherObjectType' parameter must be a GameObject object.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // Variable to store a reference to the object this collided with. Initialized to null to signify no collision.
  let collidedWith = null;

  /**
   * Loop through the other game objects and check for any object that
   * matches the input type, and whether it is intersecting with this object.
   */
  for (let i = 0; i < gameManager.gameObjects.length; i++) {
    let otherObject = gameManager.gameObjects[i];
    // If the otherObject matches the prototype of the otherObjectType
    if (otherObjectType.prototype.isPrototypeOf(otherObject)) {
      let dx = this.position.x - otherObject.position.x;
      let dy = this.position.y - otherObject.position.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      // If this GameObject is intersecting with the other object
      if (distance < this.collisionRadius + otherObject.collisionRadius) {
        collidedWith = otherObject;
        break;
      }
    }
  }

  return collidedWith;
};

// Draws a circle representing the collisionRadius for debugging.
GameObject.prototype.drawCollider = function () {
  let context = gameManager.context;
  context.save();
  context.beginPath();
  context.beginPath();
  context.arc(this.position.x,this.position.y,this.collisionRadius,0,2*Math.PI);
  context.stroke();
  context.lineWidth = 2;
  context.strokeStyle = MAIN_COLOR;
  context.stroke();
  context.restore();
};

/**
 * Creates an instance of a PlayerShip which is a subclass of GameObject.
 * The PlayerShip is the player's avatar in the game and represents the player's
 * position, direction, velocity, acceleration, and collision radius.
 * The PlayerShip, will warp to the opposite side of the gameCanvas when it reaches an edge.
 * @constructor
 * @param {Vector2} position The PlayerShip's position vector.
 * @param {Vector2} direction The PlayerShip's direction vector.
 * @param {Vector2} velocity The PlayerShip's velocity vector.
 * @param {Vector2} acceleration The PlayerShip's acceleration vector.
 * @param {number} collisionRadius The PlayerShip's collisionRadius.
 * @return {PlayerShip} The new PlayerShip object.
 */
function PlayerShip(position, direction, velocity, acceleration, collisionRadius) {
  GameObject.call(this, position, direction, velocity, acceleration, collisionRadius);
}
// Set the PlayerShip prototype to an instance of the GameObject prototype to create an inheritance chain.
PlayerShip.prototype = Object.create(GameObject.prototype);
// Set the PlayerShip constructor to the Asteroid constructor method.
PlayerShip.prototype.constructor = PlayerShip;

/**
 * @override The update function from the GameObject superclass
 * Updates the PlayerShip's velocity based on its acceleration,
 * and it position based on it's velocity,
 * and warps the PlayerShip to the opposite side of the map if it reaches an edge.
 */
PlayerShip.prototype.update = function () {
  let canvas = gameManager.canvas;
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.velocity.lerp(Vector2.zero(), 0.01);
  this.acceleration.lerp(Vector2.zero(), 0.1);

  // Warp to opposite side of game area if intersecting with an edge.
  if (this.position.x > canvas.width) {
    this.position.x = 0;
  }
  if (this.position.x < 0) {
    this.position.x = canvas.width;
  }
  if (this.position.y > canvas.height) {
    this.position.y = 0;
  }
  if (this.position.y < 0) {
    this.position.y = canvas.height;
  }
};

/**
 * @override The draw function from the GameObject superclass
 * Draws the graphical representation of the PlayerShip at it's current position and rotation.
 */
PlayerShip.prototype.draw = function () {
  let context = gameManager.context;
  context.save();
  context.translate(this.position.x, this.position.y);
  let angle = Vector2.angleBetween(Vector2.up(), this.direction);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(this.direction.x, this.direction.y-SHIP_HEIGHT);
  context.lineTo(SHIP_WIDTH, SHIP_HEIGHT);
  context.lineTo(0, SHIP_WIDTH);
  context.lineTo(-SHIP_WIDTH, SHIP_HEIGHT);
  context.lineTo(0, -SHIP_HEIGHT);
  context.lineWidth = 2;
  context.strokeStyle = MAIN_COLOR;
  context.stroke();

  // If the ship is currently accellerating, then draw the thruster flame.
  if (this.acceleration.magnitude() > 0.04) {
    let thrustWidth = 2.5;
    let thrustMiddle = 2;
    let thrustHeight = 7;
    let shipTail = SHIP_HEIGHT;
    // Draw the thrust flame
    context.beginPath();
    context.moveTo(0, shipTail);
    context.lineTo(thrustWidth, shipTail + thrustMiddle);
    context.lineTo(0, shipTail + thrustHeight);
    context.lineTo(-thrustWidth, shipTail + thrustMiddle);
    context.lineTo(0, shipTail);
    //context.lineTo(0, shipTail);
    context.lineWidth = 2;
    context.strokeStyle = THRUST_COLOR;
    context.stroke();
  }
  context.restore();
};

/**
 * Creates an instance of a Projectile which is a subclass of GameObject.
 * Projectiles are spawned when the PlayerShip fires.
 * Projectiles can damage an Asteroid.
 * Unlike the PlayerShip and Asteroids, Projectiles do not warp to the other
 * side of the map when the reach an edge.
 * Instead they are destroyed when they reach an edge to make the game more
 * challenging and less visually cluttered.
 * @constructor
 * @param {Vector2} position The Projectile's position vector.
 * @param {Vector2} direction The Projectile's direction vector.
 * @param {Vector2} velocity The Projectile's velocity vector.
 * @param {Vector2} acceleration The Projectile's acceleration vector.
 * @param {number} collisionRadius The Projectile's collisionRadius.
 * @return {Projectile} The new Projectile object.
 */
function Projectile(position, direction, velocity, acceleration, collisionRadius) {
  GameObject.call(this, position, direction, velocity, acceleration, collisionRadius);
}
// Set the Projectile prototype to an instance of the GameObject prototype to create an inheritance chain.
Projectile.prototype = Object.create(GameObject.prototype);
// Set the Projectile constructor to the Asteroid constructor method.
Projectile.prototype.constructor = Projectile;

/**
 * @override The update function from the GameObject superclass
 * Updates the Projectile's position based on it's velocity,
 * and destroys the Projectile if it reaches an edge.
 */
Projectile.prototype.update = function () {
  // Get a reference to the game canvas
  let canvas = gameManager.canvas;
  // Update the projectile's position based on it's velocity.
  this.position.add(this.velocity);

  // If this projectile goes outside of the game area
  if (this.position.x > canvas.width ||
      this.position.x < 0 ||
      this.position.y > canvas.height ||
      this.position.y < 0) {
    // Remove this projectile from the array of gameObjects
    let index = gameManager.gameObjects.indexOf(this);
    gameManager.gameObjects.splice(index, 1);
  }
};

/**
 * @override the draw function from the GameObject superclass
 * Draws the graphical representation of the Projectile at it's current position and rotation.
 */
Projectile.prototype.draw = function () {
  let context = gameManager.context;
  let length = 5;
  context.save();
  context.translate(this.position.x, this.position.y);
  let angle = Vector2.angleBetween(Vector2.up(), this.direction);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, length);
  context.lineWidth = 2;
  context.strokeStyle = MAIN_COLOR;
  context.stroke();
  context.restore();
};

/**
 * Creates an instance of an Asteroid which is a subclass of GameObject.
 * Asteroids are GameObjects that the player must avoid colliding with.
 * The player must shoot at the Asteroids to damage them enough to destroy them and earn points.
 * When an Asteroid is destroyed, it spawns smaller child asteroids
 * (unless it was already the smallest size).
 * Like the PlayerShip, Asteroids will warp to the opposite side of the gameCanvas when they reach an edge.
 * @constructor
 * @param {Vector2} position The Asteroid's position vector.
 * @param {Vector2} direction The Asteroid's direction vector.
 * @param {Vector2} velocity The Asteroid's velocity vector.
 * @param {Vector2} acceleration The Asteroid's acceleration vector.
 * @param {number} collisionRadius The Asteroid's collision radius size.
 * @param {number} numSides The Asteroid's number of sides (Must be greater than 2).
 * @param {number} health The Asteroid's health.
 * @param {number} scoreValue The Asteroid's score value.
 * @return {Asteroid} The new Asteroid object.
 */
function Asteroid(position, direction, velocity, acceleration, collisionRadius, numSides, health, scoreValue) {
  GameObject.call(this, position, direction, velocity, acceleration, collisionRadius);
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'numSides' parameter.
    if (numSides === undefined) throw "The 'numSides' parameter is required!";
    // If the 'numSides' parameter is not a number.
    if (typeof numSides !== 'number') throw "The 'numSides' parameter must be a number.";
    // If the 'numSides' parameter is less than or equal to 2.
    if (numSides <= 2) throw "The 'numSides' parameter must be a positive number greater than 2.";
    // If no input was received for the 'health' parameter.
    if (health === undefined) throw "The 'health' parameter is required!";
    // If the 'health' parameter is not a number.
    if (typeof health !== 'number') throw "The 'health' parameter must be a number.";
    // If the 'health' parameter is less than or equal to 0.
    if (health <= 0) throw "The 'health' parameter must be a number greater than zero.";
    // If no input was received for the 'scoreValue' parameter.
    if (scoreValue === undefined) throw "The 'scoreValue' parameter is required!";
    // If the 'scoreValue' parameter is not a number.
    if (typeof scoreValue !== 'number') throw "The 'scoreValue' parameter must be a number.";
    // If the 'scoreValue' parameter is less than or equal to 0.
    if (scoreValue <= 0) throw "The 'scoreValue' parameter must be a number greater than zero.";
  }
  catch (e) {
    console.log(e);
  }
  // *** END INPUT VALIDATION ***

  // Set the Asteroid's properties
  this.numSides = numSides;
  this.health = health;
  this.scoreValue = scoreValue;
}
// Set the Asteroid prototype to an instance of the GameObject prototype to create an inheritance chain.
Asteroid.prototype = Object.create(GameObject.prototype);
// Set the Asteroid constructor to the Asteroid constructor method.
Asteroid.prototype.constructor = Asteroid;

/**
 * Constants for the number of sides of the three sizes of Asteroid
 * Used for instantiating and comparing Asteroids of different sizes.
 * @static
 */
Asteroid.smallNumSides = 3;
Asteroid.mediumNumSides = 4;
Asteroid.largeNumSides = 5;

/**
 * Creates an instance of a small Asteroid with default values for small
 * This lets us instantiate a named configuration so it's easier
 * to see what the components mean and allows for easier simple code reuse.
 * @static
 */
Asteroid.createSmall = function () {
  return new Asteroid(Vector2.zero(), // position
                      Vector2.up(), // direction
                      Vector2.zero(), // velocity
                      Vector2.zero(), // acceleration
                      20, // collisionRadius
                      Asteroid.smallNumSides, // numSides
                      1, // health
                      10); // scoreValue
};

/**
 * Creates an instance of a medium Asteroid with default values for medium
 * This lets us instantiate a named configuration so it's easier
 * to see what the components mean and allows for easier simple code reuse.
 * @static
 */
Asteroid.createMedium = function () {
  return new Asteroid(Vector2.zero(), // position
                      Vector2.up(), // direction
                      Vector2.zero(), // velocity
                      Vector2.zero(), // acceleration
                      25, // collisionRadius
                      Asteroid.mediumNumSides, // numSides
                      2, // health
                      20); // scoreValue
};

/**
 * Creates an instance of a large Asteroid with default values for large
 * This lets us instantiate a named configuration so it's easier
 * to see what the components mean and allows for easier simple code reuse.
 * @static
 */
Asteroid.createLarge = function () {
  return new Asteroid(Vector2.zero(), // position
                      Vector2.up(), // direction
                      Vector2.zero(), // velocity
                      Vector2.zero(), // acceleration
                      30, // collisionRadius
                      Asteroid.largeNumSides, // numSides
                      3, // health
                      30); // scoreValue
};

/**
 * @override The update function from the GameObject superclass
 * Updates the asteroid's position based on it's velocity,
 * rotates it by the constant for asteroid rotation speed
 * and warps the asteroid to the opposite side of the map if it reaches an edge.
 */
Asteroid.prototype.update = function () {
  // Get a reference to the game canvas
  let canvas = gameManager.canvas;
  // Update the Asteroid's position based on it's velocity.
  this.position.add(this.velocity);

  this.direction.rotate(ASTEROID_ROTATION_SPEED);

  // Warp to opposite side of game area if intersecting with an edge.
  if (this.position.x > canvas.width) {
    this.position.x = 0;
  }
  if (this.position.x < 0) {
    this.position.x = canvas.width;
  }
  if (this.position.y > canvas.height) {
    this.position.y = 0;
  }
  if (this.position.y < 0) {
    this.position.y = canvas.height;
  }
};

/**
 * @override the draw function from the GameObject superclass
 * Draws the graphical representation of the Asteroid at it's current position and rotation.
 */
Asteroid.prototype.draw = function () {
  let context = gameManager.context;
  context.save();
  context.translate(this.position.x, this.position.y);
  // Calculate the angle between the global 'up' vector and this Asteroid's current direction.
  let angle = Vector2.angleBetween(Vector2.up(), this.direction);
  // Rotate the canvas by the calculated angle.
  context.rotate(angle);
  context.beginPath();
  // Create a vector that points in the global 'up' direction and has a magnitude equal to the collisionRadius of this Asteroid.
  let polygonPointVector = Vector2.multiply(Vector2.up(), this.collisionRadius);
  // Move the the end of the vector.
  context.moveTo(polygonPointVector.x, polygonPointVector.y);
  /* Calculate the angle segment between points by
   * dividing the circumference by the number of sides to draw
   */
  angle = (2 * Math.PI) / this.numSides;
  // Loop 'numSides' times
  for (let i = 0; i <= this.numSides; i++) {
    // Create a line to the end of the polygonPointVector
    context.lineTo(polygonPointVector.x, polygonPointVector.y);
    // Rotate the polygonPointVector by the angle segment calculated above
    polygonPointVector.rotate(angle);
  }
  context.lineWidth = 2;
  context.strokeStyle = MAIN_COLOR;
  context.stroke();
  context.restore();
};

/*
Full application testing

Load page:
Expecting menu presenting the game's title and the controls,
with note to press the space bar to begin.
Result: pass.

Press space bar on start menu of game:
Expecting game to begin and asteroids to spawn.
Result: pass.

Press other controls on start menu of game:
Expecting other controls to do nothing.
Result: pass.

Game begins:
Expecting Asteroids are spawned with random positions and velocities.
Asteroids begin moving in the direction of their velocity and rotating clockwise.
Result: pass.

Press escape in game:
Expecting the game to stop and the pause menu to appear and other controls to be ignored.
Result: pass.

Press other controls on pause menu:
Expecting other controls to do nothing.
Result: pass.

Press escape on pause menu:
Expecting pause menu to disappear and the game to resume and other controls begin working again.
Result: pass.

Press up in game:
Expecting ship to accellerate in the direction it is facing.
Result: pass.

Once ship is moving player does nothing:
Expecting ship to continue moving in the direction of it's velocity vector,
but velocity should slowly decrease to zero and stop.
Result: pass.

Press left or right in game:
Expecting ship to rotate in the respective direction of the control.
Result: pass.

Press space in game:
Expecting ship to fire projectile in the direction it is facing.
Result: pass.

Projetile hits Asteroid:
Expecting when 3 shots hit large, 2 hit medium, or 1 hits small,
the asteroid is destroyed and spawns two of the next smallest size asteroid in its place.
Player score goes up by first asteroid's score worth.
Result: pass.

Player hits Asteroid:
Expecting player ship to reset position at center of map.
Life count to go down.
If last life, game over menu is displayed.
Result: pass.

Press escape on game over menu:
Expecting game over menu to disappear and the game to reset its state and other controls begin working again.
Result: pass.

Press other controls on game over menu:
Expecting other controls to do nothing.
Result: pass.

Player or Asteroid cross edge of canvas:
Expecting warp to other side of canvas to stay in view and maintain velocity.
Result: pass.

Projectile cross edge of canvas:
Expecting projectile to be destroyed.
Result: pass.
*/
