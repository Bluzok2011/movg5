const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 500

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


let raven = [];
class Raven {
    constructor() {
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.sizeModifier = getSizeModifier();
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

function animate(timestamp) {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ravenInterval = getRavenInterval();
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
    [...particles, ...raven].forEach(object => {
        object.update(deltaTime);
        object.draw();
    });
    raven = raven.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    requestAnimationFrame(animate)
};
animate(0);