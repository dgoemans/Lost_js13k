function Gem(x, y, resources) {
    Sprite.call(this, x, y, 'assets/gem1.png');
    console.log('create gem', x, y)
    this.baseY = y;
    this.beaconOn = false;
    this.radiusOnMap = 0;
    this.alpha = 0;
    this.visible = false;
    this.inputLocked = true;
    this.goalResource = resources.goals;
};

inherit(Gem, Sprite);

Gem.prototype.activate = function(){
    console.log('gem activated');
    this.beaconOn = true;
    this.visible = true;
    this.inputLocked = false;
};

Gem.prototype.deactivate = function(){
    this.beaconOn = false;
    this.visible = false;
    this.inputLocked = true;
};

Gem.prototype.collide = function (other) {
    if (!this.collided && this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        console.log('>>>>>>>>>>>>>>>>> gem collide with player');

        //todo add goal resource
        console.log('!this.goalResource.canAdd(1)', !this.goalResource.canAdd(1));

        if(!this.goalResource.canAdd(1)){
            this.deactivate();
        }

        this.collided = true;
    }

    if (this.collided && !this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        this.collided = false;
    }

};

Gem.prototype.drawOnMap = function(context, goalX, goalY, radius){
    // context.clearRect(goalX, goalY, 100, 100);
    // console.log('radius', radius);
    context.beginPath();
    context.arc(goalX, goalY, this.radiusOnMap, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = 'rgba(152, 8, 8,' + this.alpha + ')';
    context.fill();

};

Gem.prototype.update = function (deltaSeconds) {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    Sprite.prototype.update.call(this, deltaSeconds);

    this.radiusOnMap += 10 * deltaSeconds;

    this.alpha -= 1 * deltaSeconds;

    if(this.alpha <= 0){
        this.alpha = 1;
    }

    if(this.radiusOnMap >= 10)
    {
        this.radiusOnMap = 0;
    }

    this.collide();

};

ctor(Gem);
