function Game() {
    State.call(this);

    this.resources = new Resources();

    this.level = null;
    this.cameraOffset = 0;
    this.gameOverPopup = null;
    this.gameOver = false;
};

inherit(Game, State);

Game.prototype.enter = function (config) {

    this.clear();

    game.canvas.style.backgroundColor = "#000000";

    State.prototype.enter.call(this, context);

    this.cameraOffset = 0;

    var level = getUrlParameter('level') || config.level;
    var levelInt = parseInt(level);

    this.level = new Level(this.resources);

    this.level.load(levelInt, this.levelLoaded, this);

    gameOverHelper.register(this.showGameOver, this);
};

Game.prototype.levelLoaded = function (room) {

    this.lightLayer = new LightLayer(this.level);

    this.add(this.lightLayer);

    this.player = new Player((room.x + room.w / 2) * this.level.tileSize, (room.y + room.h / 2) * this.level.tileSize, this.resources.health);
    Level.instance.player = this.player;

    console.log(room);

    this.add(this.player);

    this.effectsLayer = new EffectsLayer(this.level.tilesX * this.level.tilesY / 10, this.camera, this.level);

    this.add(this.effectsLayer);

    this.hud = new Hud(this.resources);
};

Game.prototype.showGameOver = function () {
    //todo clear arrays, create a shutdown function
    this.gameOver = true;
    game.popup({title: "GameOVer", lines: ['Game over! Try again!'], permanent: true});
};

Game.prototype.mouseUp = function (x, y) {
    if (this.gameOver) {
        game.goto("game");
        this.gameOver = false;
    }
    else {
        State.prototype.mouseUp.call(this, x, y);
    }
}

Game.prototype.mouseMove = function (x, y) {
}


Game.prototype.keyDown = function (key) {
    if (!this.player)
        return;

    if (key == 37)
        this.player.moveHorizontally(-1);
    if (key == 39)
        this.player.moveHorizontally(1);
    if (key == 38)
        this.player.moveVertically(-1);
    if (key == 40)
        this.player.moveVertically(1);
};

Game.prototype.keyUp = function (key) {
    if (!this.player)
        return;

    if (key == 37 || key == 39) {
        this.player.stopHorizontal();
    } else if (key == 38 || key == 40) {
        this.player.stopVertical();
    }

};


Game.prototype.leave = function () {
    State.prototype.leave.call(this, context);
};

Game.prototype.update = function (deltaSeconds) {

    this.level.update(deltaSeconds);

    this.lightLayer.setLightSource(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);

    this.camera.setPosition(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);

    State.prototype.update.call(this, deltaSeconds);

    this.hud.update(deltaSeconds);
};

Game.prototype.render = function (context) {

    this.camera.setWorld(context);

    this.level.render(context);

    State.prototype.render.call(this, context);

    this.camera.setHud(context);

    this.hud.render(context);

    if(this.level.miniMapTexture)
    {
        this.level.miniMapTexture.render(context);

        context.fillStyle = "#ff00ff";

        context.fillRect(this.level.miniMapTexture.x + this.level.miniMapScale * this.player.x / this.level.tileSize, this.level.miniMapTexture.y + this.level.miniMapScale * this.player.y / this.level.tileSize, this.level.miniMapScale, this.level.miniMapScale);
    }

    this.camera.setWorld(context);
};

ctor(Game);
