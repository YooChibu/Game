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
    goldMultiplier: 1,
    maxTowers: 10, // 최대 타워 수
    towerCount: 0, // 현재 설치된 타워 수
    experience: 0,
    level: 1,
    experienceToNextLevel: 100,
    currentMap: 'STRAIGHT' // 현재 맵 정보 추가
};

// 난이도 설정
const DIFFICULTY_SETTINGS = {
    EASY: {
        gold: 150,
        lives: 25,
        enemyHealth: 0.8,
        enemySpeed: 0.8,
        goldReward: 1.2,
        maxTowers: 12,
        enemySpawnRate: 0.03
    },
    NORMAL: {
        gold: 100,
        lives: 20,
        enemyHealth: 1,
        enemySpeed: 1,
        goldReward: 1,
        maxTowers: 10,
        enemySpawnRate: 0.05
    },
    HARD: {
        gold: 80,
        lives: 15,
        enemyHealth: 1.3,
        enemySpeed: 1.2,
        goldReward: 0.8,
        maxTowers: 8,
        enemySpawnRate: 0.07
    }
};

// 타일 크기 설정
const TILE_SIZE = 40;
const GRID_WIDTH = canvas.width / TILE_SIZE;
const GRID_HEIGHT = canvas.height / TILE_SIZE;

// 맵 정의
const MAPS = {
    STRAIGHT: {
        name: '직선 경로',
        path: [
            {x: 0, y: 7},
            {x: 1, y: 7},
            {x: 2, y: 7},
            {x: 3, y: 7},
            {x: 4, y: 7},
            {x: 5, y: 7},
            {x: 6, y: 7},
            {x: 7, y: 7},
            {x: 8, y: 7},
            {x: 9, y: 7},
            {x: 10, y: 7},
            {x: 11, y: 7},
            {x: 12, y: 7},
            {x: 13, y: 7},
            {x: 14, y: 7},
            {x: 15, y: 7},
            {x: 16, y: 7},
            {x: 17, y: 7},
            {x: 18, y: 7},
            {x: 19, y: 7}
        ]
    },
    ZIGZAG: {
        name: '지그재그',
        path: [
            {x: 0, y: 5},
            {x: 1, y: 5},
            {x: 2, y: 5},
            {x: 3, y: 5},
            {x: 4, y: 5},
            {x: 4, y: 3},
            {x: 5, y: 3},
            {x: 6, y: 3},
            {x: 7, y: 3},
            {x: 8, y: 3},
            {x: 8, y: 7},
            {x: 9, y: 7},
            {x: 10, y: 7},
            {x: 11, y: 7},
            {x: 12, y: 7},
            {x: 12, y: 3},
            {x: 13, y: 3},
            {x: 14, y: 3},
            {x: 15, y: 3},
            {x: 16, y: 3},
            {x: 16, y: 7},
            {x: 17, y: 7},
            {x: 18, y: 7},
            {x: 19, y: 7}
        ]
    },
    SPIRAL: {
        name: '나선형',
        path: [
            {x: 0, y: 7},
            {x: 1, y: 7},
            {x: 2, y: 7},
            {x: 3, y: 7},
            {x: 4, y: 7},
            {x: 4, y: 5},
            {x: 4, y: 3},
            {x: 4, y: 1},
            {x: 6, y: 1},
            {x: 8, y: 1},
            {x: 10, y: 1},
            {x: 10, y: 3},
            {x: 10, y: 5},
            {x: 10, y: 7},
            {x: 10, y: 9},
            {x: 10, y: 11},
            {x: 12, y: 11},
            {x: 14, y: 11},
            {x: 16, y: 11},
            {x: 16, y: 9},
            {x: 16, y: 7},
            {x: 16, y: 5},
            {x: 16, y: 3},
            {x: 16, y: 1},
            {x: 18, y: 1},
            {x: 19, y: 1}
        ]
    },
    MAZE: {
        name: '미로',
        path: [
            {x: 0, y: 7},
            {x: 1, y: 7},
            {x: 2, y: 7},
            {x: 3, y: 7},
            {x: 4, y: 7},
            {x: 4, y: 5},
            {x: 4, y: 3},
            {x: 6, y: 3},
            {x: 8, y: 3},
            {x: 8, y: 5},
            {x: 8, y: 7},
            {x: 8, y: 9},
            {x: 10, y: 9},
            {x: 12, y: 9},
            {x: 12, y: 7},
            {x: 12, y: 5},
            {x: 14, y: 5},
            {x: 16, y: 5},
            {x: 16, y: 7},
            {x: 16, y: 9},
            {x: 18, y: 9},
            {x: 19, y: 9}
        ]
    },
    CROSS: {
        name: '십자형',
        path: [
            {x: 0, y: 7},
            {x: 1, y: 7},
            {x: 2, y: 7},
            {x: 3, y: 7},
            {x: 4, y: 7},
            {x: 5, y: 7},
            {x: 6, y: 7},
            {x: 7, y: 7},
            {x: 8, y: 7},
            {x: 9, y: 7},
            {x: 9, y: 5},
            {x: 9, y: 3},
            {x: 9, y: 1},
            {x: 11, y: 1},
            {x: 13, y: 1},
            {x: 15, y: 1},
            {x: 15, y: 3},
            {x: 15, y: 5},
            {x: 15, y: 7},
            {x: 15, y: 9},
            {x: 15, y: 11},
            {x: 17, y: 11},
            {x: 19, y: 11}
        ]
    },
    SNAKE: {
        name: '뱀형',
        path: [
            {x: 0, y: 3},
            {x: 2, y: 3},
            {x: 4, y: 3},
            {x: 4, y: 5},
            {x: 4, y: 7},
            {x: 6, y: 7},
            {x: 8, y: 7},
            {x: 8, y: 5},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 12, y: 3},
            {x: 12, y: 5},
            {x: 12, y: 7},
            {x: 14, y: 7},
            {x: 16, y: 7},
            {x: 16, y: 5},
            {x: 16, y: 3},
            {x: 18, y: 3},
            {x: 19, y: 3}
        ]
    },
    DIAMOND: {
        name: '다이아몬드',
        path: [
            {x: 0, y: 7},
            {x: 2, y: 7},
            {x: 4, y: 7},
            {x: 6, y: 7},
            {x: 8, y: 7},
            {x: 8, y: 5},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 12, y: 3},
            {x: 12, y: 5},
            {x: 12, y: 7},
            {x: 14, y: 7},
            {x: 16, y: 7},
            {x: 16, y: 9},
            {x: 16, y: 11},
            {x: 14, y: 11},
            {x: 12, y: 11},
            {x: 12, y: 9},
            {x: 10, y: 9},
            {x: 8, y: 9},
            {x: 6, y: 9},
            {x: 4, y: 9},
            {x: 2, y: 9},
            {x: 0, y: 9}
        ]
    },
    LABYRINTH: {
        name: '미궁',
        path: [
            {x: 0, y: 7},
            {x: 1, y: 7},
            {x: 2, y: 7},
            {x: 3, y: 7},
            {x: 4, y: 7},
            {x: 4, y: 5},
            {x: 4, y: 3},
            {x: 4, y: 1},
            {x: 6, y: 1},
            {x: 8, y: 1},
            {x: 10, y: 1},
            {x: 10, y: 3},
            {x: 10, y: 5},
            {x: 10, y: 7},
            {x: 10, y: 9},
            {x: 10, y: 11},
            {x: 12, y: 11},
            {x: 14, y: 11},
            {x: 16, y: 11},
            {x: 16, y: 9},
            {x: 16, y: 7},
            {x: 16, y: 5},
            {x: 16, y: 3},
            {x: 16, y: 1},
            {x: 18, y: 1},
            {x: 19, y: 1}
        ]
    },
    DOUBLE_SPIRAL: {
        name: '이중 나선',
        path: [
            {x: 0, y: 7},
            {x: 1, y: 7},
            {x: 2, y: 7},
            {x: 3, y: 7},
            {x: 4, y: 7},
            {x: 4, y: 5},
            {x: 4, y: 3},
            {x: 4, y: 1},
            {x: 6, y: 1},
            {x: 8, y: 1},
            {x: 10, y: 1},
            {x: 10, y: 3},
            {x: 10, y: 5},
            {x: 10, y: 7},
            {x: 10, y: 9},
            {x: 10, y: 11},
            {x: 12, y: 11},
            {x: 14, y: 11},
            {x: 16, y: 11},
            {x: 16, y: 9},
            {x: 16, y: 7},
            {x: 16, y: 5},
            {x: 16, y: 3},
            {x: 16, y: 1},
            {x: 18, y: 1},
            {x: 19, y: 1},
            {x: 19, y: 3},
            {x: 19, y: 5},
            {x: 19, y: 7},
            {x: 19, y: 9},
            {x: 19, y: 11},
            {x: 17, y: 11},
            {x: 15, y: 11},
            {x: 13, y: 11},
            {x: 11, y: 11},
            {x: 9, y: 11},
            {x: 7, y: 11},
            {x: 5, y: 11},
            {x: 3, y: 11},
            {x: 1, y: 11}
        ]
    },
    PYRAMID: {
        name: '피라미드',
        path: [
            {x: 0, y: 7},
            {x: 2, y: 7},
            {x: 4, y: 7},
            {x: 6, y: 7},
            {x: 8, y: 7},
            {x: 8, y: 5},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 12, y: 3},
            {x: 14, y: 3},
            {x: 16, y: 3},
            {x: 16, y: 5},
            {x: 16, y: 7},
            {x: 16, y: 9},
            {x: 16, y: 11},
            {x: 14, y: 11},
            {x: 12, y: 11},
            {x: 10, y: 11},
            {x: 8, y: 11},
            {x: 6, y: 11},
            {x: 4, y: 11},
            {x: 2, y: 11},
            {x: 0, y: 11}
        ]
    },
    WAVE: {
        name: '파도형',
        path: [
            {x: 0, y: 5},
            {x: 1, y: 5},
            {x: 2, y: 5},
            {x: 3, y: 5},
            {x: 4, y: 5},
            {x: 4, y: 3},
            {x: 5, y: 3},
            {x: 6, y: 3},
            {x: 7, y: 3},
            {x: 8, y: 3},
            {x: 8, y: 5},
            {x: 9, y: 5},
            {x: 10, y: 5},
            {x: 11, y: 5},
            {x: 12, y: 5},
            {x: 12, y: 7},
            {x: 13, y: 7},
            {x: 14, y: 7},
            {x: 15, y: 7},
            {x: 16, y: 7},
            {x: 16, y: 9},
            {x: 17, y: 9},
            {x: 18, y: 9},
            {x: 19, y: 9}
        ]
    },
    STAIRS: {
        name: '계단형',
        path: [
            {x: 0, y: 1},
            {x: 2, y: 1},
            {x: 2, y: 3},
            {x: 4, y: 3},
            {x: 4, y: 5},
            {x: 6, y: 5},
            {x: 6, y: 7},
            {x: 8, y: 7},
            {x: 8, y: 9},
            {x: 10, y: 9},
            {x: 10, y: 11},
            {x: 12, y: 11},
            {x: 12, y: 9},
            {x: 14, y: 9},
            {x: 14, y: 7},
            {x: 16, y: 7},
            {x: 16, y: 5},
            {x: 18, y: 5},
            {x: 18, y: 3},
            {x: 19, y: 3}
        ]
    },
    CROSSROADS: {
        name: '교차로',
        path: [
            {x: 0, y: 7},
            {x: 2, y: 7},
            {x: 4, y: 7},
            {x: 6, y: 7},
            {x: 8, y: 7},
            {x: 8, y: 5},
            {x: 8, y: 3},
            {x: 8, y: 1},
            {x: 10, y: 1},
            {x: 12, y: 1},
            {x: 14, y: 1},
            {x: 16, y: 1},
            {x: 16, y: 3},
            {x: 16, y: 5},
            {x: 16, y: 7},
            {x: 16, y: 9},
            {x: 16, y: 11},
            {x: 14, y: 11},
            {x: 12, y: 11},
            {x: 10, y: 11},
            {x: 8, y: 11},
            {x: 8, y: 9},
            {x: 8, y: 7},
            {x: 10, y: 7},
            {x: 12, y: 7},
            {x: 14, y: 7},
            {x: 16, y: 7},
            {x: 18, y: 7},
            {x: 19, y: 7}
        ]
    },
    INFINITY: {
        name: '무한형',
        path: [
            {x: 0, y: 7},
            {x: 2, y: 7},
            {x: 4, y: 7},
            {x: 6, y: 7},
            {x: 8, y: 7},
            {x: 8, y: 5},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 12, y: 3},
            {x: 12, y: 5},
            {x: 12, y: 7},
            {x: 12, y: 9},
            {x: 12, y: 11},
            {x: 10, y: 11},
            {x: 8, y: 11},
            {x: 8, y: 9},
            {x: 8, y: 7},
            {x: 6, y: 7},
            {x: 4, y: 7},
            {x: 2, y: 7},
            {x: 0, y: 7},
            {x: 0, y: 5},
            {x: 0, y: 3},
            {x: 2, y: 3},
            {x: 4, y: 3},
            {x: 6, y: 3},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 12, y: 3},
            {x: 14, y: 3},
            {x: 16, y: 3},
            {x: 18, y: 3},
            {x: 19, y: 3}
        ]
    },
    BUTTERFLY: {
        name: '나비형',
        path: [
            {x: 0, y: 7},
            {x: 2, y: 7},
            {x: 4, y: 7},
            {x: 6, y: 7},
            {x: 8, y: 7},
            {x: 8, y: 5},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 12, y: 3},
            {x: 12, y: 5},
            {x: 12, y: 7},
            {x: 12, y: 9},
            {x: 12, y: 11},
            {x: 10, y: 11},
            {x: 8, y: 11},
            {x: 8, y: 9},
            {x: 8, y: 7},
            {x: 6, y: 7},
            {x: 4, y: 7},
            {x: 2, y: 7},
            {x: 0, y: 7},
            {x: 0, y: 5},
            {x: 0, y: 3},
            {x: 2, y: 3},
            {x: 4, y: 3},
            {x: 6, y: 3},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 12, y: 3},
            {x: 14, y: 3},
            {x: 16, y: 3},
            {x: 18, y: 3},
            {x: 19, y: 3}
        ]
    },
    HOURGLASS: {
        name: '모래시계',
        path: [
            {x: 0, y: 3},
            {x: 2, y: 3},
            {x: 4, y: 3},
            {x: 6, y: 3},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 10, y: 5},
            {x: 10, y: 7},
            {x: 8, y: 7},
            {x: 6, y: 7},
            {x: 4, y: 7},
            {x: 2, y: 7},
            {x: 0, y: 7},
            {x: 0, y: 9},
            {x: 0, y: 11},
            {x: 2, y: 11},
            {x: 4, y: 11},
            {x: 6, y: 11},
            {x: 8, y: 11},
            {x: 10, y: 11},
            {x: 12, y: 11},
            {x: 14, y: 11},
            {x: 16, y: 11},
            {x: 18, y: 11},
            {x: 19, y: 11}
        ]
    },
    STAR: {
        name: '별형',
        path: [
            {x: 0, y: 7},  // 시작점
            {x: 4, y: 7},  // 오른쪽으로 이동
            {x: 6, y: 3},  // 오른쪽 상단 꼭지점
            {x: 8, y: 7},  // 중앙으로
            {x: 12, y: 3}, // 오른쪽 상단 꼭지점
            {x: 14, y: 7}, // 중앙으로
            {x: 19, y: 7}, // 오른쪽 끝
            {x: 15, y: 11}, // 오른쪽 하단 꼭지점
            {x: 14, y: 7}, // 중앙으로
            {x: 10, y: 11}, // 왼쪽 하단 꼭지점
            {x: 8, y: 7},  // 중앙으로
            {x: 4, y: 11}, // 왼쪽 하단 꼭지점
            {x: 0, y: 7}   // 시작점으로 복귀
        ]
    },
    VORTEX: {
        name: '소용돌이',
        path: [
            {x: 0, y: 7},
            {x: 1, y: 7},
            {x: 2, y: 7},
            {x: 3, y: 7},
            {x: 4, y: 7},
            {x: 4, y: 6},
            {x: 4, y: 5},
            {x: 4, y: 4},
            {x: 4, y: 3},
            {x: 5, y: 3},
            {x: 6, y: 3},
            {x: 7, y: 3},
            {x: 8, y: 3},
            {x: 8, y: 4},
            {x: 8, y: 5},
            {x: 8, y: 6},
            {x: 8, y: 7},
            {x: 8, y: 8},
            {x: 8, y: 9},
            {x: 8, y: 10},
            {x: 9, y: 10},
            {x: 10, y: 10},
            {x: 11, y: 10},
            {x: 12, y: 10},
            {x: 12, y: 9},
            {x: 12, y: 8},
            {x: 12, y: 7},
            {x: 12, y: 6},
            {x: 12, y: 5},
            {x: 12, y: 4},
            {x: 13, y: 4},
            {x: 14, y: 4},
            {x: 15, y: 4},
            {x: 16, y: 4},
            {x: 16, y: 5},
            {x: 16, y: 6},
            {x: 16, y: 7},
            {x: 16, y: 8},
            {x: 16, y: 9},
            {x: 16, y: 10},
            {x: 17, y: 10},
            {x: 18, y: 10},
            {x: 19, y: 10}
        ]
    },
    MAZE2: {
        name: '맵1',
        path: [
            {x: 0, y: 7},
            {x: 1, y: 7},
            {x: 2, y: 7},
            {x: 3, y: 7},
            {x: 4, y: 7},
            {x: 4, y: 5},
            {x: 4, y: 3},
            {x: 6, y: 3},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 10, y: 5},
            {x: 10, y: 7},
            {x: 10, y: 9},
            {x: 12, y: 9},
            {x: 14, y: 9},
            {x: 16, y: 9},
            {x: 16, y: 7},
            {x: 16, y: 5},
            {x: 16, y: 3},
            {x: 16, y: 1},
            {x: 18, y: 1},
            {x: 19, y: 1}
        ]
    },
    SNAKE2: {
        name: '맵2',
        path: [
            {x: 0, y: 3},
            {x: 2, y: 3},
            {x: 4, y: 3},
            {x: 4, y: 5},
            {x: 4, y: 7},
            {x: 6, y: 7},
            {x: 8, y: 7},
            {x: 8, y: 5},
            {x: 8, y: 3},
            {x: 10, y: 3},
            {x: 12, y: 3},
            {x: 12, y: 5},
            {x: 12, y: 7},
            {x: 14, y: 7},
            {x: 16, y: 7},
            {x: 16, y: 5},
            {x: 16, y: 3},
            {x: 18, y: 3},
            {x: 19, y: 3}
        ]
    },
    TRIANGLE: {
        name: '삼각형',
        path: [
            {x: 0, y: 7},   // 시작점
            {x: 4, y: 7},   // 오른쪽으로
            {x: 8, y: 3},   // 상단 꼭지점
            {x: 12, y: 7},  // 오른쪽으로
            {x: 16, y: 7},  // 오른쪽으로
            {x: 19, y: 7},  // 오른쪽 끝
            {x: 16, y: 11}, // 하단 꼭지점
            {x: 12, y: 11}, // 왼쪽으로
            {x: 8, y: 11},  // 왼쪽으로
            {x: 4, y: 11},  // 왼쪽으로
            {x: 0, y: 7}    // 시작점으로 복귀
        ]
    }
};

// 현재 선택된 맵
let currentMap = MAPS.STRAIGHT;

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

// 특수 이벤트 정의
const SPECIAL_EVENTS = {
    GOLD_RUSH: {
        name: '골드 러시',
        description: '모든 적 처치 시 골드 2배!',
        duration: 30000,
        effect: () => {
            gameState.goldMultiplier = 2;
            showEventNotification('골드 러시 시작!');
            setTimeout(() => {
                gameState.goldMultiplier = 1;
                showEventNotification('골드 러시 종료');
            }, 30000);
        }
    },
    TOWER_POWER: {
        name: '타워 강화',
        description: '모든 타워의 공격력 50% 증가!',
        duration: 20000,
        effect: () => {
            towers.forEach(tower => {
                tower.damage *= 1.5;
            });
            showEventNotification('타워 강화 시작!');
            setTimeout(() => {
                towers.forEach(tower => {
                    tower.damage /= 1.5;
                });
                showEventNotification('타워 강화 종료');
            }, 20000);
        }
    },
    ENEMY_WEAKNESS: {
        name: '적 약화',
        description: '모든 적의 체력 30% 감소!',
        duration: 25000,
        effect: () => {
            enemies.forEach(enemy => {
                enemy.health *= 0.7;
                enemy.maxHealth *= 0.7;
            });
            showEventNotification('적 약화 시작!');
            setTimeout(() => {
                showEventNotification('적 약화 종료');
            }, 25000);
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
    },
    TOWER_EXPERT: {
        name: '타워 전문가',
        description: '타워를 10레벨까지 업그레이드했습니다.',
        condition: () => towers.some(tower => tower.level >= 10),
        unlocked: false
    },
    GOLD_COLLECTOR: {
        name: '골드 수집가',
        description: '총 10000 골드를 획득했습니다.',
        condition: () => gameStats.totalGold >= 10000,
        unlocked: false
    },
    EVENT_MASTER: {
        name: '이벤트 마스터',
        description: '모든 특수 이벤트를 경험했습니다.',
        condition: () => Object.keys(SPECIAL_EVENTS).every(event => gameStats.eventsTriggered?.includes(event)),
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
    highestWave: 0,
    eventsTriggered: []
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
                    tower.comboBonus = 1.5;
                }
            });
            // 3초 후에 효과 해제
            setTimeout(() => {
                towers.forEach(tower => {
                    if (tower.type === 'BASIC' || tower.type === 'SNIPER') {
                        tower.comboBonus = 1;
                    }
                });
            }, 3000);
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
                    tower.comboBonus = 1.5;
                    if (tower.splashRadius) tower.splashRadius *= 1.5;
                }
            });
            // 3초 후에 효과 해제
            setTimeout(() => {
                towers.forEach(tower => {
                    if (tower.type === 'SPLASH' || tower.type === 'LASER') {
                        tower.comboBonus = 1;
                        if (tower.splashRadius) tower.splashRadius /= 1.5;
                    }
                });
            }, 3000);
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
                tower.comboBonus = 1.3;
            });
            // 3초 후에 효과 해제
            setTimeout(() => {
                towers.forEach(tower => {
                    tower.comboBonus = 1;
                });
            }, 3000);
        }
    },
    ELEMENTAL_MASTERY: {
        name: '원소 지배',
        description: '모든 타워의 특수 효과가 100% 강화됩니다.',
        check: () => {
            const hasAllTypes = new Set(towers.map(t => t.type)).size === Object.keys(TOWER_TYPES).length;
            return hasAllTypes && towers.every(t => t.level >= 3);
        },
        effect: () => {
            towers.forEach(tower => {
                switch(tower.special) {
                    case 'pierce':
                        tower.pierceCount = 3;
                        break;
                    case 'slow':
                        tower.slowEffect = 0.5;
                        break;
                    case 'continuous':
                        tower.continuousDamage *= 2;
                        break;
                }
            });
            // 3초 후에 효과 해제
            setTimeout(() => {
                towers.forEach(tower => {
                    switch(tower.special) {
                        case 'pierce':
                            tower.pierceCount = 1;
                            break;
                        case 'slow':
                            tower.slowEffect = 0.7;
                            break;
                        case 'continuous':
                            tower.continuousDamage /= 2;
                            break;
                    }
                });
            }, 3000);
        }
    },
    TACTICAL_FORMATION: {
        name: '전술적 배치',
        description: '인접한 타워들이 서로의 공격력을 20% 증가시킵니다.',
        check: () => {
            return towers.some(tower => {
                const adjacentTowers = towers.filter(t => 
                    Math.abs(t.x - tower.x) <= 1 && Math.abs(t.y - tower.y) <= 1 && t !== tower
                );
                return adjacentTowers.length >= 2;
            });
        },
        effect: () => {
            towers.forEach(tower => {
                const adjacentTowers = towers.filter(t => 
                    Math.abs(t.x - tower.x) <= 1 && Math.abs(t.y - tower.y) <= 1 && t !== tower
                );
                tower.comboBonus = 1 + (adjacentTowers.length * 0.2);
            });
            // 3초 후에 효과 해제
            setTimeout(() => {
                towers.forEach(tower => {
                    tower.comboBonus = 1;
                });
            }, 3000);
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

// 타워 특수 능력 정의
const TOWER_SPECIALS = {
    BASIC: {
        name: '강화 사격',
        description: '공격력이 2배로 증가합니다.',
        cooldown: 300,
        effect: (tower) => {
            tower.damage *= 2;
            setTimeout(() => {
                tower.damage /= 2;
            }, 5000);
        }
    },
    SNIPER: {
        name: '관통 강화',
        description: '관통 횟수가 2배로 증가합니다.',
        cooldown: 400,
        effect: (tower) => {
            tower.pierceCount *= 2;
            setTimeout(() => {
                tower.pierceCount /= 2;
            }, 5000);
        }
    },
    SPLASH: {
        name: '냉기 폭발',
        description: '범위 내 모든 적을 3초간 동결시킵니다.',
        cooldown: 500,
        effect: (tower) => {
            enemies.forEach(enemy => {
                const dx = (enemy.x - tower.x) * TILE_SIZE;
                const dy = (enemy.y - tower.y) * TILE_SIZE;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= tower.range * TILE_SIZE) {
                    enemy.speed = 0;
                    setTimeout(() => {
                        enemy.speed = enemy.baseSpeed;
                    }, 3000);
                }
            });
        }
    },
    LASER: {
        name: '과열',
        description: '지속 데미지가 3배로 증가합니다.',
        cooldown: 450,
        effect: (tower) => {
            tower.continuousDamage *= 3;
            setTimeout(() => {
                tower.continuousDamage /= 3;
            }, 5000);
        }
    }
};

// 보스 몬스터 패턴 개선
const BOSS_PATTERNS = {
    TANK: {
        name: '지진',
        description: '주변 타워를 5초간 무력화합니다.',
        cooldown: 300,
        effect: (boss) => {
            towers.forEach(tower => {
                const dx = (tower.x - boss.x) * TILE_SIZE;
                const dy = (tower.y - boss.y) * TILE_SIZE;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= 3 * TILE_SIZE) {
                    tower.cooldown = 150;
                }
            });
        }
    },
    SPEED: {
        name: '시간 왜곡',
        description: '모든 타워의 공격 속도를 50% 감소시킵니다.',
        cooldown: 400,
        effect: (boss) => {
            towers.forEach(tower => {
                tower.maxCooldown *= 2;
                setTimeout(() => {
                    tower.maxCooldown /= 2;
                }, 5000);
            });
        }
    },
    SUMMONER: {
        name: '타워 약화',
        description: '모든 타워의 데미지를 50% 감소시킵니다.',
        cooldown: 500,
        effect: (boss) => {
            towers.forEach(tower => {
                tower.damage *= 0.5;
                setTimeout(() => {
                    tower.damage *= 2;
                }, 5000);
            });
        }
    }
};

// 미니맵 캔버스 설정
const minimapCanvas = document.getElementById('minimapCanvas');
const minimapCtx = minimapCanvas.getContext('2d');

// 미니맵 그리기
function drawMinimap() {
    minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    // 배경 그리기
    minimapCtx.fillStyle = '#333';
    minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    // 맵 경로 그리기
    minimapCtx.fillStyle = '#666';
    currentMap.path.forEach(point => {
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
    
    // 이전 타이머가 있다면 제거
    if (window.comboTimer) {
        clearTimeout(window.comboTimer);
    }
    
    descriptionElement.textContent = description;
    indicator.style.display = 'block';
    
    // 3초 후에 팝업을 숨기고 타이머 초기화
    window.comboTimer = setTimeout(() => {
        if (indicator) {
            indicator.style.display = 'none';
            window.comboTimer = null;
        }
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

// 타워 업그레이드 비용 계산 함수
function calculateUpgradeCost(baseCost, level) {
    return Math.floor(baseCost * Math.pow(1.5, level - 1));
}

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
        this.special = TOWER_SPECIALS[type];
        this.continuousDamage = 0;
        if (this.special === 'continuous') {
            this.continuousDamage = Math.floor(this.damage * 0.2);
        }
        this.size = TILE_SIZE - 10;
        this.levelColors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800'];
        this.comboBonus = 1; // 조합 보너스 초기화
        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.pierceCount = 1;
        this.slowEffect = 0.7;
        this.specialCooldown = 0;
        this.upgradeLevel = 1;
        this.maxUpgradeLevel = 5;
        this.upgradeCost = calculateUpgradeCost(TOWER_TYPES[type].upgradeCost, this.upgradeLevel);
        playSound(sounds.towerPlace);
    }

    upgrade() {
        if (this.upgradeLevel < this.maxUpgradeLevel) {
            this.upgradeLevel++;
            this.damage = Math.floor(this.damage * 1.5);
            this.range += 0.5;
            if (this.splashRadius) this.splashRadius += 0.5;
            this.maxCooldown = Math.max(10, this.maxCooldown * 0.8);
            this.upgradeCost = calculateUpgradeCost(TOWER_TYPES[this.type].upgradeCost, this.upgradeLevel);
            
            // 특수 능력 강화
            if (this.special === 'continuous') {
                this.continuousDamage = Math.floor(this.damage * 0.2);
            }
            
            // 업그레이드 이펙트
            showUpgradeEffect(this.x, this.y);
            playSound(sounds.powerup);
        }
    }

    getUpgradeCost() {
        return this.upgradeCost;
    }

    getSellValue() {
        return Math.floor(this.cost * 0.7 * this.upgradeLevel);
    }

    draw() {
        // 타워 크기와 색상 업데이트
        this.size = TILE_SIZE - 10 + (this.level - 1) * 2;
        const offset = (TILE_SIZE - this.size) / 2;
        
        ctx.fillStyle = this.levelColors[Math.min(this.level - 1, this.levelColors.length - 1)];
        ctx.fillRect(
            this.x * TILE_SIZE + offset,
            this.y * TILE_SIZE + offset,
            this.size,
            this.size
        );
        
        // 레벨 표시
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(
            this.level.toString(),
            this.x * TILE_SIZE + TILE_SIZE/2 - 3,
            this.y * TILE_SIZE + TILE_SIZE/2 + 3
        );
        
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
                let damage = Math.floor(this.damage * this.comboBonus);
                
                switch(this.special) {
                    case 'pierce':
                        let pierced = 0;
                        enemies.forEach(e => {
                            if (Math.abs(e.x - enemy.x) < 1 && Math.abs(e.y - enemy.y) < 1 && pierced < this.pierceCount) {
                                e.health -= damage * (1 - e.defense);
                                showDamageNumber(e.x, e.y, damage * (1 - e.defense));
                                pierced++;
                            }
                        });
                        break;
                    case 'slow':
                        enemy.speed *= this.slowEffect;
                        enemy.health -= damage * (1 - enemy.defense);
                        showDamageNumber(enemy.x, enemy.y, damage * (1 - enemy.defense));
                        setTimeout(() => {
                            enemy.speed = enemy.baseSpeed;
                        }, 1000);
                        break;
                    case 'continuous':
                        const continuousDamage = Math.floor(this.continuousDamage * this.comboBonus);
                        enemy.continuousDamage = (enemy.continuousDamage || 0) + continuousDamage;
                        showDamageNumber(enemy.x, enemy.y, continuousDamage);
                        break;
                    default:
                        enemy.health -= damage;
                        showDamageNumber(enemy.x, enemy.y, damage);
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

    gainExperience(amount) {
        this.experience += amount;
        
        // 타워 레벨업 체크
        while (this.experience >= this.experienceToNextLevel) {
            this.experience -= this.experienceToNextLevel;
            this.level++;
            this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
            
            // 레벨업 시 능력치 상승
            this.damage = Math.floor(this.damage * 1.5);
            this.range += 0.5;
            if (this.splashRadius) this.splashRadius += 0.5;
            this.maxCooldown = Math.max(10, this.maxCooldown * 0.8);
            
            // 특수 능력 강화
            if (this.special === 'continuous') {
                this.continuousDamage = Math.floor(this.damage * 0.2);
            }
            
            // 레벨업 이펙트
            showUpgradeEffect(this.x, this.y);
            playSound(sounds.powerup);
        }
    }

    useSpecial() {
        if (this.specialCooldown <= 0) {
            this.special.effect(this);
            this.specialCooldown = this.special.cooldown;
            showSpecialEffect(this.x, this.y, this.special.name);
        }
    }

    update() {
        if (this.specialCooldown > 0) {
            this.specialCooldown--;
        }
    }
}

// 적 클래스
class Enemy {
    constructor(wave, isBoss = false) {
        this.pathIndex = 0;
        this.x = currentMap.path[0].x;
        this.y = currentMap.path[0].y;
        this.baseSpeed = 0.02 + (wave * 0.005);
        this.speed = this.baseSpeed * DIFFICULTY_SETTINGS[gameState.difficulty].enemySpeed;
        this.health = (100 + (wave * 20)) * DIFFICULTY_SETTINGS[gameState.difficulty].enemyHealth;
        this.maxHealth = this.health;
        this.reward = Math.floor((10 + (wave * 2)) * DIFFICULTY_SETTINGS[gameState.difficulty].goldReward);
        this.isBoss = isBoss;
        this.continuousDamage = 0;
        this.experienceValue = isBoss ? 50 : 10;
        this.defense = 0;
        this.isInvincible = false;
        this.patternCooldown = 0;
        
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
            this.pattern = BOSS_PATTERNS[bossType];
            playSound(sounds.bossSpawn);
        }
    }

    update() {
        // 지속 데미지 적용 (매 프레임마다)
        if (this.continuousDamage > 0) {
            const damage = Math.floor(this.continuousDamage);
            this.health -= damage;
            this.continuousDamage = Math.max(0, this.continuousDamage * 0.95); // 지속 데미지가 서서히 감소
        }

        if (this.pathIndex >= currentMap.path.length - 1) {
            gameState.lives--;
            return true;
        }

        if (this.health <= 0) {
            if (!this.isInvincible) {
                // 경험치 획득
                gainExperience(this.experienceValue);
                
                // 타워 경험치 획득
                towers.forEach(tower => {
                    const dx = (this.x - tower.x) * TILE_SIZE;
                    const dy = (this.y - tower.y) * TILE_SIZE;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance <= tower.range * TILE_SIZE) {
                        tower.gainExperience(this.experienceValue / 2);
                    }
                });
                
                gameState.gold += this.reward * (gameState.goldMultiplier || 1);
                gameStats.totalGold += this.reward * (gameState.goldMultiplier || 1);
                gameStats.enemiesKilled++;
                if (this.isBoss) {
                    gameStats.bossesKilled++;
                    gameState.bossKilled = true;
                }
                playSound(sounds.enemyDeath);
                updateStats();
            }
            return true;
        }

        // 보스 능력 사용
        if (this.isBoss && this.patternCooldown <= 0) {
            this.pattern.effect(this);
            this.patternCooldown = this.pattern.cooldown;
            showBossPatternEffect(this.x, this.y, this.pattern.name);
        }
        if (this.patternCooldown > 0) this.patternCooldown--;

        const targetX = currentMap.path[this.pathIndex + 1].x;
        const targetY = currentMap.path[this.pathIndex + 1].y;
        
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

// 게임 시작 시 튜토리얼 표시
function showTutorial() {
    document.getElementById('tutorial').style.display = 'block';
}

// 카운트다운 상태 변수 추가
let isCountdownActive = false;

// 카운트다운 표시
function showCountdown() {
    if (isCountdownActive) return; // 이미 카운트다운이 진행 중이면 중단
    
    isCountdownActive = true;
    const countdown = document.getElementById('countdown');
    countdown.style.display = 'block';
    countdown.textContent = ''; // 카운트다운 시작 시 텍스트 초기화
    let count = 3;
    
    const interval = setInterval(() => {
        if (count > 0) {
            countdown.textContent = count;
            count--;
        } else {
            countdown.style.display = 'none';
            countdown.textContent = ''; // 카운트다운 종료 시 텍스트 초기화
            clearInterval(interval);
            isCountdownActive = false;
            startWave();
        }
    }, 1000);
}

// 게임 오버 화면 표시
function showGameOver() {
    const gameOver = document.getElementById('gameOver');
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalWave').textContent = gameState.wave;
    gameOver.style.display = 'block';
}

// 게임 재시작
function restartGame() {
    gameState.gold = DIFFICULTY_SETTINGS[gameState.difficulty].gold;
    gameState.lives = DIFFICULTY_SETTINGS[gameState.difficulty].lives;
    gameState.wave = 1;
    gameState.isGameOver = false;
    gameState.waveInProgress = false;
    gameState.enemiesRemaining = 0;
    gameState.isPaused = false;
    gameState.score = 0;
    towers = [];
    enemies = [];
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';
}

// 타워 설치 가능한 위치 표시
function showPlaceablePositions() {
    for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_HEIGHT; j++) {
            const isOnPath = currentMap.path.some(point => point.x === i && point.y === j);
            const hasTower = towers.some(tower => tower.x === i && tower.y === j);
            
            if (!isOnPath && !hasTower) {
                ctx.fillStyle = 'rgba(76, 175, 80, 0.2)';
                ctx.strokeStyle = '#4CAF50';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.setLineDash([]);
            }
        }
    }
}

// 타워 설치/업그레이드 이펙트
function showTowerEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'tower-effect';
    effect.style.left = `${x * TILE_SIZE}px`;
    effect.style.top = `${y * TILE_SIZE}px`;
    effect.style.width = `${TILE_SIZE}px`;
    effect.style.height = `${TILE_SIZE}px`;
    effect.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
    effect.style.borderRadius = '50%';
    document.querySelector('.game-area').appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 500);
}

// 타워 업그레이드 이펙트
function showUpgradeEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'tower-effect';
    effect.style.left = `${x * TILE_SIZE}px`;
    effect.style.top = `${y * TILE_SIZE}px`;
    effect.style.width = `${TILE_SIZE}px`;
    effect.style.height = `${TILE_SIZE}px`;
    effect.style.backgroundColor = 'rgba(255, 215, 0, 0.5)';
    effect.style.borderRadius = '50%';
    document.querySelector('.game-area').appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 500);
}

// 게임 시작 버튼 이벤트 수정
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameState.isStarted) {
        gameState.isStarted = true;
        document.getElementById('startBtn').textContent = '재시작';
        document.getElementById('tutorial').style.display = 'none';
        document.getElementById('waveStartButton').style.display = 'block'; // 게임 시작 시 버튼 표시
    } else {
        restartGame();
    }
});

// 웨이브 시작 함수 수정
function startWave() {
    if (gameState.waveInProgress) return;
    
    gameState.waveInProgress = true;
    gameState.enemiesRemaining = 10 + (gameState.wave * 2);
    
    if (gameState.wave % gameState.bossWave === 0) {
        gameState.enemiesRemaining = 1;
        enemies.push(new Enemy(gameState.wave, true));
    }
    
    // 웨이브 시작 이펙트
    showWaveStartEffect();
    playSound(sounds.powerup);
}

// 웨이브 시작 이펙트
function showWaveStartEffect() {
    const effect = document.createElement('div');
    effect.className = 'wave-start-effect';
    effect.innerHTML = `
        <h2>웨이브 ${gameState.wave} 시작!</h2>
        <p>적의 수: ${gameState.enemiesRemaining}</p>
    `;
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 2000);
}

// 정보 바 업데이트
function updateInfoBar() {
    document.getElementById('infoGold').textContent = `골드: ${gameState.gold}`;
    document.getElementById('infoLives').textContent = `생명: ${gameState.lives}`;
    document.getElementById('infoWave').textContent = `웨이브: ${gameState.wave}`;
    document.getElementById('infoScore').textContent = `점수: ${gameState.score}`;
    document.getElementById('infoDifficulty').textContent = `난이도: ${gameState.difficulty}`;
    document.getElementById('infoLevel').textContent = `레벨: ${gameState.level}`;
    document.getElementById('infoExp').textContent = `경험치: ${gameState.experience}/${gameState.experienceToNextLevel}`;
}

// 웨이브 진행 상황 업데이트
function updateWaveProgress() {
    const progress = document.getElementById('waveProgress');
    const fill = progress.querySelector('.fill');
    const total = gameState.enemiesRemaining + enemies.length;
    const remaining = gameState.enemiesRemaining;
    const percentage = ((total - remaining) / total) * 100;
    
    fill.style.width = `${percentage}%`;
    progress.style.display = gameState.waveInProgress ? 'block' : 'none';
}

// 보상 팝업 표시
function showRewardPopup(amount) {
    const popup = document.getElementById('rewardPopup');
    document.getElementById('rewardAmount').textContent = amount;
    popup.style.display = 'block';
    
    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

// 골드 부족 메시지 표시
function showInsufficientGold() {
    const message = document.getElementById('insufficientGold');
    message.style.display = 'block';
    
    setTimeout(() => {
        message.style.display = 'none';
    }, 1000);
}

// 타워 범위 미리보기
let rangePreview = null;

function showTowerRangePreview(x, y, range, type) {
    if (rangePreview) {
        rangePreview.remove();
    }
    
    rangePreview = document.createElement('div');
    rangePreview.className = 'tower-range-preview';
    rangePreview.style.left = `${x * TILE_SIZE + TILE_SIZE/2}px`;
    rangePreview.style.top = `${y * TILE_SIZE + TILE_SIZE/2}px`;
    rangePreview.style.width = `${range * TILE_SIZE * 2}px`;
    rangePreview.style.height = `${range * TILE_SIZE * 2}px`;
    rangePreview.style.marginLeft = `-${range * TILE_SIZE}px`;
    rangePreview.style.marginTop = `-${range * TILE_SIZE}px`;
    
    // 타워 종류에 따른 색상 설정
    const tower = TOWER_TYPES[type];
    rangePreview.style.backgroundColor = `${tower.color}20`;
    rangePreview.style.border = `2px solid ${tower.color}`;
    
    document.querySelector('.game-area').appendChild(rangePreview);
}

function hideTowerRangePreview() {
    if (rangePreview) {
        rangePreview.remove();
        rangePreview = null;
    }
}

// 웨이브 종료 체크 수정
function checkWaveEnd() {
    if (gameState.waveInProgress && gameState.enemiesRemaining === 0 && enemies.length === 0) {
        gameState.waveInProgress = false;
        gameState.wave++;
        const reward = calculateWaveReward();
        gameState.gold += reward;
        showRewardPopup(reward);
        
        // 웨이브 클리어 효과음
        playSound(sounds.powerup);
    }
}

// 게임 루프 수정
function gameLoop() {
    if (gameState.isGameOver || !gameState.isStarted || gameState.isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 그리드와 경로 그리기
    ctx.strokeStyle = '#ccc';
    for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_HEIGHT; j++) {
            ctx.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    ctx.fillStyle = '#eee';
    for (let point of currentMap.path) {
        ctx.fillRect(point.x * TILE_SIZE, point.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    // 타워 설치 가능한 위치 표시
    if (!gameState.waveInProgress) {
        showPlaceablePositions();
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
    if (gameState.waveInProgress && gameState.enemiesRemaining > 0 && 
        Math.random() < DIFFICULTY_SETTINGS[gameState.difficulty].enemySpawnRate) {
        enemies.push(new Enemy(gameState.wave));
        gameState.enemiesRemaining--;
    }

    // 웨이브 종료 체크
    checkWaveEnd();

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

    // UI 업데이트
    updateInfoBar();

    // 웨이브 진행 상황 업데이트
    updateWaveProgress();

    // 웨이브 시작 버튼 표시/숨김 처리
    const waveStartButton = document.getElementById('waveStartButton');
    if (waveStartButton) {
        waveStartButton.style.display = !gameState.waveInProgress && !gameState.isGameOver ? 'block' : 'none';
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
        showGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// 단축키 이벤트 추가
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameState.waveInProgress && !gameState.isGameOver && !isCountdownActive && gameState.isStarted) {
            showCountdown();
        }
    } else if (e.code === 'KeyP') {
        e.preventDefault();
        if (gameState.isStarted) {
            gameState.isPaused = !gameState.isPaused;
            document.getElementById('pauseBtn').textContent = gameState.isPaused ? '계속하기' : '일시정지';
        }
    } else if (e.code === 'KeyH') {
        e.preventDefault();
        document.getElementById('helpModal').style.display = 'block';
    }
});

// 타워 설치 이벤트 수정
canvas.addEventListener('click', (e) => {
    if (gameState.isGameOver || !gameState.isStarted || gameState.isPaused) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    const clickedTower = towers.find(tower => tower.x === x && tower.y === y);
    if (clickedTower) {
        showTowerUpgradeMenu(clickedTower, e.clientX, e.clientY);
        return;
    }

    const isOnPath = currentMap.path.some(point => point.x === x && point.y === y);
    if (isOnPath) return;

    const towerExists = towers.some(tower => tower.x === x && tower.y === y);
    if (towerExists) return;

    showTowerBuildMenu(x, y, e.clientX, e.clientY);
    showTowerEffect(x, y);
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

// 난이도 선택 이벤트 수정
document.getElementById('difficultySelect').addEventListener('change', (e) => {
    if (!gameState.isStarted) {
        gameState.difficulty = e.target.value;
        const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
        gameState.gold = settings.gold;
        gameState.lives = settings.lives;
        gameState.maxTowers = settings.maxTowers;
        updateTowerLimit();
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
    saveGame();
});

// 게임 불러오기
document.getElementById('loadBtn').addEventListener('click', () => {
    loadGame();
});

function showTowerBuildMenu(x, y, clientX, clientY) {
    if (gameState.towerCount >= gameState.maxTowers) {
        showSaveLoadNotification('타워 설치 한도에 도달했습니다!');
        return;
    }

    const existingMenu = document.querySelector('.tower-menu');
    if (existingMenu && existingMenu.parentNode) {
        existingMenu.parentNode.removeChild(existingMenu);
    }

    const towerMenu = document.createElement('div');
    towerMenu.className = 'tower-menu';
    
    // 화면 경계를 벗어나지 않도록 위치 조정
    const menuWidth = 200; // 메뉴의 최대 너비
    const menuHeight = Object.keys(TOWER_TYPES).length * 40; // 버튼 높이 * 버튼 개수
    
    let menuX = clientX;
    let menuY = clientY;
    
    // 화면 오른쪽 경계 체크
    if (menuX + menuWidth/2 > window.innerWidth) {
        menuX = window.innerWidth - menuWidth/2;
    }
    // 화면 왼쪽 경계 체크
    if (menuX - menuWidth/2 < 0) {
        menuX = menuWidth/2;
    }
    // 화면 아래쪽 경계 체크
    if (menuY + menuHeight/2 > window.innerHeight) {
        menuY = window.innerHeight - menuHeight/2;
    }
    // 화면 위쪽 경계 체크
    if (menuY - menuHeight/2 < 0) {
        menuY = menuHeight/2;
    }
    
    towerMenu.style.left = `${menuX}px`;
    towerMenu.style.top = `${menuY}px`;

    const highlight = highlightGrid(x, y);

    Object.entries(TOWER_TYPES).forEach(([type, tower]) => {
        const button = document.createElement('button');
        button.textContent = `${tower.name} (${tower.cost} 골드)`;
        button.disabled = gameState.gold < tower.cost;
        
        button.onmouseover = () => showTowerRangePreview(x, y, tower.range, type);
        button.onmouseout = hideTowerRangePreview;
        
        button.onclick = () => {
            if (gameState.gold >= tower.cost) {
                towers.push(new Tower(x, y, type));
                gameState.gold -= tower.cost;
                gameState.towerCount++;
                updateTowerLimit();
                playSound(sounds.towerPlace);
                if (towerMenu.parentNode) {
                    towerMenu.parentNode.removeChild(towerMenu);
                }
                highlight.remove();
            } else {
                showInsufficientGold();
            }
        };
        towerMenu.appendChild(button);
    });

    document.body.appendChild(towerMenu);
    setupMenuCloseHandler(towerMenu);
}

function showTowerUpgradeMenu(tower, clientX, clientY) {
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

// 게임 시작 시 로딩 화면
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        updateTowerLimit();
        document.getElementById('waveStartButton').style.display = 'none'; // 초기에는 버튼 숨김
        
        // 다음웨이브 버튼 클릭 이벤트 추가
        document.getElementById('waveStartButton').addEventListener('click', () => {
            if (!gameState.waveInProgress && !gameState.isGameOver && !isCountdownActive && gameState.isStarted) {
                showCountdown();
            }
        });
    }, 1500);
});

// 데미지 숫자 표시 함수
function showDamageNumber(x, y, damage) {
    if (!isFinite(damage) || damage <= 0) return; // 유효하지 않은 데미지 값은 표시하지 않음
    
    const damageElement = document.createElement('div');
    damageElement.className = 'damage-number';
    damageElement.textContent = Math.floor(damage);
    damageElement.style.left = `${x * TILE_SIZE + TILE_SIZE/2}px`;
    damageElement.style.top = `${y * TILE_SIZE}px`;
    document.querySelector('.game-area').appendChild(damageElement);
    
    setTimeout(() => {
        damageElement.remove();
    }, 1000);
}

// 그리드 하이라이트 함수
function highlightGrid(x, y) {
    const highlight = document.createElement('div');
    highlight.className = 'grid-highlight';
    highlight.style.left = `${x * TILE_SIZE}px`;
    highlight.style.top = `${y * TILE_SIZE}px`;
    highlight.style.width = `${TILE_SIZE}px`;
    highlight.style.height = `${TILE_SIZE}px`;
    document.querySelector('.game-area').appendChild(highlight);
    
    return highlight;
}

// 타워 제한 업데이트
function updateTowerLimit() {
    document.getElementById('towerLimitCount').textContent = gameState.towerCount;
    document.getElementById('towerLimitMax').textContent = gameState.maxTowers;
}

// 저장/불러오기 알림
function showSaveLoadNotification(message) {
    const notification = document.getElementById('saveLoadNotification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// 웨이브 클리어 보상 계산
function calculateWaveReward() {
    const baseReward = 50;
    const waveBonus = gameState.wave * 10;
    const difficultyMultiplier = DIFFICULTY_SETTINGS[gameState.difficulty].goldReward;
    const towerBonus = towers.length * 5;
    const levelBonus = gameState.level * 2;
    
    return Math.floor((baseReward + waveBonus + towerBonus + levelBonus) * difficultyMultiplier);
}

// 게임 저장
function saveGame() {
    const saveData = {
        gameState: {
            ...gameState,
            isPaused: true
        },
        towers: towers.map(tower => ({
            x: tower.x,
            y: tower.y,
            type: tower.type,
            level: tower.level,
            experience: tower.experience,
            experienceToNextLevel: tower.experienceToNextLevel
        })),
        achievements: Object.fromEntries(
            Object.entries(ACHIEVEMENTS).map(([key, achievement]) => [key, achievement.unlocked])
        ),
        currentMap: gameState.currentMap,
        timestamp: Date.now()
    };
    
    localStorage.setItem('towerDefenseSave', JSON.stringify(saveData));
    showSaveLoadNotification('게임이 저장되었습니다.');
}

// 게임 불러오기
function loadGame() {
    const saveData = localStorage.getItem('towerDefenseSave');
    if (saveData) {
        const data = JSON.parse(saveData);
        
        const saveTime = new Date(data.timestamp);
        const currentTime = new Date();
        const hoursDiff = (currentTime - saveTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            showSaveLoadNotification('저장된 게임이 만료되었습니다.');
            return;
        }
        
        Object.assign(gameState, data.gameState);
        selectMap(data.currentMap);
        
        towers = data.towers.map(towerData => {
            const tower = new Tower(towerData.x, towerData.y, towerData.type);
            tower.experience = towerData.experience;
            tower.experienceToNextLevel = towerData.experienceToNextLevel;
            for (let i = 1; i < towerData.level; i++) {
                tower.level++;
                tower.damage = Math.floor(tower.damage * 1.5);
                tower.range += 0.5;
                if (tower.splashRadius) tower.splashRadius += 0.5;
            }
            return tower;
        });
        
        Object.entries(data.achievements).forEach(([key, unlocked]) => {
            ACHIEVEMENTS[key].unlocked = unlocked;
        });
        
        updateTowerLimit();
        showSaveLoadNotification('게임을 불러왔습니다.');
    } else {
        showSaveLoadNotification('저장된 게임이 없습니다.');
    }
}

// 경험치 획득 및 레벨업
function gainExperience(amount) {
    gameState.experience += amount;
    
    // 레벨업 체크
    while (gameState.experience >= gameState.experienceToNextLevel) {
        gameState.experience -= gameState.experienceToNextLevel;
        gameState.level++;
        gameState.experienceToNextLevel = Math.floor(gameState.experienceToNextLevel * 1.5);
        
        // 레벨업 보상
        const levelUpReward = gameState.level * 50;
        gameState.gold += levelUpReward;
        showLevelUpEffect(levelUpReward);
    }
    
    updateInfoBar();
}

// 레벨업 이펙트
function showLevelUpEffect(reward) {
    const effect = document.createElement('div');
    effect.className = 'level-up-effect';
    effect.innerHTML = `
        <h3>레벨 업!</h3>
        <p>현재 레벨: ${gameState.level}</p>
        <p>보상: +${reward} 골드</p>
    `;
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 3000);
}

// 특수 이벤트 표시
function showEventNotification(message) {
    // 이미 표시된 알림이 있는지 확인
    const existingNotification = document.querySelector('.event-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'event-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// HTML에 이벤트 알림 스타일 추가
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .event-notification {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: gold;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        }
    </style>
`);

// 특수 효과 표시 함수
function showSpecialEffect(x, y, name) {
    const effect = document.createElement('div');
    effect.className = 'special-effect';
    effect.textContent = name;
    effect.style.left = `${x * TILE_SIZE}px`;
    effect.style.top = `${y * TILE_SIZE}px`;
    document.querySelector('.game-area').appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 2000);
}

function showBossPatternEffect(x, y, name) {
    const effect = document.createElement('div');
    effect.className = 'boss-pattern-effect';
    effect.textContent = name;
    effect.style.left = `${x * TILE_SIZE}px`;
    effect.style.top = `${y * TILE_SIZE}px`;
    document.querySelector('.game-area').appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 2000);
}

// 맵 선택 함수
function selectMap(mapKey) {
    currentMap = MAPS[mapKey];
    path = [...currentMap.path];
    // 게임 재시작
    restartGame();
}

// 맵 선택 UI 추가
document.getElementById('mapSelect').addEventListener('change', (e) => {
    if (!gameState.isStarted) {
        selectMap(e.target.value);
        gameState.currentMap = e.target.value;
        // 미니맵 업데이트
        drawMinimap();
    }
});

// 게임 시작
gameLoop(); 