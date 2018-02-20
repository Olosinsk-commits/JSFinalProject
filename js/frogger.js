//Topher Gidos
	
	//store reference variables for <canvas> tag
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
	//variable for frog sprite
var frog1 = new Image();
frog1.src = "images/frogger1.png";
	//variable for cars
var car = new Image();
car.src = "images/cars.png";
//variables for first car
	//variables to allow all cars to move across the screen
var carX1 = 100;
var carSX1 = 0;
		//variables for collision detection
var carY1 = 400;
//variables for second car
var carX2 = 100;
var carSX2 = 60;
var carY2 = 400;
var carWidth = 60;
var carHeight = 35;
	//variables for drawImage Method
var sx = 0;
var sy = 0;
var swidth = 40;
var sheight = 40;
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

	//event Listeners for when a key is pressed or not pressed 
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
	//function handles key down
function keyDownHandler(e) {
	if(e.keyCode == 39) {rightPress = true;}
	if(e.keyCode == 37) {leftPress = true;}
	if(e.keyCode == 38) {upPress = true;}
	if(e.keyCode == 40) {downPress = true;}
}	
	//function handles key up
function keyUpHandler(e) {
	if(e.keyCode == 39) {rightPress = false;}
	if(e.keyCode == 37) {leftPress = false;}
	if(e.keyCode == 38) {upPress = false;}
	if(e.keyCode == 40) {downPress = false;}
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
function drawFrog(){
	context.drawImage(frog1, sx, sy, swidth, sheight, x, y, width, height);
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
		sx = 0;
	}
	if (downPress == false) {
		down = true;
	}
		//leftPress logic
	if (leftPress == true && left == true && x > 20) {
		x = x - 44;
		left = false;
		sx = 80;
	}
	if (leftPress == false) {
		left = true;
	}
		//rightPress logic
	if (rightPress == true && right == true && x + width < canvas.width - 20) {
		x = x + 44;
		right = false;
		sx = 40;
	}
	if (rightPress == false) {
		right = true;
	}
}
	//function that will draw the cars
function drawCars() {
	context.drawImage(car, carSX1, 0, 60, 35, carX1, carY1, carWidth, carHeight);
		if (carX1 < canvas.width + 100) {
			carX1 = carX1 + 5;
		} else {
				carX1 = -100;
				carSX1 = (Math.floor(Math.random() * 4)) * 60;
		  }
	context.drawImage(car, carSX2, 0, 60, 35, carX2, carY2, carWidth, carHeight);
		if (carX2 < canvas.width + 100) {
			carX2 = carX2 + 5;
		} else {
				carX2 = -100;
				carSX2 = (Math.floor(Math.random() * 4)) * 60;
		  }
}
	//funtion that detects if the frog and car images are overlapping
	function runOver () {
		var carsX = [carX1, carX2]; 
		var carsY = [carY1, carY2];
		for (i = 0; i < carsX.length; i++) {
			if (carsX[i] <= x + width && 
				carsY[i] + carWidth >= x && 
				carsY[i] + carHeight >= y &&
		   		carsY[i] <= y + height){
					y = 488;
		}
	}
	}
function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height); /*clears the previous iteration of the frog and redraws a new one.*/
	drawBackground();
	drawFrog();
	moveFrog();	
	drawCars();
	runOver();
	requestAnimationFrame(draw);
}
draw();
