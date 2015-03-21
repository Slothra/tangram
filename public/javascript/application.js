// Application.js
var game = new Phaser.Game(900, 600, Phaser.AUTO, 'game-space', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
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
    var ledgeTest = createPlatform(2, 4, 200, 200);
    makeImmovable(ledgeTest);

    var ledgeTest2 = createPlatform(1, 0.5, 500, 500);
    makeImmovable(ledgeTest2);

function createPlatform(widthScale, heightScale, xLoc, yLoc){
    var newPlatform = platforms.create(xLoc, yLoc, 'ground');
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
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('walk', [0, 1, 2], 10, true);

    // camera mechanics
    game.camera.follow(player);

    // deadzone
    game.camera.deadzone = new Phaser.Rectangle(200, 100, 300, 400);
}



function update() {
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

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