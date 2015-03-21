// Application.js
var game = new Phaser.Game(1920, 600, Phaser.AUTO, 'game-space', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('pigeon', 'assets/sprites/pigeons.png');
  game.load.spritesheet('brick', 'assets/sprites/tan-square-move.png', 33, 37, 3);

}

function create() {
//  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    background = game.add.tileSprite(0, 0, 1920, game.height, 'sky');
    game.world.setBounds(0, 0, 1920, 600);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(5, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

// Creating basic platforms
    var plat01 = createPlatform(0.5, 6, 300, 250);
    makeImmovable(plat01);
    var plat02 = createPlatform(0.2, 1, 600, 400);
    makeImmovable(plat02);
    var plat03 = createPlatform(0.2, 1, 700, 500);
    makeImmovable(plat03);
    var plat04 = createPlatform(0.5, 15, 900, 500);
    makeImmovable(plat04);
    var plat05 = createPlatform(0.5, 7.5, 1500, 250);
    makeImmovable(plat05);
    var plat06 = createPlatform(0.1, 5, 1660, 400);
    makeImmovable(plat06);
     var plat05 = createPlatform(0.1, 5, 1660, 400);
    makeImmovable(plat05);

function createPlatform(widthScale, heightScale, xPixFromLeft, yPixFromBottom){
    var newPlatform = platforms.create(xPixFromLeft, game.world.height - yPixFromBottom, 'ground');
    newPlatform.scale.setTo(widthScale, heightScale);
    return newPlatform;
}

function makeImmovable(sprite){
    sprite.body.immovable = true;
}







    player = game.add.sprite(32, game.world.height - 100, 'brick')
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    player.animations.add('walk', [0, 1, 2], 10, true);

    // camera mechanics
    game.camera.follow(player);

    // deadzone
    game.camera.deadzone = new Phaser.Rectangle(200, 100, 300, 400);

    // enemies
    enemy = game.add.sprite(200,200,'pigeon');
    game.physics.arcade.enable(enemy);
    enemy.body.gravity.y = 300;

}



function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    // game.physics.arcade.collide(enemy, platforms);
    // if (game.physics.arcade.collide(enemy, player) == true){
    //     die(player)
    // };

    cursors = game.input.keyboard.createCursorKeys();
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('walk');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('walk');

    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 0;

    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -400;
    }

}

// function die (player){
//     player.kill();
//     console.log("BYE");
// }