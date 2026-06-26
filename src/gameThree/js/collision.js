class Collision {
    constructor(game, x, y) {
        this.game = game;
        this.image = document.getElementById("dust");
        this.sW = 100;
        this.sH = 90;
        this.sizeModif = Math.random() + 0.5;
        this.dW = this.sW * this.sizeModif;
        this.dh = this.sH * this.sizeModif;
        this.dX = x - this.dW /2;
        this.dY = y - this.dh /2;
        this.frameX = 0;
        this.maxX = 4;
        this.marked4deletion = false;
        this.frimer = 0;
        this.interval = 100;
    }
    update(delta) {
        if (this.frimer > this.interval) {
            this.frameX ++;
            this.frimer = 0;
        }
        else this.frimer += delta;
        if (this.frameX > this.maxX) this.marked4deletion = true;
    }
    draw(ctx){
        ctx.drawImage(this.image, this.frameX* this.sW , 0, this.sW, this.sH, this.dX, this.dY, this.dW, this.dh);
    }
}