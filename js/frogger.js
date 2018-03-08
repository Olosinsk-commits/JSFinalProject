//Topher Gidos
//store reference variables for <canvas> tag
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//variable for frog sprite

var frogAvatar = new Image();
frogAvatar.src = "../img/frogger/frogger.png";

//variable for cars
var cars = new Image();
cars.src = "../img/frogger/cars.png";

////////////// VARIABLE STACK //////////////

/**
* Variable Explanation: Variables such as 'carX1' and 'carY1' represent the
* x and y coordinates of the particular object respectively (at the center).
* Variables such as 'carWidth' and 'carHeight' represent the size of the object.
*/

//general car width and height
var carWidth = 60;
var carHeight = 35;

//variables for first car
var carX1 = 100;
var carSX1 = 3;
var carY1 = 400;

//variables for second car
var carX2 = 500;
var carSX2 = 111;
var carY2 = 400;

//variables for third car
var carX3 = 460;
var carSX3 = 220;
var carY3 = 355;

//variables for fourth car
var carX4 = 400;
var carSX4 = 328;
var carY4 = 310;

//variables for fifth car
var carX5 = 360;
var carSX5 = 3;
var carY5 = 265;

//variables for sixth car
var carX6 = 60;
var carSX6 = 111;
var carY6 = 355;

//variables for seventh car
var carX7 = 100;
var carSX7 = 220;
var carY7 = 310;

//variables for eighth car
var carX8 = 160;
var carSX8 = 328;
var carY8 = 265;

//log variables
var logWidth = 120;
var logHeight = 30;

//log 1
var logX1 = 300;
var logY1 = 180;

//log 2
var logX2 = 40;
var logY2 = 180;

//log 3
var logX3 = 100;
var logY3 = 136;

//log 4
var logX4 = 400;
var logY4 = 136;

//log 5
var logX5 = 480;
var logY5 = 92;

//log 6
var logX6 = 60;
var logY6 = 92;

//log 7
var logX7 = 120;
var logY7 = 48;

//log 8
var logX8 = 500;
var logY8 = 48;

//lily pads
var lilyWidth = 50;
var lilyHeight = 50;

var lilyX1 = 20;
var lilyY1 = 4;

var lilyX2 = 120;
var lilyY2 = 4;

var lilyX3 = 220;
var lilyY3 = 4;

var lilyX4 = 320;
var lilyY4 = 4;

var lilyX5 = 420;
var lilyY5 = 4;

var lilyX6 = 520;
var lilyY6 = 4;

var padWidth = 30;
var padHeight = 30;
	//pad 1
var padX1 = 20;
var padY1 = 4;

	//pad 2
var padX2 = 120;
var padY2 = 4;

	//pad 3
var padX3 = 220;
var padY3 = 4;

	//pad 4
var padX4 = 320;
var padY4 = 4;

	//pad 5
var padX5 = 420;
var padY5 = 4;

	//pad 6
var padX6 = 520;
var padY6 = 4;

	
var pad1 = false;
var pad2 = false;
var pad3 = false;
var pad4 = false;
var pad5 = false;
var pad6 = false;

	//Lives trackers
var lives = 3;
var livesLost = 0;

	//Win/loss counter
var play = true;
var victoryCondition = false;

//variables for drawImage Method
var sx = 0;
var sy = 0;
var swidth = 120;
var sheight = 120;
var x = 50;
var y = 444;
var width = 30;
var height = 30;

//variables for arrow button press
var rightPress = false;
var leftPress = false;
var upPress = false;
var downPress = false;
/*I do not want the sprite to continue moving when an arrow key is held down, so I will set up 4 more variables for this */
var up = true;
var down = true;
var right = true;
var left = true;

////////////// END OF VARIABLE STACK //////////////

//event Listeners for when a key is pressed or not pressed
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//function handles key down
function keyDownHandler(e) {
	switch (e.keyCode) {
		case 39:
		rightPress = true;
		e.preventDefault();
		break;
		case 37:
		leftPress = true;
		e.preventDefault();
		break;
		case 38:
		upPress = true;
		e.preventDefault();
		break;
		case 40:
		downPress = true;
		e.preventDefault();
		break;
		default:
		break;
	}
}
//function handles key up
function keyUpHandler(e) {
	switch (e.keyCode) {
		case 39:
		rightPress = false;
		e.preventDefault();
		break;
		case 37:
		leftPress = false;
		e.preventDefault();
		break;
		case 38:
		upPress = false;
		e.preventDefault();
		break;
		case 40:
		downPress = false;
		e.preventDefault();
		break;
		default:
		break;
	}
}
//function that will loop the drawBackground() function
function drawBackground() {
	//grass play area
	context.fillStyle = "green";
	context.fillRect(0, 440, 570, 45);
	context.fillRect(0, 220, 570, 45);

	//lane boundry for cars
	context.beginPath();
	context.moveTo(0, 395);
	context.lineTo(570, 395);
	context.strokeStyle = 'white';
	context.setLineDash([5]);
	context.strokeWidth = 2;
	context.stroke();
	//center divide
	context.beginPath();
	context.moveTo(0, 350);
	context.lineTo(570, 350);
	context.strokeStyle = 'white';
	context.setLineDash([0]);
	context.strokeWidth = 4;
	context.stroke();
	//lane boundry
	context.beginPath();
	context.moveTo(0, 305);
	context.lineTo(570, 305);
	context.strokeStyle = 'white';
	context.setLineDash([5]);
	context.strokeWidth = 2;
	context.stroke();

	//water area
	context.fillStyle = "blue";
	context.fillRect(0, 0, 570, 220);
}
//function that will draw the frog sprite
function drawFrog() {
	context.drawImage(frogAvatar, sx, sy, 120, 120, x, y, width, height);
}
//function to affect the frog's movement
function moveFrog () {
	//upPress logic
	if (upPress == true && up == true && y > 20) {
		y = y - 44;
		up = false;
		sx = 0;
	}
	if (upPress == false) {
		up = true;
	}
	//downPress logic
	if (downPress == true && down == true && y + height < canvas.height - 80) {
		y = y + 44;
		down = false;
		sx = 240;
	}
	if (downPress == false) {
		down = true;
	}
	//leftPress logic
	if (leftPress == true && left == true && x > 20) {
		x = x - 44;
		left = false;
		sx = 360;
	}
	if (leftPress == false) {
		left = true;
	}
	//rightPress logic
	if (rightPress == true && right == true && x + width < canvas.width - 20) {
		x = x + 44;
		right = false;
		sx = 120;
	}
	if (rightPress == false) {
		right = true;
	}
}
//function that will draw the cars
function drawCars() {
	var carsSX = [carSX1, carSX2, carSX3, carSX4, carSX5, carSX6, carSX7, carSX8];
	var carsX = [carX1, carX2, carX3, carX4, carX5, carX6, carX7, carX8];
	var carsY = [carY1, carY2, carY3, carY4, carY5, carY6, carY7, carY8];
	for (i = 0; i < carsX.length; i++) {
		context.drawImage(cars, carsSX[i], 3, 103, 58, carsX[i], carsY[i], carWidth, carHeight);
	}

}
//function that will allow all the cars to move
function moveCars() {
	//1st car
	if (carX1 < canvas.width + 100) {
		carX1 = carX1 + 5;
	} else {
		carX1 = -100;
		carSX1 = (Math.floor(Math.random() * 4)) * 109;
	}
	//2nd car
	if (carX2 < canvas.width + 100) {
		carX2 = carX2 + 5;
	} else {
		carX2 = -100;
		carSX2 = (Math.floor(Math.random() * 4)) * 109;
	}
	//3nd car
	if (carX3 > -100) {
		carX3 = carX3 - 5;
	} else {
		carX3 = canvas.width + 100;
		carSX3 = (Math.floor(Math.random() * 4)) * 109;
	}
	//4th car
	if (carX4 < canvas.width + 100) {
		carX4 = carX4 + 5;
	} else {
		carX4 = -100;
		carSX4 = (Math.floor(Math.random() * 4)) * 109;
	}
	//5th car
	if (carX5 > -100) {
		carX5 = carX3 - 5;
	} else {
		carX5 = canvas.width + 100;
		carSX5 = (Math.floor(Math.random() * 4)) * 109;
	}
	//6th car
	if (carX6 > -100) {
		carX6 = carX6 - 5;
	} else {
		carX6 = canvas.width + 100;
		carSX6 = (Math.floor(Math.random() * 4)) * 109;
	}
	//7th car
	if (carX7 < canvas.width + 100) {
		carX7 = carX7 + 5;
	} else {
		carX7 = -100;
		carSX7 = (Math.floor(Math.random() * 4)) * 109;
	}
	//8th car
	if (carX8 > -100) {
		carX8 = carX8 - 5;
	} else {
		carX8 = canvas.width + 100;
		carSX8 = (Math.floor(Math.random() * 4)) * 109;
	}
}
//function that detects if the frog and car images are overlapping
function runOver() {
	var carsX = [carX1, carX2, carX3, carX4, carX5, carX6, carX7, carX8];
	var carsY = [carY1, carY2, carY3, carY4, carY5, carY6, carY7, carY8];
	for (i = 0; i < carsX.length; i++) {
		if (carsX[i] <= x + width &&
				carsX[i] + carWidth >= x &&
				carsY[i] + carHeight >= y &&
				carsY[i] <= y + height) {
			y = 488;
			livesLost++;
		}
	}
}
	//function that will draw logs on the river.
	function drawLogs() {
		//using fillStyle for testing purposes. Will replace with images
		context.fillStyle = 'brown';
		var logsX = [logX1, logX2, logX3, logX4, logX5, logX6, logX7, logX8];
		var logsY = [logY1, logY2, logY3, logY4, logY5, logY6, logY7, logY8];

		for (i = 0; i < logsX.length; i++) {
			context.fillRect(logsX[i], logsY[i], logWidth, logHeight);
		}
	}
	//function that will move the logs ONLY
	function moveLogs() {
		//log1 only
		if (logX1 < canvas.width + 100) {
			logX1 = logX1 + 2;
		}
		else {
			logX1 = -100;
		}
		//log 2 only
		if (logX2 < canvas.width + 100) {
			logX2 = logX2 + 2;
		}
		else {
			logX2 = -100;
		}
		//log 3 only
		if (logX3 > 0 - logWidth) {
			logX3 = logX3 - 2;
		}
		else {
			logX3 = canvas.width + 100;
		}
		//log 4 only
		if (logX4 > 0 - logWidth) {
			logX4 = logX4 - 2;
		}
		else {
			logX4 = canvas.width + 100;
		}
		//log 5 only
		if (logX5 < canvas.width + 100) {
			logX5 = logX5 + 4;
		}
		else {
			logX5 = -100;
		}
		//log 6 only
		if (logX6 < canvas.width + 100) {
			logX6 = logX6 + 4;
		}
		else {
			logX6 = -100;
		}
		//log 7 only
		if (logX7 > 0 - logWidth) {
			logX7 = logX7 - 2;
		}
		else {
			logX7 = canvas.width + 100;
		}
		//log 8 only
		if (logX8 > 0 - logWidth) {
			logX8 = logX8 - 2;
		}
		else {
			logX8 = canvas.width + 100;
		}
	}
	//function for changing the collision coordinates for the logs as they move across the screen
	function floatLogs() {

		//log 1
		if (logX1 <= x + width && //this 'if' block will determine if the frog is located on the log
		logX1 + logWidth >= x &&
		logY1 + logHeight >= y &&
		logY1 <= y + height) {
			if (x < canvas.width - 30) {
				x = x + 2;  //'collision' logic for water will move with the log so the frog will never disappear when on the log.
			}
		}
		//log 2
		else if (logX2 <= x + width && //this 'if' block will determine if the frog is located on the log
		logX2 + logWidth >= x &&
		logY2 + logHeight >= y &&
		logY2 <= y + height) {
			if (x < canvas.width - 30) {
				x = x + 2;
			}
		}
		//log 3
		else if (logX3 <= x + width &&
						 logX3 + logWidth >= x &&
						 logY3 + logHeight >= y &&
					   logY3 <= y + height) {
			if (x > 0) {
				x = x - 2;
			}
		}
		//log 4
		else if (logX4 <= x + width &&
						 logX4 + logWidth >= x &&
						 logY4 + logHeight >= y &&
						 logY4 <= y + height) {
				if (x > 0) {
					x = x - 2;
				}
		}
		//log 5
		else if (logX5 <= x + width &&
						 logX5 + logWidth >= x &&
						 logY5 + logHeight >= y &&
						 logY5 <= y + height) {
				if (x > 0) {
					x = x + 4;
				}
		}
		//log 6
		else if (logX6 <= x + width &&
						 logX6 + logWidth >= x &&
						 logY6 + logHeight >= y &&
						 logY6 <= y + height) {
				if (x > 0) {
					x = x + 4;
				}
		}
		//log 7
		else if (logX7 <= x + width &&
						 logX7 + logWidth >= x &&
						 logY7 + logHeight >= y &&
						 logY7 <= y + height) {
				if (x > 0) {
					x = x - 2;
				}
		}
		//log 8
		else if (logX8 <= x + width &&
						 logX8 + logWidth >= x &&
						 logY8 + logHeight >= y &&
						 logY8 <= y + height) {
				if (x > 0) {
					x = x - 2;
				}
		}
		else if (y < 220) {
			y = 488; //reset frog's position to the bottom
			livesLost++;
		}
	}

//function for drawing lilypads
function drawPads() {
	context.fillStyle = "seagreen";
	var padsX = [padX1, padX2, padX3, padX4, padX5, padX6];
	var padsY = [padY1, padY2, padY3, padY4, padY5, padY6];
		
	for (i = 0; i < padsX.length; i++) {
		context.fillRect(padsX[i], padsY[i], padWidth, padHeight);
	}
}

function onPad() {
	if (padX1 <= x + width &&
		padX1 + padWidth >= x &&
		padY1 + padHeight >= y &&
		padY1 <= y + height) {
			pad1 = true;
			y = 488;
		}
	else if (padX2 <= x + width &&
		padX2 + padWidth >= x &&
		padY2 + padHeight >= y &&
		padY2 <= y + height) {
			pad2 = true;
			y = 488;
		}
	else if (padX3 <= x + width &&
		padX3 + padWidth >= x &&
		padY3 + padHeight >= y &&
		padY3 <= y + height) {
			pad3 = true;
			y = 488;
		}
	else if (padX4 <= x + width &&
		padX4 + padWidth >= x &&
		padY4 + padHeight >= y &&
		padY4 <= y + height) {
			pad4 = true;
			y = 488;
		}
	else if (padX5 <= x + width &&
		padX5 + padWidth >= x &&
		padY5 + padHeight >= y &&
		padY5 <= y + height) {
			pad5 = true;
			y = 488;
		}
	else if (padX6 <= x + width &&
		padX6 + padWidth >= x &&
		padY6 + padHeight >= y &&
		padY6 <= y + height) {
			pad6 = true;
			y = 488;
		}
	else if (y < 48) {
		y = 488;
		livesLost++;
	}
	
}
function drawLives() {
	//count and display lives left
	if (lives - livesLost != 0) {
		context.fillStyle = "white";
		context.font = "30px Arial";
		context.fillText("Lives: " + (lives - livesLost), (canvas.width/2)-70, 525);
	}
}

function gameOver() {
	if (lives - livesLost == 0) {
		context.save();
		play = false;
		context.fillStyle = "white";
		context.font = "72px Arial";
		context.fillText("GAME OVER", 0, 100);
		context.font = "28px Arial";
		context.fillText("Refresh to play again!");
		context.restore();
	}
}

function victory() {
	if (pad1 || pad2 || pad3 || pad4 || pad5 || pad6) {
			//print you won
		victoryCondition = true;
		play = false;	
	}
}	

function victoryScreen() {
		context.fillStyle = "white";
		context.font = "30px Arial";
		context.textAlign = "center";
		context.fillText("You Won! Refresh page to play again.", (canvas.width/2), canvas.height/2);
}

//game drawing function
function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height); /*clears the previous iteration of the frog and redraws a new one.*/
	
	drawBackground();
	drawLogs();
	drawFrog();
	drawCars();
	drawPads();
	drawLives();
	
	if (play) {
	moveLogs();
	moveFrog();
	moveCars();
	runOver();
	onPad();
	floatLogs();
	victory();

	
}
	if (victoryCondition) {
		gameOver();
		drawLives();
		victoryScreen(); 
	}
	requestAnimationFrame(draw); //refreshes based on the the user's refresh rate.
}

draw();
