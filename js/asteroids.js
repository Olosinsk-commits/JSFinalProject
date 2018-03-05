/**
 * @author Noah Greer <Noah.Greer@gmail.com>
 * 02/19/2018
 * Winter 2018
 * CSD 122 - JavaScript & jQuery
 * Group Project - Group 3 (Olga Osinskaya, Noah Greer, and Topher Gidos)
 *
 * Code to play a game of Asteroids.
 */

const KEY_CODES = {32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down'};

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
          this.fireRate = 125;
          this.nextFire = 0;
          this.playerShip = new PlayerShip(new Vector2(this.canvas.width/2, this.canvas.height/2), // position
                                           Vector2.up(), // direction
                                           new Vector2(0, 0), // velocity
                                           new Vector2(0, 0), // acceleration
                                           20); // collisionRadius
          this.gameObjects = [this.playerShip];

          this.gameObjects.push(new Asteroid(new Vector2(this.canvas.width/3, this.canvas.height/3), // position
                                             Vector2.up(), // direction
                                             new Vector2(0, 0), // velocity
                                             new Vector2(0, 0), // acceleration
                                             15) // collisionRadius
          );
          this.showColliders = false;
          requestAnimationFrame(update);
        } else {
          // Log that we could not get a reference to the context.
          console.log("Could not get canvas context. Browser does not support HTML5 canvas.");
        }
    }
}

function update() {
  handleInput();
  drawBackground();
  for (let i = 0; i < gameManager.gameObjects.length; i++) {
    let go = gameManager.gameObjects[i];
    go.update();
    go.draw();
    if (gameManager.showColliders) {
      go.drawCollider();
    }
    if (go instanceof Asteroid) {
      //
    }
  }
  //drawVector(gameManager.playerShip.direction);
  drawHealth();
  drawScore();
  requestAnimationFrame(update);
}

/**
 * Clears the game canvas by drawing a black rectangle over the entire canvas.
 */
function drawBackground() {
  let context = gameManager.context;
  let canvas = gameManager.canvas;
  context.fillStyle="#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHealth() {
  let context = gameManager.context;
  let fontSize = 20;
  context.font = fontSize + "px Arial";
  context.fillStyle = "#FFFFFF";
  context.textAlign = "left";
  let health = 100;
  let healthText = "Health: " + health;
  context.fillText(healthText, 2, fontSize);
}

function drawScore() {
  let context = gameManager.context;
  let canvas = gameManager.canvas;
  let fontSize = 20;
  context.font = fontSize + "px Arial";
  context.fillStyle = "#FFFFFF";
  context.textAlign = "right";
  let score = 100;
  let scoreText = "Score: " + score;
  context.fillText(scoreText, canvas.width - 2, fontSize);
}

function drawVector(vector) {
  let context = gameManager.context;
  let ship = gameManager.playerShip;
  let vectorDrawLength = 30;
  context.save();
  context.beginPath();
  context.moveTo(ship.position.x, ship.position.y);
  context.lineTo(ship.position.x + vector.x * vectorDrawLength,
                 ship.position.y + vector.y * vectorDrawLength);
  context.lineWidth = 2;
  context.strokeStyle = '#FFFFFF';
  context.stroke();
  context.restore();
}

function getInput(e) {
  if (KEY_CODES[e.keyCode]) {
    e.preventDefault();
    gameManager.CONTROLS_STATE[KEY_CODES[e.keyCode]] = e.type === "keydown" ? true : false;
  }
}

function handleInput() {
  let ship = gameManager.playerShip;
  let acceleration = 3;
  let rotationAngle = 3 * (Math.PI / 180);
  if (gameManager.CONTROLS_STATE.up) {
    // Accellerate the ship in the direction it is currently facing.
    ship.acceleration.add(Vector2.multiply(ship.direction, acceleration));
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
    if (Date.now() > gameManager.nextFire) {
        gameManager.nextFire = Date.now() + gameManager.fireRate;
        let projectileVelocity = 3;
        let proj = new Projectile(Vector2.add(ship.position, Vector2.multiply(ship.direction, ship.collisionRadius)), // position
                                                    new Vector2(ship.direction.x, ship.direction.y), // direction
                                                    Vector2.multiply(ship.direction, projectileVelocity), // velocity
                                                    new Vector2(0, 0), // acceleration
                                                    1); // collisionRadius
        gameManager.gameObjects.push(proj);
    }
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
  return new Vector2 (vectorA.x + vectorB.x, vectorA.y + vectorB.y);
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
   * Store the current value of the components
   * Because the rotation calculations below are
   * interdependent on each component's value.
   */
  let x = this.x;
  let y = this.y;

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
  this.x = x * cosAngle - y * sinAngle;
  this.y = x * sinAngle + y * cosAngle;
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
    if (max <= 0) throw "The 'max' parameter must be a positive number greater than zero.";
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

// Draws a circle representing the collisionRadius
GameObject.prototype.drawCollider = function () {
  let context = gameManager.context;
  context.save();
  context.beginPath();
  context.beginPath();
  context.arc(this.position.x,this.position.y,this.collisionRadius,0,2*Math.PI);
  context.stroke();
  context.lineWidth = 2;
  context.strokeStyle = '#FFFFFF';
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
  this.velocity.clampMagnitude(3);
  this.position.add(this.velocity);

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
  let shipWidth = 10;
  let shipHeight = 20;
  context.save();
  context.translate(this.position.x, this.position.y);
  let angle = Vector2.angleBetween(Vector2.up(), this.direction);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(this.direction.x, this.direction.y-shipHeight);
  context.lineTo(shipWidth, shipHeight);
  context.lineTo(0, shipWidth);
  context.lineTo(-shipWidth, shipHeight);
  context.lineTo(0, -shipHeight);
  context.lineWidth = 3;
  context.strokeStyle = '#FFFFFF';
  context.stroke();
  // If the ship is currently accellerating
  if (gameManager.CONTROLS_STATE.up) {
    let thrustWidth = 5;
    let thrustHeight = 20;
    // Draw the thrust flame
    context.beginPath();
    context.moveTo(0, shipHeight-this.direction.y - thrustWidth);
    context.lineTo(thrustWidth, thrustHeight);
    context.lineTo(0, 30);
    context.lineTo(-thrustWidth, thrustHeight);
    context.lineTo(0, shipHeight-this.direction.y - thrustWidth);
    context.lineWidth = 2;
    context.strokeStyle = '#FFFF00';
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
  let length = 10;
  context.save();
  context.beginPath();
  context.moveTo(this.position.x, this.position.y);
  context.lineTo(this.position.x + this.direction.x * length,
                         this.position.y + this.direction.y * length);
  context.lineWidth = 2;
  context.strokeStyle = '#FFFFFF';
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
 * @param {number} collisionRadius The Projectile's collisionRadius.
 * @return {Asteroid} The new Projectile object.
 */
function Asteroid(position, direction, velocity, acceleration, collisionRadius) {
  GameObject.call(this, position, direction, velocity, acceleration, collisionRadius);
}
Asteroid.prototype = Object.create(GameObject.prototype);
Asteroid.prototype.constructor = Asteroid;

/** @override The update function from the GameObject superclass */
Asteroid.prototype.update = function () {
  // Update the Asteroid's position based on it's velocity.
  this.position.add(this.velocity);

  let rotationAngle = 3 * (Math.PI / 180);
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
  let length = 10;
  context.save();
  context.beginPath();
  context.moveTo(this.position.x,
                 this.position.y - this.collisionRadius);
  context.lineTo(this.position.x - this.collisionRadius,
                 this.position.y);
  context.lineTo(this.position.x,
                 this.position.y + this.collisionRadius);
  context.lineTo(this.position.x + this.collisionRadius,
                 this.position.y);
  context.lineTo(this.position.x,
                 this.position.y - this.collisionRadius);
  context.lineWidth = 2;
  context.strokeStyle = '#FFFFFF';
  context.stroke();
  context.restore();
};
