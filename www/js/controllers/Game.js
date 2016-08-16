function Game() { throw new Error("Cannot initialize a static class!"); }

Game.preload = Preloader.init;

Game.create = function() {
    this._scene = new SceneGame();
    this._scene.create();
};

Game.changeScene = function(scene) {
    this._scene.destroy();
    this._scene = scene;
    this._scene.create();
};

Game.update = function() {
    this._scene.update();
};

Game.render = function() {
    this._scene.render();
};
