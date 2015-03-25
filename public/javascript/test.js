// Application.js
var Tan = {
    _WIDTH: 2000,
    _HEIGHT: 600

};
var gameWidth = 800;
var gameHeight = 600;
var xWorldBounds = 5000;
var yWorldBounds = 800
var gamePadding = yWorldBounds - gameHeight;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-space');

var pauseKey;
var unpauseKey;
var menuKey;
var menu;

var gamePaused = false;
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
var pauser = false;

Tan.LevelOne = function(game){};

Tan.LevelOne.prototype = {
    preload: function(){
        game.load.image('sky', 'assets/sky.png');
        game.load.image('platform', 'assets/platform_10x10.png');
        game.load.image('pigeon', 'assets/sprites/pigeons.png');
        game.load.spritesheet('brick', 'assets/sprites/player_spritesheet.png', 32, 64, 9);
        game.load.image('sm_triangle', 'assets/grams/sm_triangle.png');
        game.load.image('water', 'assets/water.png');

        game.load.image('diamond', 'assets/sprites/tan-square.png');
        game.load.image('menu', 'assets/sprites/block.png');
    },
    create: function(){

        // var xWorldBounds = 5000;
        // var yWorldBounds = 800
        pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        unpauseKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);

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

        function collisionHandler (player, enemy) {
            console.log(player, enemy)
            if (enemy.body.touching.up){
                enemy.kill();
                player.body.velocity.y = -200;
            } else {
                player.kill();
                game.state.start('GameOver');
            }
        }
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        switch (playerForm){
          case 'brick':
            moveAsBrick();
            break;
          case 'hat':
            moveAsBrickHat();
            break;
          default:
            moveAsBrick();
        }

        function movePlayer(staticFrame, walkAnim, jumpAnim){
            if (cursors.left.isDown){
                //  Move to the left
                player.body.velocity.x = -(playerSpeed);
                if (player.scale.x == -1){
                    player.animations.play(walkAnim);
                } else {
                    player.scale.x *= -1; 
                }
            } else if (cursors.right.isDown) {
              //  Move to the right
                player.body.velocity.x = (playerSpeed);
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
              //  Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown && player.body.touching.down){
                player.body.velocity.y = -400;
            }
            if (!player.body.touching.down){
                player.animations.play(jumpAnim);
            }            
        }

        function moveAsBrick(){
            movePlayer(0, 'walk', 'jump');
        }

        function moveAsBrickHat(){
            movePlayer(3, 'walkHat', 'jumpHat');
        }
    
            //  Allow the player to swim.
        if (underwater && cursors.up.isDown){
            player.body.velocity.y = -300;
        }
            
            //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down){
            player.body.velocity.y = -400;
        }

        // PAUSE MENU
        if (pauseKey.isDown && pauser === false){
            pauser = true;
            pauseMenu();
        }

        function pauseMenu(){
            // game.paused = true;
            
            // menu = game.add.sprite(gameWidth/2, gameHeight/2 + gamePadding, 'menu');
            // menu.anchor.setTo(0.5, 0.5);

            //needs to set camera offset so it appears in the camera not just at the beginning of the game
            // createPauseMenu();
            menu = game.add.sprite(game.camera.view.x + 400, -gameHeight, 'menu');
            menu.anchor.setTo(0.5, 0.5);
            menuText = game.add.text(game.camera.view.x + 400, gameHeight/2 + gamePadding, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
            menuText.anchor.setTo(0.5, 0.5);
            game.paused = true;
            game.input.onDown.addOnce(unpause,self);
        }

        
    
        function unpause(event){
            // Only act if paused
            
            if(game.paused && pauser === true){

                // Calculate the corners of the menu
                var x1 = gameWidth/2 - 270/2, x2 = gameWidth/2 + 270/2,
                    y1 = gameHeight/2 - 180/2, y2 = gameHeight/2 + 180/2;

                // Check if the click was inside the menu
                if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                    // // The choicemap is an array that will help us see which item was clicked
                    // var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                    // // Get menu local coordinates for the click
                    // var x = event.x - x1,
                    //     y = event.y - y1;

                    // // Calculate the choice 
                    // var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

                    // // Display the choice
                    // menuText.text = 'You chose menu item: ' + choisemap[choise];
                }
                else{
                    // Remove the menu and the label
                    game.add.tween(menu).to( { y: -gameHeight }, 400, Phaser.Easing.Bounce.Out, true);

                    // menu.destroy();
                    menuText.destroy();

                    // Unpause the game
                    game.paused = false;
                    pauser = false;
                }
            }
        };

        function collectGram(player, gram){
            playerGrams[gram.name] = gram;
            console.debug(playerGrams)
            gram.kill();
            playerForm = gram.name;
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
        playerForm = 'brick';
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