const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

//Global Variables
let timeToNextRaven = 0;
let ravenInterval = 500;
let timeToNextGame = 25000;
let gameInterval = 30000;
let lastTime = 0;
let score = 500;
let enemyTimer = 700;
let enemyInterval = Math.random() * 800 + 1500;
let handled = false

//Game Classes
let raven = [];
class Raven {
    constructor() {
        this.directionX = Math.random() * 3 + 6;
        this.directionY = Math.random() * 5 - 2.5;
        this.sizeModifier = getSizeModifier();
        this.width = 271 * this.sizeModifier;
        this.height = 194 * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = "images/enemies/raven.png"; 
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 40;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }
    update(input, deltaTime) {
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) {
                this.frame = 0;
            }
            else {
                this.frame++;
            }
            this.timeSinceFlap = 0;
            if (this.hasTrail){
                for (let i = 0; i < 5; i++){
                    particles.push(new Particle(this.x, this.y, this.width, this.randomColors))
                }
            }
        } else {
            this.timeSinceFlap += deltaTime;
        }
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }
    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let particles = [];
class Particle {
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + (this.size * 0.5) + Math.random() * 40 - 20;
        this.y = y + (this.size * 0.33333) + Math.random() * 40 - 20;
        this.radius = Math. random() * this.size /10;
        this.maxRadius = Math. random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math. random() * 1 + 0.5;
        this.color = color;
    }
    update(){
        this.x += this.speedX; 
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = `rgb(
            ${this.color[0]}
            ${this.color[1]}
            ${this.color[2]}`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
        ctx.fill();
        ctx.restore();
    }
};

let backgroundAndPlayer = [];
class Backround {
    constructor(){
        this.screenWidth = CANVAS_WIDTH;
        this.screenHeigth = CANVAS_HEIGHT;
        this.image = new Image;
        this.image.src = "images/backgroundForest/background.png";
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 720;
        this.speed = 5;
    }
    update(){
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.screenHeigth)
        ctx.drawImage(this.image, this.x + this.width -1, this.y, this.width, this.screenHeigth)
    }
}
backgroundAndPlayer.push(new Backround)

class Player {
    constructor(){
        this.gamewidth = CANVAS_WIDTH;
        this.gameheight = CANVAS_HEIGHT;
        this.height = Math.floor(this.gameheight/3.6);
        this.width = this.height;
        console.log (this.width)
        this.x = -this.width;
        this.spriteheight = 200;
        this.spritewidth = 200;
        this.y = this.gameheight - this.height -20;
        this.vy = 0
        this.image = new Image;
        this.image.src = "images/doggo.png"
        this.frameX = 0;
        this.maxFrameX = 8;
        this.frameY = 0;
        this.speed = 0;
        this.vy = 0;
        this.gravity = this.gameheight/600;
        this.fps = 30;
        this.timer = 0;
        this.distance = this.width/1.6;
        this.interval = 1000/this.fps;
        this.marked4Deletion = false
    }
    update(input, deltaTime){
        if (!this.isGrounded()) {
            this.vy += this.gravity;
            this.frameY = 1;
            this.maxFrameX = 5
        } else {
            this.vy = 0;
            this.maxFrameX = 8
            this.frameY = 0;
        }
        
        if (input.keys.indexOf("d") > -1){
            this.speed = 5;
        } else if (input.keys.indexOf("a") > -1){
            this.speed = -5;
        }  else this.speed = 0;
        if ((input.keys.indexOf("w" ) > -1 || input.keys.indexOf("swipe up") > -1 ) && this.isGrounded()){
            this.vy -= Math.floor(this.gameheight/22.5);
        }

        if (timeToNextGame > gameInterval) {
            if (this.x > CANVAS_WIDTH/2 - this.width/2) this.speed = 0;
        }
        this.x += this.speed;
        this.y += this.vy;

        if (this.y < 0) this.y = 0;
        else if (this.y > this.gameheight - this.height - 20) this.y = this.gameheight - this.height - 20;

        if (this.timer > this.interval){
            if (this.frameX >= this.maxFrameX) this.frameX = 0;
            else this.frameX++;
            this.timer = 0;
        } else this.timer += deltaTime;
    }
    draw(){
        ctx.drawImage(this.image, this.frameX * this.spritewidth, this.frameY * this.spriteheight, this.spritewidth, this.spriteheight, this.x, this.y, this.width, this.height)
    }
    isGrounded(){
        return this.y >= this.gameheight - this.height - 20;
    }
    restart() {
        if (this.x < 0 || this.x > CANVAS_WIDTH) this.x = -this.width 
    }
};

class InputHandler {
    constructor(){
        this.keys = [];
    };
    update(dog, worms){
        this.keys.splice(0, this.keys.length)
        this.keys.push("d")
        this.dog = dog
        worms.forEach(worm =>{
            if (worm.x - (this.dog.x + this.dog.width) <= dog.distance && worm.x - dog.x > 0) {
                this.keys.push("w")
            }
        })
    }
};
const input = new InputHandler;

let enemies = [];
class Enemy {
    constructor(){
        this.screenHeigth = CANVAS_HEIGHT;
        this.screenWidth = CANVAS_WIDTH;
        this.spritewidth = 1374 / 6;
        this.spriteheight = 171;
        this.width = this.screenHeigth/3.34; 
        this.height = this.width/1.4;
        console.log(this.width, "x", this.height)
        this.image = new Image;
        this.image.src = "images/enemies/worm.png"
        this.frameX = 0;
        this.maxFrame = 5;
        this.fps = 30;
        this.timer = 0;
        this.interval = 1000/this.fps;
        this.x = this.screenWidth;
        this.y = this.screenHeigth - this.height - 20;
        this.speed = this.width/17.5;
        this.marked4Deletion = false;
    }
    update(deltaTime){
        if (this.timer > this.interval){
            if (this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX++;
            this.timer = 0;
        } else this.timer += deltaTime;
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.marked4Deletion = true;
            score++;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frameX * this.spritewidth, 0, this.spritewidth, this.spriteheight, this.x, this.y, this.width, this.height)        
    }
}
 
//Specific Functions
function handleEnemies(deltaTime){
if (!handled) {
    if (enemyTimer > enemyInterval && timeToNextGame > gameInterval + 1500){
        enemies.push(new Enemy)
        enemyTimer = 0;
        enemyInterval = Math.random() * 800 + 1500;
    } else enemyTimer += deltaTime;
    enemies.forEach (e => {
        e.update(deltaTime);
        e.draw();
    });
    enemies = enemies.filter(object => !object.marked4Deletion);
    handled = true;
}};
function updateEverything(deltaTime) {
    [...backgroundAndPlayer, ...particles, ...raven].forEach(object => {
        object.update(input, deltaTime);
        object.draw();
    });
    input.update(backgroundAndPlayer[1], enemies);
}
function getRavenInterval() {
    const a = 1000 - score;
    if (a > 50){
        return(a);
    } else {
        return (50);
    };
};
function getSizeModifier() {
        let c = Math.random() * 0.6 + 0.4;
        return(c); 
}
//Animation Loops
function animate(timestamp) {
    handled = false;
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextGame += deltaTime;
    console.log(timeToNextGame)
    ctx.clearRect(0,0,canvas.width, canvas.height);
    if (timeToNextGame < 1500) {
        updateEverything(deltaTime);
    } else if (timeToNextGame < gameInterval){
        if (backgroundAndPlayer.length == 1) backgroundAndPlayer.push(new Player);
        backgroundAndPlayer[1].restart()
        animateRavenGame(deltaTime);
    } else if (timeToNextGame < gameInterval + 1500){
        backgroundAndPlayer[1].restart()
        updateEverything(deltaTime);
    } else if (timeToNextGame < gameInterval * 2) {
        animateDogGame(deltaTime);
    } else if (timeToNextGame > gameInterval * 2) {
        timeToNextGame = 0;
        updateEverything(deltaTime)
    }
    else {
        updateEverything(deltaTime)
    }
    handleEnemies(deltaTime)
    raven = raven.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    requestAnimationFrame(animate);
};
function animateRavenGame (deltaTime){
    ravenInterval = getRavenInterval();
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval && backgroundAndPlayer[1].x < 0) {
        raven.push(new Raven());
        timeToNextRaven = 0;
        raven.sort(function(a, b) {
            return a.width - b.width;
        });
    };
    updateEverything(deltaTime)
    input.update(backgroundAndPlayer[1], enemies);
};
function animateDogGame (deltaTime){
    updateEverything(deltaTime);
    input.update(backgroundAndPlayer[1], enemies);
    handleEnemies(deltaTime)
};

//Start
animate(0);