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
var playerGrams = {};
var playerForm = 'brick';
var enemyMovementTriggers;
var enemies;
var createdEnemy;
var platformMovementTriggers;
var platformRightTrigger;
var platformLeftTrigger;
var movPlat;
var underwater = false;
var playerSpeed = 150;
var crabbyCrab;
var leftPincer;
var rightPincer;
var pincers;
var originPosition;
var countdown = false;
var pincer;
var needNewCoconut = false;
var coconut;
var coconuts;
var crabLife = 3;
var display;
var gramCount = 0;
var coins;

Tan.LevelOne = function(game){};

Tan.LevelOne.prototype = {
    preload: function(){
        game.load.image('sky', 'assets/sky.png');
        game.load.image('platform', 'assets/platform_10x10.png');
        game.load.image('pigeon', 'assets/sprites/pigeons.png');
        game.load.spritesheet('brick', 'assets/sprites/player_spritesheet3.png', 64, 64, 9);
        game.load.image('sm_triangle', 'assets/grams/sm_triangle.png');
        game.load.image('water', 'assets/water.png');
        game.load.image('crab', 'assets/sprites/block.png');
        game.load.spritesheet('coconut-roll','assets/sprites/coconut-roll.png', 31,32,8);
        game.load.spritesheet('coin','assets/sprites/coin_spritesheet1.png', 32, 22, 8);


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

        // Create a gram
        var triGram = grams.create(200, game.world.height - 70, 'sm_triangle');
        triGram.body.gravity.y = 6;
        triGram.name = 'hat'

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

        initializePlayer();
        initializeCamera();

        player.animations.add('walk', [0, 1, 2], 10, true);
        player.animations.add('jump', [1]);
        player.animations.add('walkHat', [3, 4, 5], 10, true);
        player.animations.add('jumpHat', [4]);
        player.animations.add('swim', [6, 7, 8], 10, true);
        player.animations.add('jumpFish', [7]);

        // camera mechanics
        game.camera.follow(player);

        // deadzone
        game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 100);

        //enemies to be DRY'ed out
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

        // enemy = game.add.sprite(75,yWorldBounds - 65,'pigeon', 0, enemies);
        game.physics.enable(enemies, Phaser.Physics.ARCADE);
        createdEnemy.body.velocity.x = 100;

        pincers = game.add.group();
        pincers.enableBody = true;
        pincers.physicsBodyType = Phaser.Physics.ARCADE;

        coconuts = game.add.group();
        coconuts.enableBody = true;
        coconuts.physicsBodyType = Phaser.Physics.ARCADE;

        crabbyCrab = game.add.sprite(3500, yWorldBounds - 200, 'crab', 0, enemies);
        crabbyCrab.scale.x = 1;
        crabbyCrab.scale.y = .5;
        crabbyCrab.anchor.setTo(.5, 0);
        crabbyCrab.body.velocity.x = -50;

        leftTriggerCrabby = game.add.sprite(3200, yWorldBounds - 200, null, 0, enemyMovementTriggers);
        leftTriggerCrabby.body.setSize(4, 32, 0, 0);
        rightTriggerCrabby = game.add.sprite(3885, yWorldBounds - 200, null, 0, enemyMovementTriggers);
        rightTriggerCrabby.body.setSize(4, 32, 0, 0);

        leftPincer = game.add.sprite(3400, yWorldBounds - 250, 'platform', 0, pincers);
        rightPincer = game.add.sprite(3600, yWorldBounds - 300, 'platform', 0, pincers);
        
        // leftPincer.scale.x = .4;
        // leftPincer.scale.y = .2;
        leftPincer.body.immovable = true;

        
        // rightPincer.scale.x = .5;
        // rightPincer.scale.y = .25;
        rightPincer.body.immovable = true;

        coconut = game.add.sprite(3550, 300, 'coconut-roll', 0, coconuts);



        // Creating coins
        coins = game.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = Phaser.Physics.ARCADE;
        createCoins();


        function createCoins(){
            // Creates 25 coins in random places
            for (var i = 0; i < 25; i++){
                var coin = coins.create(game.world.randomX, game.rnd.integerInRange(-200, 200), 'coin');
                coin.body.gravity.y = 1000;
                var coinAnim = coin.animations.add('rotate');
                // coins rotate at various speeds
                coinAnim.play(game.rnd.integerInRange(5, 10), true);
            }

        }


        function initializePlayer(){
            //could probably be moved outside of create
            player = game.add.sprite(xStartPos, yStartPos, 'brick')
            game.physics.arcade.enable(player);

            player.body.bounce.y = 0;
            player.body.gravity.y = 400;
            player.body.collideWorldBounds = true;
            player.body.setSize(32, 32, 0, 32);
            player.anchor.setTo(.5, 0);
        }

        function initializeCamera(){
            game.camera.follow(player);
            game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 100);

        }

    },

    update: function(){
        game.physics.arcade.collide(grams, platforms);
        game.physics.arcade.overlap(player, grams, collectGram, null, this);
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(coconuts, platforms);
        game.physics.arcade.collide(coconuts, player);
        game.physics.arcade.collide(enemies, coconuts, bossCoconutHandler, null, this)
        game.physics.arcade.collide(coins, platforms);



        cursors = game.input.keyboard.createCursorKeys();

        // Checks if player is collides with water;
        if (game.physics.arcade.overlap(player, waters) == true){
            underwater = true;
            playerSpeed = 100;
        } else {
            underwater = false;
            playerSpeed = 150;
        };

        cursors = game.input.keyboard.createCursorKeys();
        game.physics.arcade.collide(enemies, player, collisionHandler, null, this);
        game.physics.arcade.collide(pincers, player, bossCollisionHandler, null, this);
        function collisionHandler (player, enemy) {
            if (enemy.body.touching.up){
                enemy.kill();
                player.body.velocity.y = -200;
            } else {
                player.kill();
                game.state.start('GameOver');
            }
        }

        function bossCollisionHandler (player, enemy) {
            player.kill();
            game.state.start('GameOver');
        }

        function bossCoconutHandler() {
            crabLife--;
            coconut.destroy();
            needNewCoconut = true;
            if (crabLife === 0){
                console.log("YOU WIN!")
                crabbyCrab.destroy();
                leftPincer.destroy();
                rightPincer.destroy();
            }
        }
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        // Set playerForm;
        if (underwater){
            playerForm = 'fish';
        }
        if (playerForm == 'fish'){
            if (!underwater && playerGrams.hat && player.body.touching.down){
                playerForm = 'hat';
            } 
            else if (!underwater && player.body.touching.down){
                playerForm = 'brick';
            }
        }

        if (playerForm != 'fish'){
            if (playerGrams.hat){
                playerForm = 'hat';
            }
            else{
                playerForm = 'brick';
            }
        }


        switch (playerForm){
          case 'brick':
            moveAsBrick();
            break;
          case 'hat':
            moveAsBrickHat();
            break;
          case 'fish':
            moveAsFish();
            break;
          default:
            moveAsBrick();
        }

        function movePlayer(staticFrame, walkAnim, jumpAnim, xVel, yVel){
            if (cursors.left.isDown){
                //  Move to the left
                player.body.velocity.x = -(xVel);
                if (player.scale.x == -1){
                    player.animations.play(walkAnim);
                } else {
                    player.scale.x *= -1; 
                }
            } else if (cursors.right.isDown) {
              //  Move to the right
                player.body.velocity.x = (xVel);
                if (player.scale.x == 1){
                    player.animations.play(walkAnim);
                } else {
                    player.scale.x *= -1; 
                }
            } else {
              //  Stand still
              player.animations.stop();
              player.frame = staticFrame;
              }

            // Check if player is underwater
            if (underwater){
                if (cursors.up.isDown){
                    player.body.velocity.y = yVel;
                }
            }
              //  Allow the player to jump if they are touching the ground.
            else {
                if (!underwater && cursors.up.isDown && player.body.touching.down){
                    player.body.velocity.y = yVel;
                }
            }

            if (!player.body.touching.down){
                player.animations.play(jumpAnim);
            }            
        }

        function moveAsBrick(){
            movePlayer(0, 'walk', 'jump', playerSpeed, -400);
        }

        function moveAsBrickHat(){
            movePlayer(3, 'walkHat', 'jumpHat', playerSpeed, -400);
        }

        function moveAsFish(){
            movePlayer(6, 'swim', 'jumpFish', playerSpeed - 10, -300);
        }


        if (pauseKey.isDown){
            xStartPos = player.position.x;
            yStartPos = player.position.y;
            game.state.start('PauseMenu')
        }

        function collectGram(player, gram){
            // debugger;
            headsUpDisplay(gram);
            display.addChildAt(gram,gramCount);
            gramCount++;
            playerGrams[gram.name] = gram;
            gram.kill();
        }

        function headsUpDisplay(gram){
            display = game.add.sprite(0, 0, gram.key);
            display.fixedToCamera = true;
            display.cameraOffset.x = 10;
            display.cameraOffset.y = 10;

        }
        
        // Claw moves to platform (needs animations)
        if (player.position.x > 3200 && countdown == false){
            countdown = true;
            createCoconut();
            game.time.events.add(Phaser.Timer.SECOND * 3, pinch, this);
        }

        function pinch(){
            if (player.position.x > 3600){
                game.physics.arcade.moveToXY(rightPincer,3600,400);
                pincer = 1;
            } else {
                game.physics.arcade.moveToXY(leftPincer,3300,400);
                pincer = -1;
            }
            game.time.events.add(Phaser.Timer.SECOND * 4.5, returnPinch, this);
        }

        function returnPinch(){
            if (pincer === 1){
                game.physics.arcade.moveToXY(rightPincer,3600,500);   
            } else if (pincer === -1){
                game.physics.arcade.moveToXY(leftPincer,3400,550);
            }
            game.time.events.add(Phaser.Timer.SECOND * 4.5, pausePinch, this);
        }

        function pausePinch(){
            if (countdown == true){
                leftPincer.body.velocity.y = 0;
                leftPincer.body.velocity.x = 0;
                rightPincer.body.velocity.y = 0;
                rightPincer.body.velocity.x = 0;
                countdown = false;
            }
            if (coconut.position.y > 600) {
                coconut.destroy();
                needNewCoconut = true;
            }
        }

        function createCoconut(){
            if (needNewCoconut == true && pincer == 1){
                needNewCoconut = false;
                coconut = game.add.sprite(3280, 300, 'coconut-roll', 0, coconuts);
            } else if (needNewCoconut == true){
                coconut = game.add.sprite(3550, 300, 'coconut-roll', 0, coconuts);
                needNewCoconut = false;
            }
            // game.physics.arcade.enable(coconut);

            // coconut.body.bounce.y = 0;
            coconut.body.gravity.y = 600;
            coconut.animations.add('roll', [0,1,2,3,4,5,6,7,8], 20, true);
        }

        if (coconut.body.velocity.x > 0) {
            coconut.animations.play('roll');
        } else if (coconut.body.velocity.x < 0) {
            coconut.animations.play('roll');
        } else {
            coconut.animations.stop;
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
