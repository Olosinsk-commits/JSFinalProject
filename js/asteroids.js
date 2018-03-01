/**
 * @author Noah Greer <Noah.Greer@gmail.com>
 * 02/19/2018
 * Winter 2018
 * CSD 122 - JavaScript & jQuery
 * Group Project - Group 3 (Olga Osinskaya, Noah Greer, and Topher Gidos)
 *
 * Code to play a game of Asteroids.
 */

var shipAvatar = new Image();
shipAvatar.src = "../img/icons/png/steam_4096_black.png";

var controls = {"up": false, "down": false, "left": false, "right": false, "space": false};

$(document).ready(function() {
    gameManager.start();
  }).keydown(function(e) {
    getInput(e);
  }).keyup(function(e) {
    getInput(e);
});

var gameManager = {
    // Get reference to game canvas.
    canvas : null,
    start : function() {
        this.canvas = $("#gameCanvas").get(0);
        // Check whether canvas is available in the browser.
        if (this.canvas.getContext) {
          this.ctx = this.canvas.getContext('2d');
          this.playerShip = new GameObject(new Vector2(100, 100), // position
                                           new Vector2(100, 100), // scale
                                           new Vector2(0, 0), // velocity
                                           new Vector2(0, 0), // acceleration
                                           Vector2.up, // direction
                                           1); // collisionRadius
          requestAnimationFrame(update);
        } else {
          // Log that we could not get a reference to the context.
          console.log("Could not get canvas context. Browser does not support HTML5 canvas.");
        }
    }
}

function update() {
  updateMovement();
  gameManager.playerShip.update();
  clearCanvas();
  drawBackground();
  drawPlayerShip();
  drawVector();
  drawHealth();
  drawScore();
  requestAnimationFrame(update);
}

function clearCanvas() {
  gameManager.ctx.clearRect(0, 0, gameManager.canvas.width, gameManager.canvas.height);
}

function drawBackground() {
  gameManager.ctx.fillStyle="#00BBFF";
  gameManager.ctx.fillRect(0, 0, gameManager.canvas.width, gameManager.canvas.height);
}

function drawHealth() {
  gameManager.ctx.font = "30px Arial";
  gameManager.ctx.fillStyle = "#000000";
  gameManager.ctx.textAlign = "left";
  let health = 100;
  let healthText = "Health: " + health;
  gameManager.ctx.fillText(healthText, 2, 30);
}

function drawScore() {
  gameManager.ctx.font = "30px Arial";
  gameManager.ctx.fillStyle = "#000000";
  gameManager.ctx.textAlign = "right";
  let score = 100;
  let scoreText = "Score: " + score;
  gameManager.ctx.fillText(scoreText, gameManager.canvas.width - 2, 30);
}

function drawVector() {
  gameManager.ctx.save();
  gameManager.ctx.beginPath();
  gameManager.ctx.moveTo(gameManager.playerShip.position.x, gameManager.playerShip.position.y);
  gameManager.ctx.lineTo(gameManager.playerShip.position.x + gameManager.playerShip.direction.x * 30,
                         gameManager.playerShip.position.y + gameManager.playerShip.direction.y * 30);
  gameManager.ctx.lineWidth = 2;
  gameManager.ctx.strokeStyle = '#000000';
  gameManager.ctx.stroke();
  gameManager.ctx.restore();
}

function drawPlayerShip() {
  gameManager.ctx.save();
  gameManager.ctx.translate(gameManager.playerShip.position.x, gameManager.playerShip.position.y);
  let angle = Vector2.angleBetween(Vector2.down, gameManager.playerShip.direction);
  console.log("drawPlayerShip: angle = " + angle * 180 / Math.PI);
  gameManager.ctx.rotate(angle);
  gameManager.ctx.drawImage(shipAvatar, -gameManager.playerShip.scale.x/2, -gameManager.playerShip.scale.y/2, gameManager.playerShip.scale.x, gameManager.playerShip.scale.y);
  gameManager.ctx.restore();
}

function getInput(e) {
  if (e.type && (e.type === "keydown" || e.type === "keyup") && e.key) {
    if (e.key === "ArrowUp") {
      controls.up = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
    if (e.key === "ArrowDown") {
      controls.down = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      controls.left = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      controls.right = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
    if (e.key === " ") {
      controls.space = e.type === "keydown" ? true : false;
      e.preventDefault();
    }
  }
}

function updateMovement() {
  let acceleration = 2;
  let rotationAngle = 2 * (Math.PI / 180);
  if (controls.up) {
    gameManager.playerShip.acceleration.add(gameManager.playerShip.direction);
  }
  if (controls.down) {
    // do nothing.
  }
  if (controls.left) {
    gameManager.playerShip.direction.rotate(-rotationAngle);
  }
  if (controls.right) {
    gameManager.playerShip.direction.rotate(rotationAngle);
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

  // Log that the new GameObject was created sucessfully.
  console.log("Created new Vector2: (x: " + this.x +
                                  ", y: " + this.y + ")");
}

Vector2.down = new Vector2(0, -1);
Vector2.left = new Vector2(-1, 0);
Vector2.right = new Vector2(1, 0);
Vector2.up = new Vector2(0, 1);

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

  let dotProduct = fromV.x * toV.x + fromV.y * toV.y;
  let length = fromV.magnitude() * toV.magnitude();
  let ratio = dotProduct/length;
  console.log("ratio = " + ratio);
  ratio = Math.max(-1, Math.min(ratio, 1));
  console.log("ratio = " + ratio);
  let angle = Math.acos(ratio);
  return angle;
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
 * Rotates this vector by an angle value.
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
 * @param {Vector2} scale The GameObject's scale vector.
 * @param {Vector2} velocity The GameObject's velocity vector.
 * @param {Vector2} acceleration The GameObject's acceleration vector.
 * @param {Vector2} direction The GameObject's direction vector.
 * @param {number} collisionRadius The GameObject's collisionRadius.
 * @return {GameObject} The new GameObject object.
 */
function GameObject(position, scale, velocity, acceleration, direction, collisionRadius) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'position' parameter.
  if (position === undefined) throw "The 'position' parameter is required!";
  // If the 'position' parameter is not a Vector2.
  if (!position instanceof Vector2) throw "The 'position' parameter must be a Vector2 object.";
  // If no input was received for the 'scale' parameter.
  if (scale === undefined) throw "The 'scale' parameter is required!";
  // If the 'scale' parameter is not a Vector2.
  if (!scale instanceof Vector2) throw "The 'scale' parameter must be a Vector2 object.";
  // If no input was received for the 'velocity' parameter.
  if (velocity === undefined) throw "The 'velocity' parameter is required!";
  // If the 'velocity' parameter is not a Vector2.
  if (!velocity instanceof Vector2) throw "The 'velocity' parameter must be a Vector2 object.";
  // If no input was received for the 'acceleration' parameter.
  if (acceleration === undefined) throw "The 'acceleration' parameter is required!";
  // If the 'acceleration' parameter is not a Vector2.
  if (!acceleration instanceof Vector2) throw "The 'acceleration' parameter must be a Vector2 object.";
  // If no input was received for the 'direction' parameter.
  if (direction === undefined) throw "The 'direction' parameter is required!";
  // If the 'direction' parameter is not a Vector2.
  if (!direction instanceof Vector2) throw "The 'direction' parameter must be a Vector2 object.";
  // If no input was received for the 'collisionRadius' parameter.
  if (collisionRadius === undefined) throw "The 'collisionRadius' parameter is required!";
  // If the 'collisionRadius' parameter is not a number.
  if (typeof collisionRadius !== 'number') throw "The 'collisionRadius' parameter must be a number.";
  // If the 'collisionRadius' parameter is less than or equal to 0.
  if (collisionRadius <= 0) throw "The 'collisionRadius' parameter must be a positive number greater than zero.";
  // *** END INPUT VALIDATION ***

  // Set the new GameObject's properties.
  this.position = position;
  this.scale = scale;
  this.velocity = velocity;
  this.acceleration = acceleration;
  this.direction = direction;
  this.collisionRadius = collisionRadius;

  // Log that the new GameObject was created sucessfully.
  console.log("Created new GameObject: position: " + this.position +
                                       ", scale: " + this.scale +
                                    ", velocity: " + this.velocity +
                                ", acceleration: " + this.acceleration +
                                    ", direction: " + this.direction +
                             ", collisionRadius: " + this.collisionRadius);
}

GameObject.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.velocity.clampMagnitude(5);
  this.position.add(this.velocity);
};
