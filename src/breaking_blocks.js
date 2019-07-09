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

        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");

        let x = canvas.width/2;
        let y = canvas.height-30;

        const ballRadius = 10;
        let dx = 2;
        let dy = -2;

        let currentColor= "#4695d6";
        let currentPaddleColor = "#4695d6";
        const colors = [
            "#4695d6",
            "#fed95c",
            "#fa6e57",
            "#f69e53"
        ];

        let paddleHeight = 10;
        let paddleWidth = 75;
        let paddleX = (canvas.width-paddleWidth)/2;
        let paddleDX = 7;

        let rightPressed = false;
        let leftPressed = false;

        const brickRowCount = 5;
        const brickColumnCount = 5;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;

        const randomColor = () => {
            return colors[Math.floor(Math.random() * colors.length)];
        }

        let bricks = [];
        for(let c=0; c<brickColumnCount; c++) {
            bricks[c] = [];
            for(let r= 0; r<brickRowCount; r++) {
                bricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: 1,
                    color: randomColor(),
                    point: 100
                };
            }
        }

        let score = 0;
        const maxLives = 3;
        let lives = maxLives;
        let point = 0;

        let maxCombo = 1;
        let combo = 0;
        let comboFlug = false;

        const keyDownHandler = (e) => {
            if(e.key === "Right" || e.key === "ArrowRight"){
                rightPressed = true;
            }
            else if(e.key === "Left" || e.key === "ArrowLeft" ){
                leftPressed = true;
            }
        }

        const keyUpHandler = (e) => {
            if(e.key === "Right" || e.key === "ArrowRight"){
                rightPressed = false;
            }
            else if(e.key === "Left" || e.key === "ArrowLeft"){
                leftPressed = false;
            }
        }

        const mouseMoveHandler = (e) => {
            const relativeX = e.clientX - canvas.offsetLeft;
            if(0 < relativeX && relativeX < canvas.width){
                paddleX = relativeX - paddleWidth/2;

                if(relativeX < 0 + paddleWidth/2){
                    paddleX = 0;
                }
                else if(relativeX > canvas.width-paddleWidth/2){
                    paddleX = canvas.width - paddleWidth;
                }
            }
        }

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);

        const collisionDetection = () => {
            for(let c=0; c<brickColumnCount; c++){
                for(let r=0; r<brickRowCount; r++){
                    let b = bricks[c][r];
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

        const drawScore = () => {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#4695d6";
            ctx.fillText("Score:" + score, 8, 20);
        };

        const drawCombo = () => {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#4695d6";
            ctx.fillText("COMBO:" + combo,  canvas.width - 215 , 20);
        };

        const drawPoint = () => {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#4695d6";
            ctx.fillText("Points:" + point, 130 , 20);
        }

        const drawLives = () => {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#4695d6";
            ctx.fillText("Lives:"+ lives, canvas.width - 65, 20);
        }

        const drawBall = color => {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI*2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }

        const drawPaddle = color => {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }

        const drawBricks = () => {
            for(let c=0; c<brickColumnCount; c++){
                for(let r=0; r<brickRowCount; r++){
                    if(bricks[c][r].status === 1){
                        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
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

        const draw = () => {

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

