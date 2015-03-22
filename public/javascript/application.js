// Application.js
var Tan = {
    _WIDTH: 2000,
    _HEIGHT: 600

};
var gameWidth = 800;
var gameHeight = 600;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-space');

var pauseKey;
var unpauseKey;
var xStartPos = 0;
var yStartPos = gameHeight;
var player;
var enemyMovementTriggers;
var enemies;
var createdEnemy;
var platformMovementTriggers;
var platformRightTrigger;
var platformLeftTrigger;
var movPlat;

Tan.LevelOne = function(game){};

Tan.LevelOne.prototype = {
    preload: function(){
        game.load.image('sky', 'assets/sky.png');
        game.load.image('platform', 'assets/platform_10x10.png');
        game.load.image('pigeon', 'assets/sprites/pigeons.png');
        game.load.spritesheet('brick', 'assets/sprites/tan-square-move.png', 33, 37, 3);
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
        var plat16 = createPlatform(8, 3, 3000, 200);
        makeImmovable(plat16);
        var plat17 = createPlatform(8, 3, 1700, 200);
        makeImmovable(plat17);

        platformMovementTriggers = game.add.group();
        platformMovementTriggers.enableBody = true;
        platformMovementTriggers.allowGravity = false;
        platformMovementTriggers.physicsBodyType = Phaser.Physics.ARCADE;

        platformLeftTrigger = game.add.sprite(1200, 300, null, 0, platformMovementTriggers);
        platformLeftTrigger.body.setSize(40, 500, 0, 0);
        platformRightTrigger = game.add.sprite(1400, 300, null, 0, platformMovementTriggers);
        platformRightTrigger.body.setSize(40, 100, 0, 0);

        movPlat = createPlatform(10,3, 1300, 500);
        game.physics.enable(movPlat, Phaser.Physics.ARCADE);
        movPlat.allowGravity = false;
        movPlat.body.velocity.x = 50;
        movPlat.body.immovable = true;

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

        player = game.add.sprite(xStartPos, yStartPos, 'brick')
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0;
        player.body.gravity.y = 400;
        player.body.collideWorldBounds = true;

        player.animations.add('walk', [0, 1, 2], 10, true);
        player.animations.add('jump', [1])

        // camera mechanics
        game.camera.follow(player);

        // deadzone
        game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 100);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        // Enemy movement triggers
        enemyMovementTriggers = game.add.group();
        enemyMovementTriggers.enableBody = true;
        enemyMovementTriggers.physicsBodyType = Phaser.Physics.ARCADE;

        leftTrigger = game.add.sprite(100, yWorldBounds - 65, null, 0, enemyMovementTriggers);
        leftTrigger.body.setSize(4, 32, 0, 0);
        rightTrigger = game.add.sprite(210, yWorldBounds - 65, null, 0, enemyMovementTriggers);
        rightTrigger.body.setSize(4, 32, 0, 0);

        // creates enemy with triggers
        createdEnemy = game.add.sprite(200, yWorldBounds - 65, 'pigeon', 0, enemies);
        createdEnemy.anchor.setTo(.5, 0); //so it flips around its middle
 
        // createdEnemy.animations.add('birdwalk', [0], 10, true);

        // enemy = game.add.sprite(75,yWorldBounds - 65,'pigeon', 0, enemies);
        game.physics.enable(createdEnemy, Phaser.Physics.ARCADE);
        createdEnemy.body.velocity.x = 100;


    },

    update: function(){

        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(enemies, platforms);

        // Checks if player is collides with water;
        if (game.physics.arcade.overlap(player, waters) == true){
            // console.log("I forgot my swimsuit!");
        };
        cursors = game.input.keyboard.createCursorKeys();

        if (game.physics.arcade.collide(enemies, player) && createdEnemy.body.touching.up){
            createdEnemy.kill();
            console.log('he dead');
            player.body.velocity.y = -200;
        } else if (game.physics.arcade.collide(player, enemies) || game.physics.arcade.collide(player, enemies)){
            console.log('you dead');
            die(player);
        };
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown){
            //  Move to the left
            player.body.velocity.x = -150;
            if (player.body.touching.down){
                player.animations.play('walk');
            }
        } else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;
            if (player.body.touching.down){
                player.animations.play('walk');
            }

        } else {
            //  Stand still
            player.animations.stop();
            player.frame = 0;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down){
            player.body.velocity.y = -400;
        }

        if (!player.body.touching.down){
            player.animations.play('jump')
        }

        if (pauseKey.isDown){
            xStartPos = player.position.x;
            yStartPos = player.position.y;
            game.state.start('PauseMenu')

        }

        game.physics.arcade.overlap(enemies, enemyMovementTriggers, function(enemy, trigger) {
        // Do a simple check to ensure the trigger only changes the enemy's direction
        // once by storing it in a property on the enemy. This prevents enemies getting
        // 'stuck' inside a trigger if they overlap into it too far.
            if (enemy.lastTrigger !== trigger) {
                // Reverse the velocity of the enemy and remember the last trigger.
                enemy.scale.x *= -1;
                enemy.body.velocity.x *= -1;
                enemy.lastTrigger = trigger;
            }
        });

        game.physics.arcade.overlap(platforms, platformMovementTriggers, function(platform, trigger) {
        // Do a simple check to ensure the trigger only changes the enemy's direction
        // once by storing it in a property on the enemy. This prevents enemies getting
        // 'stuck' inside a trigger if they overlap into it too far.
            if (platform.lastTrigger !== trigger) {
                // Reverse the velocity of the enemy and remember the last trigger.
                platform.body.velocity.x *= -1;
                platform.lastTrigger = trigger;
            }
        });

        function die(){
            player.kill();
            game.state.start('GameOver');
        };

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

Tan.GameOver = function(game){};

Tan.GameOver.prototype = {
    preload: function(){
        // load death screen images
    },
    create: function(){
        // place dead screen
        // ask to restart
        
    },
    update: function(){
        var restartKey = game.input.keyboard.addKey(Phaser.Keyboard.Y);
        var endKey = game.input.keyboard.addKey(Phaser.Keyboard.N);
        // restart from last checkpoint (start of level, boss)
        if (restartKey.isDown){
            game.state.start('LevelOne')
        }
        if (endKey.isDown){
            console.Log("Bye!")
        }

    }
}



game.state.add('LevelOne', Tan.LevelOne);
game.state.add('PauseMenu', Tan.PauseMenu);
game.state.add('GameOver', Tan.GameOver);
game.state.start('LevelOne');
