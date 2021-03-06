import Phaser from "phaser";
import config from "../config";

export default class extends Phaser.State {

    constructor() {
        super();
        this.platforms = null;
        this.player = null;
        this.stars = null;
        this.cursors = null;
        this.scoreText = null;
        this.ground = null;
        this.ledge0 = null;
        this.ledge1 = null;
        this.score = 0;
        this.offsetScale = 1;
    }

    preload() {
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    }

    getScale() {
        let docElement = document.documentElement
        let width = docElement.clientWidth;
        let height = docElement.clientHeight;
        let scaleX = width / config.gameWidth;
        let scaleY = height / config.gameHeight;
        if (scaleX >= scaleY)
            return scaleY;
        return scaleX;
    }


    create() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
        // this.game.scale.pageAlignHorizontally = true;
        this.offsetScale = this.getScale();

        this.game.scale.onOrientationChange.add(this.onOrientationChange, this);
        //  We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        this.game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.game.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        this.ground = this.platforms.create(0, this.game.world.height - (64 * this.offsetScale), 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.ground.scale.setTo(2 * this.offsetScale, 2 * this.offsetScale);

        //  This stops it from falling away when you jump on it
        this.ground.body.immovable = true;
        this.ground.y = this.game.world.height - (64 * this.offsetScale);
        //  Now let's create two ledges
        this.ledge0 = this.platforms.create(400 * this.offsetScale, 400 * this.offsetScale, 'ground');
        this.ledge0.x = 400 * this.offsetScale;
        this.ledge0.y = 400 * this.offsetScale;
        this.ledge0.body.immovable = true;

        this.ledge0.scale.setTo(this.offsetScale, this.offsetScale);

        this.ledge1 = this.platforms.create(-150 * this.offsetScale, 250 * this.offsetScale, 'ground');

        this.ledge1.body.immovable = true;
        this.ledge1.scale.setTo(this.offsetScale, this.offsetScale);
        // The player and its settings
        this.player = this.game.add.sprite(32 * this.offsetScale, this.game.world.height - (150 * this.offsetScale), 'dude');
        this.player.scale.setTo(this.offsetScale, this.offsetScale);
        //  We need to enable physics on the player
        this.game.physics.arcade.enable(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.stars = this.game.add.group();

        this.stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (let i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            let star = this.stars.create(i * 70 * this.offsetScale, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 6;
            star.scale.setTo(this.offsetScale, this.offsetScale)
            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.scoreText = this.game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    }

    update() {
        //  Collide the player and the stars with the platforms
        let hitPlatform = this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.collide(this.stars, this.platforms);
        this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down && hitPlatform) {
            this.player.body.velocity.y = -350;
        }
    }

    collectStar(player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

    }

    onOrientationChange(scale, prevOrientation, wasIncorrect) {
        this.offsetScale = this.getScale();

        this.game.scale.setGameSize(config.gameWidth * this.offsetScale, config.gameHeight * this.offsetScale)
        this.ground.scale.setTo(2 * this.offsetScale, 2 * this.offsetScale);
        this.ground.y = this.game.world.height - (64 * this.offsetScale);
        this.player.scale.setTo(this.offsetScale, this.offsetScale);
        this.player.x *= this.offsetScale;
        this.player.y *= this.offsetScale
        this.ledge0.scale.setTo(this.offsetScale, this.offsetScale);
        this.ledge0.x = 400 * this.offsetScale;
        this.ledge0.y = 400 * this.offsetScale;
        this.ledge1.scale.setTo(this.offsetScale, this.offsetScale);
        this.ledge1.x = -150 * this.offsetScale;
        this.ledge1.y = 250 * this.offsetScale;
        for (let i = 0; i < 12; i++) {
            let star = this.stars.getAt(i);
            star.x = i * 70 * this.offsetScale;
            star.y *= this.offsetScale;
            star.scale.setTo(this.offsetScale, this.offsetScale);
        }
        console.log(["scale = ", this.game.scale.width, this.game.scale.height, this.offsetScale].join(" "));
    }


}
