let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
let movingSpeed = 60;
let secondsPassed = 0;
let oldTimeStamp = 0;

const powerUps = ["plusBallSpeed", "plusPaddleSize", "minusPaddleSize", "plusPaddleSpeed", "plusBallSize"]
let whichPowerUp = 0

let plusBallSpeed = document.getElementById("plusBallSpeed");
let plusBallSize = document.getElementById("plusBallSize");
let plusPaddleSpeed = document.getElementById("plusPaddleSpeed");
let plusPaddleSize = document.getElementById("plusPaddleSize");
let minusPaddleSize = document.getElementById("minusPaddleSize");


//setting starting scoreline
let scoreLeft = 0
let scoreRight = 0


//allowing ball to change directions when hits paddles
let velocityX = 10
let posVelocityX = velocityX
let negVelocityX = velocityX/-1

//setting multiple speeds
let velocityY = 10
let negVelocityY = 0
let paddleSpeedY = 5
let paddle1SpeedY = paddleSpeedY
let paddle2SpeedY = paddleSpeedY
let paddleSpeedX = 0.4
let playing = false
let setBallBounciness = 5
let ballBounciness = setBallBounciness

//setting powerUp speeds
let powerUpVelX = Math.round((Math.random() * 4 - 2)*100)/100
let powerUpVelY = Math.round((Math.random() * 4 - 2)*100)/100
let powerUpTime = 0
let powerUpWidth = 120
let powerUpHeight = 120
let powerUpShow = true

//sets canvas fullscreen
canvas.height = Math.floor(window.innerHeight)
canvas.width = Math.floor(window.innerWidth)

//setting dimensions
let paddleHeight = 100
let paddle1Height = paddleHeight
let paddle2Height = paddleHeight
let paddleWidth = 20
let predictedSpotY1 = canvas.height/2
let predictedSpotY2 = canvas.height/2
let ballSize = 10


//creates key object (kind of array)
let toggledKeys = {};
let paddle1 = {
    x: 0,
    y: canvas.height/2-paddleHeight/2
};
let paddle2 = {
    x: canvas.width-20,
    y: canvas.height/2-paddleHeight/2

};
let ball = {
    x: paddle1.x+paddleWidth+ballSize,
    y: paddle1.y+paddleHeight/2
}
let powerUpPos = {
    x: canvas.width/2+(Math.round(Math.random() * canvas.width/2 - canvas.width/4)),
    y: canvas.height/2+(Math.round(Math.random() * canvas.height/2 - canvas.height/4))
}

//when key is pressed down, log the key
document.addEventListener("keydown", event => {
    toggledKeys[event.code] = true;
    event.preventDefault();
});
//when key comes back up, log the key
document.addEventListener("keyup", event => {
    toggledKeys[event.code] = false;
    event.preventDefault();
});


function update() {

    //checking if ball hit the front of the right paddle
    if (ball.x >= paddle2.x-ballSize && ball.x <= paddle2.x+posVelocityX-5 && ball.y <= paddle2.y+paddle2Height+ballSize && ball.y >= paddle2.y-ballSize){
        velocityX = negVelocityX
        velocityY = Math.round(((ball.y-paddle2.y-(paddle2Height/2))/ballBounciness*(100/paddle2Height))*10)/10
        negVelocityY = -velocityY
    }//checking if ball hit the sides of the right paddle
    else if (ball.x >= paddle2.x-ballSize && ball.x <= paddle2.x+posVelocityX+20 && ball.y <= paddle2.y+paddle2Height+ballSize && ball.y >= paddle2.y-ballSize){
        velocityY = negVelocityY
    }
    //checking if ball hit the front of the left paddle
    if (ball.x <= paddle1.x+30 && ball.x >= paddle1.x-posVelocityX+25 && ball.y <= paddle1.y+paddle1Height+ballSize && ball.y >= paddle1.y-ballSize){
        velocityX = posVelocityX
        velocityY = Math.round(((ball.y-paddle1.y-(paddle1Height/2))/ballBounciness*(100/paddle1Height))*10)/10
        negVelocityY = -velocityY
    }//checking if ball hit the sides of the left paddle
    else if (ball.x <= paddle1.x+30 && ball.x >= paddle1.x-posVelocityX && ball.y <= paddle1.y+paddle1Height+ballSize && ball.y >= paddle1.y-ballSize){
        velocityY = negVelocityY
    }
    if(velocityX>0){
        calculate2()
    }
    if(velocityX<0){
        calculate1()
    }
    //top and bottom of page collisions
    if (ball.y+velocityY < ballSize){
        ball.y = Math.abs(velocityY)-(ball.y-ballSize)+ballSize
        velocityY = velocityY/-1
    }
    if (ball.y+velocityY > canvas.height-ballSize){
        ball.y = canvas.height-(Math.abs(velocityY)-((canvas.height-ball.y)-ballSize)+ballSize)
        velocityY = velocityY/-1
    }
    if (toggledKeys["Space"] && playing == false){
        if (ball.x < canvas.width/2){
            velocityY = Math.round(Math.random() * (5+5) -5)
        }
        playing = true;
        powerUpShow = true;
        whichPowerUp = powerUps[Math.floor(Math.random()*4.99)]
    }
    if (toggledKeys["Escape"] && playing == false){
        window.location.replace("index.html")
    }
    //if ball is going away from left cpu
    if (velocityX > 0){
        //if cpu is too close to top/bottom walls, go to middle
        if (paddle1.y > canvas.height-paddle1Height-80){
            paddle1.y -= paddle1SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle1.y < 80){
            paddle1.y += paddle1SpeedY*movingSpeed*secondsPassed;
        }//if cpu is near middle, go towards ball/middle
        if (paddle1.x < canvas.width/2 - 160 && paddle1.y > 80 && paddle1.y < canvas.height-paddle1Height-80 && paddle1.y+paddle1Height/2 > (predictedSpotY2+canvas.height/2)/2){
            paddle1.y -= paddle1SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle1.x < canvas.width/2 - 160 && paddle1.y > 80 && paddle1.y < canvas.height-paddle1Height-80 && paddle1.y+paddle1Height/2 < (predictedSpotY2+canvas.height/2)/2){
            paddle1.y += paddle1SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle1.x > canvas.width/2 - 160 && paddle1.y > 80 && paddle1.y < canvas.height-paddle1Height-80 && paddle1.y+paddle1Height/2 > predictedSpotY2){
            paddle1.y -= paddle1SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle1.x > canvas.width/2 - 160 && paddle1.y > 80 && paddle1.y < canvas.height-paddle1Height-80 && paddle1.y+paddle1Height/2 < predictedSpotY2){
            paddle1.y += paddle1SpeedY*movingSpeed*secondsPassed;
        }
    }//if ball is going towards left cpu
    if (velocityX < 0){
        //go towards predicted spot
        if (predictedSpotY1 > paddle1.y+paddle1Height/2 && paddle1.y < canvas.height-paddle1Height-paddle1SpeedY) {
            paddle1.y += paddle1SpeedY*movingSpeed*secondsPassed;
        }
        else if (predictedSpotY1 > paddle1.y+paddle1Height/2) {
            paddle1.y = canvas.height-paddle1Height
        }
        if (predictedSpotY1 < paddle1.y+paddle1Height/2 && paddle1.y > 0) {
            paddle1.y -= paddle1SpeedY*movingSpeed*secondsPassed;
        }
        else if (predictedSpotY1 < paddle1.y+paddle1Height/2) {
            paddle1.y = 0
        }
    }
    //same thing for right cpu
    if (velocityX < 0){
        if (paddle2.y > canvas.height-paddle2Height-80){
            paddle2.y -= paddle2SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle2.y < 80){
            paddle2.y += paddle2SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle2.x < canvas.width/2 - 260 && paddle2.y > 80 && paddle2.y < canvas.height-paddle2Height-80 && paddle2.y+paddle2Height/2 > (predictedSpotY2+canvas.height/2)/2){
            paddle2.y -= paddle2SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle2.x < canvas.width/2 - 260 && paddle2.y > 80 && paddle2.y < canvas.height-paddle2Height-80 && paddle2.y+paddle2Height/2 < (predictedSpotY2+canvas.height/2)/2){
            paddle2.y += paddle2SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle2.x > canvas.width/2 - 260 && paddle2.y > 80 && paddle2.y < canvas.height-paddle2Height-80 && paddle2.y+paddle2Height/2 > predictedSpotY2){
            paddle2.y -= paddle2SpeedY*movingSpeed*secondsPassed;
        }
        if (paddle2.x > canvas.width/2 - 260 && paddle2.y > 80 && paddle2.y < canvas.height-paddle2Height-80 && paddle2.y+paddle2Height/2 < predictedSpotY2){
            paddle2.y += paddle2SpeedY*movingSpeed*secondsPassed;
        }
    }
    if (velocityX > 0){
        if (predictedSpotY2 > paddle2.y+paddle2Height/2 && paddle2.y < canvas.height-paddle2Height-paddle2SpeedY) {
            paddle2.y += paddle2SpeedY*movingSpeed*secondsPassed;
        }
        else if (predictedSpotY2 > paddle2.y+paddle2Height/2) {
            paddle2.y = canvas.height-paddle2Height
        }
        if (predictedSpotY2 < paddle2.y+paddle2Height/2 && paddle2.y > 0) {
            paddle2.y -= paddle2SpeedY*movingSpeed*secondsPassed;
        }
        else if (predictedSpotY2 < paddle2.y+paddle2Height/2) {
            paddle2.y = 0
        }
    }
    //if ball goes past right paddle
    if (ball.x > canvas.width-ballSize+posVelocityX) {
        scoreLeft+=1
        paddle1Height = paddleHeight
        paddle2Height = paddleHeight
        ballBounciness = setBallBounciness
        paddle1SpeedY = paddleSpeedY
        paddle2SpeedY = paddleSpeedY
        posVelocityX = 10
        negVelocityX = -10
        ballSize = 10
        playing = false
        paddle1 = {
            x: 0,
            y: canvas.height/2-paddleHeight/2
        };
        paddle2 = {
            x: canvas.width-20,
            y: canvas.height/2-paddleHeight/2
        
        };
        ball = {
            x: paddle2.x-ballSize,
            y: paddle1.y+paddleHeight/2
        }
        velocityX = posVelocityX
        velocityY = 0
    }
    //if ball goes past left paddle
    if (ball.x < ballSize-posVelocityX){
        scoreRight+=1
        paddle1Height = paddleHeight
        paddle2Height = paddleHeight
        ballBounciness = setBallBounciness
        paddle1SpeedY = paddleSpeedY
        paddle2SpeedY = paddleSpeedY
        posVelocityX = 10
        negVelocityX = -10
        ballSize = 10
        playing = false
        paddle1 = {
            x: 0,
            y: canvas.height/2-paddleHeight/2
        };
        paddle2 = {
            x: canvas.width-20,
            y: canvas.height/2-paddleHeight/2
        
        };
        ball = {
            x: paddle1.x+paddleWidth+ballSize,
            y: paddle1.y+paddleHeight/2
        }
        velocityX = posVelocityX
        velocityY = 0
    }
    //checking if game has started
    if (playing == true){
        //ball movement
        ball.x += velocityX*movingSpeed*secondsPassed
        ball.y += velocityY*movingSpeed*secondsPassed
        //paddles get closer
        if (paddle1.x < canvas.width/2 - 80){
            paddle1.x += paddleSpeedX*movingSpeed*secondsPassed
            paddle2.x -= paddleSpeedX*movingSpeed*secondsPassed
        }
    }
    //If powerUp is too close to walls, go towards middle
    if (powerUpPos.y <= 20+velocityY || powerUpPos.y+powerUpHeight >= canvas.height-20){
        powerUpVelY = powerUpVelY/-1
    }//If powerUp is too close to paddles, go towards middle
    if (powerUpPos.x+powerUpWidth >= paddle2.x){
        powerUpVelX = -2
    }
    else if(powerUpPos.x <= paddle1.x+20){
        powerUpVelX = 2
    }//Changing speed and direction of powerUp every 50 ticks
    else if(powerUpTime >= 50 && powerUpShow == true && powerUpPos.x+powerUpWidth <= paddle2.x && powerUpPos.x >= paddle1.x+20){
        powerUpTime = 0
        powerUpVelX = Math.round((Math.random() * 4 - 2)*100)/100
        powerUpVelY = Math.round((Math.random() * 4 - 2)*100)/100
    }
    if(powerUpShow == true){
        powerUpPos.x += powerUpVelX*movingSpeed*secondsPassed
        powerUpPos.y += powerUpVelY*movingSpeed*secondsPassed
    }
    //Changing in game variables when ball hits powerUp
    if(ball.x-ballSize >= powerUpPos.x && ball.x+ballSize <= powerUpPos.x+powerUpWidth && ball.y-ballSize >= powerUpPos.y && ball.y+ballSize <= powerUpPos.y+powerUpHeight && powerUpShow == true){
        if(whichPowerUp == "plusPaddleSize"){
            if (velocityX > 0){
                if(paddle1.y > canvas.height-200){
                    paddle1.y = canvas.height-200
                }
                paddle1Height = 200
            }
            else if (velocityX < 0){
                if(paddle2.y > canvas.height-200){
                    paddle2.y = canvas.height-200
                }
                paddle2Height = 200
            }
        }
        else if(whichPowerUp == "plusBallSpeed"){
            if(velocityX > 0){
                velocityX = 15
            }
            else if(velocityX < 0){
                velocityX = -15
            }
            posVelocityX = 15
            negVelocityX = -15
            ballBounciness = 3.5
            paddle1SpeedY = 7.5
            paddle2SpeedY = 7.5
        }
        else if(whichPowerUp == "plusBallSize"){
            ballSize = 20 
        }
        else if(whichPowerUp == "minusPaddleSize"){
            if (velocityX > 0){
                paddle1Height = 50
            }
            else if (velocityX < 0){
                paddle2Height = 50
            }
        }
        else if(whichPowerUp == "plusPaddleSpeed"){
            if (velocityX > 0){
                paddle1SpeedY = 8
            }
            else if (velocityX < 0){
                paddle2SpeedY = 8
            }
        }
        powerUpShow = false
    }
    //powerUp goes away after 600 ticks of usage
    if(powerUpTime >= 600 && powerUpShow == false){
        paddle1Height = paddleHeight
        paddle2Height = paddleHeight
        ballBounciness = setBallBounciness
        paddle1SpeedY = paddleSpeedY
        paddle2SpeedY = paddleSpeedY
        ballSize = 10
        if (velocityX > 0){
            velocityX = 10
        }
        else if (velocityX < 0){
            velocityX = -10
        }
    }

    powerUpTime += 1*movingSpeed*secondsPassed
}

//calculates where the ball will end up when it gets to the paddle
function calculate1(){
    let distanceToPaddle = (ball.x - (paddle1.x+20+ballSize))
    let slope = -(velocityY/(velocityX-paddleSpeedX))
    //let slope = -(velocityY/velocityX)
    predictedSpotY1 = (slope*distanceToPaddle)+ball.y
    let bounces = 0
    let adjustedHeight = canvas.height-ballSize*2
    
    //calculating how many times the ball will bounce off the walls
    while(predictedSpotY1 > canvas.height-ballSize || predictedSpotY1 < ballSize){
        if(predictedSpotY1 < ballSize){
            bounces+=1
            predictedSpotY1 = -predictedSpotY1+ballSize*2+Math.abs(velocityY)
        }
        else if(predictedSpotY1 > canvas.height-ballSize){
            bounces +=1
            predictedSpotY1 = canvas.height-(predictedSpotY1-canvas.height)-ballSize*2-Math.abs(velocityY)
        }
    }

    //calculating where the ball will be when in hits the left paddle
    if (predictedSpotY1 > canvas.height-ballSize && bounces == 1){
        predictedSpotY1 = (canvas.height-ballSize)*2-predictedSpotY1-velocityY
    }
    else if (predictedSpotY1 < ballSize && bounces == 1){
        predictedSpotY1 = Math.abs(predictedSpotY1)+(canvas.height+ballSize)-(canvas.height-ballSize)-velocityY
    }
    else if (predictedSpotY1 < ballSize && (bounces % 2) == 0){
        predictedSpotY1 = (adjustedHeight*bounces)-Math.abs(predictedSpotY1)+velocityY*bounces
    }
    else if (predictedSpotY1 > canvas.height-ballSize && (bounces % 2) == 0){
        predictedSpotY1 = predictedSpotY1-(adjustedHeight*bounces)+velocityY*bounces
    }
    else if(predictedSpotY1 > canvas.height-ballSize && (bounces % 2) != 0){
        predictedSpotY1 = adjustedHeight-(predictedSpotY1-(adjustedHeight*bounces))+ballSize*2-velocityY*bounces
    }
    else if(predictedSpotY1 < ballSize && (bounces % 2) != 0){
        predictedSpotY1 = adjustedHeight+(Math.abs(predictedSpotY1)-adjustedHeight*bounces)+ballSize*2-velocityY*bounces
    }
}
//calculates where the ball will end up when it gets to the paddle
function calculate2(){
    let distanceToPaddle = (paddle2.x-ball.x)
    let slope = (velocityY/(velocityX+paddleSpeedX))
    //let slope = (velocityY/velocityX)
    predictedSpotY2 = (slope*distanceToPaddle)+ball.y
    let bounces = 0
    let adjustedHeight = canvas.height-ballSize*2

    //calculating how many times the ball will bounce off the walls
    while(predictedSpotY2 > canvas.height-ballSize || predictedSpotY2 < ballSize){
        if(predictedSpotY2 < ballSize){
            bounces+=1
            predictedSpotY2 = -predictedSpotY2+ballSize*2+Math.abs(velocityY)
        }
        else if(predictedSpotY2 > canvas.height-ballSize){
            bounces +=1
            predictedSpotY2 = canvas.height-(predictedSpotY2-canvas.height)-ballSize*2-Math.abs(velocityY)
        }
    }

    //calculating where the ball will be when in hits the right paddle
    if (predictedSpotY2 > canvas.height-ballSize && bounces == 1){
        predictedSpotY2 = (canvas.height-ballSize)*2-predictedSpotY2-velocityY
    }
    else if (predictedSpotY2 < ballSize && bounces == 1){
        predictedSpotY2 = Math.abs(predictedSpotY2)+(canvas.height+ballSize)-(canvas.height-ballSize)-velocityY
    }
    else if (predictedSpotY2 < ballSize && (bounces % 2) == 0){
        predictedSpotY2 = (adjustedHeight*bounces)-Math.abs(predictedSpotY2)+velocityY*bounces
    }
    else if (predictedSpotY2 > canvas.height-ballSize && (bounces % 2) == 0){
        predictedSpotY2 = predictedSpotY2-(adjustedHeight*bounces)+velocityY*bounces
    }
    else if(predictedSpotY2 > canvas.height-ballSize && (bounces % 2) != 0 && ball.x < canvas.width-60){
        predictedSpotY2 = adjustedHeight-(predictedSpotY2-(adjustedHeight*bounces))+ballSize*2-velocityY*bounces
    }
    else if(predictedSpotY2 < ballSize && (bounces % 2) != 0){
        predictedSpotY2 = adjustedHeight+(Math.abs(predictedSpotY2)-adjustedHeight*bounces)+ballSize*2-velocityY*bounces
    }
}

function draw(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);    
    update();
    ctx.fillStyle='blue';
    ctx.fillRect(paddle1.x, paddle1.y, paddleWidth, paddle1Height);
    ctx.fillStyle='red';
    ctx.fillRect(paddle2.x, paddle2.y, paddleWidth, paddle2Height);
    ctx.fillStyle='black';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(scoreLeft +"-"+ scoreRight, canvas.width/2, 40);
    ctx.fillStyle='grey'
    if(playing == false){
        ctx.fillText("Press Space To Start", canvas.width/2, canvas.height/2);
        ctx.fillText("Press Escape To Go Back To Home Page", canvas.width/2, canvas.height/2+60);
    }
    ctx.globalCompositeOperation = 'destination-over';
    if(playing == true && powerUpShow == true){
        if(whichPowerUp == "plusPaddleSize"){
            ctx.drawImage(plusPaddleSize, powerUpPos.x, powerUpPos.y, 120, 120);
        }
        else if(whichPowerUp == "plusBallSpeed"){
            ctx.drawImage(plusBallSpeed, powerUpPos.x, powerUpPos.y, 120, 120);
        }
        else if(whichPowerUp == "plusBallSize"){
            ctx.drawImage(plusBallSize, powerUpPos.x, powerUpPos.y, 120, 120);
        }
        else if(whichPowerUp == "minusPaddleSize"){
            ctx.drawImage(minusPaddleSize, powerUpPos.x, powerUpPos.y, 120, 120);
        }
        else if(whichPowerUp == "plusPaddleSpeed"){
            ctx.drawImage(plusPaddleSpeed, powerUpPos.x, powerUpPos.y, 120, 120);
        }
    }
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);