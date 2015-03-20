// Application.js
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-space', { preload: preload, create: create, update: update });

function preload() {
   game.load.image('brick', 'assets/sprites/block.png')
}

function create() {
  var test = game.add.sprite(200, 200, 'brick')
}

function update() {
}