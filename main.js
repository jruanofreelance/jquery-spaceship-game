var playerShipProperties = {
    lifes: 3,
    munition: 1000,
    weapon: 1,
		speed: 5,
		movement: 10,
    score: 0,
    timeRewards: 10000
    },
    enemyShipProperties = {
      lifes: 1,
      munition: 10000,
      weapon: 1,
  		speed: 10,
  		movement: 2000
    },
    numberEnemies = 6,
    numberPlayers = 1,
    liveShips = [enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes],
    leftKey = 37,
    upKey = 38,
    rightKey = 39,
    downKey = 40,
    widthWindow = $(window).width(),
    windowMarginLeft = 50,
    windowMarginRight = widthWindow - windowMarginLeft;

$(document).ready(function(){

	elementPlayerShip = $("#playerShip");

	widthPlayerShip = elementPlayerShip.width();
	heightPlayerShip = elementPlayerShip.height();

	elementEnemyShipsContanier = $(".enemyShipsContainer");
	widthEnemyShipsContanier = elementEnemyShipsContanier.width();

  enemyShip1 = $("#enemyShip1");
  enemyShip2 = $("#enemyShip2");
  enemyShip3 = $("#enemyShip3");
  enemyShip4 = $("#enemyShip4");
  enemyShip5 = $("#enemyShip5");
  enemyShip6 = $("#enemyShip6");

  enemyShips = [enemyShip1, enemyShip2, enemyShip3, enemyShip4, enemyShip5, enemyShip6];
  enemyBullets = [false,false,false,false,false,false];

  canShoot = true;

  initializeScore();
  initializeLifes();
	initializeEvents();
	enemyShipsToRight();
  generateRandomNumberEnemyShoot();

  setInterval(rewards, playerShipProperties.timeRewards);

  $(".preloader").fadeOut("fast");

});

function rewards(){

  var widthWindow = $(window).width(),
      randomNumberInitialPositionReward = Math.floor(Math.random() * widthWindow),
      rewards,
      randomRewardObtained,
      heightWindow,
      i,
      hasRewardCollisionWithShip;

  if(randomNumberInitialPositionReward < 20){
    randomNumberInitialPositionReward = 20;
  }else if(randomNumberInitialPositionReward > widthWindow - 20){
    randomNumberInitialPositionReward = randomNumberInitialPositionReward = 20;
  }

  pointReward = "pointReward";
  lifeReward = "lifeReward";
  //weaponReward = "weaponReward";
  //rewards = [pointReward, lifeReward, weaponReward];
  rewards = [pointReward, lifeReward];
  randomRewardObtained = Math.floor(Math.random()*rewards.length);

  for (i = 0; i < rewards.length; i++) {
    if(randomRewardObtained == i){

      elementEnemyShipsContanier.before("<div class='"+rewards[i]+"'></div>");

      rewardElement = $("."+rewards[i]);
      reward = rewards[i];

      rewardElement.css("left",randomNumberInitialPositionReward + "px");

    }
  }

  heightWindow = windowHeightObtain();
  topRewardCollidedWithShip = heightWindow - 140;

  rewardElement.animate({top:"+" + topRewardCollidedWithShip + "px"},3000,"linear",function(){

    hasRewardCollisionWithShip = rewardCollides();

    if(hasRewardCollisionWithShip === false){

      rewardElement.animate({top: heightWindow - 60 + "px"},600,"linear",function(){

        hiddenReward();

      });

    }

  });

}

function rewardCollides(){
  var widthRewardElement = rewardElement.width(),
      rewardElementPositionLeft = rewardElement.offset().left,
      rewardCollidedWithShip = false,
      elementDistancePlayerShip = elementPlayerShip.offset(),
      positionXPlayerShip = elementDistancePlayerShip.left;

  if(rewardElementPositionLeft > positionXPlayerShip && rewardElementPositionLeft < positionXPlayerShip + widthPlayerShip){

    rewardCollidedWithShip = true;
    hiddenReward();

    if(reward === pointReward){
      playerShipProperties.score = playerShipProperties.score + 10;
      scoreContainer.text(playerShipProperties.score);
    }else if (reward === lifeReward) {
      playerShipProperties.lifes = playerShipProperties.lifes + 1;
      lifeContainer.append("<div class='life' id='life" + playerShipProperties.lifes + "'></div>");
    }

    //TODO: Another weapon
    /*
    }else if(reward === weaponReward){
      console.log(weaponReward);
    }
    */

  }

  return rewardCollidedWithShip;

}

function initializeScore(){
  scoreContainer = $("#score");
  scoreContainer.text(playerShipProperties.score);
}

function initializeLifes(){
  var i;
  lifeContainer = $(".lifesContainer");

  for (i = 1; i <= playerShipProperties.lifes; i++) {
    lifeContainer.append("<div class='life' id='life" + i + "'></div>");
  }

}

function initializeEvents(){

	$(window).resize(function() {

		//TODO: resize width screen

    /*
		newWidthWindow = $(window).width();
		var elementDistancePlayerShip = elementPlayerShip.offset();
		var positionXPlayerShip = elementDistancePlayerShip.left;
		var aRestar = widthWindow - newWidthWindow;
		newPositionXPlayerShip = positionXPlayerShip - aRestar;

		elementPlayerShip.css("left",newPositionXPlayerShip + "px");

		widthWindow = newWidthWindow;
    */

	});

	$("body").keydown(function (event) {
		event.preventDefault();
		var key = event.keyCode,
		    elementDistancePlayerShip = elementPlayerShip.offset(),
    		positionXPlayerShip = elementDistancePlayerShip.left,
       	positionYPlayerShip = elementDistancePlayerShip.top,
    		centerXPlayerShip = positionXPlayerShip + widthPlayerShip / 2,
    		centerYPlayerShip = positionYPlayerShip + heightPlayerShip / 2,
        bulletPositionCenter,
        hasCollided;

    windowWidthObtain();

		if(key === leftKey && positionXPlayerShip > windowMarginLeft){
			//elementPlayerShip.animate({left: "-=" + playerShipProperties.movement}, playerShipProperties.speed, 'linear', function () {});
			elementPlayerShip.css("left","-=" + playerShipProperties.speed + "px");
		}

		if(key === rightKey && positionXPlayerShip < windowMarginRight - widthPlayerShip){
			//elementPlayerShip.animate({left: "+=" + playerShipProperties.movement}, playerShipProperties.speed, 'linear', function () {});
			elementPlayerShip.css("left","+=" + playerShipProperties.speed + "px");
		}

		if(key === upKey){

      if(canShoot){

        canShoot = false;

        elementPlayerShip.before("<div class='weaponShip1'></div>");
  	    bullet = $(".weaponShip1");

  			bulletPositionCenter = centerXPlayerShip - 10;

  			bullet.css("left",bulletPositionCenter + "px");

  			bullet.animate({top:"110px"},3000,"linear",function(){

          hasCollided = bulletCollides();

          if(hasCollided === false){

            bullet.animate({top:"0px"},600,"linear",function(){

              hiddenBullet();

            });

          }

        });

      }

		}

	});

}

function windowWidthObtain(){

	widthWindow = $(window).width();
	windowMarginRight = widthWindow - windowMarginLeft;

}

function windowHeightObtain(){

	heightWindow = $(window).height();
  return heightWindow;

}

function enemyShipsToRight(){

	windowWidthObtain();
	var finalPositionRight = windowMarginRight - widthEnemyShipsContanier;

	$(".enemyShipsContainer").animate({left: finalPositionRight},enemyShipProperties.movement,"linear",function(){enemyShipsToLeft();});

}

function enemyShipsToLeft(){

	finalPositionLeft = windowMarginLeft;

	$(".enemyShipsContainer").animate({left:finalPositionLeft},enemyShipProperties.movement,"linear",function(){enemyShipsToRight();});

}

function bulletCollides(){

  var widthBullet = bullet.width(),
      widthEnemyShip = $(".enemyShips").width(),
      bulletPositionLeft = bullet.offset().left,
      enemyShipsPosition = [],
      collided = false;

  $(".enemyShipsContainer div").each(function(){

    enemyShipsPosition.push(parseInt($(this).offset().left));

  });

    $.each(enemyShipsPosition, function(index, position) {

      if(bulletPositionLeft > position && bulletPositionLeft < position + widthEnemyShip){

        liveShips[index] = liveShips[index] - 1;

        if(liveShips[index] === 0){

          enemyShips[index].css("visibility","hidden");
          hiddenBullet();
          collided = true;
          playerShipProperties.score = playerShipProperties.score + 10;
          scoreContainer.text(playerShipProperties.score);
          if (liveShips.indexOf(1) === -1) {
              $("body").append("<div class='youWin'></div>");
              $(".youWin").click(function () {
                  window.location.reload(true);
              });
          }

        }else if(liveShips[index] < 0){

          liveShips[index] = 0;

        }

      }

    });

    return collided;

}

function hiddenBullet(){

  bullet.fadeOut();
  bullet.remove();
  canShoot = true;

}

function hiddenEnemyBullet(){

  enemyBullet.fadeOut();
  enemyBullet.remove();

}

function hiddenReward(){
  rewardElement.fadeOut();
  rewardElement.remove();
}

function generateRandomNumberEnemyShoot(){

	randomNumber = Math.floor(Math.random() * 5);

	if(liveShips[randomNumber] === 0){

		generateRandomNumberEnemyShoot();

	}else{

		enemyShoot(randomNumber);

	}

}

function enemyShoot(enemyNumber){

  var elementDistanceEnemyShip = enemyShips[enemyNumber].offset(),
      positionXEnemyShip = elementDistanceEnemyShip.left,
      positionYEnemyShip = elementDistanceEnemyShip.top,
      heightWindow,
      hasCollisionWithShip;

  margenDisparoXnaveEnemiga1 = positionXEnemyShip + 40;
  margenDisparoYnaveEnemiga1 = positionYEnemyShip + 70;

  //enemyShips[enemyNumber].before("<div class='weaponEnemyShip1'></div>");

  $(".gameContainer").before("<div class='weaponEnemyShip1'></div>");

  enemyBullet = $(".weaponEnemyShip1");

  enemyBullet.css("left", margenDisparoXnaveEnemiga1 - 10 + "px");
  enemyBullet.css("top", margenDisparoYnaveEnemiga1 + "px");

  heightWindow = windowHeightObtain();

  topCollidedWithShip = heightWindow - 160;

  enemyBullet.animate({top:"+" + topCollidedWithShip + "px"},3000,"linear",function(){

    hasCollisionWithShip = enemyBulletCollides();

    if(hasCollisionWithShip === false){

      enemyBullet.animate({top: heightWindow - 60 + "px"},600,"linear",function(){

        hiddenEnemyBullet();
        generateRandomNumberEnemyShoot();

      });

    }

  });

}

function enemyBulletCollides(){

  var widthEnemyBullet = enemyBullet.width(),
      bulletPositionLeft = enemyBullet.offset().left,
      collidedWithShip = false,
      elementDistancePlayerShip = elementPlayerShip.offset(),
      positionXPlayerShip = elementDistancePlayerShip.left,
      previouslifes,
      life;

  if(bulletPositionLeft > positionXPlayerShip && bulletPositionLeft < positionXPlayerShip + widthPlayerShip){

    collidedWithShip = true;
    previouslifes = playerShipProperties.lifes;
    life = $("#life" + previouslifes);
    playerShipProperties.lifes = playerShipProperties.lifes - 1;

    life.remove();

    if(playerShipProperties.lifes === 0){

      elementPlayerShip.remove();
      $("body").append("<div class='gameOver'></div>");
      $(".gameOver").click(function(){

				window.location.reload(true);

			});
    }

    hiddenEnemyBullet();
    generateRandomNumberEnemyShoot();

  }

  return collidedWithShip;

}
