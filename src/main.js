import "pixi";
import "p2";
import Phaser from "phaser";
import BootState from "./states/Boot";
import config from "./config";

class Game extends Phaser.Game {

    constructor() {
        const docElement = document.documentElement
        const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
        const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight
        super(800, 600, Phaser.AUTO, 'content', null)
        this.state.add('Boot', BootState, false)
        this.state.start('Boot')

    }
}

window.game = new Game()
