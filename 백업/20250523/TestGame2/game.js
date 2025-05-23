// 게임 캔버스 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 상태
const gameState = {
    gold: 100,
    lives: 20,
    wave: 1,
    isGameOver: false,
    waveInProgress: false,
    enemiesRemaining: 0,
    isPaused: false,
    isStarted: false,
    score: 0,
    difficulty: 'NORMAL', // EASY, NORMAL, HARD
    bossWave: 5, // 5웨이브마다 보스 등장
    bossKilled: false,
    goldMultiplier: 1
};

// 난이도 설정
const DIFFICULTY_SETTINGS = {
    EASY: {
        gold: 150,
        lives: 25,
        enemyHealth: 0.8,
        enemySpeed: 0.8,
        goldReward: 1.2
    },
    NORMAL: {
        gold: 100,
        lives: 20,
        enemyHealth: 1,
        enemySpeed: 1,
        goldReward: 1
    },
    HARD: {
        gold: 80,
        lives: 15,
        enemyHealth: 1.3,
        enemySpeed: 1.2,
        goldReward: 0.8
    }
};

// 타일 크기 설정
const TILE_SIZE = 40;
const GRID_WIDTH = canvas.width / TILE_SIZE;
const GRID_HEIGHT = canvas.height / TILE_SIZE;

// 경로 설정 (적이 이동할 경로)
const path = [
    {x: 0, y: 3},
    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 2, y: 2},
    {x: 3, y: 2},
    {x: 4, y: 2},
    {x: 4, y: 1},
    {x: 5, y: 1},
    {x: 6, y: 1},
    {x: 7, y: 1},
    {x: 8, y: 1},
    {x: 9, y: 1},
    {x: 10, y: 1},
    {x: 11, y: 1},
    {x: 12, y: 1},
    {x: 13, y: 1},
    {x: 14, y: 1},
    {x: 15, y: 1},
    {x: 16, y: 1},
    {x: 17, y: 1},
    {x: 18, y: 1},
    {x: 19, y: 1}
];

// 타워 배열
let towers = [];

// 적 배열
let enemies = [];

// 타워 종류 정의
const TOWER_TYPES = {
    BASIC: {
        name: '기본 타워',
        cost: 50,
        range: 3,
        damage: 10,
        cooldown: 30,
        color: 'blue',
        upgradeCost: 75,
        special: 'none'
    },
    SNIPER: {
        name: '스나이퍼 타워',
        cost: 100,
        range: 5,
        damage: 30,
        cooldown: 60,
        color: 'purple',
        upgradeCost: 150,
        special: 'pierce' // 관통 공격
    },
    SPLASH: {
        name: '스플래시 타워',
        cost: 150,
        range: 2,
        damage: 15,
        cooldown: 45,
        color: 'orange',
        splashRadius: 1,
        upgradeCost: 200,
        special: 'slow' // 감속 효과
    },
    LASER: {
        name: '레이저 타워',
        cost: 200,
        range: 4,
        damage: 20,
        cooldown: 20,
        color: 'red',
        upgradeCost: 300,
        special: 'continuous' // 지속 데미지
    }
};

// 보스 몬스터 정의
const BOSS_TYPES = {
    TANK: {
        name: '탱크 보스',
        health: 1000,
        speed: 0.01,
        reward: 100,
        color: 'brown',
        ability: 'shield' // 일정 시간 무적
    },
    SPEED: {
        name: '스피드 보스',
        health: 500,
        speed: 0.03,
        reward: 150,
        color: 'cyan',
        ability: 'dash' // 순간 이동
    },
    SUMMONER: {
        name: '소환사 보스',
        health: 800,
        speed: 0.015,
        reward: 200,
        color: 'green',
        ability: 'summon' // 적 소환
    }
};

// 파워업 정의
const POWERUPS = {
    GOLD: {
        name: '골드 부스트',
        cost: 100,
        duration: 30000,
        effect: () => {
            gameState.goldMultiplier = 2;
            setTimeout(() => {
                gameState.goldMultiplier = 1;
            }, 30000);
        }
    },
    DAMAGE: {
        name: '데미지 부스트',
        cost: 150,
        duration: 30000,
        effect: () => {
            towers.forEach(tower => {
                tower.damage *= 2;
            });
            setTimeout(() => {
                towers.forEach(tower => {
                    tower.damage /= 2;
                });
            }, 30000);
        }
    },
    FREEZE: {
        name: '시간 정지',
        cost: 200,
        duration: 10000,
        effect: () => {
            enemies.forEach(enemy => {
                enemy.speed = 0;
            });
            setTimeout(() => {
                enemies.forEach(enemy => {
                    enemy.speed = enemy.baseSpeed;
                });
            }, 10000);
        }
    }
};

// 업적 정의
const ACHIEVEMENTS = {
    FIRST_TOWER: {
        name: '첫 타워',
        description: '첫 타워를 설치했습니다.',
        condition: () => towers.length === 1,
        unlocked: false
    },
    BOSS_KILLER: {
        name: '보스 킬러',
        description: '첫 보스를 처치했습니다.',
        condition: () => gameState.bossKilled,
        unlocked: false
    },
    TOWER_MASTER: {
        name: '타워 마스터',
        description: '모든 타워 종류를 설치했습니다.',
        condition: () => {
            const towerTypes = new Set(towers.map(t => t.type));
            return towerTypes.size === Object.keys(TOWER_TYPES).length;
        },
        unlocked: false
    },
    WAVE_MASTER: {
        name: '웨이브 마스터',
        description: '10웨이브를 클리어했습니다.',
        condition: () => gameState.wave >= 10,
        unlocked: false
    }
};

// 사운드 관리
const sounds = {
    bgm: document.getElementById('bgm'),
    towerPlace: document.getElementById('towerPlace'),
    enemyDeath: document.getElementById('enemyDeath'),
    bossSpawn: document.getElementById('bossSpawn'),
    powerup: document.getElementById('powerup')
};

let soundEnabled = true;
let musicEnabled = true;

// 사운드 재생 함수
function playSound(sound) {
    if (soundEnabled && sound && !sound.paused) {
        sound.currentTime = 0;
        sound.play().catch(() => {
            // 사운드 재생 실패 시 무시
        });
    }
}

// 사운드 토글
document.getElementById('soundToggle').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    document.getElementById('soundToggle').textContent = soundEnabled ? '🔊' : '🔇';
});

document.getElementById('musicToggle').addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    document.getElementById('musicToggle').textContent = musicEnabled ? '🎵' : '🎵';
    if (musicEnabled && sounds.bgm) {
        sounds.bgm.play().catch(() => {
            // BGM 재생 실패 시 무시
        });
    } else if (sounds.bgm) {
        sounds.bgm.pause();
    }
});

// 게임 통계
const gameStats = {
    enemiesKilled: 0,
    bossesKilled: 0,
    totalGold: 0,
    highestWave: 0
};

// 타워 조합 정의
const TOWER_COMBOS = {
    BASIC_SNIPER: {
        name: '관통 강화',
        description: '기본 타워와 스나이퍼 타워의 관통 데미지가 50% 증가합니다.',
        check: () => {
            const hasBasic = towers.some(t => t.type === 'BASIC');
            const hasSniper = towers.some(t => t.type === 'SNIPER');
            return hasBasic && hasSniper;
        },
        effect: () => {
            towers.forEach(tower => {
                if (tower.type === 'BASIC' || tower.type === 'SNIPER') {
                    tower.damage *= 1.5;
                }
            });
        }
    },
    SPLASH_LASER: {
        name: '범위 강화',
        description: '스플래시 타워와 레이저 타워의 범위 데미지가 50% 증가합니다.',
        check: () => {
            const hasSplash = towers.some(t => t.type === 'SPLASH');
            const hasLaser = towers.some(t => t.type === 'LASER');
            return hasSplash && hasLaser;
        },
        effect: () => {
            towers.forEach(tower => {
                if (tower.type === 'SPLASH' || tower.type === 'LASER') {
                    tower.damage *= 1.5;
                    if (tower.splashRadius) tower.splashRadius *= 1.5;
                }
            });
        }
    },
    ALL_TOWERS: {
        name: '전체 강화',
        description: '모든 타워의 데미지가 30% 증가합니다.',
        check: () => {
            const towerTypes = new Set(towers.map(t => t.type));
            return towerTypes.size === Object.keys(TOWER_TYPES).length;
        },
        effect: () => {
            towers.forEach(tower => {
                tower.damage *= 1.3;
            });
        }
    }
};

// 특수 능력 정의
const ABILITIES = {
    TOWER_BOOST: {
        name: '전체 타워 강화',
        cost: 300,
        duration: 30000,
        effect: () => {
            towers.forEach(tower => {
                tower.damage *= 2;
            });
            setTimeout(() => {
                towers.forEach(tower => {
                    tower.damage /= 2;
                });
            }, 30000);
        }
    },
    ENEMY_SLOW: {
        name: '적 이동 속도 감소',
        cost: 200,
        duration: 20000,
        effect: () => {
            enemies.forEach(enemy => {
                enemy.speed *= 0.5;
            });
            setTimeout(() => {
                enemies.forEach(enemy => {
                    enemy.speed = enemy.baseSpeed;
                });
            }, 20000);
        }
    },
    AUTO_GOLD: {
        name: '골드 자동 획득',
        cost: 400,
        duration: 60000,
        effect: () => {
            const interval = setInterval(() => {
                gameState.gold += 10;
                gameStats.totalGold += 10;
                updateStats();
            }, 5000);
            setTimeout(() => {
                clearInterval(interval);
            }, 60000);
        }
    }
};

// 미니맵 캔버스 설정
const minimapCanvas = document.getElementById('minimapCanvas');
const minimapCtx = minimapCanvas.getContext('2d');

// 미니맵 그리기
function drawMinimap() {
    minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    // 맵 그리기
    minimapCtx.fillStyle = '#eee';
    path.forEach(point => {
        minimapCtx.fillRect(
            point.x * (minimapCanvas.width / GRID_WIDTH),
            point.y * (minimapCanvas.height / GRID_HEIGHT),
            minimapCanvas.width / GRID_WIDTH,
            minimapCanvas.height / GRID_HEIGHT
        );
    });
    
    // 타워 그리기
    towers.forEach(tower => {
        minimapCtx.fillStyle = tower.color;
        minimapCtx.fillRect(
            tower.x * (minimapCanvas.width / GRID_WIDTH),
            tower.y * (minimapCanvas.height / GRID_HEIGHT),
            minimapCanvas.width / GRID_WIDTH,
            minimapCanvas.height / GRID_HEIGHT
        );
    });
    
    // 적 그리기
    enemies.forEach(enemy => {
        minimapCtx.fillStyle = enemy.isBoss ? enemy.color : 'red';
        minimapCtx.fillRect(
            enemy.x * (minimapCanvas.width / GRID_WIDTH),
            enemy.y * (minimapCanvas.height / GRID_HEIGHT),
            minimapCanvas.width / GRID_WIDTH,
            minimapCanvas.height / GRID_HEIGHT
        );
    });
}

// 통계 업데이트
function updateStats() {
    document.getElementById('enemiesKilled').textContent = gameStats.enemiesKilled;
    document.getElementById('bossesKilled').textContent = gameStats.bossesKilled;
    document.getElementById('totalGold').textContent = gameStats.totalGold;
    document.getElementById('highestWave').textContent = gameStats.highestWave;
}

// 타워 조합 체크
function checkTowerCombos() {
    Object.entries(TOWER_COMBOS).forEach(([key, combo]) => {
        if (combo.check()) {
            combo.effect();
            showComboEffect(combo.name, combo.description);
        }
    });
}

// 조합 효과 표시
function showComboEffect(name, description) {
    const indicator = document.getElementById('comboIndicator');
    const descriptionElement = document.getElementById('comboDescription');
    
    descriptionElement.textContent = description;
    indicator.style.display = 'block';
    
    setTimeout(() => {
        indicator.style.display = 'none';
    }, 3000);
}

// 특수 능력 버튼 이벤트
document.querySelectorAll('.ability-button').forEach((button, index) => {
    button.addEventListener('click', () => {
        const ability = Object.values(ABILITIES)[index];
        if (gameState.gold >= ability.cost) {
            gameState.gold -= ability.cost;
            ability.effect();
            button.disabled = true;
            setTimeout(() => {
                button.disabled = false;
            }, ability.duration);
        }
    });
});

// 타워 클래스
class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = 1;
        this.range = TOWER_TYPES[type].range;
        this.damage = TOWER_TYPES[type].damage;
        this.cost = TOWER_TYPES[type].cost;
        this.cooldown = 0;
        this.maxCooldown = TOWER_TYPES[type].cooldown;
        this.color = TOWER_TYPES[type].color;
        this.splashRadius = TOWER_TYPES[type].splashRadius;
        this.special = TOWER_TYPES[type].special;
        this.continuousDamage = 0;
        playSound(sounds.towerPlace);
    }

    upgrade() {
        this.level++;
        this.damage *= 1.5;
        this.range += 0.5;
        if (this.splashRadius) this.splashRadius += 0.5;
        this.maxCooldown = Math.max(10, this.maxCooldown * 0.8);
        
        // 특수 능력 강화
        if (this.special === 'continuous') {
            this.continuousDamage = this.damage * 0.2;
        }
    }

    getUpgradeCost() {
        return TOWER_TYPES[this.type].upgradeCost * this.level;
    }

    getSellValue() {
        return Math.floor(this.cost * 0.7);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * TILE_SIZE + 5, this.y * TILE_SIZE + 5, TILE_SIZE - 10, TILE_SIZE - 10);
        
        // 레벨 표시
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(this.level.toString(), this.x * TILE_SIZE + TILE_SIZE/2 - 3, this.y * TILE_SIZE + TILE_SIZE/2 + 3);
        
        // 공격 범위 표시
        ctx.strokeStyle = `${this.color}40`;
        ctx.beginPath();
        ctx.arc(
            this.x * TILE_SIZE + TILE_SIZE/2,
            this.y * TILE_SIZE + TILE_SIZE/2,
            this.range * TILE_SIZE,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    attack(enemies) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        for (let enemy of enemies) {
            const dx = (enemy.x - this.x) * TILE_SIZE;
            const dy = (enemy.y - this.y) * TILE_SIZE;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= this.range * TILE_SIZE) {
                switch(this.special) {
                    case 'pierce':
                        // 관통 공격
                        enemies.forEach(e => {
                            if (Math.abs(e.x - enemy.x) < 1 && Math.abs(e.y - enemy.y) < 1) {
                                e.health -= this.damage;
                            }
                        });
                        break;
                    case 'slow':
                        // 감속 효과
                        enemy.speed *= 0.7;
                        enemy.health -= this.damage;
                        setTimeout(() => {
                            enemy.speed = enemy.baseSpeed;
                        }, 1000);
                        break;
                    case 'continuous':
                        // 지속 데미지
                        enemy.health -= this.damage;
                        enemy.continuousDamage = (enemy.continuousDamage || 0) + this.continuousDamage;
                        break;
                    default:
                        enemy.health -= this.damage;
                }
                
                this.cooldown = this.maxCooldown;
                
                // 공격 이펙트 그리기
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(this.x * TILE_SIZE + TILE_SIZE/2, this.y * TILE_SIZE + TILE_SIZE/2);
                ctx.lineTo(enemy.x * TILE_SIZE + TILE_SIZE/2, enemy.y * TILE_SIZE + TILE_SIZE/2);
                ctx.stroke();
                break;
            }
        }
    }
}

// 적 클래스
class Enemy {
    constructor(wave, isBoss = false) {
        this.pathIndex = 0;
        this.x = path[0].x;
        this.y = path[0].y;
        this.baseSpeed = 0.02 + (wave * 0.005);
        this.speed = this.baseSpeed * DIFFICULTY_SETTINGS[gameState.difficulty].enemySpeed;
        this.health = (100 + (wave * 20)) * DIFFICULTY_SETTINGS[gameState.difficulty].enemyHealth;
        this.maxHealth = this.health;
        this.reward = Math.floor((10 + (wave * 2)) * DIFFICULTY_SETTINGS[gameState.difficulty].goldReward);
        this.isBoss = isBoss;
        this.continuousDamage = 0;
        
        if (isBoss) {
            const bossType = Object.keys(BOSS_TYPES)[Math.floor(Math.random() * Object.keys(BOSS_TYPES).length)];
            const boss = BOSS_TYPES[bossType];
            this.health = boss.health;
            this.maxHealth = boss.health;
            this.speed = boss.speed;
            this.reward = boss.reward;
            this.color = boss.color;
            this.ability = boss.ability;
            this.abilityCooldown = 0;
            gameState.bossKilled = false;
            playSound(sounds.bossSpawn);
        }
    }

    update() {
        // 지속 데미지 적용
        if (this.continuousDamage > 0) {
            this.health -= this.continuousDamage;
            this.continuousDamage *= 0.9; // 지속 데미지 감소
        }

        if (this.pathIndex >= path.length - 1) {
            gameState.lives--;
            return true;
        }

        if (this.health <= 0) {
            gameState.gold += this.reward * (gameState.goldMultiplier || 1);
            gameStats.totalGold += this.reward * (gameState.goldMultiplier || 1);
            gameStats.enemiesKilled++;
            if (this.isBoss) {
                gameStats.bossesKilled++;
                gameState.bossKilled = true;
            }
            playSound(sounds.enemyDeath);
            updateStats();
            return true;
        }

        // 보스 능력 사용
        if (this.isBoss && this.abilityCooldown <= 0) {
            switch(this.ability) {
                case 'shield':
                    this.health += 100;
                    this.abilityCooldown = 300;
                    break;
                case 'dash':
                    this.pathIndex = Math.min(this.pathIndex + 3, path.length - 1);
                    this.abilityCooldown = 200;
                    break;
                case 'summon':
                    for (let i = 0; i < 3; i++) {
                        enemies.push(new Enemy(gameState.wave));
                    }
                    this.abilityCooldown = 400;
                    break;
            }
        }
        if (this.abilityCooldown > 0) this.abilityCooldown--;

        const targetX = path[this.pathIndex + 1].x;
        const targetY = path[this.pathIndex + 1].y;
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        
        if (Math.abs(dx) < this.speed && Math.abs(dy) < this.speed) {
            this.pathIndex++;
        } else {
            this.x += dx * this.speed;
            this.y += dy * this.speed;
        }
        
        return false;
    }

    draw() {
        ctx.fillStyle = this.isBoss ? this.color : 'red';
        ctx.fillRect(
            this.x * TILE_SIZE + 5,
            this.y * TILE_SIZE + 5,
            TILE_SIZE - 10,
            TILE_SIZE - 10
        );

        // 체력바
        const healthBarWidth = TILE_SIZE - 10;
        const healthBarHeight = 5;
        const healthPercentage = this.health / this.maxHealth;
        
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.x * TILE_SIZE + 5,
            this.y * TILE_SIZE,
            healthBarWidth,
            healthBarHeight
        );
        
        ctx.fillStyle = 'green';
        ctx.fillRect(
            this.x * TILE_SIZE + 5,
            this.y * TILE_SIZE,
            healthBarWidth * healthPercentage,
            healthBarHeight
        );

        // 보스 이름 표시
        if (this.isBoss) {
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(
                BOSS_TYPES[Object.keys(BOSS_TYPES).find(key => BOSS_TYPES[key].color === this.color)].name,
                this.x * TILE_SIZE,
                this.y * TILE_SIZE - 5
            );
        }
    }
}

// 웨이브 시작 함수
function startWave() {
    if (gameState.waveInProgress) return;
    
    gameState.waveInProgress = true;
    gameState.enemiesRemaining = 10 + (gameState.wave * 2);
    
    // 보스 웨이브 체크
    if (gameState.wave % gameState.bossWave === 0) {
        gameState.enemiesRemaining = 1;
        enemies.push(new Enemy(gameState.wave, true));
    }
    
    // 웨이브 시작 메시지
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.fillText(`웨이브 ${gameState.wave} 시작!`, canvas.width/2 - 150, canvas.height/2);
}

function updateInfoBar() {
    document.getElementById('infoGold').textContent = `골드: ${gameState.gold}`;
    document.getElementById('infoLives').textContent = `생명: ${gameState.lives}`;
    document.getElementById('infoWave').textContent = `웨이브: ${gameState.wave}`;
    document.getElementById('infoScore').textContent = `점수: ${gameState.score}`;
    document.getElementById('infoDifficulty').textContent = `난이도: ${gameState.difficulty}`;
}

// 게임 루프
function gameLoop() {
    if (gameState.isGameOver || !gameState.isStarted || gameState.isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    // 화면 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 그리드 그리기
    ctx.strokeStyle = '#ccc';
    for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_HEIGHT; j++) {
            ctx.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // 경로 그리기
    ctx.fillStyle = '#eee';
    for (let point of path) {
        ctx.fillRect(point.x * TILE_SIZE, point.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    // 타워 그리기 및 공격
    towers.forEach(tower => {
        tower.draw();
        tower.attack(enemies);
    });

    // 적 업데이트 및 그리기
    enemies = enemies.filter(enemy => {
        enemy.draw();
        return !enemy.update();
    });

    // 새로운 적 생성
    if (gameState.waveInProgress && gameState.enemiesRemaining > 0 && Math.random() < 0.05) {
        enemies.push(new Enemy(gameState.wave));
        gameState.enemiesRemaining--;
    }

    // 웨이브 종료 체크
    if (gameState.waveInProgress && gameState.enemiesRemaining === 0 && enemies.length === 0) {
        gameState.waveInProgress = false;
        gameState.wave++;
        gameState.gold += 50; // 웨이브 클리어 보상
    }

    // 업적 체크
    checkAchievements();

    // 미니맵 업데이트
    drawMinimap();
    
    // 타워 조합 체크
    checkTowerCombos();
    
    // 최고 웨이브 업데이트
    if (gameState.wave > gameStats.highestWave) {
        gameStats.highestWave = gameState.wave;
        updateStats();
    }

    // UI 그리기 (캔버스 내 텍스트는 info-bar로 대체)
    updateInfoBar();

    if (!gameState.waveInProgress) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('스페이스바를 눌러 다음 웨이브 시작', canvas.width/2 - 150, canvas.height - 20);
    }

    if (gameState.isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.fillText('일시정지', canvas.width/2 - 100, canvas.height/2);
    }

    // 게임 오버 체크
    if (gameState.lives <= 0) {
        gameState.isGameOver = true;
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('게임 오버!', canvas.width/2 - 100, canvas.height/2);
    }

    requestAnimationFrame(gameLoop);
}

// 키보드 이벤트
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameState.waveInProgress && !gameState.isGameOver) {
        e.preventDefault(); // 기본 동작 방지
        startWave();
    }
});

// 마우스 클릭 이벤트
canvas.addEventListener('click', (e) => {
    if (gameState.isGameOver || !gameState.isStarted || gameState.isPaused) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    // 기존 타워 클릭 체크
    const clickedTower = towers.find(tower => tower.x === x && tower.y === y);
    if (clickedTower) {
        showTowerUpgradeMenu(clickedTower, e.clientX, e.clientY);
        return;
    }

    // 경로 위에 타워를 설치할 수 없도록 체크
    const isOnPath = path.some(point => point.x === x && point.y === y);
    if (isOnPath) return;

    // 이미 타워가 있는지 체크
    const towerExists = towers.some(tower => tower.x === x && tower.y === y);
    if (towerExists) return;

    showTowerBuildMenu(x, y, e.clientX, e.clientY);
});

function setupMenuCloseHandler(menu) {
    const closeMenu = (e) => {
        if (!menu.contains(e.target) && e.target !== canvas) {
            if (menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
            document.removeEventListener('click', closeMenu);
        }
    };
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
}

// 게임 컨트롤 이벤트
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameState.isStarted) {
        gameState.isStarted = true;
        document.getElementById('startBtn').textContent = '재시작';
    } else {
        // 게임 재시작
        gameState.gold = 100;
        gameState.lives = 20;
        gameState.wave = 1;
        gameState.isGameOver = false;
        gameState.waveInProgress = false;
        gameState.enemiesRemaining = 0;
        gameState.isPaused = false;
        towers = [];
        enemies = [];
    }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    if (gameState.isStarted) {
        gameState.isPaused = !gameState.isPaused;
        document.getElementById('pauseBtn').textContent = gameState.isPaused ? '계속하기' : '일시정지';
    }
});

document.getElementById('helpBtn').addEventListener('click', () => {
    document.getElementById('helpModal').style.display = 'block';
});

document.getElementById('closeHelp').addEventListener('click', () => {
    document.getElementById('helpModal').style.display = 'none';
});

// 난이도 선택 이벤트
document.getElementById('difficultySelect').addEventListener('change', (e) => {
    if (!gameState.isStarted) {
        gameState.difficulty = e.target.value;
        const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
        gameState.gold = settings.gold;
        gameState.lives = settings.lives;
    }
});

// 파워업 메뉴 이벤트
document.querySelectorAll('.powerup-item').forEach(item => {
    item.addEventListener('click', () => {
        const powerupType = item.dataset.powerup.toUpperCase();
        const powerup = POWERUPS[powerupType];
        
        if (gameState.gold >= powerup.cost) {
            gameState.gold -= powerup.cost;
            powerup.effect();
            playSound(sounds.powerup);
        }
    });
});

// 업적 체크
function checkAchievements() {
    Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            showAchievement(achievement.name);
        }
    });
}

// 업적 표시
function showAchievement(name) {
    const achievement = document.getElementById('achievement');
    if (achievement) {
        achievement.textContent = `업적 달성: ${name}!`;
        achievement.style.display = 'block';
        setTimeout(() => {
            achievement.style.display = 'none';
        }, 3000);
    }
}

// 게임 저장
document.getElementById('saveBtn').addEventListener('click', () => {
    const saveData = {
        gameState: {
            ...gameState,
            isPaused: true
        },
        towers: towers.map(tower => ({
            x: tower.x,
            y: tower.y,
            type: tower.type,
            level: tower.level
        })),
        achievements: Object.fromEntries(
            Object.entries(ACHIEVEMENTS).map(([key, achievement]) => [key, achievement.unlocked])
        )
    };
    localStorage.setItem('towerDefenseSave', JSON.stringify(saveData));
    alert('게임이 저장되었습니다.');
});

// 게임 불러오기
document.getElementById('loadBtn').addEventListener('click', () => {
    const saveData = localStorage.getItem('towerDefenseSave');
    if (saveData) {
        const data = JSON.parse(saveData);
        Object.assign(gameState, data.gameState);
        towers = data.towers.map(towerData => {
            const tower = new Tower(towerData.x, towerData.y, towerData.type);
            for (let i = 1; i < towerData.level; i++) {
                tower.upgrade();
            }
            return tower;
        });
        Object.entries(data.achievements).forEach(([key, unlocked]) => {
            ACHIEVEMENTS[key].unlocked = unlocked;
        });
        alert('게임을 불러왔습니다.');
    } else {
        alert('저장된 게임이 없습니다.');
    }
});

function showTowerBuildMenu(x, y, clientX, clientY) {
    // 기존 메뉴 제거
    const existingMenu = document.querySelector('.tower-menu');
    if (existingMenu && existingMenu.parentNode) {
        existingMenu.parentNode.removeChild(existingMenu);
    }

    const towerMenu = document.createElement('div');
    towerMenu.className = 'tower-menu';
    towerMenu.style.left = `${clientX}px`;
    towerMenu.style.top = `${clientY}px`;

    Object.entries(TOWER_TYPES).forEach(([type, tower]) => {
        const button = document.createElement('button');
        button.textContent = `${tower.name} (${tower.cost} 골드)`;
        button.disabled = gameState.gold < tower.cost;
        button.onclick = () => {
            if (gameState.gold >= tower.cost) {
                towers.push(new Tower(x, y, type));
                gameState.gold -= tower.cost;
                if (towerMenu.parentNode) {
                    towerMenu.parentNode.removeChild(towerMenu);
                }
            }
        };
        towerMenu.appendChild(button);
    });

    document.body.appendChild(towerMenu);
    setupMenuCloseHandler(towerMenu);
}

function showTowerUpgradeMenu(tower, clientX, clientY) {
    // 기존 메뉴 제거
    const existingMenu = document.querySelector('.tower-menu');
    if (existingMenu && existingMenu.parentNode) {
        existingMenu.parentNode.removeChild(existingMenu);
    }

    const towerMenu = document.createElement('div');
    towerMenu.className = 'tower-menu';
    towerMenu.style.left = `${clientX}px`;
    towerMenu.style.top = `${clientY}px`;

    const upgradeCost = tower.getUpgradeCost();
    const sellValue = tower.getSellValue();

    const upgradeButton = document.createElement('button');
    upgradeButton.textContent = `업그레이드 (${upgradeCost} 골드)`;
    upgradeButton.disabled = gameState.gold < upgradeCost;
    upgradeButton.onclick = () => {
        if (gameState.gold >= upgradeCost) {
            gameState.gold -= upgradeCost;
            tower.upgrade();
            if (towerMenu.parentNode) {
                towerMenu.parentNode.removeChild(towerMenu);
            }
        }
    };
    towerMenu.appendChild(upgradeButton);

    const sellButton = document.createElement('button');
    sellButton.textContent = `판매 (${sellValue} 골드)`;
    sellButton.onclick = () => {
        gameState.gold += sellValue;
        towers = towers.filter(t => t !== tower);
        if (towerMenu.parentNode) {
            towerMenu.parentNode.removeChild(towerMenu);
        }
    };
    towerMenu.appendChild(sellButton);

    document.body.appendChild(towerMenu);
    setupMenuCloseHandler(towerMenu);
}

// 게임 시작
gameLoop(); 