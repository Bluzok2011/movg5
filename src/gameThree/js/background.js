class Helper {
    constructor(g, w, h, sm, i) {
        this.game = g;
        this.width = w;
        this.height = h;
        this.sMod = sm;
        this.image = i;
        this.x = 0;
        this.y = 0;
    }
    update() {
        if (this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.sMod;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
       if(this.game.width>this.width) context.drawImage(this.image, this.x + this.width*2, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game) {
        this.game = game;
        this.width = 1667 * this.game.hMod;
        this.height = this.game.height;

        //layers
        this.layer1Image = document.getElementById("layer1");
        this.layer1 = new Helper(game, this.width, this.height, 0, this.layer1Image);

        this.layer2Image = document.getElementById("layer2");
        this.layer2 = new Helper(game, this.width, this.height, 0.2, this.layer2Image);

        this.layer3Image = document.getElementById("layer3");
        this.layer3 = new Helper(game, this.width, this.height, 0.4, this.layer3Image);

        this.layer4Image = document.getElementById("layer4");
        this.layer4 = new Helper(game, this.width, this.height, 0.8, this.layer4Image);

        this.layer5Image = document.getElementById("layer5");
        this.layer5 = new Helper(game, this.width, this.height, 1, this.layer5Image);

        this.backgrounds = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }
    update(){
        this.backgrounds.forEach(background => {
            background.update();
        })
    }
    draw(context) {
        this.backgrounds.forEach(background => {
            background.draw(context);
        })
    }
}