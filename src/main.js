import "pixi";
import "p2";
import Phaser from "phaser";
import BootState from "./states/Boot";
import config from "./config";

class Game extends Phaser.Game {

    constructor() {
        const docElement = document.documentElement
        const width = docElement.clientWidth;
        const height = docElement.clientHeight;
        let scaleX = width / config.gameWidth;
        let scaleY = height / config.gameHeight;
        console.log(["scale = ", scaleX, scaleY].join(" "));
        if (scaleX > scaleY)
            scaleX = scaleY;
        else
            scaleY = scaleX;
        super(config.gameWidth * scaleX, config.gameHeight * scaleY, Phaser.AUTO, 'content', null)
        console.log(["result scale = ", width, height, config.gameWidth * scaleX, config.gameHeight * scaleY, scaleX, scaleY].join(" "));
        this.state.add('Boot', BootState, false)
        this.state.start('Boot')

    }
}

window.game = new Game()
