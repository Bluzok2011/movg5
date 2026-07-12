import { Dust, Fire, Splash } from "./particles.js";

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}

class State {
    constructor(st, pl, game) {
        this.state = st;
        this.player = pl;
        this.game = game;
    }
    
}

export class Sitting extends State {
    constructor(pl, game) {
        super("Sitting", pl, game);
    }
    enter() {
        this.player.frameY = 5;
        this.player.maxX = 4;
        this.player.frameX = 0;
        this.player.cooldown = 0;
        this.player.speed = 0;
        this.player.vy = 15;
        this.player.radius = 45;
    }
    handleInput(input, d) {
        if (this.player.cooldown < 100) this.player.cooldown += d;
        else {
            if (input.includes("d") || input.includes("a")) this.player.setState(states.RUNNING, 1);
            if (input.includes("w")) this.player.setState(states.JUMPING, 1);
            if (input.includes("Enter")) this.player.setState(states.ROLLING, 2);
        }
    }
}
export class Running extends State {
    constructor(pl, g) {
        super("Running", pl, g);
    }
    enter() {
        this.player.frameY = 3;
        this.player.maxX = 8;
        this.player.frameX = 0;
        this.player.cooldown = 0;
        this.player.radius = 45;
    }
    handleInput(input, d) {
        this.game.particles.push(new Dust(this.game, this.player.x + this.player.width*0.6, this.player.y + this.player.height*0.9));
        if (this.player.cooldown < 100) this.player.cooldown += d;
        else {
            if (input.includes("s")) this.player.setState(states.SITTING, 0);
            if (input.includes("w")) this.player.setState(states.JUMPING, 1);
            if (input.includes("Enter")) this.player.setState(states.ROLLING, 2);
        }
    }
}
export class Jumping extends State {
    constructor(pl, g) {
        super("Jumping", pl, g);
    }
    enter() {
        if (this.player.onGround()) {
            this.player.vy -= 20;
        }
        this.player.frameY = 1;
        this.player.maxX = 6;
        this.player.frameX = 0;
        this.player.radius = 45;
    }
    handleInput(input, d) {
        if (this.player.cooldown < 200) this.player.cooldown += d;
        else {
            if (input.includes("s")) this.player.setState(states.SITTING, 0);

            if (input.includes("Enter")) this.player.setState(states.ROLLING, 2);
        }
        if (this.player.vy > this.player.gravity) this.player.setState(states.FALLING, 1);
        if (input.includes("s")) this.player.setState(states.DIVING, 0);
    }
}
export class Falling extends State {
    constructor(pl, g) {
        super("Falling", pl, g);
    }
    enter() {
        this.player.frameY = 2;
        this.player.maxX = 6;
        this.player.frameX = 0;
        this.player.radius = 45;
    }
    handleInput(input) {
        if (input.includes("s")) this.player.setState(states.DIVING, 0);
        if (this.player.onGround()) this.player.setState(states.RUNNING, 1);
    }
}
export class Rolling extends State {
    constructor(pl, g) {
        super("Rolling", pl, g);
    }
    enter() {
        this.player.frameY = 6;
        this.player.maxX = 6;
        this.player.frameX = 0;
        this.player.radius= 30;
    }
    handleInput(input) {
        this.game.particles.push(new Fire(this.game, this.player.x + this.player.width, this.player.y + this.player.height));
        if (!input.includes("Enter") && this.player.onGround()) this.player.setState(states.RUNNING, 1);
        else if (!input.includes("Enter") && !this.player.onGround()) this.player.setState(states.FALLING, 1);
        else if (input.includes("Enter") && input.includes("w") && this.player.onGround()) this.player.vy -= 20;
        else if (!this.player.onGround() && input.includes("s")) this.player.setState(states.DIVING, 0);
    }
}
export class Diving extends State {
    constructor(pl, g) {
        super("Diving", pl, g);
    }
    enter() {
        this.player.frameY = 6;
        this.player.maxX = 6;
        this.player.frameX = 0;
        this.player.vy = 15;
        this.player.radius = 30;
    }
    handleInput(input) {
        this.game.particles.push(new Fire(this.game, this.player.x + this.player.width, this.player.y + this.player.height));
        if (input.includes("Enter") && this.player.onGround())  this.player.setState(states.ROLLING, 2);
        else if (input.includes("s") && this.player.onGround()) {
            for (let i = 0; i < 30; i++) {
                this.game.particles.push(new Splash(this.game,this.player.x + this.player.width*0.3, this.player.y));
            }
            this.player.setState(states.SITTING, 0);
        }
        else if (this.player.onGround()) {
            this.player.setState(states.RUNNING, 1);
            for (let i = 0; i < this.player.splashs; i++) {
                this.game.particles.push(new Splash(this.game, this.player.x + this.player.width*0.3, this.player.y));
                console.log (i)
            }
        }
    }
}
export class Hit extends State {
    constructor(pl, g) {
        super("Hit", pl, g);
    }
    enter() {
        this.player.frameY = 4;
        this.player.maxX = 10;
        this.player.frameX = 0;
        this.player.radius = 45;
    }
    handleInput(input) {
        if (this.player.onGround() && this.player.frameX >= this.player.maxX) {
            this.player.setState(states.RUNNING, 1);
        } else if (this.player.frameX >= this.player.maxX) {
            this.player.setState(states.FALLING, 1);
        }
    }
    }