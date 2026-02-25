const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const starterButton = document.querySelector("#start")
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collision');
const collisionCtx = collisionCanvas.getContext('2d'); 
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;


let score = 500;
let gameOver = false;
ctx.font = '50px Impact';

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

function getRavenScore(a) {
    const b = a * 100;
    const c = Math.floor(b);
    const e = 100 - c;
    const f = e * 2;
    return(f)
}
function getRavenDamage(a) {
    const b = a * 100;
    const c = Math.floor(b);
    const e = 100 - c;
    const f = e * 1.5;
    return(f)
}

let raven = [];
class Raven {
    constructor() {
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = 271 * this.sizeModifier;
        this.height = 194 * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'raven.png'; 
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 40;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.5;
        this.score = getRavenScore(this.sizeModifier);
        this.damage = getRavenDamage(this.sizeModifier);
    }
    update(deltaTime) {
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
        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
            score -= this.damage;
        }
    }
    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
        ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80);
    console.log(score);
}

let explosions = [];
class Explosion {
    constructor (x, y, size){
        this.image = new Image();
        this.image.src = "boom.png";
        this.spriteHeight = 179;
        this.spriteWidth = 200;
        this.size = size;
        this.frame = 0;
        this.x = x;
        this.y = y;
        this.sound = new Audio();
        this.sound.src = "rock_breaking.flac";
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        if (this.frame === 0)this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - (this.size * 0,25) , this.size, this.size);
    }
}


window.addEventListener('click', function(e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;
    raven.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
            // collision detected
            object.markedForDeletion = true;
            score += object.score;
            explosions.push(new Explosion(object.x, object.y, object.width))
        }
    });
});

function drawGameOver(){
    ctx.textAlign = "center"
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "white"
    ctx.fillText("GAME OVER", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
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

function animate(timestamp) {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    collisionCtx.clearRect(0,0,collisionCanvas.width, collisionCanvas.height);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval) {
        raven.push(new Raven());
        timeToNextRaven = 0;
        raven.sort(function(a, b) {
            return a.width - b.width;
        });
    }
    drawScore();
    [...particles, ...raven, ...explosions].forEach(object => {
        object.update(deltaTime);
        object.draw();
    });
    raven = raven.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    if (score < 1) gameOver = true;
    if (!gameOver) {
        requestAnimationFrame(animate);
    } else { 
        drawGameOver();
    }
};
starterButton.addEventListener("click", function() {
    animate(0);
    starterButton.style.visibility = "hidden";
})
