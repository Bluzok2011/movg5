export class Collision {
    constructor(game, x, y, kind) {
        this.game = game;
        this.enemyKind = kind;
        this.image = document.getElementById("dust");
        this.sW = 200;
        this.sH = 197;
        this.sizeModif = this.getSize(this.enemyKind);
        this.dW = (this.sW/2 * this.sizeModif)*this.game.hMod;
        this.dh = (this.sH/2 * this.sizeModif)*this.game.hMod;
        this.dX = x - this.dW /2;
        this.dY = y - this.dh /2;
        this.frameX = 0;
        this.maxX = 4;
        this.marked4Deletion = false;
        this.frimer = 0;
        this.interval = Math.random() * 70 + 60;

    }
    update(delta) {
        if (this.frimer > this.interval) {
            this.frameX ++;
            this.frimer = 0;
        }
        else this.frimer += delta;
        //if (this.frameX === 0) this.game.player.sound.play();
        this.dX -= this.game.speed;
        if (this.frameX > this.maxX) this.marked4Deletion = true;
    }
    draw(ctx){
        ctx.drawImage(this.image, this.frameX* this.sW , 0, this.sW, this.sH, this.dX, this.dY, this.dW, this.dh);
    }
    getSize(kind){
        if (kind === "spider"){
            return Math.random() *0.6 + 1.25;
        } else if (kind === "fly"){
            return Math.random() *0.5 + 0.35;
        } else if (kind === "plant"){
            return Math.random() *0.75+ 0.5;
        }
    }
}