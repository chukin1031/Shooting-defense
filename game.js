// 게임 캔버스와 컨텍스트 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 플레이어 캐릭터 설정
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  color: 'blue',
  speed: 5
};

// 플레이어 총알 배열
const bullets = [];
const bulletSpeed = 7;
const bulletSize = 25; // 총알 크기를 5배로 키움

// 적 캐릭터 배열
const enemies = [];
const enemyWidth = 50;
const enemyHeight = 50;
const enemySpeed = 2;

// 노란색 캐릭터 배열
const yellowObjects = [];
const yellowWidth = 50;
const yellowHeight = 50;
const yellowSpeed = 3;

// 점수
let score = 0;

// 체력 및 게임 오버 관련 변수
let health = 3;
let gameOver = false;

// 체력 바 설정
const healthBarWidth = 100;
const healthBarHeight = 20;
const healthBarPadding = 10;

// 적 생성
function spawnEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - enemyWidth),
    y: 0,
    width: enemyWidth,
    height: enemyHeight,
    color: 'red',
    speed: enemySpeed
  };
  enemies.push(enemy);
}

// 노란색 개체 생성
function spawnYellowObject() {
  const yellowObject = {
    x: Math.random() * (canvas.width - yellowWidth),
    y: 0,
    width: yellowWidth,
    height: yellowHeight,
    color: 'yellow',
    speed: yellowSpeed
  };
  yellowObjects.push(yellowObject);
}

// 플레이어 입력 처리
function handlePlayerInput() {
  if (keys.ArrowLeft && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys.ArrowRight && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
}

// 총알 생성
function shootBullet() {
  const bullet = {
    x: player.x + player.width / 2 - bulletSize / 2,
    y: player.y,
    width: bulletSize,
    height: bulletSize,
    color: player.color, // 플레이어 색과 동일하게 설정
    speed: bulletSpeed
  };
  bullets.push(bullet);
}

// 게임 상태 업데이트
function update() {
  if (!gameOver) {
    // 플레이어 입력 처리
    handlePlayerInput();

    // 적 생성
    if (Math.random() < 0.02) {
      spawnEnemy();
    }

    // 노란색 개체 생성 (4초마다)
    if (Math.random() < 0.01) {
      spawnYellowObject();
    }

    // 적 이동 및 충돌 검사
    enemies.forEach((enemy, enemyIndex) => {
      enemy.y += enemy.speed;

      // 적이 화면 아래로 벗어나면 삭제
      if (enemy.y > canvas.height) {
        enemies.splice(enemyIndex, 1);
        // 체력 감소
        health--;
      }

      // 적과 총알 충돌 검사
      bullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          bullets.splice(bulletIndex, 1);
          enemies.splice(enemyIndex, 1);
          score += 20; // 적을 제거할 때마다 20점 추가
        }
      });
    });

    // 노란색 개체 이동 및 충돌 검사
    yellowObjects.forEach((yellowObj, yellowIndex) => {
      yellowObj.y += yellowObj.speed;

      // 노란색 개체가 화면 아래로 벗어나면 삭제
      if (yellowObj.y > canvas.height) {
        yellowObjects.splice(yellowIndex, 1);
      }

      // 플레이어와 노란색 개체 충돌 검사
      if (
        player.x < yellowObj.x + yellowObj.width &&
        player.x + player.width > yellowObj.x &&
        player.y < yellowObj.y + yellowObj.height &&
        player.y + player.height > yellowObj.y
      ) {
        // 노란색 개체와 충돌 시 점수 증가
        yellowObjects.splice(yellowIndex, 1);
        score += 50;
      }
    });

    // 총알 이동
    bullets.forEach((bullet, index) => {
      bullet.y -= bullet.speed;

      // 총알이 화면 위로 벗어나면 삭제
      if (bullet.y < 0) {
        bullets.splice(index, 1);
      }
    });

    // 체력이 0이 되면 게임 오버 처리
    if (health <= 0) {
      gameOver = true;
    }

    // 화면 업데이트
    draw();

    // 점수 표시
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // 체력 텍스트 표시
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Health: ' + health, canvas.width - 120, 30);
  } else {
    // 게임 오버 화면 표시
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2 - 40);

    // 재시작 버튼 표시
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / 2 - 80, canvas.height / 2, 160, 50);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Restart', canvas.width / 2 - 40, canvas.height / 2 + 30);

    // 마우스 클릭 이벤트 리스너
    canvas.addEventListener('click', restartGame);
  }
}

// 화면 그리기
function draw() {
  // 캔버스 클리어
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어 그리기
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 적 그리기
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // 노란색 개체 그리기
  yellowObjects.forEach(yellowObj => {
    ctx.fillStyle = yellowObj.color;
    ctx.fillRect(yellowObj.x, yellowObj.y, yellowObj.width, yellowObj.height);
  });

  // 총알 그리기
  bullets.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// 키 입력 처리
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === ' ') { // 스페이스바 입력 시 총알 발사
    shootBullet();
  }
});
window.addEventListener('keyup', e => {
  keys[e.key] = false;
});

// 게임 초기화
function initGame() {
  score = 0;
  health = 3;
  gameOver = false;
  enemies.length = 0;
  bullets.length = 0;
  yellowObjects.length = 0;

  // 노란색 개체 생성 타이머 설정
  setInterval(spawnYellowObject, 4000); // 4초마다 spawnYellowObject 함수 호출
}

// 재시작 함수
function restartGame() {
  initGame();
  canvas.removeEventListener('click', restartGame);
  gameLoop();
}

// 게임 루프
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// 시작
initGame();
gameLoop();
