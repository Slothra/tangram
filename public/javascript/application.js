// Application.js
var Tan = {
    _WIDTH: 2000,
    _HEIGHT: 600

};
var gameWidth = 2000;
var gameHeight = 600;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-space');

var pauseKey;
var unpauseKey;
var xStartPos = 0;
var yStartPos = gameHeight - 100;
var player;
var playerGrams = {};

Tan.LevelOne = function(game){};

Tan.LevelOne.prototype = {
    preload: function(){
        game.load.image('sky', 'assets/sky.png');
        game.load.image('platform', 'assets/platform_10x10.png');
        game.load.image('pigeon', 'assets/sprites/pigeons.png');
        game.load.spritesheet('brick', 'assets/sprites/tan-square-move.png', 32, 37, 3);
        game.load.spritesheet('brickHat', 'assets/sprites/spritesheet_hat.png', 33, 58, 3);
        game.load.image('sm_triangle', 'assets/grams/sm_triangle.png');
        game.load.image('water', 'assets/water.png')
    },
    create: function(){

        var xWorldBounds = 5000;
        var yWorldBounds = 800
        pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        background = game.add.tileSprite(0, 0, xWorldBounds, gameHeight + 200, 'sky');
        game.world.setBounds(0, 0, xWorldBounds, yWorldBounds);

        waters = game.add.group();
        waters.enableBody = true;

        platforms = game.add.group();
        platforms.enableBody = true;

        grams = game.add.group();
        grams.enableBody = true;

        var ground = platforms.create(0, game.world.height - 50, 'platform');
        ground.scale.setTo(xWorldBounds/10, 7);
        ground.body.immovable = true;

        var water01 = createWater((xWorldBounds/10 + 1000), 25, 1000, 300);
        var plat01 = createPlatform(20, 40, 300, 250);
        makeImmovable(plat01);
        var plat02 = createPlatform(6, 3, 600, 400);
        makeImmovable(plat02);
        var plat03 = createPlatform(6, 3, 700, 500);
        makeImmovable(plat03);
        var plat04 = createPlatform(16, 45, 900, 500);
        makeImmovable(plat04);
        var plat05 = createPlatform(17, 7, 1500, 500);
        makeImmovable(plat05);
        var plat06 = createPlatform(4, 19, 1500, 430);
        makeImmovable(plat06);
        var plat07 = createPlatform(17, 15, 1500, 200);
        makeImmovable(plat07);
        var plat08 = createPlatform(9, 18, 1580, 380);
        makeImmovable(plat08);
        var plat09 = createPlatform(12, 3, 1800, 380);
        makeImmovable(plat09);
        var plat10 = createPlatform(15, 3, 2000, 500);
        makeImmovable(plat10);
        var plat11 = createPlatform(18, 3, 2400, 440);
        makeImmovable(plat11);
        var plat12 = createPlatform(30, 50, 2700, 350);
        makeImmovable(plat12);
        var plat13 = createPlatform(12, 3, 3200, 450);
        makeImmovable(plat13);
        var plat14 = createPlatform(12, 3, 3500, 470);
        makeImmovable(plat14);
        var plat15 = createPlatform((xWorldBounds/10 + 3900), 50, 3900, 350);
        makeImmovable(plat15);

        // Create a gram
        var triGram = grams.create(200, game.world.height - 70, 'sm_triangle');
        triGram.body.gravity.y = 6;

        function createPlatform(widthScale, heightScale, xPixFromLeft, yPixFromBottom){
            var newPlatform = platforms.create(xPixFromLeft, game.world.height - yPixFromBottom, 'platform');
            newPlatform.scale.setTo(widthScale, heightScale);
            return newPlatform;
        }

        function createWater(widthScale, heightScale, xPixFromLeft, yPixFromBottom){
            var newWater = waters.create(xPixFromLeft, game.world.height - yPixFromBottom, 'water');
            newWater.scale.setTo(widthScale, heightScale);
            return newWater;
        }

        function makeImmovable(sprite){
            sprite.body.immovable = true;
        }

        player = game.add.sprite(xStartPos, yStartPos, 'brickHat')

        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 400;
        player.body.collideWorldBounds = true;

        player.animations.add('walk', [0, 1, 2], 10, true);


        // camera mechanics
        game.camera.follow(player);

        // deadzone
        game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 100);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
    },

    update: function(){
        game.physics.arcade.collide(grams, platforms);
        game.physics.arcade.overlap(player, grams, collectGram, null, this);
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(enemies, platforms);
        // if (game.physics.arcade.collide(enemies, player) == true){
        //     die(player)
        // };
        // Checks if player is collides with water;
        if (game.physics.arcade.overlap(player, waters) == true){
            // console.log("I forgot my swimsuit!");
        };
        cursors = game.input.keyboard.createCursorKeys();

        if (game.physics.arcade.collide(enemies, player) == true){
            die(player)
        };
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown){
            //  Move to the left
            player.body.velocity.x = -150;
            player.animations.play('walk');
        } else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;
            player.animations.play('walk');

        } else {
            //  Stand still
            player.animations.stop();
            player.frame = 0;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down){
            player.body.velocity.y = -400;
        }

        if (pauseKey.isDown){
            debugger;
            xStartPos = player.position.x;
            yStartPos = player.position.y;
            game.state.start('PauseMenu')
        }

        function collectGram(player, gram){
            playerGrams.hat = gram;
            console.debug(playerGrams)
            gram.kill();
            var position = player.position;
            // player.kill()
            // player = game.add.sprite(position.x, position.y, 'brickHat');

            console.debug(positionx);
        }

        function transform(){
            if (playerGrams.length > 0) {
                // game.physics.moveToObject(playerGrams[0], player);
                console.debug('grams', playerGrams);
                console.debug('player', player);
            }

        }

    }

};

Tan.PauseMenu = function(game){};

Tan.PauseMenu.prototype = {
    preload: function(){
        // Load a menu here

    },
    create: function(){
        unpauseKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        // Retrieve inventory
        // Populate menu

    },
    update: function(){
        // Allow form change
        // Allow unpause
        if (unpauseKey.isDown){
            game.state.start('LevelOne')
        }

    }
}

game.state.add('LevelOne', Tan.LevelOne);
game.state.add('PauseMenu', Tan.PauseMenu);

game.state.start('LevelOne');
