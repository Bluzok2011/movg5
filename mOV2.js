window.addEventListener ("load", function(){
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 1200;
const CANVAS_HEIGHT = canvas.height = 720;
let enemies = [];
let enemyTimer = 0;
let enemyInterval = Math.random() * 1000 + 750;
let lastTime = 0;
let score = 0;
let gameOver = false;

class InputHandler {
    constructor(){
        this.keys = [];
        window.addEventListener("keydown", e => {
            if ((e.key === "a" ||
                e.key === "w" ||
                e.key === "s" ||
                e.key === "d") &&
                this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            } else if (e.key === 'Enter' && gameOver) {
                restartWindow();
            }
            
        })
        window.addEventListener("keyup", e => {
            if (e.key === "a" ||
                e.key === "w" ||
                e.key === "s" ||
                e.key === "d"){
                this.keys.splice(this.keys.indexOf(e.key), 1);
                //this.keys.splice(0, this.keys.length)
            }
        })
    }
}

class Player {
    constructor(CANVAS_HEIGHT, CANVAS_WIDTH){
        this.gamewidth = CANVAS_WIDTH;
        this.gameheight = CANVAS_HEIGHT;
        this.width = 200;
        this.height = 200;
        this.x = 0;
        this.y = this.gameheight - this.height -20;
        this.vy = 0
        this.image = doggo;
        this.frameX = 0;
        this.maxFrameX = 8
        this.frameY = 0;
        this.speed = 0;
        this.vy = 0;
        this.gravity = 1;
        this.fps = 30;
        this.timer = 0;
        this.interval = 1000/this.fps;

    }
    update(input, deltaTime, enemies){
        if (this.timer > this.interval){
            if (this.frameX >= this.maxFrameX) this.frameX = 0;
            else this.frameX++;
            this.timer = 0;
        } else this.timer += deltaTime;
        if (input.keys.indexOf("d") > -1){
            this.speed = 5;
        } else if (input.keys.indexOf("a") > -1){
            this.speed = -5;
        }  else this.speed = 0;
        if (input.keys.indexOf("w" ) > -1 && this.isGrounded()){
            this.vy -= 32;
        }
        if (this.x < 0) this.x = 0;
        else if (this.x > this.gamewidth - this.width) this.x = this.gamewidth - this.width
        this.x += this.speed;
        this.y += this.vy;
        if (!this.isGrounded()) {
            this.vy += this.gravity;
            this.frameY = 1;
            this.maxFrameX = 5
        } else {
            this.vy = 0;
            this.maxFrameX = 8
            this.frameY = 0;
        }
        if (this.y < 0) this.y = 0;
        else if (this.y > this.gameheight - this.height) this.y = this.gameheight - this.height
        enemies.forEach(enem => {
            const dx = (enem.x + enem.width/2) - (this.x + this.width/2);
            const dy = (enem.y + enem.height/2) - (this.y + this.height/2);
            const pythagoras = Math.sqrt(dx * dx + dy * dy);
            const sumOfRadii = enem.width/2 + this.width/2
            if (pythagoras < sumOfRadii){
                gameOver = true;
            }         
        })
        
    }
    draw(){
        //ctx.strokeRect(this.x, this.y, this.width, this.height + 1);
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2);
        ctx.stroke();
        ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }
    isGrounded(){
        return this.y >= this.gameheight - this.height - 20;
    }
    restart(){
        this.x = 0;
        this.y = this.gameheight - this.height -20;
        this.vy = 0
        this.image = doggo;
        this.frameX = 0;
        this.maxFrameX = 8
        this.frameY = 0;
        this.speed = 0;
        this.vy = 0;
        this.gravity = 1;
        this.fps = 30;
        this.timer = 0;
        this.interval = 1000/this.fps; 
    }
}

class Backround {
    constructor(gameheight, gamewidth){
        this.screenWidth = gamewidth;
        this.screenHeigth = gameheight;
        this.image = forest;
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 720;
        this.speed = 7;
    }
    update(){
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x + this.width -1, this.y, this.width, this.height)
    }
    restart() {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 720;
        this.speed = 7;
    }
}

class Enemy {
    constructor(gameheight, gamewidth){
        this.screenHeigth = gameheight;
        this.screenWidth = gamewidth;
        this.spritewidth = 1374 / 6;
        this.spriteheight = 171;
        this.width = 215
        this.height = 150;
        this.image = worm;
        this.frameX = 0;
        this.maxFrame = 5;
        this.fps = 30;
        this.timer = 0;
        this.interval = 1000/this.fps;
        this.x = this.screenWidth;
        this.y = this.screenHeigth-this.height-20;
        this.speed = Math.random() * 2 + 7;
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
        //ctx.strokeRect(this.x, this.y, this.width, this.height + 1)
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/1.5, this.width/2, 0, Math.PI*2);
        ctx.stroke();
        ctx.drawImage(this.image, this.frameX * this.spritewidth, 0, this.spritewidth, this.spriteheight, this.x, this.y, this.width, this.height)        
    }
}
 
function handleEnemies(deltaTime){
    if (enemyTimer > enemyInterval){
        enemies.push(new Enemy (CANVAS_HEIGHT, CANVAS_WIDTH))
        enemyTimer = 0;
        enemyInterval = Math.random() * 1000 + 750;
    } else enemyTimer += deltaTime;
    enemies.forEach (e => {
        e.update(deltaTime);
        e.draw();
    });
    enemies = enemies.filter(object => !object.marked4Deletion)
}

function restartWindow(){
    players.restart();
    background.restart();
    score = 0;
    gameOver = false;
    enemies = [];
    animate(0);
}

function displayStatus(){
    if (!gameOver){
        ctx.textAlign = 'left';
        ctx.font = '50px Impact';
        ctx.fillStyle = 'black';
        ctx.fillText('Score: ' + score, 20, 50);
        ctx.fillStyle = 'white';
        ctx.fillText('Score: ' + score, 22.5, 52.5);
    } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.fillStyle = "#A9A9"
        ctx.fillText('Game Over; score: ' + score + '; press Enter to restart', CANVAS_WIDTH/2 - 2.5, CANVAS_HEIGHT/2 - 2.5);
        ctx.fillStyle = 'white';
        ctx.fillText('Game Over; score: ' + score + '; press Enter to restart', CANVAS_WIDTH/2 , CANVAS_HEIGHT/2);
    }

}

const input = new InputHandler();
const background = new Backround(CANVAS_HEIGHT, CANVAS_WIDTH)
const players = new Player(CANVAS_HEIGHT, CANVAS_WIDTH);

function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    console.log(enemies);
    ctx.clearRect(0, 0,CANVAS_WIDTH, CANVAS_HEIGHT);
    background.update();
    background.draw();
    players.update(input, deltaTime, enemies);
    players.draw();
    handleEnemies(deltaTime);
    displayStatus();
    if (!gameOver){
        requestAnimationFrame(animate);
    }
}
animate(0);
});
