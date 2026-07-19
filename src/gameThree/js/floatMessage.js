export class FloatingMessage {
    constructor(value,x,y,targetX,targetY, game) {
        this.value = value;
        this.game = game;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.timer = 0;
        this.px = 20 * this.game.hMod;
        this.marked4Deletion = false;
    }
    update() {
        this.x += (this.targetX - this.x)*0.03;
        this.y += (this.targetY - this.y)*0.03;
        this.timer++;
        if (this.timer >= 100) {
            this.marked4Deletion = true;
        }
    }
    draw(ctx){
        ctx.font = this.px+"px Creepster";
        ctx.fillStyle = "#fff";
        ctx.fillText(this.value, this.x+2, this.y+2);
        ctx.fillStyle = "#000000";
        ctx.fillText(this.value, this.x, this.y);
    }
}