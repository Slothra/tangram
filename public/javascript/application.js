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


var platforms;
var platformMovementTriggers;
var platformRightTrigger;
var platformLeftTrigger;

var introText = "Pigeons are evil and I, \nTan, am the only thing standing \nin the way of their wicked plot. \n\n\nOr… I was until I was knocked into \nthe river that carried me far, \nfar from home. \n\n\nI must get back, \nI must save TeenyTown, \nI must stop the evil pigeons!"

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

var deadZoneY = 0;
var deadZoneHeight = 100;

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
var laughSound;
var victorySound;

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

// Level 2 Vars

var random;
var moleBoss;
var leftClaw;
var rightClaw;
var moleLife = 3;
var moleSpeed = 100;
var moleCountdown;
var moleHit = false;
var moleVelX = 100;
var claws;
var fakeMoleBoss;
var fakeLeftClaw;
var fakeRightClaw;

var bossZoneY = 950;
var bossZoneX = 3250;
var holePadding = 100;
var breakableWalls;

var undergroundMusic;

var thanks;
var credits;



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

            mainMenuText = "Left Arrow  - Move left\nRight Arrow - Move right\nUp Arrow    - Jump\nF button    - change form\nM button    - Mute game\nP button    - Pause game"
            titleText = game.add.bitmapText(150, 200, 'font', mainMenuText, 25);
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
        game.load.audio('victorySound', 'assets/sound/victory.m4a');

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
        victorySound = game.add.audio('victorySound');

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

        createMovingPlat(1300, 500, 'plank', 'horizontal', 100, 200, 60);


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

        game.physics.arcade.overlap(platforms, platformMovementTriggers, function(platform, trigger) {
            if (platform.lastTrigger !== trigger) {
                // Reverse the velocity of the platform and remember the last trigger.
                if (platform.name == 'horizontal'){
                    platform.body.velocity.x *= -1;
                } else if (platform.name == 'vertical'){
                    platform.body.velocity.y *= -1;
                }
                platform.lastTrigger = trigger;
            }
        });

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
                victorySound.play();
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


        // if (crabDead == true && player.position.x > levelTwoStart){
        if (player.position.x > levelTwoStart){
            music.stop();
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
        game.load.spritesheet('shade', 'assets/sprites/shade.png', 1200, 900, 2);
        // game.load.spritesheet('moleMan', 'assets/sprites/mole.png', 247, 102, 2);
        game.load.spritesheet('moleMan-resize', 'assets/sprites/resized-mole.png', 141, 72, 2);
        // game.load.spritesheet('claws', 'assets/sprites/mole-claws.png', 186, 210, 2);
        game.load.spritesheet('claws-resize', 'assets/sprites/Mole-Claws-resized.png', 144, 104, 2);
        game.load.spritesheet('underground-pigeon','assets/sprites/underground-pigeon.png', 41, 36, 3);

        game.load.audio('laugh', 'assets/sound/mole-laugh.wav');
        game.load.audio('undergroundMusic', 'assets/sound/underground-music.m4a')
        game.load.audio('victorySound', 'assets/sound/victory.m4a');
        game.load.spritesheet('parallel_glow', 'assets/grams/parallel_glow.png', 64, 64, 8);
        game.load.image('dirt', 'assets/scene/level2/dirtTile_10x10.png');
        game.load.image('bgTexture', 'assets/scene/level2/bgtexture.png');
        game.load.image('rootPlat', 'assets/scene/level2/treerootHoriz.png');
        game.load.image('rootPlat2', 'assets/scene/level2/treerootHorizflip.png');
        game.load.spritesheet('hintsLevelTwo', 'assets/sprites/hintsTwo.png', 119,77,3);

        game.load.image('root01', 'assets/scene/level2/treeroot01.png');
        game.load.image('root02', 'assets/scene/level2/treeroot02.png');
        game.load.image('root03', 'assets/scene/level2/treeroot03.png');
        game.load.image('root04', 'assets/scene/level2/treeroot04.png');
        game.load.image('root05', 'assets/scene/level2/treeroot05.png');


        function loadLevelOneStuff(){
            game.load.image('platform', 'assets/platform_10x10.png');
            game.load.spritesheet('pigeon', 'assets/sprites/pigeon.png', 41.5, 32, 3)
            game.load.spritesheet('brick', 'assets/sprites/player_spritesheet3.png', 64, 64, 15);
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

            game.load.image('plank_short', 'assets/scene/plank_short.png');
            game.load.image('plank', 'assets/scene/plank2.png');

            game.load.bitmapFont('font', 'assets/fonts/joystix_bitmap/joystix.png', 'assets/fonts/joystix_bitmap/joystix.fnt');




            cursors = game.input.keyboard.createCursorKeys();
            pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
            toggleKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
            muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

            game.physics.startSystem(Phaser.Physics.ARCADE);

            // background = game.add.tileSprite(0, 0, xWorldBounds, gameHeight + 200, 'sky');
            // var clouds = game.add.group();

            game.world.setBounds(0, 0, xWorldBounds, yWorldBounds);

            music = game.add.audio('exploring');
            gameOverMusic = game.add.audio('gameover');
            music.loop = true;
            // music.play();
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

            grams = game.add.group();
            grams.enableBody = true;
            grams.physicsBodyType = Phaser.Physics.ARCADE;

        }
        loadLevelOneStuff();
    },

    create: function(){
        bossTime = false;
        laughSound = game.add.audio('laugh');
        undergroundMusic = game.add.audio('undergroundMusic');
        undergroundMusic.loop = true;
        undergroundMusic.play();
        victorySound = game.add.audio('victorySound');

        playerForm = 'brick'

        // create map
        xStartPos = 60;
        yStartPos = 200;

        // setcamera Deadzone
        deadZoneY = 100;
        deadZoneHeight = 200;

        xWorldBounds = 5000;
        yWorldBounds = 1000;
        gamePadding = yWorldBounds - gameHeight;

        levelTwoBackground = game.add.tileSprite(0, 0, xWorldBounds, yWorldBounds, 'bgTexture');

        game.world.setBounds(0, 0, xWorldBounds, yWorldBounds);

        sceneElemBack = game.add.group();

        platforms = game.add.group();
        platforms.enableBody = true;

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        enemyMovementTriggers = game.add.group();
        enemyMovementTriggers.enableBody = true;
        enemyMovementTriggers.physicsBodyType = Phaser.Physics.ARCADE;

        grams = game.add.group();
        grams.enableBody = true;
        grams.physicsBodyType = Phaser.Physics.ARCADE;

        breakableWalls = game.add.group();
        breakableWalls.enableBody = true;
        breakableWalls.physicsBodyType = Phaser.Physics.ARCADE;

        createGram(240, 640, 'parallel_glow', 'parallel', true);

        // Creating coins
        coins = game.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = Phaser.Physics.ARCADE;

        initializePlayer();
        initializeCamera();

        player.animations.add('walk', [0, 1, 2], 10, true);
        player.animations.add('jump', [1]);
        player.animations.add('walkHat', [3, 4, 5], 10, true);
        player.animations.add('jumpHat', [4]);
        player.animations.add('walkCandle', [12, 13, 14], 10, true);
        player.animations.add('jumpCandle', [13]);

        sceneElem = game.add.group();

        moleBoss = game.add.sprite(bossZoneX, bossZoneY+10, 'moleMan-resize')
        addProperties(moleBoss);
        moleBoss.animations.add('moleMove', [0], 10, true);
        moleBoss.animations.add('moleHurt', [1], 10, true);
        moleBoss.animations.play('moleMove');
        createLeftTrigger(moleBoss, 300);
        createRightTrigger(moleBoss, 300);

        claws = game.add.group();
        claws.enableBody = true;
        claws.physicsBodyType = Phaser.Physics.ARCADE;

        leftClaw = game.add.sprite(bossZoneX - 150, bossZoneY+10, 'claws-resize', 0)
        addProperties(leftClaw);
        claws.add(leftClaw);
        rightClaw = game.add.sprite(bossZoneX + 150, bossZoneY+10, 'claws-resize', 1)
        addProperties(rightClaw);
        claws.add(rightClaw);

        fakeMoleBoss = game.add.sprite(bossZoneX, bossZoneY-30, 'moleMan-resize')
        addProperties(fakeMoleBoss);
        fakeLeftClaw = game.add.sprite(bossZoneX - 150, bossZoneY-30, 'claws-resize', 0)
        addProperties(fakeLeftClaw);
        fakeRightClaw = game.add.sprite(bossZoneX + 150, bossZoneY-30, 'claws-resize', 1)
        addProperties(fakeRightClaw);

        var bossOverlay = game.add.tileSprite(2500, game.world.height - 50, 1600, 50, 'dirt');
        
        shade = game.add.sprite(player.position.x, player.position.y,'shade')
        shade.anchor.setTo(0.5,0.5);
        shade.animations.add('little', [0], 10, true);
        shade.animations.add('big', [1], 10, true);
        shade.scale.x = 1.5;
        shade.scale.y = 1.5;

        // Creates head up display
        createHeadsUpDisplay();

        platformMovementTriggers = game.add.group();
        platformMovementTriggers.enableBody = true;
        platformMovementTriggers.allowGravity = false;
        platformMovementTriggers.physicsBodyType = Phaser.Physics.ARCADE;
   
        function addProperties(sprite){
            game.physics.arcade.enable(sprite);
            sprite.body.immovable = true;
            sprite.anchor.setTo(.5,0);

        }


        if (playerGrams.hat){
            playerGrams.hat.displayed = false;
        }

       

        createCoinCluster(65, 800, 5);
        createCoinCluster(960, 280, 7);
        createCoinCluster(2950, 330, 5);
        createCoinCluster(2440, 730, 5);
        createCoinCluster(2250, 445, 3);



        // Creates Dirt platforms 
        function createDirtPlat(xPixFromLeft, yPixFromBottom, width, height){
            var newDirt = game.add.tileSprite(xPixFromLeft, game.world.height - yPixFromBottom, width, height, 'dirt');
            platforms.add(newDirt);
            newDirt.body.immovable = true;
            return newDirt;
        }

        // ground
        createDirtPlat(0, 50, xWorldBounds, 50);

        createDirtPlat(0, yWorldBounds, 30, yWorldBounds);
        createDirtPlat(90, yWorldBounds, xWorldBounds, 200);
        createDirtPlat(30, 300, 280, 70);
        createDirtPlat(30, 250, 100, 120);
        createDirtPlat(90, 800, 150, 450);
        createDirtPlat(240, 800, 200, 300);
        createDirtPlat(300, 450, 140, 100);
        createDirtPlat(360, 350, 180, 170);
        createDirtPlat(190, 180, 350, 50);
        createDirtPlat(440, 800, 300, 200);
        createDirtPlat(740, 800, 150, 550);
        createDirtPlat(670, 500, 70, 50);
        createDirtPlat(610, 350, 130, 220);
        createDirtPlat(800, 175, 170, 200);
        //Big middle block
        createDirtPlat(890, 650, 400, 400);
        createDirtPlat(1050, 175, 150, 70);
        createDirtPlat(1290, 650, 300, 550);
        createDirtPlat(1790, 650, 300, 600);

        var root01 = createMovingPlat(1695, 210, 'rootPlat2', 'vertical', 100, 100, 50);
        root01.body.setSize(120, 32, 8, 70);

        var root02 = createMovingPlat(1560, 400, 'rootPlat', 'vertical', 150, 150, -50);
        root02.body.setSize(120, 32, 0, 70);

        var root03 = createMovingPlat(1675, 500, 'rootPlat2', 'vertical', 90, 100, 80);
        root03.body.setSize(120, 32, 8, 70);

        createDirtPlat(2090, 650, 700, 100);
        createDirtPlat(2090, 760, 250, 50);
        createDirtPlat(2450, 760, 250, 50);
        createDirtPlat(2790, 750, 100, 200);
        createDirtPlat(2890, 750, 400, 50);
        createDirtPlat(3290, 750, 200, 200);
        createDirtPlat(3600, yWorldBounds, 400, yWorldBounds);
        createDirtPlat(2800, 490, 800, 80);
        createDirtPlat(2890, 600, 300, 50);
        createDirtPlat(2800, 410, 200, 200);
        createDirtPlat(2800, 150, 200, 100);
        createDirtPlat(3000, 300, 100, 50);
        createDirtPlat(3230, 225, 150, 30);
        createDirtPlat(3500, 300, 100, 50);
        createDirtPlat(2750, 330, 50, 50);
        createDirtPlat(2180, 490, 500, 50);
        createDirtPlat(2180, 440, 100, 170);
        createDirtPlat(2340, 340, 160, 50);
        createDirtPlat(2500, 340, 170, 200);
        createDirtPlat(2670, 240, 50, 100);
        createDirtPlat(2180, 200, 320, 100);

        createEnemy(1135, 86,'underground-pigeon', 130, 130);
        createEnemy(1119, 685,'underground-pigeon', 150, 150);
        createEnemy(3070, 632,'underground-pigeon', 50, 50);
        createEnemy(2500, 377,'underground-pigeon', 100, 100);



        createSceneElem(1.4, false, 355, 500, 'root04', true);
        createSceneElem(1.3, true, 680, 550, 'root02');
        createSceneElem(1.2, true, 30, 90, 'root01', true);
        createSceneElem(1.4, true, 490, 150, 'root05', true);
        createSceneElem(1.2, false, 1000, 100, 'root03');
        createSceneElem(1.2, false, 1000, 100, 'root03');
        createSceneElem(1.5, true, 1960, 720, 'root05', true);
        createSceneElem(1, true, 2450, 685, 'root02');
        createSceneElem(1.1, true, 2768, 765, 'root01', true);
        createSceneElem(1, true, 3000, 675, 'root02');
        createSceneElem(1, false, 3500, 600, 'root03');
        createSceneElem(1.1, false, 2732, 470, 'root01', true);
        createSceneElem(1, false, 2250, 525, 'root04', true);
        createSceneElem(1.3, true, 2430, 240, 'root02');



        function createWall(xPixFromLeft, yPixFromBottom, width, height){
            var newWall = game.add.tileSprite(xPixFromLeft, game.world.height - yPixFromBottom, width, height, 'dirt');
            breakableWalls.add(newWall);
            newWall.body.immovable = true;
            newWall.tint = 0xa3845e;
            return newWall;
        }

        createWall(1400, 800, 30, 150);
        createWall(3130, 700, 30, 100);
        createWall(2600, 440, 30, 100);


        




    },

    update: function(){
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(player, breakableWalls, collideBreakable, null, this);
        game.physics.arcade.collide(enemies, player, collideEnemy, null, this);
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(grams, platforms);
        game.physics.arcade.overlap(player, grams, collectGram, null, this);
        game.physics.arcade.collide(coins, platforms);
        game.physics.arcade.overlap(player, coins, collectCoin, null, this);
        game.physics.arcade.overlap(platforms, platformMovementTriggers, function(platform, trigger) {
            if (platform.lastTrigger !== trigger) {
                // Reverse the velocity of the platform and remember the last trigger.
                if (platform.name == 'horizontal'){
                    platform.body.velocity.x *= -1;
                } else if (platform.name == 'vertical'){
                    platform.body.velocity.y *= -1;
                }
                platform.lastTrigger = trigger;
            }
        });
        game.physics.arcade.collide(player, moleBoss, collideBoss, null, this);
        game.physics.arcade.collide(player, claws, collideClaws, null, this);




        shade.position.x = player.position.x
        shade.position.y = player.position.y

        if ((playerForm == 'brick' || playerForm == 'hat') && (player.position.x > 70 && player.position.x < 100)){
            showHint('dark-hint');
        }

        function showHint(hintType){
            if (hint){
                hint.destroy();
            }
            if (hintType == 'dark-hint'){
                hint = game.add.sprite(player.position.x - 20, player.position.y - 50, 'hintsLevelTwo')
                hint.animations.add('dark-hint', [2], 10, true);
                hint.animations.play('dark-hint');
            } else if (hintType == 'mole-hint'){
                hint = game.add.sprite(player.position.x - 20, player.position.y - 50, 'hintsLevelTwo')
                hint.animations.add('mole-hint', [1], 10, true);
                hint.animations.play('mole-hint');
            }
            game.time.events.add(Phaser.Timer.SECOND * 3, hideHint, this);
        }
        

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

        function moveAsCandle(){
            movePlayer(12, 'walkCandle', 'jumpCandle', playerSpeed, -400);
        }

        // Player Movement

        switch (playerForm){
          case 'brick':
            moveAsBrick();
            break;
          case 'hat':
            moveAsBrickHat();
            break;
          case 'parallel':
            moveAsCandle();
            break;
          default:
            moveAsBrick();
        }

        if (playerForm === 'parallel'){
            shade.animations.play('big');
        } else {
            shade.animations.play('little');
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

        // ========================
        // Enemy Logic

        function collideEnemy(player, enemy){
            if (enemy.body.touching.up){
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
                literallyDying(undergroundMusic);
                game.time.events.add(Phaser.Timer.SECOND * 8, restartScreen, this);
            }
        }

        game.physics.arcade.overlap(enemies, enemyMovementTriggers, function(enemy, trigger) {
            if (enemy.lastTrigger !== trigger) {
                enemy.scale.x *= -1;
                enemy.body.velocity.x *= -1;
                enemy.lastTrigger = trigger;
            }
        });

        // ========================
        // Boss Logic

        if (player.position.x >= 2890 && player.position.y >= 760 && bossTime == false && moleLife != 0){
            bossMusic = game.add.audio('boss');
            undergroundMusic.stop();
            bossMusic.loop = true;
            bossMusic.play();
            showHint('mole-hint');
            moleFight();
        }

        fakeMoleBoss.body.velocity.y = moleSpeed;

        function moleFight(){
            bossTime = true;
            moleCountdown = true;
            if (moleLife > 0){
                laughSound.play();
                fakeMoleBoss.body.velocity.y = moleSpeed;
                fakeLeftClaw.body.velocity.y = moleSpeed;
                fakeRightClaw.body.velocity.y = moleSpeed;
            }
        }

        if (moleCountdown === true && bossTime === true){
            moleCountdown = false;
            moleSpeed = 100;
            game.time.events.add(Phaser.Timer.SECOND * 4, positionsMole, this);
        }


        function moleSwitch(){
            moleBoss.animations.play('moleMove');
            moleBoss.body.velocity.y = 0;
            moleCountdown = true
        }

        leftClaw.body.velocity = moleBoss.body.velocity;
        rightClaw.body.velocity = moleBoss.body.velocity;

        function clearMole(){
            moleBoss.destroy();
            leftClaw.destroy();
            rightClaw.destroy();
            game.time.events.add(Phaser.Timer.SECOND * 2, positionsMole, this);
        }

        function positionsMole(){
            if (moleLife > 0){
                moleBoss.body.velocity.x = moleVelX;
                random = Math.floor(Math.random() * (5))+1;
                game.time.events.add(Phaser.Timer.SECOND * random, moveMole, this);
            }
        }

        function addProperties(sprite){
            game.physics.arcade.enable(sprite);
            sprite.anchor.setTo(.5, 0);
            sprite.body.immovable = true;
        }

        function moveMole(){
            laughSound.play();
            moleVelX = moleBoss.body.velocity.x;
            moleBoss.body.velocity.x = 0;
            moleBoss.body.velocity.y = -(moleSpeed);
            game.time.events.add(Phaser.Timer.SECOND * .5, pauseMole, this);

        }

        function pauseMole(){
            moleBoss.body.velocity.y = 0;
            game.time.events.add(Phaser.Timer.SECOND * 1.4, hideMole, this);
        }

        function hideMole(){
            moleBoss.body.velocity.y = moleSpeed;
            game.time.events.add(Phaser.Timer.SECOND * .5, moleSwitch, this);
        }

        game.physics.arcade.overlap(moleBoss, enemyMovementTriggers, function(moleBoss, trigger) {
            if (moleBoss.lastTrigger !== trigger) {
                moleBoss.scale.x *= -1;
                moleBoss.body.velocity.x *= -1;
                moleBoss.lastTrigger = trigger;
            }
        });

        function collideClaws (player, claw){
            player.destroy();
            literallyDying(bossMusic);
            game.time.events.add(Phaser.Timer.SECOND * 8, restartScreen, this);  
        }

        function collideBoss (player, enemy){
            if (moleLife > 0 && enemy.body.touching.up){
                player.body.velocity.y = -250;
                moleLife--;
                moleBoss.animations.play('moleHurt');
                poofSound.play();
                if (moleLife == 0){
                    console.log("You Win!")
                    leftClaw.destroy();
                    rightClaw.destroy();
                    fakeMoleBoss.destroy();
                    fakeRightClaw.destroy();
                    fakeLeftClaw.destroy();
                    bossMusic.stop();
                    victorySound.play();
                    undergroundMusic.play();
                    game.time.events.add(Phaser.Timer.SECOND * 3, startCredits, this);
                }
            } else if (moleLife === 0){
                bossTime = false;
            } else {
                player.destroy();
                literallyDying(bossMusic);
                game.time.events.add(Phaser.Timer.SECOND * 8, restartScreen, this);  
            }
        }

        function collideBreakable(player, wall){
            if (playerForm == 'superhat'){
                player.animations.play('drill')
                game.time.events.add(Phaser.Timer.SECOND * .75, wallBreak, this);
                function wallBreak(){
                    poofSound.play();
                    wall.destroy()
                    var collision = game.add.sprite(wall.position.x+5,wall.position.y+50,'collision');
                    collision.animations.add('explode', [0, 1, 2], 20, false);
                    collision.animations.play('explode');
                    var cleanup = function (){
                        collision.destroy();
                    } 
                    game.time.events.add(Phaser.Timer.SECOND * .5, cleanup, this);
                }
                
            } else {
                if (hint){
                    hint.destroy();
                }
                hint = game.add.sprite(player.position.x - 20, player.position.y - 50, 'hintsLevelTwo')
                hint.animations.add('wall-hint', [0], 10, true);
                hint.animations.play('wall-hint');
                game.time.events.add(Phaser.Timer.SECOND * 3, hideHint, this);
            
            }
        }

        function hideHint(){
            hint.destroy()
        }

        function startCredits(){
            game.state.start('Credits')
        }
        
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
            var text = game.add.bitmapText(60, 100, 'font', introText, 25);

        } else if (currentLevel === 2){
            var levelTwoText = "I've fallen... \nand I can't get up."
            var text = game.add.bitmapText(120, 300, 'font', levelTwoText, 25);
            fallingSound = game.add.audio('falling');
            fallingSound.play();
        }
    },
    update: function(){
        game.time.events.add(Phaser.Timer.SECOND * 5, nextLevel, this);

        function nextLevel(){
            if (currentLevel === 1){
                game.state.start('LevelOne')
            } else if (currentLevel === 2){
                game.state.start('LevelTwo')
            }
        }
    }
}



Tan.Credits = function(game){};

Tan.Credits.prototype = {
    preload: function(){
        game.load.bitmapFont('font', 'assets/fonts/joystix_bitmap/joystix.png', 'assets/fonts/joystix_bitmap/joystix.fnt'); 

    },
    create: function(){
        var text = "    Congratulations!    \n\n\n ...but Tan's adventure \n    is far from over    \n\n\n\n       Created By       \n\n      Heather Jang      \n     Keith Reynolds     \n\n\n   Powered by Phaser   \n\n Thanks to the team at \n    Lighthouse Labs  \n\nMore levels coming soon,\n\n Thank you for playing!"
        thanks = game.add.bitmapText(120, 600, 'font', text, 25)
        credits = "Congratulations!\n...but Tan's adventure is far from over\n\n\n\n  Created By \nHeather Jang   Keith Reynolds \n Powered by Phaser \n Thanks to the team at Lighthouse Labs"
    },
    update: function(){
        thanks.y--

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
                gramCount = 2;
                playerForm = 'brick';
                bossTime = false;
                moleLife = 3;
                countdown = false;
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
    game.camera.deadzone = new Phaser.Rectangle(200, deadZoneY, 300, deadZoneHeight);
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
        newEnemy.animations.add('pigeon-step', [0,1,0,2], 10, true);
        newEnemy.animations.play('pigeon-step');
    } else if (enemyKey == 'badfish'){
        newEnemy.animations.add('badfish-swim',[0,1,2], 10, true);
        newEnemy.animations.play('badfish-swim');
    } else if (enemyKey == 'underground-pigeon'){
        newEnemy.animations.add('underground-pigeon-step', [0,1,0,2], 10, true);
        newEnemy.animations.play('underground-pigeon-step');
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



// Moving platforms
function createMovingPlat(xPixFromLeft, yPixFromBottom, imgKey, type, triggerOne, triggerTwo, velocity){
    var newMovePlat = platforms.create(xPixFromLeft, game.world.height - yPixFromBottom, imgKey, 0, platforms);
    game.physics.enable(newMovePlat, Phaser.Physics.ARCADE);
    newMovePlat.allowGravity = false;
    newMovePlat.body.immovable = true;
    newMovePlat.name = type;

    if (type == 'horizontal'){
        newMovePlat.body.velocity.x = velocity;
        createPlatformTrigger((newMovePlat.position.x - triggerOne), newMovePlat.position.y);
        createPlatformTrigger((newMovePlat.position.x + triggerTwo), newMovePlat.position.y);
    } else if (type == 'vertical'){
        newMovePlat.body.velocity.y = velocity;
        createPlatformTrigger(newMovePlat.position.x, (newMovePlat.position.y - triggerOne));
        createPlatformTrigger(newMovePlat.position.x, (newMovePlat.position.y + triggerTwo));
    }

    return newMovePlat;
}

function createPlatformTrigger(xPos, yPos){
    var trigger = game.add.sprite(xPos, yPos, null, 0, platformMovementTriggers);
    trigger.body.setSize(10, 10, 0, 0);
    return trigger;
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

function createCoinCluster(xPos, yPos, numCoins){
    for (var i = 0; i < numCoins; i++){
        var coin = coins.create(game.rnd.integerInRange(xPos-40, xPos+40), yPos, 'coin');
        coin.body.gravity.y = 1000;
        var coinAnim = coin.animations.add('rotate');
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

// Sets up pause Screen
function pauseMenu(){
    var text = "Left Arrow  - Move left\nRight Arrow - Move right\nUp Arrow    - Jump\nF button    - change form\nM button    - Mute game\nP button    - Pause game\n\n     Click to resume"
    menuText = game.add.bitmapText(game.camera.view.x + 150, gameHeight/2 + game.camera.view.y, 'font', text, 25);
    // menuText = game.add.text(game.camera.view.x + 400, gameHeight/2 + game.camera.view.y, 'Click to resume', { font: '30px Arial', fill: '#fff' });
    // menuText.anchor.setTo(0.5, 0.5);
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

function displayToggler(){
    if (toggler.displayed == false){
        toggler.visible = false;
    }
    else{
        toggler.visible = true;
    }            
}

function restartScreen(){
    game.state.start('GameOver');
}

// Adds Level States
game.state.add('LevelOne', Tan.LevelOne);
game.state.add('LevelTwo', Tan.LevelTwo);
game.state.add('Loading', Tan.Loading);
game.state.add('MainMenu', Tan.MainMenu);
game.state.add('GameOver', Tan.GameOver);
game.state.add('Credits', Tan.Credits);
game.state.start('MainMenu');
