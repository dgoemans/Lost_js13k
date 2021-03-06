function Hud(resources) {

    this.resources = resources;

    this.hearts = [];

    this.goals = null;

    this.goalsImg = new Sprite(canvasWidth - 150, 15, 'assets/scroll.png', 1);

    for(var i=0; i<3; i++)
    {
        var heart = new Sprite(20 + i * 40, 20, 'assets/heart.png', 2);
        this.hearts.push(heart);
    }

    this.goals = new Label(canvasWidth - 80, 10, 35, "Trebuchet MS", 0 + " / 3");
    this.goals.color = '#fff';

};

ctor(Hud);

Hud.prototype.update = function(deltaSeconds) {

    var currentHealth = this.resources.health.currentValue;

    for(var i=0; i<3; i++)
    {
        this.hearts[i].frame = i < currentHealth ? 1 : 0
    }

    var currentGoals = this.resources.goals.currentValue;
    this.goals.text = currentGoals + ' / 3';
}

Hud.prototype.render = function(context) {
    this.hearts.forEach(function(heart) {
        heart.render(context);
    });

    this.goals.render(context);

    this.goalsImg.render(context);
}
