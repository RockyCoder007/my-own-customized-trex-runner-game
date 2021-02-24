var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround;

var cloudsGroup, cloudImage;
var buildingsGroup, building,building1, building2, building3, building4, building5, building6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trexrunning1.png","trex (1).png","trexrunning2.png");
  trex_collided = loadAnimation("trex_gameOver.png");
  

  
  cloudImage = loadImage("cloud.png");
  
  building1 = loadImage("bulding1.png");
  building2 = loadImage("building2.png");
  building3 = loadImage("building3.png");
  building4 = loadImage("building4.png");
  building5 = loadImage("building5.png");
  building6 = loadImage("building6.png");

  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ground = createSprite(width/2,height-10,width*2,25);

  ground.x = ground.width /2;
  trex = createSprite(50,height-100,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.15;
  

  
   gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,gameOver.y+40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width-400,height-10,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  buildingsGroup = createGroup();
  cloudsGroup = createGroup();
  building1.scale=1;
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,200);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
 
  background(rgb(50,180,255));
  ground.shapeColor=rgb(0,200,0);
  //displaying score
  text("Score: "+ score, width/2,80);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
      if(score%100===0&&score>0){
        
        checkPointSound.play();
      }
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -4-(Math.round(score/100 ));
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length>0||keyDown("space")&& trex.y >= height-60) {
        trex.velocityY = -12;
      jumpSound.play();
      touches=[];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnBuildings();
    
    if(buildingsGroup.isTouching(trex)){
        gameState=END;

    }
  }
   else if (gameState === END) {
     console.log("hey")
     
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    buildingsGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     buildingsGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  if (mousePressedOver(restart)||touches.length>0){
    reset();
    touches=[];
  }

 
  //stop trex from falling down
  trex.collide(invisibleGround);
  

  
  drawSprites();
}

function spawnBuildings(){
 if (frameCount % 60 === 0){
   building = createSprite(width,height-35,10,40);
   building.velocityX = -6-(Math.round(score/100));
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: building.addImage(building1);
              break;
      case 2: building.addImage(building2);
              break;
      case 3: building.addImage(building3);
              break;
      case 4: building.addImage(building4);
              break;
      case 5: building.addImage(building5);
              break;
      case 6: building.addImage(building6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    building.scale = 0.1;
    building.lifetime = 300;
    building.setCollider("rectangle",0,0,300,400);
    //building.debug=true;
   //add each obstacle to the group
    buildingsGroup.add(building);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) { 
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3-(Math.round(score/100));
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function reset(){
  
  gameState=PLAY;
  trex.changeAnimation("running",trex_running);
  score=0;
  buildingsGroup.destroyEach();
  cloudsGroup.destroyEach();
}