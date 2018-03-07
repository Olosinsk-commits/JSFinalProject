/**
 * @author Noah Greer <Noah.Greer@gmail.com>
 * 02/19/2018
 * Winter 2018
 * CSD 122 - JavaScript & jQuery
 * Group Project - Group 3 (Olga Osinskaya, Noah Greer, and Topher Gidos)
 *
 * Code to play a game of Asteroids.
 */

const KEY_CODES = {27: 'escape', 32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down'};
const FONT_SIZE = 20; // 20px font size
const BG_COLOR = '#000000'; // Black background color
const MAIN_COLOR = '#FFFFFF'; // White main color
const THRUST_COLOR = '#FFFF00'; // Yellow thruster color
const SHIP_WIDTH = 5;
const SHIP_HEIGHT = 10;

$(document).ready(function() {
    $(window).keydown(function(e) {
      getInput(e);
    }).keyup(function(e) {
      getInput(e);
    });
    gameManager.start();
  });

var gameManager = {
    // Get reference to game canvas.
    canvas : null,
    start : function() {
        this.canvas = $("#gameCanvas").get(0);
        // Check whether canvas is available in the browser.
        if (this.canvas.getContext) {
          this.context = this.canvas.getContext('2d');
          // Array to store the controls states
          this.CONTROLS_STATE = {};
          // Initialize the array with the keys as all being false
          for (keyCode in KEY_CODES) {
            this.CONTROLS_STATE[KEY_CODES[keyCode]] = false;
          }
          this.gamePaused = false;
          this.playerLives = 3;
          this.playerScore = 0;
          this.fireRate = 125;
          this.nextFire = 0;
          this.gameObjects = [];
          this.playerShip = new PlayerShip(new Vector2(this.canvas.width/2, this.canvas.height/2), // position
                                           Vector2.up(), // direction
                                           Vector2.zero(), // velocity
                                           Vector2.zero(), // acceleration
                                           12); // collisionRadius
          this.gameObjects.push(this.playerShip);

          this.gameObjects.push(new Asteroid(new Vector2(this.canvas.width/3, this.canvas.height/3), // position
                                             Vector2.up(), // direction
                                             Vector2.zero(), // velocity
                                             Vector2.zero(), // acceleration
                                             20, // collisionRadius
                                             3, // numSides
                                             10) // scoreValue
          );
          this.gameObjects.push(new Asteroid(new Vector2(this.canvas.width/2, this.canvas.height/3), // position
                                             Vector2.up(), // direction
                                             Vector2.zero(), // velocity
                                             Vector2.zero(), // acceleration
                                             25, // collisionRadius
                                             4, // numSides
                                             20) // scoreValue
          );
          this.gameObjects.push(new Asteroid(new Vector2(this.canvas.width*2/3, this.canvas.height/3), // position
                                             Vector2.up(), // direction
                                             Vector2.zero(), // velocity
                                             Vector2.zero(), // acceleration
                                             30, // collisionRadius
                                             5, // numSides
                                             30) // scoreValue
          );
          this.showColliders = false;
          requestAnimationFrame(update);
        } else {
          // Log that we could not get a reference to the context.
          console.log("Could not get canvas context. Browser does not support HTML5 canvas.");
        }
    }
}

function update(time) {
  handleInput(time);
  drawBackground();
  for (let i = 0; i < gameManager.gameObjects.length; i++) {
    let go = gameManager.gameObjects[i];
    if (!gameManager.gamePaused) {
      go.update();
      checkCollisions(go);
    }
    go.draw();
    if (gameManager.showColliders) {
      go.drawCollider();
    }
  }

  drawLives();
  drawScore();
  requestAnimationFrame(update);
}

/**
 * Draws the black background for the game.
 * This also serves the purpose of clearing the entire canvas.
 */
function drawBackground() {
  let context = gameManager.context;
  let canvas = gameManager.canvas;
  context.fillStyle = BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Checks the collisions of the input game object.
 */
function checkCollisions(go) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'go' parameter.
    if (go === undefined) throw "The 'go' parameter is required!";
    // If the 'go' parameter is not a GameObject.
    if (!go instanceof GameObject) throw "The 'go' parameter must be a GameObject object.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  if (go instanceof Asteroid) {
    // Get the Projectile this collided with (if any)
    let collidedWithProjectile = go.checkCollisionWith(Projectile);
    if (collidedWithProjectile) {
      // Remove this Asteroid from the array of gameObjects
      let index = gameManager.gameObjects.indexOf(go);
      gameManager.gameObjects.splice(index, 1);
      // Remove the projectile from the array of gameObjects
      index = gameManager.gameObjects.indexOf(collidedWithProjectile);
      gameManager.gameObjects.splice(index, 1);
      // Increase the player's score by this Asteroid's score value.
      gameManager.playerScore += go.scoreValue;
    }
  }

  if (go instanceof PlayerShip) {
    // Get the Asteroid this collided with (if any)
    let collidedWithAsteroid = go.checkCollisionWith(Asteroid)
    if (collidedWithAsteroid) {
      // Move the player ship to the starting position and remove a life.
      go.position.x = gameManager.canvas.width/2;
      go.position.y = gameManager.canvas.height/2;
      go.direction = Vector2.up();
      go.velocity = Vector2.zero();
      go.acceleration = Vector2.zero();
      // Decrease the player's lives by 1.
      gameManager.playerLives--;
    }
  }
}

/**
 * Draws the player's available lives.
 */
function drawLives() {
  let canvas = gameManager.canvas;
  let context = gameManager.context;
  context.font = FONT_SIZE + "px Arial";
  context.fillStyle = "#FFFFFF";
  context.textAlign = "left";
  let livesText = "Lives: ";
  let textWidth = context.measureText(livesText).width;
  context.fillText(livesText, 2, FONT_SIZE * 2);

  // Loop 'playerLives' times to draw the ship avatar once per life.
  for (let i = 0; i < gameManager.playerLives; i++) {
    context.save();
    // Offset the position from the lives text by a multiple of the ship's width to space them out evenly.
    context.translate(textWidth + (2 * SHIP_WIDTH) + (4 * SHIP_WIDTH * i), FONT_SIZE * 2);
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
  let canvas = gameManager.canvas;
  context.font = FONT_SIZE + "px Arial";
  context.fillStyle = "#FFFFFF";
  context.textAlign = "left";
  let scoreText = "Score: " + gameManager.playerScore;
  context.fillText(scoreText, 0, FONT_SIZE);
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
    gameManager.CONTROLS_STATE[KEY_CODES[e.keyCode]] = e.type === "keydown" ? true : false;
  }
}

function handleInput(time) {
  let ship = gameManager.playerShip;
  let acceleration = 2;
  let rotationAngle = 3 * (Math.PI / 180);
  if (gameManager.CONTROLS_STATE.escape) {
    // Pause the game.
    gameManager.gamePaused = !gameManager.gamePaused;
  }
  if (!gameManager.gamePaused) {
    if (gameManager.CONTROLS_STATE.up) {
      // Accellerate the ship in the direction it is currently facing.
      ship.acceleration = Vector2.lerp(ship.acceleration, Vector2.multiply(ship.direction, acceleration), 0.005);
      ship.acceleration.clampMagnitude(3);
    }
    /*
    if (gameManager.CONTROLS_STATE.down) {
      // do nothing.
    }
    */
    if (gameManager.CONTROLS_STATE.left) {
      ship.direction.rotate(-rotationAngle);
    }
    if (gameManager.CONTROLS_STATE.right) {
      ship.direction.rotate(rotationAngle);
    }
    if (gameManager.CONTROLS_STATE.space) {
      // If enough time has passed between the last fire and this one
      if (time > gameManager.nextFire) {
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
  } else {
    if (gameManager.CONTROLS_STATE.up) {gameManager.CONTROLS_STATE.up = false;}
    if (gameManager.CONTROLS_STATE.left) {gameManager.CONTROLS_STATE.left = false;}
    if (gameManager.CONTROLS_STATE.right) {gameManager.CONTROLS_STATE.right = false;}
    if (gameManager.CONTROLS_STATE.space) {gameManager.CONTROLS_STATE.space = false;}
  }
}

/**
 * Creates an instance of a Vector2 with an x and y component.
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
    console.log(e.message);
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
}

/**
 * Creates a new Vector2 object with the default values for down.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.down = function () {
  return new Vector2(0, 1);
}

/**
 * Creates a new Vector2 object with the default values for left.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.left = function () {
  return new Vector2(-1, 0);
}

/**
 * Creates a new Vector2 object with the default values for right.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.right = function () {
  return new Vector2(1, 0);
}

/**
 * Creates a new Vector2 object with the default values for up.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Vector2.up = function () {
  return new Vector2(0, -1);
}

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
    if (!fromV instanceof Vector2) throw "The 'fromV' parameter must be a Vector2 object.";
    // If no input was received for the 'toV' parameter.
    if (toV === undefined) throw "The 'toV' parameter is required!";
    // If the 'toV' parameter is not a Vector2.
    if (!toV instanceof Vector2) throw "The 'toV' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  // Calculate the dot product.
  let dot = fromV.x * toV.x + fromV.y * toV.y;
  // Calculate the determinant.
  let det = fromV.x * toV.y - fromV.y * toV.x;
  // Calculate the angle.
  let angle = Math.atan2(det, dot);
  return angle;
}

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
    if (!vector instanceof Vector2) throw "The 'vector' parameter must be a Vector2 object.";
    // If no input was received for the 'scalar' parameter.
    if (scalar === undefined) throw "The 'scalar' parameter is required!";
    // If the 'scalar' parameter is not a number.
    if (typeof scalar !== 'number') throw "The 'scalar' parameter must be a number.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  return new Vector2 (vector.x * scalar, vector.y * scalar);
}

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
    if (!vectorA instanceof Vector2) throw "The 'vectorA' parameter must be a Vector2 object.";
    // If no input was received for the 'vectorB' parameter.
    if (vectorB === undefined) throw "The 'vectorB' parameter is required!";
    // If the 'vectorB' parameter is not a Vector2.
    if (!vectorB instanceof Vector2) throw "The 'vectorB' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  // Return a new vector with components equal to the sum of the two input vector's components.
  return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
}

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
    if (!vectorA instanceof Vector2) throw "The 'vectorA' parameter must be a Vector2 object.";
    // If no input was received for the 'vectorB' parameter.
    if (vectorB === undefined) throw "The 'vectorB' parameter is required!";
    // If the 'vectorB' parameter is not a Vector2.
    if (!vectorB instanceof Vector2) throw "The 'vectorB' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  // Return a new vector with components equal to the difference of the two input vector's components.
  return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
}

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
    if (!vector instanceof Vector2) throw "The 'vector' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  let result = vector;
  let m = vector.magnitude();
  if (m > 0) {
    result = Vector2.multiply(vector, 1/m);
  }
  return result;
}

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
    if (!fromV instanceof Vector2) throw "The 'fromV' parameter must be a Vector2 object.";
    // If no input was received for the 'toV' parameter.
    if (toV === undefined) throw "The 'toV' parameter is required!";
    // If the 'toV' parameter is not a Vector2.
    if (!toV instanceof Vector2) throw "The 'toV' parameter must be a Vector2 object.";
    // If no input was received for the 'percent' parameter.
    if (percent === undefined) throw "The 'percent' parameter is required!";
    // If the 'percent' parameter is not a number.
    if (typeof percent !== 'number') throw "The 'percent' parameter must be a number.";
    // If the 'percent' parameter is not between 0 and 1 (inclusive).
    if (percent < 0 || percent > 1) throw "The 'percent' parameter must be between 0 and 1 (inclusive).";
  }
  catch (e) {
    console.log(e.message);
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
}

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
    if (!otherVector instanceof Vector2) throw "The 'otherVector' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  this.x += otherVector.x;
  this.y += otherVector.y;
}

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
    if (!otherVector instanceof Vector2) throw "The 'otherVector' parameter must be a Vector2 object.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  this.x -= otherVector.x;
  this.y -= otherVector.y;
}

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
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  this.x *= scalar;
  this.y *= scalar;
}

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
    console.log(e.message);
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
}

/**
 * Calculates the magnitude (length) of this vector.
 * @return {number} The magnitude (length) of this vector.
 */
Vector2.prototype.magnitude = function () {
  // Return the magnitude of the vector calculated using the pythagorean theorem.
  return Math.sqrt(this.x * this.x + this.y * this.y);
}

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
}

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
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  if (this.magnitude() > max) {
    this.normalize();
    this.multiply(max);
  }
}

/**
 * Sets this vector's components to new interpolated values between it and the to vector by the provided percent.
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
    if (!toV instanceof Vector2) throw "The 'toV' parameter must be a Vector2 object.";
    // If no input was received for the 'percent' parameter.
    if (percent === undefined) throw "The 'percent' parameter is required!";
    // If the 'percent' parameter is not a number.
    if (typeof percent !== 'number') throw "The 'percent' parameter must be a number.";
    // If the 'percent' parameter is not between 0 and 1 (inclusive).
    if (percent < 0 || percent > 1) throw "The 'percent' parameter must be between 0 and 1 (inclusive).";
  }
  catch (e) {
    console.log(e.message);
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
}

/**
 * Creates an instance of a GameObject.
 * @constructor
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
    if (!position instanceof Vector2) throw "The 'position' parameter must be a Vector2 object.";
    // If no input was received for the 'direction' parameter.
    if (direction === undefined) throw "The 'direction' parameter is required!";
    // If the 'direction' parameter is not a Vector2.
    if (!direction instanceof Vector2) throw "The 'direction' parameter must be a Vector2 object.";
    // If no input was received for the 'velocity' parameter.
    if (velocity === undefined) throw "The 'velocity' parameter is required!";
    // If the 'velocity' parameter is not a Vector2.
    if (!velocity instanceof Vector2) throw "The 'velocity' parameter must be a Vector2 object.";
    // If no input was received for the 'acceleration' parameter.
    if (acceleration === undefined) throw "The 'acceleration' parameter is required!";
    // If the 'acceleration' parameter is not a Vector2.
    if (!acceleration instanceof Vector2) throw "The 'acceleration' parameter must be a Vector2 object.";
    // If no input was received for the 'collisionRadius' parameter.
    if (collisionRadius === undefined) throw "The 'collisionRadius' parameter is required!";
    // If the 'collisionRadius' parameter is not a number.
    if (typeof collisionRadius !== 'number') throw "The 'collisionRadius' parameter must be a number.";
    // If the 'collisionRadius' parameter is less than or equal to 0.
    if (collisionRadius <= 0) throw "The 'collisionRadius' parameter must be a positive number greater than zero.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  // Set the new GameObject's properties.
  this.position = position;
  this.direction = direction;
  this.velocity = velocity;
  this.acceleration = acceleration;
  this.collisionRadius = collisionRadius;

  // Log that the new GameObject was created sucessfully.
  console.log("Created new GameObject: position: " + JSON.stringify(this.position) +
                                   ", direction: " + JSON.stringify(this.direction) +
                                    ", velocity: " + JSON.stringify(this.velocity) +
                                ", acceleration: " + JSON.stringify(this.acceleration) +
                             ", collisionRadius: " + JSON.stringify(this.collisionRadius));
}

// Abstract update method for the GameObject base class.
GameObject.prototype.update = function () {
  try {
    throw "Cannot instantiate abstract class";
  }
  catch (e) {
    console.log(e.message);
  }
};

// Abstract draw method for the GameObject base class.
GameObject.prototype.draw = function () {
  try {
    throw "Cannot instantiate abstract class";
  }
  catch (e) {
    console.log(e.message);
  }
};

/**
 * Checks whether this game object collided with another game object that matches otherObjectType.
 * @param {GameObject} otherObjectType Takes the constructor name of the object to check collision with.
 * @return {?GameObject} The matching object that collided with this one.
 */
GameObject.prototype.checkCollisionWith = function (otherObjectType) {
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'otherObjectType' parameter.
    if (otherObjectType === undefined) throw "The 'otherObjectType' parameter is required!";
    // If the 'otherObjectType' parameter is not a GameObject.
    if (!otherObjectType instanceof GameObject) throw "The 'otherObjectType' parameter must be a GameObject object.";
  }
  catch (e) {
    console.log(e.message);
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

// Draws a circle representing the collisionRadius
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
 * Creates an instance of a PlayerShip.
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
PlayerShip.prototype = Object.create(GameObject.prototype);
PlayerShip.prototype.constructor = PlayerShip;

/** @override The update function from the GameObject superclass */
PlayerShip.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.velocity.lerp(Vector2.zero(), 0.01);
  this.acceleration.lerp(Vector2.zero(), 0.1);

  // Warp to opposite side of game area if bumping against edge.
  if (this.position.x > gameCanvas.width) {
    this.position.x = 0;
  }
  if (this.position.x < 0) {
    this.position.x = gameCanvas.width;
  }
  if (this.position.y > gameCanvas.height) {
    this.position.y = 0;
  }
  if (this.position.y < 0) {
    this.position.y = gameCanvas.height;
  }
};

/** @override The draw function from the GameObject superclass */
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

  // If the ship is currently accellerating draw the thruster flame.
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
 * Creates an instance of a Projectile.
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
Projectile.prototype = Object.create(GameObject.prototype);
Projectile.prototype.constructor = Projectile;

/** @override The update function from the GameObject superclass */
Projectile.prototype.update = function () {
  // Update the projectile's position based on it's velocity.
  this.position.add(this.velocity);

  // If this projectile goes outside of the game area
  if (this.position.x > gameCanvas.width ||
      this.position.x < 0 ||
      this.position.y > gameCanvas.height ||
      this.position.y < 0) {
    // Remove this projectile from the array of gameObjects
    let index = gameManager.gameObjects.indexOf(this);
    gameManager.gameObjects.splice(index, 1);
  }
}

/** @override the draw function from the GameObject superclass */
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
 * Creates an instance of an Asteroid.
 * @constructor
 * @param {Vector2} position The Projectile's position vector.
 * @param {Vector2} direction The Projectile's direction vector.
 * @param {Vector2} velocity The Projectile's velocity vector.
 * @param {Vector2} acceleration The Projectile's acceleration vector.
 * @param {number} collisionRadius The Projectile's collision radius size.
 * @param {number} numSides The Projectile's number of sides.
 * @param {number} scoreValue The Projectile's score value.
 * @return {Asteroid} The new Asteroid object.
 */
function Asteroid(position, direction, velocity, acceleration, collisionRadius, numSides, scoreValue) {
  GameObject.call(this, position, direction, velocity, acceleration, collisionRadius);
  // *** BEGIN INPUT VALIDATION ***
  try {
    // If no input was received for the 'numSides' parameter.
    if (numSides === undefined) throw "The 'numSides' parameter is required!";
    // If the 'numSides' parameter is not a number.
    if (typeof numSides !== 'number') throw "The 'numSides' parameter must be a number.";
    // If the 'numSides' parameter is less than or equal to 2.
    if (numSides <= 2) throw "The 'numSides' parameter must be a positive number greater than 2.";
    // If no input was received for the 'scoreValue' parameter.
    if (scoreValue === undefined) throw "The 'scoreValue' parameter is required!";
    // If the 'scoreValue' parameter is not a number.
    if (typeof scoreValue !== 'number') throw "The 'scoreValue' parameter must be a number.";
    // If the 'scoreValue' parameter is less than or equal to 0.
    if (scoreValue <= 0) throw "The 'scoreValue' parameter must be a positive number greater than zero.";
  }
  catch (e) {
    console.log(e.message);
  }
  // *** END INPUT VALIDATION ***

  this.numSides = numSides;
  this.scoreValue = scoreValue;
}
Asteroid.prototype = Object.create(GameObject.prototype);
Asteroid.prototype.constructor = Asteroid;

/** @override The update function from the GameObject superclass */
Asteroid.prototype.update = function () {
  // Update the Asteroid's position based on it's velocity.
  this.position.add(this.velocity);

  let rotationAngle = 0.5 * (Math.PI / 180);
  this.direction.rotate(rotationAngle);

  // Warp to opposite side of game area if bumping against edge.
  if (this.position.x > gameCanvas.width) {
    this.position.x = 0;
  }
  if (this.position.x < 0) {
    this.position.x = gameCanvas.width;
  }
  if (this.position.y > gameCanvas.height) {
    this.position.y = 0;
  }
  if (this.position.y < 0) {
    this.position.y = gameCanvas.height;
  }
}

/** @override the draw function from the GameObject superclass */
Asteroid.prototype.draw = function () {
  let context = gameManager.context;
  context.save();
  context.translate(this.position.x, this.position.y);
  let angle = Vector2.angleBetween(Vector2.up(), this.direction);
  context.rotate(angle);
  context.beginPath();
  let polygonPointVector = Vector2.multiply(Vector2.up(), this.collisionRadius);
  context.moveTo(polygonPointVector.x, polygonPointVector.y);
  angle = (2 * Math.PI) / this.numSides;
  for (let i = 0; i <= this.numSides; i++) {
    context.lineTo(polygonPointVector.x, polygonPointVector.y);
    polygonPointVector.rotate(angle);
  }
  context.lineWidth = 2;
  context.strokeStyle = MAIN_COLOR;
  context.stroke();
  context.restore();
};

/**
 * Creates a new Vector2 object with the default values for zero.
 * @return {Vector2} The new Vector2 object.
 * @static
 */
Asteroid.small = function () {
  return new Vector2(0, 0);
}
