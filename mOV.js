const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collision');
const collisionCtx = collisionCanvas.getContext('2d'); 
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;


let score = 0;
ctx.font = '50px Impact';

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

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
        } else {
            this.timeSinceFlap += deltaTime;
        }
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }
        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
            score--;
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
}

window.addEventListener('click', function(e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    raven.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
            // collision detected
            object.markedForDeletion = true;
            score += 2;
        }
    });
});

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
    [...raven].forEach(object => {
        object.update(deltaTime);
        object.draw();
        raven = raven.filter(object => !object.markedForDeletion);
    });
    /*canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    collisionCanvas.width = window.innerWidth;
    collisionCanvas.height = window.innerHeight;*/
    requestAnimationFrame(animate);
    
};
animate(0);