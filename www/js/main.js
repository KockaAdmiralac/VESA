/* globals Phaser: true, require: true */
window.onerror = function(error, file, line, column) {
    file = file.split("/");
    file = file[file.length - 1];
    alert(
        "Error: " + error +
        "\nFile: " + file +
        "\nLine: " + line +
        "\nColumn: " + column
    );
};

function temp(a) { alert(JSON.stringify(a)); }

var game;   // Main game object

window.onload = function() {
    game = new Phaser.Game(640, 480, Phaser.AUTO, 'VESA', {
        preload: Preloader.init.bind(Preloader),
        create: Game.create.bind(Game),
        update: Game.update.bind(Game),
        render: Game.render.bind(Game)
    }, true);
};
