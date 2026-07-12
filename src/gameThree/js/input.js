export class InputHandler {
    constructor(game){
        this.keys = [];
        this.game = game;
        window.addEventListener("keydown", e => {
            if ((e.key === "s"  //Down
                || e.key === "w" //Up
                || e.key === "a"  //Left
                || e.key === "d" //Right
                || e.key === "Enter" //Action
            ) && this.keys.indexOf(e.key) === -1 ) {
                this.keys.push(e.key)
            } else if (e.key === "k") this.game.debu = !this.game.debu;


        });
        window.addEventListener("keyup", e => {
            if (e.key === "s"  //Down
                || e.key === "w" //Up
                || e.key === "a"  //Left
                || e.key === "d" //Right
                || e.key === "Enter" //Action
            ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }

        });

    }
}