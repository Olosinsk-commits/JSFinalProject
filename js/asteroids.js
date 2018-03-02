/**
 * @author Noah Greer <Noah.Greer@gmail.com>
 * 02/19/2018
 * Winter 2018
 * CSD 122 - JavaScript & jQuery
 * Group Project - Group 3 (Olga Osinskaya, Noah Greer, and Topher Gidos)
 *
 * Code to play a game of Asteroids.
 */

const keyCodes = {space: 32, left: 37, up: 38, right: 39, down: 40};

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
          this.ctx = this.canvas.getContext('2d');
          this.playerShip = new PlayerShip(new Vector2(this.canvas.width/2, this.canvas.height/2), // position
                                           Vector2.up(), // direction
                                           new Vector2(0, 0), // velocity
                                           new Vector2(0, 0), // acceleration
                                           1); // collisionRadius
          this.controls = {space: false, left: false, up: false, right: false, down: false};
          this.gameObjects = [this.playerShip];
          requestAnimationFrame(update);
        } else {
          // Log that we could not get a reference to the context.
          console.log("Could not get canvas context. Browser does not support HTML5 canvas.");
        }
    }
}

function update() {
  handleInput();
  clearCanvas();
  drawBackground();
  for (go of gameManager.gameObjects) {
    go.update();
    go.draw();
  }
  //drawVector(gameManager.playerShip.direction);
  drawHealth();
  drawScore();
  requestAnimationFrame(update);
}

function clearCanvas() {
  gameManager.ctx.clearRect(0, 0, gameManager.canvas.width, gameManager.canvas.height);
}

function drawBackground() {
  gameManager.ctx.fillStyle="#000000";
  gameManager.ctx.fillRect(0, 0, gameManager.canvas.width, gameManager.canvas.height);
}

function drawHealth() {
  let fontSize = 20;
  gameManager.ctx.font = fontSize + "px Arial";
  gameManager.ctx.fillStyle = "#FFFFFF";
  gameManager.ctx.textAlign = "left";
  let health = 100;
  let healthText = "Health: " + health;
  gameManager.ctx.fillText(healthText, 2, fontSize);
}

function drawScore() {
  let fontSize = 20;
  gameManager.ctx.font = fontSize + "px Arial";
  gameManager.ctx.fillStyle = "#FFFFFF";
  gameManager.ctx.textAlign = "right";
  let score = 100;
  let scoreText = "Score: " + score;
  gameManager.ctx.fillText(scoreText, gameManager.canvas.width - 2, fontSize);
}

function drawVector(vector) {
  gameManager.ctx.save();
  gameManager.ctx.beginPath();
  gameManager.ctx.moveTo(gameManager.playerShip.position.x, gameManager.playerShip.position.y);
  gameManager.ctx.lineTo(gameManager.playerShip.position.x + vector.x * 30,
                         gameManager.playerShip.position.y + vector.y * 30);
  gameManager.ctx.lineWidth = 2;
  gameManager.ctx.strokeStyle = '#FFFFFF';
  gameManager.ctx.stroke();
  gameManager.ctx.restore();
}

function getInput(e) {
  if (e.type && (e.type === "keydown" || e.type === "keyup") && e.key) {
    if (e.keyCode === keyCodes.up) {
      gameManager.controls.up = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
    if (e.keyCode === keyCodes.down) {
      gameManager.controls.down = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
    if (e.keyCode === keyCodes.left) {
      gameManager.controls.left = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
    if (e.keyCode === keyCodes.right) {
      gameManager.controls.right = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
    if (e.keyCode === keyCodes.space) {
      gameManager.controls.space = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
  }
}

function handleInput() {
  let acceleration = 3;
  let rotationAngle = 3 * (Math.PI / 180);
  if (gameManager.controls.up) {
    gameManager.playerShip.acceleration.add(Vector2.multiply(gameManager.playerShip.direction, acceleration));
  }
  /*
  if (gameManager.controls.down) {
    // do nothing.
  }
  */
  if (gameManager.controls.left) {
    gameManager.playerShip.direction.rotate(-rotationAngle);
  }
  if (gameManager.controls.right) {
    gameManager.playerShip.direction.rotate(rotationAngle);
  }
  if (gameManager.controls.space) {
    let projectileVelocity = 3;
    let proj = new Projectile(Vector2.add(gameManager.playerShip.position, Vector2.multiply(gameManager.playerShip.direction, 10)), // position
                                                new Vector2(gameManager.playerShip.direction.x, gameManager.playerShip.direction.y), // direction
                                                Vector2.multiply(gameManager.playerShip.direction, projectileVelocity), // velocity
                                                new Vector2(0, 0), // acceleration
                                                1); // collisionRadius
    gameManager.gameObjects.push(proj);
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
  // If no input was received for the 'x' parameter.
  if (x === undefined) throw "The 'x' parameter is required!";
  // If the 'x' parameter is not a number.
  if (typeof x !== 'number') throw "The 'x' parameter must be a number.";
  // If no input was received for the 'y' parameter.
  if (y === undefined) throw "The 'y' parameter is required!";
  // If the 'y' parameter is not a number.
  if (typeof y !== 'number') throw "The 'y' parameter must be a number.";
  // *** END INPUT VALIDATION ***

  // Set the new GameObject's properties.
  this.x = x;
  this.y = y;
}

Vector2.down = function () {
  return new Vector2(0, 1);
}

Vector2.left = function () {
  return new Vector2(-1, 0);
}

Vector2.right = function () {
  return new Vector2(1, 0);
}

Vector2.up = function () {
  return new Vector2(0, -1);
}

/**
 * Calculates the whole clockwise angle (0-2PI / 0-360) between two vectors.
 * @param {Vector2} fromV The vector to calculate the angle from.
 * @param {Vector2} toV The vector to calculate the angle to.
 */
Vector2.angleBetween = function (fromV, toV) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'fromV' parameter.
  if (fromV === undefined) throw "The 'fromV' parameter is required!";
  // If the 'fromV' parameter is not a Vector2.
  if (!fromV instanceof Vector2) throw "The 'fromV' parameter must be a Vector2 object.";
  // If no input was received for the 'toV' parameter.
  if (toV === undefined) throw "The 'toV' parameter is required!";
  // If the 'toV' parameter is not a Vector2.
  if (!toV instanceof Vector2) throw "The 'toV' parameter must be a Vector2 object.";
  // *** END INPUT VALIDATION ***

  let dot = fromV.x * toV.x + fromV.y * toV.y;
  let det = fromV.x * toV.y - fromV.y * toV.x;
  let angle = Math.atan2(det, dot);
  return angle;
}

/**
 * Multiplies a vector's components by a scalar value.
 * @param {Vector2} vector The vector to be multiplied.
 * @param {number} scalar The scalar to multiply the vector by.
 * @return {Vector2} The new scaled vector.
 */
Vector2.multiply = function (vector, scalar) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'vector' parameter.
  if (vector === undefined) throw "The 'vector' parameter is required!";
  // If the 'vector' parameter is not a Vector2.
  if (!vector instanceof Vector2) throw "The 'vector' parameter must be a Vector2 object.";
  // If no input was received for the 'scalar' parameter.
  if (scalar === undefined) throw "The 'scalar' parameter is required!";
  // If the 'scalar' parameter is not a number.
  if (typeof scalar !== 'number') throw "The 'scalar' parameter must be a number.";
  // *** END INPUT VALIDATION ***

  return new Vector2 (vector.x * scalar, vector.y * scalar);
}

/**
 * Multiplies a vector's components by a scalar value.
 * @param {Vector2} vectorA The first vector to be added.
 * @param {Vector2} vectorB The second vector to be added.
 * @return {Vector2} The new vector with the sum of the components of the inputs.
 */
Vector2.add = function (vectorA, vectorB) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'vectorA' parameter.
  if (vectorA === undefined) throw "The 'vectorA' parameter is required!";
  // If the 'vectorA' parameter is not a Vector2.
  if (!vectorA instanceof Vector2) throw "The 'vectorA' parameter must be a Vector2 object.";
  // If no input was received for the 'vectorB' parameter.
  if (vectorB === undefined) throw "The 'vectorB' parameter is required!";
  // If the 'vectorB' parameter is not a Vector2.
  if (!vectorB instanceof Vector2) throw "The 'vectorB' parameter must be a Vector2 object.";
  // *** END INPUT VALIDATION ***

  return new Vector2 (vectorA.x + vectorB.x, vectorA.y + vectorB.y);
}

// Adds another vector to this vector.
Vector2.prototype.add = function (otherVector) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'position' parameter.
  if (otherVector === undefined) throw "The 'otherVector' parameter is required!";
  // If the 'otherVector' parameter is not a Vector2.
  if (!otherVector instanceof Vector2) throw "The 'otherVector' parameter must be a Vector2 object.";
  // *** END INPUT VALIDATION ***

  this.x = this.x + otherVector.x;
  this.y = this.y + otherVector.y;
}

// Subtracts another vector from this vector.
Vector2.prototype.subtract = function (otherVector) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'position' parameter.
  if (otherVector === undefined) throw "The 'otherVector' parameter is required!";
  // If the 'otherVector' parameter is not a Vector2.
  if (!otherVector instanceof Vector2) throw "The 'otherVector' parameter must be a Vector2 object.";
  // *** END INPUT VALIDATION ***

  this.x = this.x - otherVector.x;
  this.y = this.y - otherVector.y;
}

/**
 * Multiplies this vector's components by a scalar value.
 * @param {Vector2} vector The vector to be multiplied.
 * @param {number}
 */
Vector2.prototype.multiply = function (scalar) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'scalar' parameter.
  if (scalar === undefined) throw "The 'scalar' parameter is required!";
  // If the 'scalar' parameter is not a number.
  if (typeof scalar !== 'number') throw "The 'scalar' parameter must be a number.";
  // *** END INPUT VALIDATION ***

  this.x *= scalar;
  this.y *= scalar;
}

/**
 * Divides this vector's components by a scalar value.
 * @param {number}
 */
Vector2.prototype.divide = function (scalar) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'scalar' parameter.
  if (scalar === undefined) throw "The 'scalar' parameter is required!";
  // If the 'scalar' parameter is not a number.
  if (typeof scalar !== 'number') throw "The 'scalar' parameter must be a number.";
  // *** END INPUT VALIDATION ***

  this.x /= scalar;
  this.y /= scalar;
}

/**
 * Rotates this vector by an angle (radian) value.
 * @param {number}
 */
Vector2.prototype.rotate = function (angle) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'angle' parameter.
  if (angle === undefined) throw "The 'angle' parameter is required!";
  // If the 'angle' parameter is not a number.
  if (typeof angle !== 'number') throw "The 'angle' parameter must be a number.";
  // *** END INPUT VALIDATION ***

  let x = this.x;
  let y = this.y;
  this.x = x * Math.cos(angle) - y * Math.sin(angle);
  this.y = x * Math.sin(angle) + y * Math.cos(angle);
}

/**
 * @return {number} the magnitude of the vector.
 */
Vector2.prototype.magnitude = function () {
  // Return the magnitude of the vector calculated using the pythagorean theorem.
  return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vector2.prototype.normalize = function () {
  let m = this.magnitude();
  if (m > 0) {
    this.divide(m);
  }
}

/**
 * Clamps the magnitude of the vector.
 * @param {number}
 */
Vector2.prototype.clampMagnitude = function (newMagnitude) {
  if (this.magnitude() > newMagnitude) {
    this.normalize();
    this.multiply(newMagnitude);
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
  throw "Cannot instantiate abstract class";
};

// Abstract draw method for the GameObject base class.
GameObject.prototype.draw = function () {
  throw "Cannot instantiate abstract class";
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

/** @override the update function from the GameObject superclass */
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

/** @override the draw function from the GameObject superclass */
PlayerShip.prototype.draw = function () {
  let shipWidth = 10;
  let shipHeight = 20;
  gameManager.ctx.save();
  gameManager.ctx.translate(this.position.x, this.position.y);
  let angle = Vector2.angleBetween(Vector2.up(), this.direction);
  gameManager.ctx.rotate(angle);
  gameManager.ctx.beginPath();
  gameManager.ctx.moveTo(this.direction.x, this.direction.y-shipHeight);
  gameManager.ctx.lineTo(shipWidth, shipHeight);
  gameManager.ctx.lineTo(0, shipWidth);
  gameManager.ctx.lineTo(-shipWidth, shipHeight);
  gameManager.ctx.lineTo(0, -shipHeight);
  gameManager.ctx.lineWidth = 3;
  gameManager.ctx.strokeStyle = '#FFFFFF';
  gameManager.ctx.stroke();
  // If the ship is currently accellerating
  if (gameManager.controls.up) {
    let thrustWidth = 5;
    let thrustHeight = 20;
    // Draw the thrust flame
    gameManager.ctx.beginPath();
    gameManager.ctx.moveTo(0, shipHeight-this.direction.y - thrustWidth);
    gameManager.ctx.lineTo(thrustWidth, thrustHeight);
    gameManager.ctx.lineTo(0, 30);
    gameManager.ctx.lineTo(-thrustWidth, thrustHeight);
    gameManager.ctx.lineTo(0, shipHeight-this.direction.y - thrustWidth);
    gameManager.ctx.lineWidth = 2;
    gameManager.ctx.strokeStyle = '#FFFF00';
    gameManager.ctx.stroke();
  }
  gameManager.ctx.restore();
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

/** @override the update function from the GameObject superclass */
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
  let length = 10;
  gameManager.ctx.save();
  gameManager.ctx.beginPath();
  gameManager.ctx.moveTo(this.position.x, this.position.y);
  gameManager.ctx.lineTo(this.position.x + this.direction.x * length,
                         this.position.y + this.direction.y * length);
  gameManager.ctx.lineWidth = 2;
  gameManager.ctx.strokeStyle = '#FFFFFF';
  gameManager.ctx.stroke();
  gameManager.ctx.restore();
};
