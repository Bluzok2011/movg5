class Enemy {
    constructor(game){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frimer = 0;
        this.game = game;
        this.score = undefined;
        this.marked4deletion = false;
        this.width = undefined;
        this.spritewidth = undefined;
        this.height = undefined;
        this.x = undefined;
        this.y = undefined;
        this.speedX = undefined;
        this.speedY = undefined;
        this.maxX = undefined;
        this.image = undefined;
        this.kind = undefined;
    }
    update(delta) {
        // movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.frimer > this.frameInterval) {
            this.frimer = 0;
            if (this.frameX < this.maxX) this.frameX++;
            else this.frameX = 0;

        } else this.frimer += delta;

        if (this.x + this.width < 0) {
            this.marked4deletion = true;
            this.game.score -= this.score;
        }
    }
    draw(ctx){
        if (this.game.debu) ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frameX * this.spritewidth, 0, this.spritewidth, this.spriteheight ,this.x, this.y, this.width, this.height);
    }
}
export class FlyingEnemy extends Enemy{
    constructor(game) {
        super(game);
        this.width = Math.random() * 40 + 30;
        this.height = this.width/1.36;
        this.spritewidth = 60;
        this.spriteheight = 44;
        this.score = 3;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxX = 5;
        this.image = document.getElementById("fly");
        this.angle = 0;
        this.kind = "fly"
        this.va = Math.random() * 0.1 + 0.05;
    }
    update(deltaT){
        super.update(deltaT);

        this.angle += this.va;
        this.y += Math.sin(this.angle);
        this.va = Math.random() * 0.1 + 0.05;
    }
}

export class GroundEnemy extends Enemy{
    constructor(game) {
        super(game);
        this.width = Math.random() * 30 + 40;
        this.height = this.width/0.68;
        this.spritewidth = 60;
        this.spriteheight = 87;
        this.score = 1;
        this.x = this.game.width;
        this.y = this.game.height - this.game.ground - this.height;
        this.speedX = 0;
        this.speedY = 0;
        this.maxX = 1;
        this.kind = "plant"
        this.image = document.getElementById("knofensa");
    }
    /*update(){

    }
    draw(ctx){

    }*/
}

export class ClimbyEnemy extends Enemy{
    constructor(game) {
        super(game);
        this.width = Math.random() * 70 + 70;
        this.height = this.width/0.83;
        this.spritewidth = 120;
        this.spriteheight = 144;
        this.score = 2;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxX = 5;
        this.kind = "spider"
        this.image = document.getElementById("ariados");
    }
    update(deltaT){
        super.update(deltaT);
        if (this.y > this.game.height - this.height - this.game.ground ) this.speedY *= -1;
        if (this.y < -this.height) this.marked4deletion = true;
    }
    draw(ctx){
        super.draw(ctx);
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2,0);
        ctx.lineTo(this.x + this.width/2, this.y +50);
        ctx.stroke();
        ctx.closePath();
    }
}
