class Particle {
    constructor(game, x, y) {
        this.game = game;
        this.marked4Deletion = false;
        this.x = x;
        this.y = y;
        this.speedX = undefined;
        this.speedY = undefined;
        this.size = undefined
    }
    update() {
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95;
        if (this.size < 0.5) {
            this.marked4Deletion = true;
        }

    }
}
export class Dust extends Particle {
    constructor(game, x, y) {
        super(game, x, y);
        this.size = Math.random() * 10 +10;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = "rgba(0, 0, 0, 0.3)";
        this.isDust = Math.random() > 0.2;
        this.tranparency = Math.random() *0.33 + 0.44;
        if (!this.isDust) {
            this.image = document.getElementById("dust");
            this.size = Math.random() * 30 +20;
        }
    }
    draw(ctx) {
        if (this.isDust) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI,);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            ctx.save();
            ctx.globalAlpha = this.tranparency ;
            ctx.translate(this.x - this.size, this.y - this.size);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, 0, 0,  200, 200, this.size / 2, this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
}
export class Splash extends Particle {
    constructor(game, x, y) {
        super(game, x, y);
        this.color = "rgba(0, 0, 0, 0.3)";
        this.size = Math.random() * 100 +100;
        this.speedX = Math.random() * 6 -4;
        this.speedY = Math.random() * 2+2;
        this.gravity = 0;
        this.apple = 0.1; //Newton's apple -> update
        this.angle = 0;
        this.va = Math.random() *2 -1;
        this.isDust = Math.random() > 0.66;
        this.isDustToo = Math.random() < 0.2;
        if (this.isDust) {
            this.image = document.getElementById("dust");
            this.size /= 2;
        } else if (this.isDustToo) {
            this.size = Math.random() * 12 +12;
        }
        else this.image = document.getElementById("fire");

    }
    update() {
        super.update();
        this.gravity += this.apple; //Newton's apple
        this.y += this.gravity;
    }
    draw(ctx){
            ctx.save();
            ctx.translate(this.x - this.size * 0.5, this.y - this.size * 0.5);
            ctx.rotate(this.angle);
        if (this.isDust) {
            ctx.drawImage(this.image, 0, 0,  200, 200, this.size / 2, this.size / 2, this.size, this.size);
        }
        else if (this.isDustToo) {
            ctx.beginPath();
            ctx.arc(50,100, this.size, 0, 2 * Math.PI, );
            ctx.fillStyle = this.color;
            ctx.fill();
        } else ctx.drawImage(this.image, this.size / 2, this.size / 2, this.size, this.size);
        ctx.restore();
    }
}
export class Fire extends Particle {
    constructor(game, x, y) {
        super(game, x, y);
        this.image = document.getElementById("fire");
        this.size = Math.random() * 100 + 75;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 -0.1;

        this.noSin = Math.random() < 0.66;
    }
    update() {
        super.update();
        this.angle += this.va;
        if (!this.noSin) this.y += Math.sin(this.angle*0.75);
        else {
            if (this.size > 20 )this.size += 0.2;
            this.y += Math.sin(this.angle*7)
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x - this.size*0.3, this.y - this.size*0.4);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.size /2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}