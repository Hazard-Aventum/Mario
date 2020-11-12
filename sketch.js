var marioImage, marioCollided;
var obstacleImage;
var gameOverImage, restartImage;
var bgImage, brickImage;
var groundImage;

var jumpSound;
var checkPointSound; 
var deathSound;

var ground;
var mario, obstacle;

var gameOver, restart;

var obstacleGroup,brickGroup;

var score = 0;

var PLAY = 0;
var END = 1;
var gamestate = PLAY;

function preload(){
  bgImage = loadImage("bg.png");
  groundImage = loadImage("ground.png");
  brickImage = loadImage("brick.png");

  gameOverImage  = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");

  marioAnimation = loadAnimation("mario00.png","mario01.png", "mario02.png", "mario03.png");
  marioCollided = loadAnimation("collided.png");

  obstacleAnimation = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");
  obstacleCollide = loadAnimation("obstacle4.png")

  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  deathSound = loadSound("die.mp3");

}


function setup(){
  createCanvas(800,660);

  ground = createSprite(400,610,800,10);
  ground.addImage(groundImage);

  ground.velocityX = -10;
  ground.scale = 1.3;

  mario = createSprite(100,535,20,20);
  mario.addAnimation("Run",marioAnimation);
  mario.addAnimation("Collide",marioCollided);
  mario.scale = 2;
  mario.setCollider("rectangle",0,0,25,30);

  restart = createSprite(400,300,20,20);
  restart.addImage("restart", restartImage);
  restart.visible = false;

  gameOver = createSprite(400,370,20,20);
  gameOver.addImage("GameOver", gameOverImage);
  gameOver.visible = false;

  obstacleGroup = new Group();
  brickGroup = new Group();

}

function draw(){
  background(bgImage);

  textSize(25);
  fill("black");
  text("Score:" + score, 700,30);

  if(gamestate === PLAY){
    if(ground.x < 0 ){
      ground.x = ground.width/2
    }
  
    if(keyDown("space") && mario.y>519){
      mario.velocityY = -18;
      jumpSound.play();
    }

    for(var index = 0;index<brickGroup.length;index = index + 1){
      if(brickGroup.get(index).isTouching(mario)){
        brickGroup.get(index).remove();
        score = score + 1;
      }
    }
  
    mario.velocityY = mario.velocityY + 1;

    mario.collide(ground);
  
    spawnObstacle();
    spawnBrick();

    if (mario.isTouching(obstacleGroup)){
      gamestate = END;
    }
  }
  else if(gamestate === END){

    gameOver.visible = true;
    restart.visible = true;

    mario.changeAnimation("Collide", marioCollided);
    obstacle.changeAnimation("chompStop",obstacleCollide);

    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);

    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);

    mario.velocityY = 0;

    if(mousePressedOver(restart)){
      gamestate = PLAY;

      mario.changeAnimation("Run",marioAnimation);

      ground.velocityX = -10;

      gameOver.visible = false;
      restart.visible = false;

      obstacleGroup.destroyEach();
      brickGroup.destroyEach();

      score = 0;
    }


  }
  
  drawSprites();
}

function spawnObstacle(){
  if(frameCount % 150 === 0){
   obstacle = createSprite(800,530,50,50);
   obstacle.addAnimation("Chomp",obstacleAnimation);
   obstacle.addAnimation("chompStop",obstacleCollide);
 
   obstacle.scale = 1.4;
   obstacle.velocityX = -10;
   obstacle.lifetime = 140;
 
   mario.depth = obstacle.depth;
   mario.depth = mario.depth + 1

   obstacle.setCollider("rectangle",0,0,40,40)

   obstacleGroup.add(obstacle);
  }

}

function spawnBrick(){ 
  var nu = Math.round(random(120,150));
  if(frameCount % nu === 0){
    var brick = createSprite(800,random(375,475),10,10);
    brick.addImage(brickImage);
  
    brick.scale = 1.5;
    brick.velocityX = -10;
    brick.lifetime = 140;

    mario.depth = brick.depth;
    mario.depth = mario.depth + 1;

    brickGroup.add(brick);
  }
}
