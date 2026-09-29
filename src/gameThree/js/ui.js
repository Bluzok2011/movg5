export class UI {
    constructor(g) {
        this.game = g;
        this.fontSize = 40*this.game.hMod;
        this.fontFamily = "Creepster";
        this.image = document.getElementById("live");
        this.first = 40*this.game.hMod;
        this.second = 71*this.game.hMod;
        this.third = 100*this.game.hMod;
    }
    draw(ctx) {
        ctx.font = this.fontSize + "px " + this.fontFamily;
        ctx.textAlign = "left";
        ctx.fillStyle = this.game.fontColor;


        ctx.fillStyle = "white";
        ctx.fillText("Score: " + this.game.score, 20, this.first+2);
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + this.game.score, 20, this.first);

        ctx.font = this.fontSize*0.7 + "px " + this.fontFamily;
        ctx.fillStyle = "white";
        ctx.fillText("Energy: " + this.game.player.energy.toFixed(1), 20, this.second+2);
        ctx.fillStyle = "black";
        ctx.fillText("Energy: " + this.game.player.energy.toFixed(1), 20, this.second);

        ctx.fillStyle = "white";
        ctx.fillText("Timer: " + (this.game.time * 0.001).toFixed(1), 20, this.third+2);
        ctx.fillStyle = "black";
        ctx.fillText("Timer: " + (this.game.time * 0.001).toFixed(1), 20, this.third);


        for (let i = 0;i < this.game.lifetime;i++) {
            let j = 25 * this.game.hMod;
            let h = 30 * this.game.hMod;
            ctx.save()
            ctx.filter = "invert(100%)"
            ctx.drawImage(this.image, this.game.width-(this.game.lifetime*h+2) +(h*i), this.first-h*1.2-2,j+4,j+4);
            ctx.restore()

            j = 25 * this.game.hMod;
            h = 30 * this.game.hMod;
            ctx.drawImage(this.image, this.game.width-(this.game.lifetime*h) +(h*i), this.first-h*1.2,j,j);
        }


        if (this.game.gameOver) {
            ctx.font = this.fontSize * 2 + "px " + this.fontFamily;
            ctx.textAlign = "center";
            if (this.game.score >this.game.goal && this.game.killed === false) {
                ctx.fillText("BOO!!", this.game.width / 2, this.game.height / 2);
                ctx.fillStyle = "green";
                ctx.fillText("BOO!!", this.game.width / 2+2, this.game.height / 2+2);
                ctx.fillStyle = "black";
                ctx.font = this.fontSize *0.9  + "px " + this.fontFamily;
                ctx.fillStyle = "green";
                ctx.fillText("Who is afraid of who here?", this.game.width / 2 + 2, this.game.height / 2 + 45*this.game.hMod+2);
                ctx.fillStyle = "black";
                ctx.fillText("Who is afraid of who here?", this.game.width / 2, this.game.height / 2 + 45*this.game.hMod)

            } else {
                ctx.fillStyle = "red";
                ctx.fillText("Love at first bite?", this.game.width / 2 + 2, this.game.height / 2+2);
                ctx.fillStyle = "black";
                ctx.fillText("Love at first bite?", this.game.width / 2, this.game.height / 2);

                ctx.font = this.fontSize *0.75  + "px " + this.fontFamily;
                ctx.fillStyle = "red";
                ctx.fillText("Nope. Better luck next time!", this.game.width / 2, this.game.height / 2 +45*this.game.hMod);
                ctx.fillStyle = "black";
                ctx.fillText("Nope. Better luck next time!", this.game.width / 2+2, this.game.height / 2 +45*this.game.hMod+2);
            }

        }

    }
}