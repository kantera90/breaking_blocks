'use strict';

export default class breaking_blocks{

    //コンストラクタ
    constructor(){

    }

    /**
     * ブロック崩し
     * @return 特になし
     */

    view() {

        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");

        var x = canvas.width/2;
        var y = canvas.height-30;
        var ballRadius = 10;
        var dx = 2;
        var dy = -2;

        var currentColor = "#4695d6";
        var currentPaddleColor = "#4695d6";
        var colors = [
            "#4695d6",
            "#fed95c",
            "#fa6e57",
            "#f69e53"
        ];

        var paddleHeight = 10;
        var paddleWidth = 75;
        var paddleX = (canvas.width-paddleWidth)/2;
        var paddleDX = 7;

        var rightPressed = false;
        var leftPressed = false;

        var brickRowCount = 5;
        var brickColumnCount = 5;
        var brickWidth = 75;
        var brickHeight = 20;
        var brickPadding = 10;
        var brickOffsetTop = 30;
        var brickOffsetLeft = 30;

        var bricks = [];
        for(var c=0; c<brickColumnCount; c++) {
            bricks[c] = [];
            for(var r= 0; r<brickRowCount; r++) {
                bricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: 1,
                    color: randomColor(),
                    point: 100
                };
            }
        }

        var score = 0;
        var maxLives = 3;
        var lives = maxLives;
        var point = 0;

        var maxCombo = 1;
        var combo = 0;
        var comboFlug = false;

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);

        function randomColor(){
            return colors[Math.floor(Math.random() * colors.length)];
        }

        function keyDownHandler(e){
            if(e.key === "Right" || e.key === "ArrowRight"){
                rightPressed = true;
            }
            else if(e.key === "Left" || e.key === "ArrowLeft" ){
                leftPressed = true;
            }
        }

        function keyUpHandler(e){
            if(e.key === "Right" || e.key === "ArrowRight"){
                rightPressed = false;
            }
            else if(e.key === "Left" || e.key === "ArrowLeft"){
                leftPressed = false;
            }
        }

        function mouseMoveHandler(e) {
            var relativeX = e.clientX - canvas.offsetLeft;
            if(relativeX > 0 && relativeX < canvas.width){
                paddleX = relativeX - paddleWidth/2;

                if(relativeX < 0 + paddleWidth/2){
                    paddleX = 0;
                }
                else if(relativeX > canvas.width-paddleWidth/2){
                    paddleX = canvas.width - paddleWidth;
                }
            }
        }

        function collisionDetection(){
            for(var c=0; c<brickColumnCount; c++){
                for(var r=0; r<brickRowCount; r++){
                    var b = bricks[c][r];
                    if(b.status === 1){
                        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                            dy = -dy;
                            b.status = 0;
                            score++;
                            currentColor = randomColor();
                            point += b.point;

                            if(comboFlug === true || combo === 0){

                                if(combo !== 0){
                                    point += Math.floor(point * 1.2) - point;
                                }
                                combo++;
                            }

                            comboFlug = true;

                            if(combo > maxCombo){
                                maxCombo = combo;
                            }

                            if(score === brickRowCount*brickColumnCount){
                                alert("YOU WIN, CONGRATULATIONS!");
                                alert("RESULT: " + point + " points! / MAX COMBO: " + maxCombo);
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        }

        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#4695d6";
            ctx.fillText("Score:" + score, 8, 20);
        }

        function drawCombo() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#4695d6";
            ctx.fillText("COMBO:" + combo,  canvas.width - 215 , 20);
        }

        function drawPoint() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#4695d6";
            ctx.fillText("Points:" + point, 130 , 20);
        }

        function drawLives() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#4695d6";
            ctx.fillText("Lives:"+ lives, canvas.width - 65, 20);
        }

        function drawBall(color) {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI*2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle(color) {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }

        function drawBricks() {
            for(var c=0; c<brickColumnCount; c++){
                for(var r=0; r<brickRowCount; r++){
                    if(bricks[c][r].status === 1){
                        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = bricks[c][r].color;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function draw() {

            //描画コード
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawBricks();

            drawBall(currentColor);

            drawPaddle(currentPaddleColor);

            drawScore();

            drawLives();

            drawPoint();

            drawCombo();

            collisionDetection();

            if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
                dx = -dx;
                currentColor = randomColor();
            }

            if(y + dy < ballRadius) {
                dy = -dy;
                currentColor = randomColor();
            }
            else if(y + dy > canvas.height-ballRadius){

                combo = 0;
                comboFlug = false;

                if(x > paddleX && x < paddleX + paddleWidth){
                    dx = dx * (1 + maxLives / 50);
                    dy = -dy * (1 + lives / 50);
                }
                else{

                    lives--;

                    currentPaddleColor = randomColor();
                    paddleWidth = paddleWidth * 1.5;
                    paddleDX = paddleDX * 1.1;
                    if(0>lives){
                        alert("GAME OVER");
                        alert("RESULT: " + point + " points! / MAX COMBO: " + maxCombo);
                        document.location.reload();
                    }
                    else{
                        x = canvas.width/2;
                        y = canvas.height-30;
                        dx = 2;
                        dy = -2;
                        paddleX = (canvas.width-paddleWidth)/2;
                    }
                }
            }

            if(rightPressed && paddleX < canvas.width-paddleWidth){
                paddleX += paddleDX;
            }
            else if(leftPressed && paddleX > 0){
                paddleX -= paddleDX;
            }

            x += dx;
            y += dy;

            requestAnimationFrame(draw);
        }

        draw();

    }

}

