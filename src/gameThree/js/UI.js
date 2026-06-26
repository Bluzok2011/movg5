export class UI {
    constructor(g) {
        this.game = g;
        this.fontSize = 30;
        this.fontFamily = "Arial";
    }
    draw(ctx) {
        ctx.font = this.fontSize + "px " + this.fontFamily;
        ctx.textAlign = "left";
        ctx.fillStyle = this.game.fontColor;

        ctx.fillText("Score: " + this.game.score, 20, 50);
    }
}