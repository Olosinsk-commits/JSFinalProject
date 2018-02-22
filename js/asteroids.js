/**
 * @author Noah Greer <Noah.Greer@gmail.com>
 * 02/19/2018
 * Winter 2018
 * CSD 122 - JavaScript & jQuery
 * Group Project - Group 3 (Olga Osinskaya, Noah Greer, and Topher Gidos)
 *
 * Code to play a game of Asteroids.
 */



var canvas;
var ctx;

var position = new Vector2(0, 0);

var ship = new Image();
ship.src = "../img/icons/png/steam_4096_black.png";

var controls = {"up": false, "down": false, "left": false, "right": false, "space": false};

$(document).ready(function() {
  // Get reference to game canvas.
  canvas = $("#gameCanvas").get(0);
  // Check whether canvas is available in the browser.
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    requestAnimationFrame(update);
  } else {
    // Log that we could not get a reference to the context.
    console.log("Could not get canvas context. Browser does not support HTML5 canvas.");
  }
  }).keydown(function(e) {
    getInput(e);
  }).keyup(function(e) {
    getInput(e);
});


/*
rotation formula:
x = x * Math.cos(theta) - y * Math.sin(theta)

y = x * Math.sin(theta) + y * Math.cos(theta)
*/

function update() {
  updateMovement();
  ctx.rotate(0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle="#00BBFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(ship, position.x, position.y, 100, 100);
  requestAnimationFrame(update);
}

function getInput(e) {
  if (e.type && (e.type === "keydown" || e.type === "keyup") && e.key) {
    switch (e.key) {
      case "ArrowUp":
        controls.up = e.type === "keydown" ? true : false;
        e.preventDefault();
        break;
      case "ArrowDown":
        controls.down = e.type === "keydown" ? true : false;
        e.preventDefault();
        break;
      case "ArrowLeft":
        controls.left = e.type === "keydown" ? true : false;
        e.preventDefault();
        break;
      case "ArrowRight":
        controls.right = e.type === "keydown" ? true : false;
        e.preventDefault();
        break;
      case " ":
        controls.space = e.type === "keydown" ? true : false;
        e.preventDefault();
        break;
      default:
       break;
    }
  }
}

function updateMovement() {
  let speed = 5;
  if (controls.up) {
    position.y -= speed;
  }
  if (controls.down) {
    position.y += speed;
  }
  if (controls.left) {
    position.x -= speed;
  }
  if (controls.right) {
    position.x += speed;
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
  // If the 'name' parameter is not a number.
  if (typeof x !== 'number') throw "The 'x' parameter must be a number.";
  // If the 'x' parameter is less than zero.
  if (x < 0) throw "The 'x' parameter must be greater than or equal to zero.";
  // If no input was received for the 'x' parameter.
  if (y === undefined) throw "The 'y' parameter is required!";
  // If the 'y' parameter is not a number.
  if (typeof y !== 'number') throw "The 'y' parameter must be a number.";
  // If the 'y' parameter is less than zero.
  if (x < 0) throw "The 'x' parameter must be greater than or equal to zero.";
  // *** END INPUT VALIDATION ***

  // Set the new GameObject's properties.
  this.x = x;
  this.y = y;

  // Log that the new GameObject was created sucessfully.
  console.log("Created new Vector2: (x: " + this.x +
                                  ", y: " + this.y + ")");
}

/**
 * Creates an instance of a GameObject with a position vector, velocity vector, and rotation vector.
 * @constructor
 * @param {Vector2} position The GameObject's position vector.
 * @param {Vector2} velocity The GameObject's velocity vector.
 * @param {Vector2} rotation The GameObject's rotation vector.
 * @return {GameObject} The new GameObject object.
 */
function GameObject(position, velocity, rotation, collisionRadius) {
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'position' parameter.
  if (position === undefined) throw "The 'position' parameter is required!";
  // If the 'position' parameter is not a Vector2.
  if (position instanceof Vector2) throw "The 'position' parameter must be a Vector2 object.";
  // If no input was received for the 'velocity' parameter.
  if (velocity === undefined) throw "The 'velocity' parameter is required!";
  // If the 'velocity' parameter is not a Vector2.
  if (velocity instanceof Vector2) throw "The 'velocity' parameter must be a Vector2 object.";
  // If no input was received for the 'rotation' parameter.
  if (rotation === undefined) throw "The 'rotation' parameter is required!";
  // If the 'rotation' parameter is not a Vector2.
  if (rotation instanceof Vector2) throw "The 'rotation' parameter must be a Vector2 object.";
  // If no input was received for the 'collisionRadius' parameter.
  if (collisionRadius === undefined) throw "The 'collisionRadius' parameter is required!";
  // If the 'collisionRadius' parameter is not a number.
  if (typeof collisionRadius !== 'number') throw "The 'collisionRadius' parameter must be a number.";
  // If the 'collisionRadius' parameter is less than or equal to 0.
  if (collisionRadius <= 0) throw "The 'collisionRadius' parameter must be a positive number greater than zero.";
  // *** END INPUT VALIDATION ***

  // Set the new GameObject's properties.
  this.position = position;
  this.velocity = velocity;
  this.rotation = rotation;
  this.collisionRadius = collisionRadius;

  // Log that the new GameObject was created sucessfully.
  console.log("Created new GameObject: position: " + this.position +
                                    ", velocity: " + this.velocity +
                                    ", rotation: " + this.rotation +
                             ", collisionRadius: " + this.collisionRadius);
}

/**
 * Creates an instance of an Asteroid with a position vector, velocity vector, and rotation vector.
 * @constructor
 * @param {Vector2} position The Asteroid's position vector.
 * @param {Vector2} velocity The Asteroid's velocity vector.
 * @param {Vector2} rotation The Asteroid's rotation vector.
 * @return {Asteroid} The new Asteroid object.
 */
function Asteroid(position, velocity, rotation, collisionRadius, health) {
  try {
    GameObject.call(this, position, velocity, rotation, collisionRadius);
  } catch (e) {
    console.log(e.message);
  }
  // *** BEGIN INPUT VALIDATION ***
  // If no input was received for the 'position' parameter.
  if (position === undefined) throw "The 'position' parameter is required!";
  // If the 'position' parameter is not a Vector2.
  if (position instanceof Vector2) throw "The 'position' parameter must be a Vector2 object.";
  // *** END INPUT VALIDATION ***

  // Set the new Asteroid's properties.
  this.position = position;
  this.velocity = velocity;
  this.rotation = rotation;
  this.collisionRadius = collisionRadius;

  // Log that the new Asteroid was created sucessfully.
  console.log("Created new Asteroid: position: " + this.position +
                                    ", velocity: " + this.velocity +
                                    ", rotation: " + this.rotation +
                             ", collisionRadius: " + this.collisionRadius);
}
