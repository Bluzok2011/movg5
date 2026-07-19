import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbyEnemy } from "./enemies.js";
import { UI } from "./ui.js";

window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    const CANVAS_HEIGHT = canvas.height = window.innerHeight;
    const mod = CANVAS_HEIGHT/500
    const CANVAS_WIDTH = canvas.width = window.innerWidth;
    let lastTime = 0;


    class Game {
        constructor(height, width, modif) {
            this.width = width;
            this.height = height;
            this.hMod = modif;
            this.gameOver = false;
            this.killed = false;
            this.speed = 0;
            this.maxSpeed = 3;
            this.debu = false;
            this.score = 0;
            this.particles = [];
            this.float = [];
            this.lifetime = 5;
            this.goal = 25;
            console.log("Modifier: ", modif);
            this.input = new InputHandler(this);
            this.ground = 83 * this.hMod;
            this.background = new Background(this);
            this.player = new Player(this, ctx);
            this.enemies = [];
            this.enemyInter = Math.random() * 500 +750;
            this.eimer = 0;
            this.time = 0;
            this.maxTime = 30000;
            this.fontColor = "black";
            this.UI = new UI(this);
        }
        update(deltaT){
            this.player.update(this.input.keys, deltaT);
            this.background.update();

            //enemies
            if (this.eimer < this.enemyInter) this.eimer += deltaT;
            else {
                this.enemyInter = Math.random() * 500 +750;
                this.eimer = 0;
                this.addEnemy();
            }

            this.enemies.forEach(enem =>{
                enem.update(deltaT);
            })
            this.enemies = this.enemies.filter(enemy => !enemy.marked4deletion);

            this.particles.forEach(particle => {
                particle.update(deltaT);
            })
            this.float.forEach(particle => {
                particle.update();
            })
            for (let i = 100; i < this.particles.length; i++) {
                this.particles.splice(Math.floor(Math.random() * (this.particles.length -1)), 1)
            }
            this.particles = this.particles.filter(part => !part.marked4Deletion);
            this.float = this.float.filter(part => !part.marked4Deletion);

            //Time Win
            if (this.score <= 0) this.score = 0;
            this.time += deltaT;
            if (this.time > this.maxTime) this.gameOver = true;
        }
        draw(ctx){
            this.background.draw(ctx);
            this.UI.draw(ctx);
            if (!this.gameOver) {
                this.player.draw(ctx);
                this.particles.forEach(particle => {
                    particle.draw(ctx);
                })
                this.float.forEach(particle => {
                    particle.draw(ctx);
                })
                this.enemies.forEach(enem => {
                    enem.draw(ctx);
                })
            }
        }
        addEnemy() {
            this.enemies.push(new FlyingEnemy(this));
            if (this.speed > 0 && Math.random() > 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbyEnemy(this));
        }
    }

    const GAME = new Game(CANVAS_HEIGHT, CANVAS_WIDTH, mod);
    function animate(timestamp){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const delta = timestamp - lastTime;
        lastTime = timestamp;
        GAME.update(delta);
        GAME.draw(ctx);
        if (!GAME.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});

