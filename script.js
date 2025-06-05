$(function () {
  const laneCount = 5;
  const laneWidth = 500 / laneCount;
  let playerLane = 2;
  let gameInterval, spawnInterval, scoreInterval;
  let score = 0;
  let gameRunning = false;

  function setPlayerPosition() {
    $('#player').css('left', playerLane * laneWidth + 10);
  }

  function startGame() {
    $('#start-screen').hide();
    $('#game-over').hide();
    $('#score-display').show().text("Pontuação: 0");
    score = 0;
    gameRunning = true;

    $('.enemy').remove();
    setPlayerPosition();

    gameInterval = setInterval(gameLoop, 20);
    spawnInterval = setInterval(spawnEnemy, 1000);
    scoreInterval = setInterval(() => {
      score++;
      $('#score-display').text("Pontuação: " + score);
    }, 500);
  }

  function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    clearInterval(scoreInterval);
    $('#game-over').show();
    $('#final-score').text(`Pontuação: ${score}`);
    $('#score-display').hide();
  }

  function spawnEnemy() {
    if (!gameRunning) return;

    const lane = Math.floor(Math.random() * laneCount);
    const enemy = $('<div class="enemy"></div>');
    const img = Math.random() < 0.5 ? 'img/enemy1.png' : 'img/enemy2.png';
    enemy.css({
      left: lane * laneWidth + 10,
      backgroundImage: `url(${img})`
    });

    $('#game-area').append(enemy);
  }

  function gameLoop() {
    $('.enemy').each(function () {
      const enemy = $(this);
      const top = parseInt(enemy.css('top')) + 4;
      enemy.css('top', top);

      const enemyLeft = parseInt(enemy.css('left'));
      const enemyRight = enemyLeft + enemy.width();
      const playerLeft = parseInt($('#player').css('left'));
      const playerRight = playerLeft + $('#player').width();
      const playerTop = $('#game-area').height() - $('#player').height();

      if (top + enemy.height() >= playerTop && top <= playerTop + $('#player').height()) {
        if (enemyLeft < playerRight && enemyRight > playerLeft) {
          endGame();
        }
      }

      if (top > $('#game-area').height()) {
        enemy.remove();
      }
    });

    let bgY = parseInt($('#game-area').css('background-position-y')) || 0;
    $('#game-area').css('background-position-y', bgY + 2);
  }

  $(document).keydown(function (e) {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft' && playerLane > 0) playerLane--;
    if (e.key === 'ArrowRight' && playerLane < laneCount - 1) playerLane++;
    setPlayerPosition();
  });

  $('#start-screen').show();

  window.startGame = startGame;
});
