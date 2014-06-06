/**
 * Created by suyuhong on 14-4-1.
 */

FlappyBird.playGame = (function(){
    var bird = new FlappyBird.bird();
    var story = new FlappyBird.story();
    var pillars = [];
    var stage = null;
    var instance = null;
    var Game = function(){
        if(instance){
            return instance;
        }
        this.floorY = 465;
        this.score = 0;
        this.isStart = false;
        this.isEnd = false;
        this.timer = null;
        instance = this;
    }
    Game.prototype.init = function(){
		var canvas = document.getElementById('my-bird');
		canvas.width = document.body.clientWidth;
        stage = new createjs.Stage(canvas);
		
        //管道初始化
        pillars = story.buildPillar(stage);

        //小鸟初始化，(60,200)是小鸟的坐标，渲染到画布上
        bird.init(stage, 60, 200);
        createjs.Ticker.setFPS(10);

        //设置画布监听
        createjs.Ticker.addEventListener("tick", stage);

        //监听键盘操作
        this.addSpaceKeyListener();
    };

    //监听键盘操作
    Game.prototype.addSpaceKeyListener = function () {
        var self = this;
        document.onkeydown = function (e) {
            var e = e || event;
            var currKey = e.keyCode || e.which || e.charCode;
            if (currKey == 32) {
                if(self.isStart == false){
                    self.start();
                    self.isStart = true;

                    //设置tick事件
                    createjs.Ticker.addEventListener("tick", self.tick);
                    document.querySelector('.tip').style.display = "none";
                } else if (self.isEnd == false) {
                    self.jump();
                } else {
                    self.restart();
                }
            }
        }
    };

    //游戏开始
    Game.prototype.start = function() {
        this.jump();
    };
    Game.prototype.jump = function () {
        bird.jump();
    };

    //给小鸟设置定时器
    Game.prototype.createTimer = function (fn) {
        this.timer = setInterval(fn.bind(bird), 30);
    };

    Game.prototype.tick = function(){
        if(bird.state == "die"){
            return;
        }
        for(var i=0; i < pillars.length; i++){
            var pipes = pillars[i];

            //管道从右向左的位置更新，以及管道碰撞检测
            var pillar = pipes.update();

            //删除已经移出左边界的管道
            if(pillar){
                pillars.splice(0, 1);
            }
        }
    };

    //更新分数
    Game.prototype.updateScore = function(){
        ++ this.score;
        var scoreEle = document.querySelector('.game-score').getElementsByTagName('strong')[0];
        scoreEle.innerHTML = this.score;
    };

    Game.prototype.end = function(){
        this.isEnd = true;
    };

    Game.prototype.restart = function(){
        window.location.reload();
    };
    return Game;
}());
