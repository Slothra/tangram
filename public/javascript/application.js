// Application.js
var Tan = {
    _WIDTH: 2000,
    _HEIGHT: 600

};
var gameWidth = 800;
var gameHeight = 600;

// Menu dimensions
var x1;
var x2;
var y1;
var y2;
var mainMenu;
var mainMenuText;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-space');

var pauseKey;
var unpauseKey;
var pauser = false;
var xWorldBounds = 5000;
var yWorldBounds = 800;
var gamePadding = yWorldBounds - gameHeight;

var xStartPos = 30;

var cursors;

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
var gramCount = 1;
var coins;
var coinCount = 0;
var crabVel = -50;
var deadPlayer;
var bossTime = false;
var crabDead = false;
var firstTimeUnderwater = true;
var hint;
var levelTwoStart = 4500;
var currentLevel = 1;
var background;
var grams;
var sceneElemBack;
var sceneElem;

var grassGroup;

var shade;

var music;
var introMusic;
var selectSound;
var bossMusic;
var gameOverMusic;
var restartMusic;
var jumpSound;
var poofSound;
var splashSound;
var crackSound;
var coinSound;
var gramSound;
var fallingSound;

var muteKey;
var muted = false;


// Heads up display
var toggleKey;
var coinText;
var toggler;
var togglerDefaultPadding = 236;
var togglerPaddingLeft = togglerDefaultPadding;
var togglerPaddingTop = 10;
var toggleOn = false;
var togglePosition = 0;
var toggleForm;

Tan.MainMenu = function(game){};

Tan.MainMenu.prototype = {
    preload: function(){
        // menu graphics and sound
        game.load.spritesheet('menu', 'assets/sprites/MainMenu.png', 399.125, 393, 8);
        // game.load.image('button', 'assets/sprites/button.png');
        game.load.bitmapFont('font', 'assets/fonts/joystix_bitmap/joystix.png', 'assets/fonts/joystix_bitmap/joystix.fnt'); 
        game.load.audio('intro', 'assets/sound/restart.m4a');
        game.load.audio('menu-select', 'assets/sound/form-change.wav');

    },
    create: function(){
        // play sound create main menu including buttons for start/password
        introMusic = game.add.audio('intro');
        selectSound = game.add.audio('menu-select');
        selectSound.volume = .1;
        introMusic.loop = true;
        introMusic.play();
        mainMenu = game.add.sprite(400, 270, 'menu');
        mainMenu.anchor.setTo(.5,.5);
        mainMenu.animations.add('start', [0,1,2,3,4,5,6,7,6,5,4,3,2,1], 20, true)

        // var button = game.add.sprite(400, 500, 'button');
        // button.anchor.setTo(.5,.5);

        var text = "Click to begin"
        titleText = game.add.bitmapText(270,mainMenu.position.y-250, 'font', "TanGram", 40);
        mainMenuText = game.add.bitmapText(250, mainMenu.position.y+230, 'font', text, 25);
        x1 = gameWidth/2 - 270/2; 
        x2 = gameWidth/2 + 270/2;
        y1 = gameHeight/2 - 180/2;
        y2 = gameHeight/2 + 180/2;

    },
    update: function(){
        // if clicked starts game
        game.input.onDown.add(loading,self);   
        selectSound.volume = .1;
        var clickMenu = false;

        function clicked(){
            if (clickMenu === false){
                selectSound.play();
                clickMenu = true;
            }
        }

        function loading(){
            clicked();

            mainMenu.animations.play('start');
            game.time.events.add(Phaser.Timer.SECOND * 3, helpMenu, this);
        }
        function helpMenu(){
            clickMenu = false;
            mainMenu.destroy();

            var mainMenuText = "Left Arrow  - Move left\nRight Arrow - Move right\nUp Arrow    - Jump\nF button    - change form\nM button    - Mute game\nP button    - Pause game"
            var text = game.add.bitmapText(150, 200, 'font', mainMenuText, 25);
            game.input.onDown.add(startGame,self);
        }

        function startGame(){
            clicked();
            selectSound.play();
            introMusic.stop();
            game.state.start('Loading');
        }
    }
}

Tan.LevelOne = function(game){};

Tan.LevelOne.prototype = {
    preload: function(){
        // game.load.image('sky', 'assets/sky.png');
        // game.load.image('sky', 'assets/scene/blue_gradient.png');
        game.load.image('sky', 'assets/scene/beach2.png');


        game.load.image('platform', 'assets/platform_10x10.png');
        game.load.spritesheet('pigeon', 'assets/sprites/pigeon.png', 41.5, 32, 3)
        game.load.spritesheet('brick', 'assets/sprites/player_spritesheet3.png', 64, 64, 12);
        game.load.spritesheet('heart', 'assets/sprites/heart.png', 38,30,4)
        game.load.image('sm_triangle', 'assets/grams/sm_triangle2.png');
        game.load.image('sm_square', 'assets/grams/tan-square.png');
        game.load.spritesheet('death-tint', 'assets/sprites/deathtint.png', 800,600,3)

        game.load.image('water', 'assets/water.png');
        game.load.spritesheet('crab', 'assets/sprites/crab.png', 298.3, 143, 3);
        game.load.spritesheet('right-claw', 'assets/sprites/right-claw.png', 138, 133, 2);
        game.load.spritesheet('left-claw', 'assets/sprites/left-claw.png', 138, 133, 2);
        game.load.spritesheet('coconut-roll','assets/sprites/coconut-roll.png', 31,32,8);
        game.load.spritesheet('spiral', 'assets/sprites/spiral.png', 38.5, 38, 4);
        game.load.spritesheet('coin','assets/sprites/coin_spritesheet1.png', 32, 22, 8);
        game.load.image('displayCoin', 'assets/sprites/coin.png');
        game.load.spritesheet('collision', 'assets/sprites/colision.png', 30, 33, 3)
        game.load.spritesheet('badfish', 'assets/sprites/badfish-swim.png', 99, 72, 3);
        game.load.image('toggler', 'assets/sprites/gram_toggler2.png');
        game.load.spritesheet('hints', 'assets/sprites/LevelOneHints.png', 118,77,2);

        game.load.audio('exploring', 'assets/sound/exploring.m4a');
        game.load.audio('boss', 'assets/sound/boss.m4a');
        game.load.audio('suspense', 'assets/sound/suspense.m4a');
        game.load.audio('gameover', 'assets/sound/gameover.m4a');
        game.load.audio('restart', 'assets/sound/restart.m4a');
        game.load.audio('jumpSound', 'assets/sound/jump.wav');
        game.load.audio('poof', 'assets/sound/poof.wav');
        game.load.audio('splash', 'assets/sound/splash.wav');
        game.load.audio('crack', 'assets/sound/crack.mp3');
        game.load.audio('coin', 'assets/sound/coin.mp3');
        game.load.audio('gram', 'assets/sound/gram.wav');
        game.load.audio('menu-select', 'assets/sound/form-change.wav');

        game.load.bitmapFont('font', 'assets/fonts/joystix_bitmap/joystix.png', 'assets/fonts/joystix_bitmap/joystix.fnt'); 
    
        game.load.image('ground_sand', 'assets/scene/ground_sand_tile3.png');
        game.load.image('plat01', 'assets/scene/plat01.png');
        game.load.image('plat04', 'assets/scene/plat04_160x450.png');
        game.load.image('plat05_06', 'assets/scene/plat05_06.png');
        game.load.image('plat07_08', 'assets/scene/plat07_08.png');
        game.load.image('plat12', 'assets/scene/plat12_300x300.png');
        game.load.image('plat_end', 'assets/scene/platEnd.png');
        game.load.image('plat_end_rounded', 'assets/scene/plat_end_rounded.png');
        game.load.image('plank', 'assets/scene/plank2.png');
        game.load.image('plank_short', 'assets/scene/plank_short.png');
        game.load.image('plank_long', 'assets/scene/plank_long.png');
        game.load.image('seaweed', 'assets/scene/seaweed.png');
        game.load.image('rocks_small', 'assets/scene/rocks.png');
        game.load.image('rocks', 'assets/scene/rocks2.png');
        game.load.image('sign', 'assets/scene/sign.png');

        game.load.spritesheet('hat_glow', 'assets/grams/grams_anim3.png', 64,64,8);
        game.load.image('water_front', 'assets/scene/water_anim3.png');
        game.load.image('water_back', 'assets/scene/water_anim4.png');
        game.load.image('bubble', 'assets/scene/bubble.png');
        game.load.image('cloud', 'assets/scene/cloud.png');
        game.load.image('tree', 'assets/scene/palmtree.png');
        game.load.image('grass', 'assets/scene/grass.png');




    },

    create: function(){


        pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        toggleKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
        muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        background = game.add.tileSprite(0, 0, xWorldBounds, gameHeight + 200, 'sky');
        var clouds = game.add.group();

        game.world.setBounds(0, 0, xWorldBounds, yWorldBounds);



        music = game.add.audio('exploring');
        gameOverMusic = game.add.audio('gameover');
        music.loop = true;
        music.play();
        jumpSound = game.add.audio('jumpSound');
        poofSound = game.add.audio('poof');
        splashSound = game.add.audio('splash');
        crackSound = game.add.audio('crack');
        coinSound = game.add.audio('coin');
        gramSound = game.add.audio('gram');
        selectSound = game.add.audio('menu-select');
        selectSound.volume = .1;

        waters = game.add.group();
        waters.enableBody = true;

        platforms = game.add.group();
        platforms.enableBody = true;

        var waterBack = game.add.tileSprite(1062, 490, xWorldBounds, 512, 'water_back');
        var waterTween = game.add.tween(waterBack)
        .to( { y: 500}, 1000, Phaser.Easing.Linear.In, true, 0, -1)
        .yoyo(true).repeat(1000000).start();


        // Keep this group behind player
        sceneElemBack = game.add.group();

        grams = game.add.group();
        grams.enableBody = true;
        grams.physicsBodyType = Phaser.Physics.ARCADE;

        var ground = platforms.create(0, game.world.height - 50, 'platform');
        ground.scale.setTo(xWorldBounds/10, 7);
        ground.body.immovable = true;

        var water01 = createWater((xWorldBounds-levelTwoStart/10), 25, 1000, 300);
        var plat01 = createPlatform(20, 20, 300, 250, true);
        var plat02 = createPlatform(7, 3, 600, 400, true);
        var plat03 = createPlatform(7, 3, 700, 500, true);
        var plat04 = createPlatform(16, 45, 900, 500, true);
        var plat05 = createPlatform(17, 7, 1500, 500, true);
        var plat06 = createPlatform(4, 19, 1500, 430, true);
        var plat07 = createPlatform(17, 15, 1500, 200, true);
        var plat08 = createPlatform(9, 18, 1580, 380, true);
        var plat09 = createPlatform(12, 3, 1800, 380, true);
        var plat10 = createPlatform(17, 3, 2000, 500, true);
        var plat11 = createPlatform(17, 3, 2400, 440, true);
        var plat12 = createPlatform(30, 30, 2700, 350, true);
        var plat13 = createPlatform(13, 3, 3200, 450, true);
        var plat14 = createPlatform(12, 3, 3550, 470, true);
        var plat15 = createPlatform(((xWorldBounds - levelTwoStart)/10), 30, 3900, 350, true);
        var plat16 = createPlatform(8, 3, 3000, 200, true);
        var plat17 = createPlatform(8, 3, 1700, 200, true);

        platformMovementTriggers = game.add.group();
        platformMovementTriggers.enableBody = true;
        platformMovementTriggers.allowGravity = false;
        platformMovementTriggers.physicsBodyType = Phaser.Physics.ARCADE;

        createMovingPlat(1300, 500, 'plank', 150, 150);

        createGram(200, game.world.height - 110, 'hat_glow', 'hat', true);

        function createWater(widthScale, heightScale, xPixFromLeft, yPixFromBottom){
            var newWater = waters.create(xPixFromLeft, game.world.height - yPixFromBottom, 'water');
            newWater.scale.setTo(widthScale, heightScale);
            return newWater;
        }

        //enemies to be DRY'ed out
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        // Enemy movement triggers
        enemyMovementTriggers = game.add.group();
        enemyMovementTriggers.enableBody = true;
        enemyMovementTriggers.physicsBodyType = Phaser.Physics.ARCADE;

        // creates enemy with triggers
        createEnemy(200,80, 'pigeon', 50, 50);
        createEnemy(420,280, 'pigeon', 100, 80);
        createEnemy(2850,380, 'pigeon', 90, 90);
        createEnemy(2000, 150, 'badfish', 150, 150);
        createEnemy(2000, 300, 'badfish', 100, 600);


        initializePlayer();
        initializeCamera();

        player.animations.add('walk', [0, 1, 2], 10, true);
        player.animations.add('jump', [1]);
        player.animations.add('walkHat', [3, 4, 5], 10, true);
        player.animations.add('jumpHat', [4]);
        player.animations.add('swim', [6, 7, 8], 10, true);
        player.animations.add('jumpFish', [10]);
        player.animations.add('walkUnderwater', [0, 1, 2], 6, true);

        pincers = game.add.group();
        pincers.enableBody = true;
        pincers.physicsBodyType = Phaser.Physics.ARCADE;

        coconuts = game.add.group();
        coconuts.enableBody = true;
        coconuts.physicsBodyType = Phaser.Physics.ARCADE;

        crabbyCrab = game.add.sprite(3500, yWorldBounds - 200, 'crab', 0, enemies);
        crabbyCrab.animations.add('crabWalk',[0,1], 10, true);
        crabbyCrab.animations.add('hurt',[2], 10, true);
        crabbyCrab.anchor.setTo(.5, 0);
        crabbyCrab.body.velocity.x = crabVel;

        leftTriggerCrabby = game.add.sprite(3200, yWorldBounds - 200, null, 0, enemyMovementTriggers);
        leftTriggerCrabby.body.setSize(4, 32, 0, 0);
        rightTriggerCrabby = game.add.sprite(3885, yWorldBounds - 200, null, 0, enemyMovementTriggers);
        rightTriggerCrabby.body.setSize(4, 32, 0, 0);

        leftPincer = game.add.sprite(crabbyCrab.position.x - 150, 510, 'left-claw', 0, pincers);
        leftPincer.animations.add('leftPincerMove', [1], 10, true);
        leftPincer.animations.add('leftPinchAni', [0], 10, true);
        leftPincer.animations.play('leftPincerMove');
        rightPincer = game.add.sprite(crabbyCrab.position.x+149, 510, 'right-claw', 0, pincers);
        rightPincer.anchor.setTo(1,0);
        rightPincer.animations.add('rightPincerMove', [0], 10, true);
        rightPincer.animations.add('rightPinchAni', [1], 10, true);
        rightPincer.animations.play('rightPincerMove');
        leftPincer.body.immovable = true;
        rightPincer.body.immovable = true;

        coconut = game.add.sprite(3550, 300, 'coconut-roll', 0, coconuts);


        // Creating coins
        coins = game.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = Phaser.Physics.ARCADE;
        createCoins();
        
        createHeadsUpDisplay();

    // Scenic overlay
        var bubbles = game.add.group();
        var planks = game.add.group();
        var sands = game.add.group();
        sceneElem = game.add.group();
        //Sand
        game.add.tileSprite(0, 745, xWorldBounds, 70, 'ground_sand');
        sands.create(295, 541, 'plat01');
        sands.create(895, 290, 'plat04');
        sands.create(1495, 295, 'plat05_06');
        sands.create(1495, 415, 'plat07_08');
        sands.create(2695, 445, 'plat12');
        game.add.tileSprite(3950, 445, xWorldBounds, 350, 'plat_end');
        sands.create(3895, 445, 'plat_end_rounded');

        // Planks
        planks.create(590, 395, 'plank_short');
        planks.create(690, 295, 'plank_short');
        planks.create(1695, 595, 'plank_short');
        planks.create(1790, 415, 'plank');
        planks.create(1995, 295, 'plank_long');
        planks.create(2395, 355, 'plank_long');
        planks.create(3000, 595, 'plank_short');
        planks.create(3195, 345, 'plank');
        planks.create(3545, 325, 'plank');
        createSceneElem(.5, false, 1100, 110, 'seaweed', true);
        createSceneElem(.75, false, 1150, 150, 'seaweed' );
        createSceneElem(.6, false, 1200, 120, 'seaweed', true);
        createSceneElem(.5, false, 1390, 120, 'seaweed');
        createSceneElem(.7, false, 1420, 140, 'seaweed', true);
        createSceneElem(.6, false, 1720, 120, 'seaweed');
        createSceneElem(.9, false, 1750, 170, 'seaweed', true);
        createSceneElem(.6, true, 1800, 120, 'seaweed');
        createSceneElem(.5, false, 2070, 110, 'seaweed', true);
        createSceneElem(.75, true, 2120, 150, 'seaweed');
        createSceneElem(.35, false, 2190, 95, 'seaweed', true);
        createSceneElem(.75, false, 2230, 150, 'seaweed');
        createSceneElem(.5, true, 2260, 110, 'seaweed');
        createSceneElem(.35, true, 2300, 95, 'seaweed', true);
        createSceneElem(1, false, 1110, 60, 'rocks');
        createSceneElem(1, false, 1190, 60, 'rocks_small', true);
        createSceneElem(1, true, 1400, 60, 'rocks');
        createSceneElem(1, false, 1720, 60, 'rocks', true);
        createSceneElem(1, true, 1780, 60, 'rocks_small');
        createSceneElem(.7, true, 1900, 56, 'rocks', true);
        createSceneElem(1, false, 2100, 60, 'rocks_small');
        createSceneElem(.6, true, 2300, 55, 'rocks', true);
        createSceneElem(.4, false, 2350, 55, 'rocks_small');
        createSceneElem(1.5, false, 3070, 60, 'rocks');
        createSceneElem(1.8, false, 3150, 60, 'rocks_small', true);
        createSceneElem(1.8, false, 3450, 60, 'rocks_small', true);
        createSceneElem(1.5, true, 3510, 60, 'rocks');
        createSceneElem(1, false, 3590, 60, 'rocks', true);
        createSceneElem(1, false, 230, 235, 'tree');
        createSceneElem(.7, true, 775, 180, 'tree');


        // Creates water (front layer)
        var waterFront = game.add.tileSprite(1062, 505, xWorldBounds, 512, 'water_front');
        var waterTween = game.add.tween(waterFront)
        .to( { y: 495, alpha: 0.4 }, 2000, Phaser.Easing.Linear.In, true, 0, -1)
        .yoyo(true).repeat(1000000).start();

        // Creates 28 random bubbles in the water
        var bubbleDelay = 0;
        function createBubbles(){
            for (var i = 0; i < 28; i++){
                var bubble = bubbles.create(game.rnd.integerInRange(1200, xWorldBounds-1200), game.rnd.integerInRange(675, 750), 'bubble');
                bubble.scale.set(game.rnd.realInRange(0.3, 0.7));
                game.add.tween(bubble).to({ y: 500, alpha: 0 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, bubbleDelay, 1000, false);
                bubbleDelay += 200;
            }
        }
        createBubbles();

        // Creates clouds
        function createClouds(){
            for (var i = 0; i < 20; i++){
                var xStart = i * 250;
                var cloud = clouds.create(xStart, game.rnd.integerInRange(100,400), 'cloud');
                cloud.alpha = game.rnd.realInRange(0.1, 0.5);
                cloud.scale.set(game.rnd.realInRange(0.7, 4));
                game.add.tween(cloud).to({ x: xStart-1000}, 150000, Phaser.Easing.Linear.InOut, true, 0, 1000, false);
            }
        }
        createClouds();

        game.add.sprite(4260, 386, 'sign');

    },

    update: function(){
        // Sets up physics
        game.physics.arcade.collide(grams, platforms);
        game.physics.arcade.overlap(player, grams, collectGram, null, this);
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(coconuts, platforms);
        game.physics.arcade.collide(coconuts, player);
        game.physics.arcade.overlap(enemies, coconuts, bossCoconutHandler, null, this)
        game.physics.arcade.collide(coins, platforms);
        game.physics.arcade.overlap(player, coins, collectCoin, null, this);
        game.physics.arcade.collide(enemies, player, collisionHandler, null, this);
        game.physics.arcade.collide(pincers, player, bossCollisionHandler, null, this);

        // Sets up controls
        cursors = game.input.keyboard.createCursorKeys();

        // Sets up mute
        if (muteKey.isDown && muted === false){
            muted = true;
            game.time.events.add(Phaser.Timer.SECOND * .5, mute, this);
        }

        player.z = 1;

        function mute(){
            if (game.sound.volume === 1){
                game.sound.volume = 0;    
            } else {
                game.sound.volume = 1;
            }
            muted = false;
        }

        // Sets up pause Screen
        if (pauseKey.isDown && pauser === false){
            pauser = true;
            pauseMenu();
        }

        function pauseMenu(){
            menuText = game.add.text(game.camera.view.x + 400, gameHeight/2 + game.camera.view.y, 'Click to resume', { font: '30px Arial', fill: '#fff' });
            menuText.anchor.setTo(0.5, 0.5);
            game.paused = true;
            game.input.onDown.addOnce(unpause,self);
        }  
    
        function unpause(event){
            // Only act if paused
            if(game.paused && pauser === true){
                // menu.destroy();
                menuText.destroy();

                // Unpause the game
                game.paused = false;
                pauser = false;
            }
        };

        // Checks if player is collides with water;
        if (game.physics.arcade.overlap(player, waters) == true){
            if (underwater === false){
                splashSound.play();
            }
            underwater = true;
            playerSpeed = 100;
        } else {
            if (underwater === true){
                splashSound.play();
            }
            underwater = false;
            playerSpeed = 150;
        };

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        // Set playerForm
        for (var key in playerGrams){
            var gram = playerGrams[key];
            if (togglePosition == gram.displayIndex){
                toggleForm = gram.name;
                if (underwater){
                    if (toggleForm == 'brick'){
                        playerForm = 'brickUnderwater';
                    } else if (toggleForm == 'hat'){
                        playerForm = 'fish';
                    }
                } else if (playerForm == 'fish' && !underwater && !player.body.touching.down) {
                    playerForm = 'fish';
                } else {
                    playerForm = gram.name;
                }
            }
        }

        // Player Movement

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
          case 'brickUnderwater':
            moveAsBrickUnderwater();
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
                if (cursors.up.isDown && player.position.y > 470){
                    player.body.velocity.y = yVel;
                }
           }

              //  Allow the player to jump if they are touching the ground.
            else {
                if (!underwater && cursors.up.isDown && player.body.touching.down){
                    player.body.velocity.y = yVel;
                    jumpSound.play();
                }
            }

            if (!underwater && !player.body.touching.down && playerForm == 'fish')
                player.animations.play(jumpAnim);
            else if (!player.body.touching.down && playerForm != 'fish'){
                player.animations.play(jumpAnim);
                
            }            
        }

        function showHint(hintName){
            if (hint){
                hint.destroy();
            }
            hint = game.add.sprite(player.position.x - 20, player.position.y - 50, 'hints')
            hint.animations.add('water-hint', [0], 10, true);
            hint.animations.add('crab-hint', [1], 10, true);
            if (hintName === 'underwater'){
                hint.animations.play('water-hint')
                game.time.events.add(Phaser.Timer.SECOND * 3, hideHint, this);
            } else if (hintName === 'crab'){
                hint.animations.play('crab-hint')   
                game.time.events.add(Phaser.Timer.SECOND * 3, hideHint, this);
            }
            
        }

        function hideHint(){
            hint.destroy()
        }

        function moveAsBrick(){
            movePlayer(0, 'walk', 'jump', playerSpeed, -400);
        }

        function moveAsBrickUnderwater(){
            movePlayer(0, 'walkUnderwater', 'jump', playerSpeed/3, -300);
                if (firstTimeUnderwater === true && player.body.touching.down){
                    firstTimeUnderwater = false;
                    showHint('underwater');
                }
 
        }

        function moveAsBrickHat(){
            movePlayer(3, 'walkHat', 'jumpHat', playerSpeed, -400);
        }

        function moveAsFish(){
            movePlayer(6, 'swim', 'jumpFish', playerSpeed*1.25, -300);
        }

        function displayToggler(){
            if (toggler.displayed == false){
                toggler.visible = false;
            }
            else{
                toggler.visible = true;
            }            
        }

        function collectGram(player, gram){
            gram.displayIndex = gramCount;
            gramSound.play();
            gramCount++;
            playerGrams[gram.name] = gram;
            gram.kill();
        }

        function collectCoin(player, coin){
            coinSound.play();
            coinCount++;
            coinText.text = coinCount;
            coin.kill();
        }

        // Moves toggle position
        if (toggleKey.isDown && toggleOn == false){
            toggleOn = true;
            selectSound.play();
            if (togglePosition < gramCount-1){
                togglerPaddingLeft += 50;
                togglePosition++;
            } else {
                togglerPaddingLeft = togglerDefaultPadding;
                togglePosition = 0;
            }
            toggler.position.y = togglerPaddingTop;
            toggler.position.x = togglerPaddingLeft;
            toggler.fixedToCamera = true;
        } else if (toggleKey.isUp){
            toggleOn = false;
        }

        displayGrams();
        displayToggler();

        // Claw moves to platform (needs animations)
        
        var tempCrabVel;
        if (crabbyCrab.body.velocity.x === 0 && pincer == 1){
            leftPincer.body.velocity.x = 0;
        } else if (crabbyCrab.body.velocity.x === 0 && pincer == -1){
            rightPincer.body.velocity.x = 0
        } else if (crabDead === false) {
            crabVel = crabbyCrab.body.velocity.x;
            leftPincer.body.velocity.x = crabVel;
            rightPincer.body.velocity.x = crabVel;
        }

        if (player.position.x > 3000 && bossTime === false){
            bossFight();
            showHint('crab');
        }

        function bossFight(){
            bossTime = true;
            bossMusic = game.add.audio('boss');
            music.stop();
            bossMusic.loop = true;
            bossMusic.play();
        }

        if (crabbyCrab.body.velocity.x != 0){
            leftPincer.animations.play('leftPincerMove')
            rightPincer.animations.play('rightPincerMove')
        }

        if (player.position.x > 3200 && countdown == false && crabDead===false){
            countdown = true;
            createCoconut();
            game.time.events.add(Phaser.Timer.SECOND * 3, pinch, this);
        }

        function pinch(){
            if (crabDead === false){
                tempCrabVel = crabbyCrab.body.velocity.x;
                crabbyCrab.body.velocity.x = 0;
                if (player.position.x > 3500){
                    game.physics.arcade.moveToXY(rightPincer,3645, 266, 120);
                    rightPincer.animations.play('rightPinchAni')
                    pincer = 1;
                } else {
                    game.physics.arcade.moveToXY(leftPincer,3250,260, 120);
                    leftPincer.animations.play('leftPinchAni')
                    pincer = -1;
                }
                game.time.events.add(Phaser.Timer.SECOND * 2.25, returnPinch, this);
            }
        }

        function returnPinch(){
            if (pincer === 1){
                game.physics.arcade.moveToXY(rightPincer,crabbyCrab.position.x+149, 530);
                rightPincer.animations.stop();
            } else if (pincer === -1){
                game.physics.arcade.moveToXY(leftPincer,crabbyCrab.position.x - 150, 530);
                leftPincer.animations.stop();
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
                crabbyCrab.body.velocity.x = tempCrabVel;
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
            coconut.body.gravity.y = 600;
            coconut.animations.add('roll', [0,1,2,3,4,5,6,7,8], 20, true);
        }

        // Coconut Move
        if (coconut.body.velocity.x > 0) {
            coconut.animations.play('roll');
        } else if (coconut.body.velocity.x < 0) {
            coconut.animations.play('roll');
        } else {
            coconut.animations.stop;
        }

        function restartScreen(){
            game.state.start('GameOver');
        }

        function bossCollisionHandler (player, enemy) {
            if (crabDead===false){
                player.destroy();
                literallyDying(bossMusic);
                game.time.events.add(Phaser.Timer.SECOND * 8, restartScreen, this);  
            }
        }

        function bossCoconutHandler() {
            crabLife--;
            crabbyCrab.animations.play('hurt');
            var collision = game.add.sprite(coconut.position.x,coconut.position.y-5,'collision');
            collision.animations.add('explode', [0, 1, 2], 20, false);
            collision.animations.play('explode');
            crackSound.play();
            var cleanup = function (){
                collision.destroy();
                switchAnimation();
            }
            var switchAnimation = function(){
                crabbyCrab.animations.play('crabWalk')
            };
            game.time.events.add(Phaser.Timer.SECOND * .5, cleanup, this);
            coconut.destroy();
            needNewCoconut = true;
            if (crabLife === 0){
                bossMusic.stop();
                music.play();
                // console.log("YOU WIN!")
                spiral = game.add.sprite(crabbyCrab.position.x, crabbyCrab.position.y, 'spiral')
                spiral.animations.add('spiral-move', [0,1,2,3], 5, true);
                crabDead = true;
            }
        }

        if (crabDead === true){
                crabbyCrab.animations.play('hurt');
                spiral.animations.play('spiral-move');
                crabbyCrab.body.velocity.x = 0;
                leftPincer.body.velocity.y = 0;
                leftPincer.body.velocity.x = 0;
                rightPincer.body.velocity.y = 0;
                rightPincer.body.velocity.x = 0;
        }

        if (crabbyCrab.body.velocity.x != 0){
            crabbyCrab.animations.play('crabWalk');
        } else if (crabDead === false) {
            crabbyCrab.animations.stop();
        } else {
            crabbyCrab.animations.play('hurt')
        }

        function collisionHandler (player, enemy) {
            if (enemy == crabbyCrab && crabDead === false) {
                player.destroy();
                literallyDying(bossMusic);
                game.time.events.add(Phaser.Timer.SECOND * 8, restartScreen, this);
            } else if (enemy == crabbyCrab && crabDead === true){

            } else if (enemy.body.touching.up){
                poofSound.play();
                var collision = game.add.sprite(enemy.position.x-3,enemy.position.y-5,'collision');
                collision.animations.add('explode', [0, 1, 2], 20, false);
                collision.animations.play('explode');
                var cleanup = function (){
                    collision.destroy();
                }
                enemy.kill();
                player.body.velocity.y = -200;
                game.time.events.add(Phaser.Timer.SECOND * .5, cleanup, this);
            } else {
                player.destroy();
                literallyDying(music);
                game.time.events.add(Phaser.Timer.SECOND * 8, restartScreen, this);
            }
        }

        game.physics.arcade.overlap(enemies, enemyMovementTriggers, function(enemy, trigger) {
            if (enemy.lastTrigger !== trigger) {
                // Reverse the velocity of the enemy and remember the last trigger.
                enemy.scale.x *= -1;
                enemy.body.velocity.x *= -1;
                enemy.lastTrigger = trigger;
            }
        });

        game.physics.arcade.overlap(platforms, platformMovementTriggers, function(platform, trigger) {
            if (platform.lastTrigger !== trigger) {
                // Reverse the velocity of the platform and remember the last trigger.
                platform.body.velocity.x *= -1;
                platform.lastTrigger = trigger;
            }
        });

        // if (crabDead == true && player.position.x > levelTwoStart){
        if (player.position.x > levelTwoStart){
            game.state.start('Loading');
            currentLevel = 2;
        }
    }

};






Tan.LevelTwo = function(game){};

Tan.LevelTwo.prototype = {
    preload: function(){
        // load level two assets
        game.load.image('underground', 'assets/underground.png');
        game.load.image('rock', 'assets/rock.png');
        game.load.image('sm_shade', 'assets/shade.png');

        function loadLevelOneStuff(){
            game.load.image('platform', 'assets/platform_10x10.png');
            game.load.spritesheet('pigeon', 'assets/sprites/pigeon.png', 41.5, 32, 3)
            game.load.spritesheet('brick', 'assets/sprites/player_spritesheet3.png', 64, 64, 12);
            game.load.spritesheet('heart', 'assets/sprites/heart.png', 38,30,4)
            game.load.image('sm_triangle', 'assets/grams/sm_triangle2.png');
            game.load.image('sm_square', 'assets/grams/tan-square.png');
            game.load.spritesheet('death-tint', 'assets/sprites/deathtint.png', 800,600,3)

            game.load.spritesheet('spiral', 'assets/sprites/spiral.png', 38.5, 38, 4);
            game.load.spritesheet('coin','assets/sprites/coin_spritesheet1.png', 32, 22, 8);
            game.load.image('displayCoin', 'assets/sprites/coin.png');
            game.load.spritesheet('collision', 'assets/sprites/colision.png', 30, 33, 3)
            game.load.image('toggler', 'assets/sprites/gram_toggler2.png');
            game.load.spritesheet('hints', 'assets/sprites/LevelOneHints.png', 118,77,2);

            game.load.audio('exploring', 'assets/sound/exploring.m4a');
            game.load.audio('boss', 'assets/sound/boss.m4a');
            game.load.audio('suspense', 'assets/sound/suspense.m4a');
            game.load.audio('gameover', 'assets/sound/gameover.m4a');
            game.load.audio('restart', 'assets/sound/restart.m4a');
            game.load.audio('jumpSound', 'assets/sound/jump.wav');
            game.load.audio('poof', 'assets/sound/poof.wav');
            game.load.audio('splash', 'assets/sound/splash.wav');
            game.load.audio('crack', 'assets/sound/crack.mp3');
            game.load.audio('coin', 'assets/sound/coin.mp3');
            game.load.audio('gram', 'assets/sound/gram.wav');
            game.load.audio('menu-select', 'assets/sound/form-change.wav');

            game.load.bitmapFont('font', 'assets/fonts/joystix_bitmap/joystix.png', 'assets/fonts/joystix_bitmap/joystix.fnt');

            cursors = game.input.keyboard.createCursorKeys();
            pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
            toggleKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
            muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

            game.physics.startSystem(Phaser.Physics.ARCADE);

            background = game.add.tileSprite(0, 0, xWorldBounds, gameHeight + 200, 'sky');
            var clouds = game.add.group();

            game.world.setBounds(0, 0, xWorldBounds, yWorldBounds);

            music = game.add.audio('exploring');
            gameOverMusic = game.add.audio('gameover');
            music.loop = true;
            music.play();
            jumpSound = game.add.audio('jumpSound');
            poofSound = game.add.audio('poof');
            splashSound = game.add.audio('splash');
            crackSound = game.add.audio('crack');
            coinSound = game.add.audio('coin');
            gramSound = game.add.audio('gram');
            selectSound = game.add.audio('menu-select');
            selectSound.volume = .1;


            platforms = game.add.group();
            platforms.enableBody = true;

            // Keep this group behind player
            sceneElemBack = game.add.group();

            grams = game.add.group();
            grams.enableBody = true;
            grams.physicsBodyType = Phaser.Physics.ARCADE;
        }
        loadLevelOneStuff();

    },

    create: function(){
        // create map
        xStartPos = 60;
        yStartPos = 200;

        xWorldBounds = 5000;
        yWorldBounds = 1000;
        gamePadding = yWorldBounds - gameHeight

        sceneElemBack = game.add.group();
        levelTwoBackground = game.add.tileSprite(-1500, 0, xWorldBounds, gameHeight+gamePadding, 'underground');
        levelTwoBackground.scale.x = 15;
        game.world.setBounds(0, 0, xWorldBounds, yWorldBounds);
        platforms = game.add.group();
        platforms.enableBody = true;

        // Keep this group behind player
        sceneElemBack = game.add.group();

        grams = game.add.group();
        grams.enableBody = true;
        grams.physicsBodyType = Phaser.Physics.ARCADE;

        initializePlayer();
        initializeCamera();

        player.animations.add('walk', [0, 1, 2], 10, true);
        player.animations.add('jump', [1]);
        player.animations.add('walkHat', [3, 4, 5], 10, true);
        player.animations.add('jumpHat', [4]);

        // shade = game.add.sprite(player.position.x,player.position.y,'sm_shade')
        // shade.anchor.setTo(0.5,0.5)
        // shade.scale.x = 1.5;
        // shade.scale.y = 1.5;

        // Creates head up display
        createHeadsUpDisplay();

        if (playerGrams.hat){
            playerGrams.hat.displayed = false;
        }
   

        var ground = platforms.create(0, game.world.height - 50, 'platform');
        ground.scale.setTo(xWorldBounds/10, 7);
        ground.body.immovable = true;

        createPlatform(3, yWorldBounds, 0, yWorldBounds, true);
        createPlatform(xWorldBounds/10, 20, 90, yWorldBounds, true);

        createPlatform(28, 7, 30, 300, true);
        createPlatform(10, 12, 30, 250, true);
        createPlatform(15, 45, 90, 800, true);
        createPlatform(20, 30, 240, 800, true);
        createPlatform(14, 10, 300, 450, true);
        createPlatform(18, 17, 360, 350, true);
        createPlatform(35, 5, 190, 180, true);
        createPlatform(30, 20, 440, 800, true);
        createPlatform(15, 55, 740, 800, true);
        createPlatform(7, 5, 670, 500, true);
        createPlatform(13, 22, 610, 350, true);
        createPlatform(17, 20, 800, 175, true);
        createPlatform(40, 40, 890, 650, true);
        createPlatform(15, 7, 1050, 175, true);
        createPlatform(30, 55, 1290, 650, true);
        createPlatform(30, 60, 1790, 650, true);
        createPlatform(7, 5, 1720, 250, true);
        createPlatform(7, 5, 1590, 375, true);
        createPlatform(7, 5, 1720, 525, true);
        createPlatform(70, 10, 2090, 650, true);
        createPlatform(25, 5, 2090, 760, true);
        createPlatform(25, 5, 2450, 760, true);
        createPlatform(10, 20, 2790, 750, true);
        createPlatform(40, 5, 2890, 750, true);
        createPlatform(20, 20, 3290, 750, true);
        createPlatform(40, yWorldBounds, 3600, yWorldBounds, true);
        createPlatform(80, 8, 2800, 490, true);
        createPlatform(30, 5, 2890, 600, true);
        createPlatform(20, 20, 2800, 410, true);
        createPlatform(20, 10, 2800, 150, true);
        createPlatform(10, 5, 3000, 300, true);
        createPlatform(15, 3, 3230, 250, true);
        createPlatform(10, 5, 3500, 300, true);
        createPlatform(5, 5, 2750, 330, true);
        createPlatform(50, 5, 2180, 490, true);
        createPlatform(10, 17, 2180, 440, true);
        createPlatform(16, 5, 2340, 340, true);
        createPlatform(17, 20, 2500, 340, true);
        createPlatform(5, 10, 2670, 240, true);
        createPlatform(32, 10, 2180, 200, true);

    },
    update: function(){
        game.physics.arcade.collide(player, platforms);

        // shade.position.x = player.position.x
        // shade.position.y = player.position.y

        if (muteKey.isDown && muted === false){
            muted = true;
            game.time.events.add(Phaser.Timer.SECOND * .5, mute, this);
        }

        function mute(){
            if (game.sound.volume === 1){
                game.sound.volume = 0;    
            } else {
                game.sound.volume = 1;
            }
            muted = false;
        }

        // Sets up pause Screen
        if (pauseKey.isDown && pauser === false){
            pauser = true;
            pauseMenu();
        }

        function pauseMenu(){
            menuText = game.add.text(game.camera.view.x + 400, gameHeight/2 + game.camera.view.y, 'Click to resume', { font: '30px Arial', fill: '#fff' });
            menuText.anchor.setTo(0.5, 0.5);
            game.paused = true;
            game.input.onDown.addOnce(unpause,self);
        }  
    
        function unpause(event){
            // Only act if paused
            if(game.paused && pauser === true){
                // menu.destroy();
                menuText.destroy();

                // Unpause the game
                game.paused = false;
                pauser = false;
            }
        };

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        // Set playerForm
        for (var key in playerGrams){
            var gram = playerGrams[key];
            if (togglePosition == gram.displayIndex){
                toggleForm = gram.name;
                playerForm = gram.name;
            }
        }

        function moveAsBrick(){
            movePlayer(0, 'walk', 'jump', playerSpeed, -400);
        }

        function moveAsBrickHat(){
            movePlayer(3, 'walkHat', 'jumpHat', playerSpeed, -400);
        }

        // Player Movement

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

            if (cursors.up.isDown && player.body.touching.down){
                player.body.velocity.y = yVel;
                jumpSound.play();
            }

            if (!player.body.touching.down){
                player.animations.play(jumpAnim);
                
            }     

        }

        displayGrams();

    }

}

Tan.Loading = function(game){};

Tan.Loading.prototype = {
    preload: function(){
        game.load.audio('falling', 'assets/sound/falling.mp3');
    },
    create: function(){
        if (currentLevel === 1) {
            var levelOneText = "Level One"
            var text = game.add.bitmapText(120, 300, 'font', levelOneText, 25);

        } else if (currentLevel === 2){
            var levelTwoText = "Level Two"
            var text = game.add.bitmapText(120, 300, 'font', levelTwoText, 25);
            fallingSound = game.add.audio('falling');
            fallingSound.play();
        }
    },
    update: function(){
        game.time.events.add(Phaser.Timer.SECOND * 4, nextLevel, this);

        function nextLevel(){
            if (currentLevel === 1){
                game.state.start('LevelOne')
            } else if (currentLevel === 2){
                game.state.start('LevelTwo')
            }
        }
    }
}







Tan.GameOver = function(game){};

Tan.GameOver.prototype = {
    preload: function(){
        // load death screen images
        game.load.bitmapFont('font', 'assets/fonts/joystix_bitmap/joystix.png', 'assets/fonts/joystix_bitmap/joystix.fnt'); 

    },
    create: function(){
        restartMusic = game.add.audio('restart');
        restartMusic.loop = true;
        restartMusic.play();
        var restartText = "Would you like to restart?"
        var yesOrNo = "y/n"
        var text = game.add.bitmapText(120, 300, 'font', restartText, 25);
        game.add.bitmapText(text.position.x + 230,350,'font', yesOrNo, 25);
        
    },
    update: function(){
        var restartKey = game.input.keyboard.addKey(Phaser.Keyboard.Y);
        var endKey = game.input.keyboard.addKey(Phaser.Keyboard.N);

        // restart from last checkpoint (start of level, boss)
        if (restartKey.isDown){
            restartMusic.stop();
            reloadCurrentLevel();
        }

        function reloadCurrentLevel(){
            if (currentLevel ===1){
                gramCount = 1;
                playerGrams = {};
                coinCount = 0;
                game.state.start('LevelOne');
                playerForm = 'brick';
                bossTime = false;
                crabLife = 3;
                countdown = false;
            } else if (currentLevel === 2){
                game.state.start('LevelTwo');
            }
        }
        if (endKey.isDown){
            restartMusic.stop();
            console.Log("Bye!");
        }
    }
}

// ==================================
// Methods for all levels

function initializePlayer(){
    //could probably be moved outside of create
    player = game.add.sprite(xStartPos, yStartPos, 'brick');
    game.physics.arcade.enable(player);

    player.body.bounce.y = 0;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;
    player.body.setSize(32, 32, 0, 32);
    player.anchor.setTo(.5, 0);
    player.z = 1;
}


function initializeCamera(){
    game.camera.follow(player);
    game.camera.deadzone = new Phaser.Rectangle(200, 0, 300, 100);
}

// Create a gram
function createGram(xPos, yPos, imgKey, gramName, animate){
    var gram = grams.create(xPos, yPos, imgKey);
    gram.body.gravity.y = 6;
    gram.name = gramName;
    gram.displayed = false;
    if (animate == true) {
        var glow = gram.animations.add('glow');
        glow.play(7, true);
        gram.animated = true;
    }
    return gram;
}

function createEnemy(xPixFromLeft, yPixFromBottom, enemyKey, leftTrigger, rightTrigger){
    var newEnemy = enemies.create(xPixFromLeft, game.world.height - yPixFromBottom, enemyKey, 0, enemies);
    newEnemy.body.velocity.x = 100;
    if (enemyKey == 'pigeon'){
        newEnemy.animations.add('pigeon-step', [0,1,2], 10, true);
        newEnemy.animations.play('pigeon-step');
    } else if (enemyKey == 'badfish'){
        newEnemy.animations.add('badfish-swim',[0,1,2], 10, true);
        newEnemy.animations.play('badfish-swim');
    }
    newEnemy.anchor.setTo(.5,0)
    createLeftTrigger(newEnemy, leftTrigger);
    createRightTrigger(newEnemy, rightTrigger);
    return newEnemy;
}

function createLeftTrigger(enemy, leftTrigger){
    var left = game.add.sprite(enemy.position.x - leftTrigger, enemy.position.y, '', 0, enemyMovementTriggers);
    left.body.setSize(4, 32, 0, 0);
    return left;
}

function createRightTrigger(enemy, rightTrigger){
    var right = game.add.sprite(enemy.position.x + rightTrigger, enemy.position.y, '', 0, enemyMovementTriggers);
    right.body.setSize(4, 32, 0, 0);
    return right;
}

function createMovingPlat(xPixFromLeft, yPixFromBottom, imgKey, leftTrigger, rightTrigger){
    var newMovePlat = platforms.create(xPixFromLeft, game.world.height - yPixFromBottom, imgKey, 0, platforms);
    game.physics.enable(newMovePlat, Phaser.Physics.ARCADE);
    newMovePlat.allowGravity = false;
    newMovePlat.body.velocity.x = 60;
    newMovePlat.body.immovable = true;

    createPlatLeftTrigger(newMovePlat, leftTrigger);
    createPlatRightTrigger(newMovePlat, rightTrigger);

    return newMovePlat;
}

function createPlatform(widthScale, heightScale, xPixFromLeft, yPixFromBottom, immovable){
    var newPlatform = platforms.create(xPixFromLeft, game.world.height - yPixFromBottom, 'platform');
    newPlatform.scale.setTo(widthScale, heightScale);
    if (immovable == true){
        newPlatform.body.immovable = true;
    }
    return newPlatform;
}

function makeImmovable(sprite){
    sprite.body.immovable = true;
}

function createPlatLeftTrigger(platform, leftTrigger){
    var left = game.add.sprite(platform.position.x - leftTrigger, platform.position.y, null, 0, platformMovementTriggers);
    left.body.setSize(40, 500, 0, 0);
    return left;
}

function createPlatRightTrigger(platform, rightTrigger){
    var right = game.add.sprite(platform.position.x + rightTrigger, platform.position.y, null, 0, platformMovementTriggers);
    right.body.setSize(40, 100, 0, 0);
    return right;
}

function createCoins(){
    // Creates 25 coins in random places
    for (var i = 0; i < 25; i++){
        var coin = coins.create(game.rnd.integerInRange(50, xWorldBounds-1800), game.rnd.integerInRange(-200, 200), 'coin');
        coin.body.gravity.y = 1000;
        var coinAnim = coin.animations.add('rotate');
        // coins rotate at various speeds
        coinAnim.play(game.rnd.integerInRange(5, 10), true);
    }
}


function anchorAndFixToCam(obj){
    obj.fixedToCamera = true;
    return obj;
}

function createHeadsUpText(xPos, yPos, text, size){
    var text = game.add.bitmapText(xPos, yPos, 'font', text, size);
    anchorAndFixToCam(text);
    return text;
}

function createHeadsUpIcon(xPos, yPos, imgKey){
    var icon = game.add.sprite(xPos, yPos, imgKey);
    anchorAndFixToCam(icon);
    return icon;
}

// Creates head up display
function createHeadsUpDisplay(){
    var margin = 30;

    createHeadsUpText(margin, margin, "Tan's Grams:", 20);

    createHeadsUpIcon(35, 55, 'displayCoin');
    createHeadsUpText(63, 57, "x ", 15);
    coinText = createHeadsUpText(85, 55, coinCount.toString(), 20);

    toggler = createHeadsUpIcon(game.camera.view.x + togglerDefaultPadding, togglerPaddingTop, 'toggler');
    toggler.scale.setTo(0.75, 0.75);
    toggler.displayed = false;
    toggler.fixedToCamera = true;


    // create small square icon
    var sq_icon = createGram(0, 0, 'sm_square', 'brick');
    sq_icon.displayIndex = 0;
    sq_icon.visible = false; 
    playerGrams.brick = sq_icon;
}

function createSceneElem(scale, horizFlip, xPixFromLeft, yPixFromBottom, imgKey, front){
    if (front == true){
        var newElement = sceneElem.create(xPixFromLeft, game.world.height - yPixFromBottom, imgKey);
    } else {
        var newElement = sceneElemBack.create(xPixFromLeft, game.world.height - yPixFromBottom, imgKey);
    }

    newElement.anchor.setTo(.5,.5)
    if (horizFlip == true){
        newElement.scale.setTo(-scale, scale);
    } else {
        newElement.scale.setTo(scale);
    }
        return newElement;
}

// ========================
// Update functions
function literallyDying (currentMusic){
    currentMusic.stop();
    var suspenseSound = game.add.audio('suspense');
    suspenseSound.play();
    gameOverMusic.play();
    var deadPlayer = game.add.sprite(player.position.x,player.position.y+20,'heart');
    deadPlayer.animations.add('dead', [0,1,2,3], 1, false);
    deadPlayer.animations.play('dead');
    var deathScreen = game.add.sprite(game.camera.view.x,game.camera.view.y,'death-tint');
    deathScreen.animations.add('tint', [0,1,2], 10, false);
    deathScreen.animations.play('tint');

}

function displayGram(gram){
    var marginLeft = 210;
    var padding = 50;
    var topPadding;

    if (gram.animated){
        topPadding = 28;
    }else{
        topPadding = 38
    }

    var displayGram = game.add.sprite(marginLeft + ((gram.displayIndex + 1) * padding), topPadding, gram.key);
    displayGram.anchor.setTo(0.5, 0.5);
    displayGram.fixedToCamera = true;
}

function displayGrams(){
    for (var key in playerGrams) {
        var gram = playerGrams[key];
        if (playerGrams.hasOwnProperty(key) && gram.displayed == false) {
            toggler.displayed = true;
            gram.displayed = true;
            displayGram(gram);
        }
    }
}


// Adds Level States
game.state.add('LevelOne', Tan.LevelOne);
game.state.add('LevelTwo', Tan.LevelTwo);
game.state.add('Loading', Tan.Loading);
game.state.add('MainMenu', Tan.MainMenu);
game.state.add('GameOver', Tan.GameOver);
game.state.start('LevelTwo');
