import {Sitting, Running, Jumping, Falling, Rolling, Diving, Hit} from "./states.js";
import { Collision } from "./collision.js";
import { FloatingMessage } from "./floatMessage.js";

export class Player {
    constructor(game, ctx){
        this.game = game;
        this.ctx = ctx;
        this.sWidth = 100;
        this.sHeigth = 91.3;
        this.width = this.sWidth * this.game.hMod;
        this.height = this.sHeigth * this.game.hMod;
        this.x = 0;
        this.y = (this.game.height - this.height) - this.game.ground;
        this.image = document.getElementById("doggo");
        this.frameX = 0;
        this.maxX = 4;
        this.frameY = 3;
        this.speed = 0;
        this.splashs = 30;
        this.vy = 0;
        this.maxSpeed = 10*this.game.hMod;
        this.gravity = 0.575 * this.game.hMod;
        this.states = [
            new Sitting(this, this.game), //0
            new Running(this, this.game), //1
            new Jumping(this, this.game), //2
            new Falling(this, this.game), //3
            new Rolling(this, this.game), //4
            new Diving(this, this.game),  //5
            new Hit(this, this.game)];    //6
        this.curState = this.states[0];
        this.curState.enter();
        this.interval = 1000  / 20;
        this.nextFrame = 0;
        this.cooldown = 0;
        this.radius = 45*this.game.hMod;
        this.centerY = null;
        this.centerX = null;
        this.sound = new Audio();
        this.sound.src = "../../audio/rock_breaking.flac";
    }
    update(input, deltatime){
        this.checkCollision();

        //input Handler
        this.curState.handleInput(input, deltatime);

        //animations
        if (this.nextFrame < this.interval) this.nextFrame += deltatime;
        else {
            this.nextFrame = 0;
            if (this.frameX === this.maxX) this.frameX = 0;
            else this.frameX++;
        }

        //speed control
        if (input.includes("d")) {
            if (this.speed < this.maxSpeed) {
                this.speed += 0.5;
            }
        } else {
            if (this.speed > 0) {
                this.speed -= 0.5;
            }
        }
        if (input.includes("a")) {
            if (this.speed > -this.maxSpeed) {
                this.speed -= 0.5;
            }
        } else {
            if (this.speed < 0) {
                this.speed += 0.5;
            }
        }

        //movement
        if (!(this.curState === this.states[6])) {
            this.x += this.speed*this.game.hMod;
        }
        this.y += this.vy;
        this.centerY = this.y - this.height/2;
        this.centerX = this.x - this.width/2;

        //boundaries
        if (!this.onGround()) {
            this.vy += this.gravity;
        } else {
            this.vy = 0;
        }
        if (this.y > (this.game.height - this.height) - this.game.ground) this.y = this.game.height - this.height - this.game.ground;
        if (this.x <= 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        //circle center and other checks
        this.centerY = this.y + this.height * 0.66;
        this.centerX = this.x + this.width * 0.5;
    }
    draw(){
        if (this.game.debu) {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
        this.ctx.drawImage(this.image, this.sWidth * this.frameX, this.sHeigth * this.frameY, this.sWidth, this.sHeigth, this.x, this.y, this.width, this.height);

    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.ground;
    }
    setState(s, speed){
        this.curState = this.states[s];
        this.game.speed = this.game.maxSpeed * speed;
        this.curState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enem => {
            if (this.checkCircRectCollision(enem)){
                //collision
                enem.marked4deletion = true;
                this.game.particles.push(new Collision(this.game, enem.x+enem.width/2, enem.y+enem.height/2, enem.kind));
                if (this.curState === this.states[5] || this.curState === this.states[4]) {
                    this.game.score += enem.score;
                    this.game.float.push(new FloatingMessage("+"+enem.score, enem.x, enem.y, this.game.width, 20, this.game));
                } else if (!(this.curState === this.states[6])){
                    this.setState(6, 0);
                    this.game.lifetime--;
                    this.game.score -= enem.score*2;
                    this.game.float.push(new FloatingMessage("-"+enem.score*2, enem.x, enem.y, this.game.width, 20, this.game));
                    if (this.game.lifetime <= 0) {
                        this.game.gameOver = true;
                        this.game.killed = true;
                    }
                    console.log("Live lost")
                }
            }
        })
    }
    checkCircRectCollision(rect){

        const closestX = Math.max(rect.x, Math.min(this.centerX, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(this.centerY, rect.y + rect.height));

        // 2. Distance from your class center properties to the closest point
        const distanceX = this.centerX - closestX;
        const distanceY = this.centerY - closestY;

        // 3. Squared distance check
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        return distanceSquared <= (this.radius * this.radius);
    }
}
