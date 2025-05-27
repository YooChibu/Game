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
        gold: 200,
        lives: 25,
        enemyHealth: 0.8,
        enemySpeed: 0.8,
        goldReward: 1.2,
        maxTowers: 12,
        enemySpawnRate: 0.03
    },
    NORMAL: {
        gold: 150,
        lives: 20,
        enemyHealth: 1,
        enemySpeed: 1,
        goldReward: 1,
        maxTowers: 10,
        enemySpawnRate: 0.05
    },
    HARD: {
        gold: 100,
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
        name: '맵3',
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
        name: '맵4',
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
        name: '맵5',
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
        name: '맵6',
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
        name: '맵7',
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
        name: '맵8',
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
        name: '맵9',
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
        name: '맵10',
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
        name: '맵11',
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
        name: '맵14',
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
        name: '맵15',
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
        name: '맵12',
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

// 타워 타입 정의
const TOWER_TYPES = {
    BASIC: {
        name: '기본 타워',
        cost: 100,
        damage: 10,
        range: 3,
        cooldown: 30,
        color: 'blue',
        special: {
            name: '강화 사격',
            description: '10초 동안 공격력이 50% 증가합니다.',
            cooldown: 30,
            duration: 10,
            effect: (tower) => {
                tower.damage *= 1.5;
                setTimeout(() => {
                    tower.damage /= 1.5;
                }, 10000);
            }
        }
    },
    ICE: {
        name: '얼음 타워',
        cost: 150,
        damage: 5,
        range: 3,
        cooldown: 40,
        color: 'lightblue',
        freezeDuration: 2,
        special: {
            name: '빙결 폭발',
            description: '범위 내 모든 적을 5초 동안 얼립니다.',
            cooldown: 45,
            effect: (tower) => {
                enemies.forEach(enemy => {
                    const dx = (enemy.x - tower.x) * TILE_SIZE;
                    const dy = (enemy.y - tower.y) * TILE_SIZE;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= tower.range * TILE_SIZE) {
                        enemy.speed = 0;
                        setTimeout(() => {
                            enemy.speed = enemy.baseSpeed;
                        }, 5000);
                    }
                });
            }
        }
    },
    POISON: {
        name: '독 타워',
        cost: 200,
        damage: 3,
        range: 2,
        cooldown: 20,
        color: 'green',
        poisonDamage: 2,
        poisonDuration: 5,
        special: {
            name: '독 구름',
            description: '범위 내 적들에게 강력한 독 데미지를 줍니다.',
            cooldown: 40,
            effect: (tower) => {
                enemies.forEach(enemy => {
                    const dx = (enemy.x - tower.x) * TILE_SIZE;
                    const dy = (enemy.y - tower.y) * TILE_SIZE;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= tower.range * TILE_SIZE) {
                        enemy.poisonDamage = tower.poisonDamage * 3;
                        enemy.poisonDuration = tower.poisonDuration * 2;
                    }
                });
            }
        }
    },
    LASER: {
        name: '레이저 타워',
        cost: 250,
        damage: 15,
        range: 4,
        cooldown: 50,
        color: 'red',
        continuousDamage: 5,
        special: {
            name: '과열 레이저',
            description: '10초 동안 연속 데미지가 3배로 증가합니다.',
        cooldown: 60,
            duration: 10,
            effect: (tower) => {
                tower.continuousDamage *= 3;
                setTimeout(() => {
                    tower.continuousDamage /= 3;
                }, 10000);
            }
        }
    },
    SPLASH: {
        name: '스플래시 타워',
        cost: 300,
        damage: 8,
        range: 2,
        cooldown: 45,
        color: 'purple',
        splashRadius: 1.5,
        slowEffect: 0.3,
        special: {
            name: '대규모 폭발',
            description: '범위가 2배로 증가하고 데미지가 50% 증가합니다.',
            cooldown: 50,
            duration: 8,
            effect: (tower) => {
                tower.splashRadius *= 2;
                tower.damage *= 1.5;
                setTimeout(() => {
                    tower.splashRadius /= 2;
                    tower.damage /= 1.5;
                }, 8000);
            }
        }
    },
    SUPPORT: {
        name: '지원 타워',
        cost: 200,
        damage: 0,
        range: 4,
        cooldown: 0,
        color: 'yellow',
        buffRange: 3,
        buffMultiplier: 1.2,
        special: {
            name: '전체 강화',
            description: '모든 타워의 공격력이 30% 증가합니다.',
            cooldown: 60,
            duration: 15,
            effect: (tower) => {
                towers.forEach(t => {
                    if (t !== tower) {
                        t.damage *= 1.3;
                    }
                });
                setTimeout(() => {
                    towers.forEach(t => {
                        if (t !== tower) {
                            t.damage /= 1.3;
                        }
                    });
                }, 15000);
            }
        }
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
    bgm: new Audio('sounds/bgm.mp3'),
    tower_place: new Audio('sounds/tower_place.mp3'),
    tower_attack: new Audio('sounds/tower_attack.mp3'),
    enemy_death: new Audio('sounds/enemy_death.mp3'),
    game_start: new Audio('sounds/game_start.mp3'),
    game_over: new Audio('sounds/game_over.mp3'),
    ui_click: new Audio('sounds/ui_click.mp3')
};

// 사운드 설정
let soundEnabled = true;
let musicEnabled = true;

function playSound(soundName) {
    if (!soundEnabled) return;
    const sound = sounds[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.log('사운드 재생 실패:', error));
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById('soundToggleBtn');
    soundBtn.classList.toggle('muted', !soundEnabled);
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    const musicBtn = document.getElementById('musicToggleBtn');
    musicBtn.classList.toggle('muted', !musicEnabled);
    
    if (musicEnabled) {
        sounds.bgm.loop = true;
        sounds.bgm.play().catch(error => console.log('BGM 재생 실패:', error));
    } else {
        sounds.bgm.pause();
    }
}

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
    ICE_POISON: {
        name: '독성 얼음',
        description: '얼음 타워와 독 타워가 함께 있을 때, 얼음 효과가 독 데미지를 증가시킵니다.',
        effect: (towers) => {
            const iceTower = towers.find(t => t.type === 'ICE');
            const poisonTower = towers.find(t => t.type === 'POISON');
            if (iceTower && poisonTower) {
                poisonTower.poisonDamage *= 1.5;
                iceTower.freezeDuration += 2;
                    }
        }
    },
    SUPPORT_NETWORK: {
        name: '지원 네트워크',
        description: '지원 타워가 다른 타워들을 강화합니다.',
        effect: (towers) => {
            const supportTowers = towers.filter(t => t.type === 'SUPPORT');
            supportTowers.forEach(support => {
            towers.forEach(tower => {
                    if (tower !== support) {
                        const dx = tower.x - support.x;
                        const dy = tower.y - support.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance <= support.buffRange) {
                            tower.damage *= support.buffMultiplier;
                        }
                    }
                });
            });
        }
    },
    ELEMENTAL_MASTERY: {
        name: '원소 지배',
        description: '모든 타워 종류가 설치되어 있을 때, 특수 효과가 100% 강화됩니다.',
        effect: (towers) => {
            const hasAllTypes = Object.keys(TOWER_TYPES).every(type => 
                towers.some(t => t.type === type)
            );
            if (hasAllTypes) {
            towers.forEach(tower => {
                    switch(tower.type) {
                        case 'ICE':
                            tower.freezeDuration *= 2;
                        break;
                        case 'POISON':
                            tower.poisonDamage *= 2;
                            tower.poisonDuration *= 2;
                        break;
                        case 'LASER':
                        tower.continuousDamage *= 2;
                        break;
                        case 'SPLASH':
                            tower.splashRadius *= 1.5;
                            tower.slowEffect *= 1.5;
                            break;
                    }
                });
            }
        }
    }
};

// 특수 능력 정의
const ABILITIES = {
    TOWER_BOOST: {
        name: '전체 타워 강화',
        cost: 300
    }
};

// ... existing code ...

class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        this.specialCooldown = 0;
        this.specialActive = false;
        this.special = TOWER_TYPES[type].special;
        
        // 업그레이드 레벨 초기화
        this.rangeLevel = 0;
        this.damageLevel = 0;
        this.speedLevel = 0;
        this.bulletLevel = 0;
        
        const towerType = TOWER_TYPES[type];
        this.baseDamage = towerType.damage;
        this.baseRange = towerType.range;
        this.baseCooldown = towerType.cooldown;
        this.damage = this.baseDamage;
        this.range = this.baseRange;
        this.maxCooldown = this.baseCooldown;
        this.cooldown = 0;
        this.color = towerType.color;
        this.bulletCount = 1;
        
        // 특수 능력 초기화
        if (type === 'SPLASH') {
            this.splashRadius = towerType.splashRadius;
            this.slowEffect = towerType.slowEffect;
        } else if (type === 'POISON') {
            this.poisonDamage = towerType.poisonDamage;
            this.poisonDuration = towerType.poisonDuration;
        } else if (type === 'ICE') {
            this.freezeDuration = towerType.freezeDuration;
        } else if (type === 'LASER') {
            this.continuousDamage = towerType.continuousDamage;
        } else if (type === 'SUPPORT') {
            this.buffRange = towerType.buffRange;
            this.buffMultiplier = towerType.buffMultiplier;
            this.buffedTowers = new Set(); // 버프된 타워 추적
        }
}

    // 업그레이드 비용 계산
    getUpgradeCost(upgradeType) {
        const baseCost = 100;
        const level = this[`${upgradeType}Level`];
        return Math.floor(baseCost * Math.pow(1.5, level));
}

    // 업그레이드 가능 여부 확인
    canUpgrade(upgradeType) {
        const level = this[`${upgradeType}Level`];
        return level < this.level;
    }

    // 업그레이드 적용
    upgrade(upgradeType) {
        if (!this.canUpgrade(upgradeType)) return false;

        const cost = this.getUpgradeCost(upgradeType);
        if (gameState.gold < cost) return false;

        gameState.gold -= cost;
        this[`${upgradeType}Level`]++;

        switch(upgradeType) {
            case 'range':
                this.range = this.baseRange * (1 + this.rangeLevel * 0.2);
                break;
            case 'damage':
                this.damage = this.baseDamage * (1 + this.damageLevel * 0.3);
                break;
            case 'speed':
                this.maxCooldown = this.baseCooldown * (1 - this.speedLevel * 0.1);
                break;
            case 'bullet':
                this.bulletCount = 1 + this.bulletLevel;
                break;
        }

        showUpgradeEffect(this.x, this.y);
        return true;
    }

    // 판매 가격 계산
    getSellValue() {
        const totalUpgradeCost = 
            this.getUpgradeCost('range') +
            this.getUpgradeCost('damage') +
            this.getUpgradeCost('speed') +
            this.getUpgradeCost('bullet');
        return Math.floor(totalUpgradeCost * 0.7);
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
            if (this.type === 'LASER') {
                this.continuousDamage = Math.floor(this.damage * 0.2);
            }
            
            // 레벨업 이펙트
            showUpgradeEffect(this.x, this.y);
            playSound('powerup');
        }
    }

    useSpecial() {
        if (this.specialCooldown <= 0) {
            this.special.effect(this);
            this.specialCooldown = this.special.cooldown;
            showSpecialEffect(this.x, this.y, this.special.name);
            playSound('powerup');
        }
    }

    update() {
        if (this.specialCooldown > 0) {
            this.specialCooldown--;
        }
    }

    draw() {
        // 타워 기본 모양 그리기
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * TILE_SIZE + 5,
            this.y * TILE_SIZE + 5,
            TILE_SIZE - 10,
            TILE_SIZE - 10
        );
        
        // 타워 레벨 표시
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.level.toString(),
            this.x * TILE_SIZE + TILE_SIZE/2,
            this.y * TILE_SIZE + TILE_SIZE/2 + 4
        );
        
        // 타워 범위 표시 (항상 표시)
        const gradient = ctx.createRadialGradient(
            this.x * TILE_SIZE + TILE_SIZE/2,
            this.y * TILE_SIZE + TILE_SIZE/2,
            0,
            this.x * TILE_SIZE + TILE_SIZE/2,
            this.y * TILE_SIZE + TILE_SIZE/2,
            this.range * TILE_SIZE
        );
        
        // 색상 값을 rgba 형식으로 변환
        const color = this.color;
        const rgbaColor = color === 'blue' ? 'rgba(0, 0, 255, 0.25)' :
                         color === 'red' ? 'rgba(255, 0, 0, 0.25)' :
                         color === 'green' ? 'rgba(0, 255, 0, 0.25)' :
                         color === 'yellow' ? 'rgba(255, 255, 0, 0.25)' :
                         color === 'purple' ? 'rgba(128, 0, 128, 0.25)' :
                         'rgba(255, 255, 255, 0.25)';
        
        gradient.addColorStop(0, rgbaColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            this.x * TILE_SIZE + TILE_SIZE/2,
            this.y * TILE_SIZE + TILE_SIZE/2,
            this.range * TILE_SIZE,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // 범위 테두리
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(
            this.x * TILE_SIZE + TILE_SIZE/2,
            this.y * TILE_SIZE + TILE_SIZE/2,
            this.range * TILE_SIZE,
            0,
            Math.PI * 2
        );
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // 쿨다운 표시
        if (this.cooldown > 0) {
            const cooldownPercentage = this.cooldown / this.maxCooldown;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(
                this.x * TILE_SIZE + 5,
                this.y * TILE_SIZE + 5,
                (TILE_SIZE - 10) * cooldownPercentage,
                TILE_SIZE - 10
            );
        }

        // 특수 능력 쿨다운 표시
        if (this.specialCooldown > 0) {
            const cooldownPercentage = this.specialCooldown / this.special.cooldown;
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(
                this.x * TILE_SIZE + 5,
                this.y * TILE_SIZE + TILE_SIZE - 10,
                (TILE_SIZE - 10) * cooldownPercentage,
                5
            );
        }
    }

    attack(enemies) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        // 범위 내 적 찾기
        const target = enemies.find(enemy => {
            const dx = (enemy.x - this.x) * TILE_SIZE;
            const dy = (enemy.y - this.y) * TILE_SIZE;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= this.range * TILE_SIZE;
        });

        if (target) {
            // 공격 효과음 재생
            playSound('tower_attack');

            // 타워 종류별 공격 효과
            switch(this.type) {
                case 'BASIC':
                    target.health -= this.damage;
                    showDamageNumber(target.x, target.y, this.damage);
                        break;

                case 'ICE':
                    target.health -= this.damage;
                    target.speed *= 0.5;
                    target.freezeDuration = this.freezeDuration;
                    showDamageNumber(target.x, target.y, this.damage);
                        break;

                case 'POISON':
                    target.health -= this.damage;
                    target.poisonDamage = this.poisonDamage;
                    target.poisonDuration = this.poisonDuration;
                    showDamageNumber(target.x, target.y, this.damage);
                        break;

                case 'LASER':
                    target.health -= this.damage;
                    target.continuousDamage = this.continuousDamage;
                    showDamageNumber(target.x, target.y, this.damage);
                break;

                case 'SPLASH':
                    // 범위 내 모든 적에게 데미지
                    enemies.forEach(enemy => {
                        const dx = (enemy.x - this.x) * TILE_SIZE;
                        const dy = (enemy.y - this.y) * TILE_SIZE;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance <= this.splashRadius * TILE_SIZE) {
                            enemy.health -= this.damage;
                            enemy.speed *= (1 - this.slowEffect);
                            showDamageNumber(enemy.x, enemy.y, this.damage);
                        }
                    });
                    break;

                case 'SUPPORT':
                    // 이전에 버프된 타워들의 데미지 복원
                    this.buffedTowers.forEach(tower => {
                        tower.damage = tower.baseDamage * (1 + tower.damageLevel * 0.3);
                    });
                    this.buffedTowers.clear();

                    // 주변 타워 강화
                    towers.forEach(tower => {
                        if (tower !== this) {
                            const dx = (tower.x - this.x) * TILE_SIZE;
                            const dy = (tower.y - this.y) * TILE_SIZE;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance <= this.buffRange * TILE_SIZE) {
                                // 기본 데미지에 버프 적용
                                const baseDamage = tower.baseDamage * (1 + tower.damageLevel * 0.3);
                                tower.damage = baseDamage * this.buffMultiplier;
                                this.buffedTowers.add(tower);
        }
    }
                    });
                    break;
            }

            this.cooldown = this.maxCooldown;
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
            playSound('bossSpawn');
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
                playSound('enemy_death');
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
    if (!countdown) {
        console.error('카운트다운 요소를 찾을 수 없습니다.');
        isCountdownActive = false;
        startWave();
        return;
    }
    
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
        document.getElementById('waveStartButton').style.display = 'block';
        
        // 게임 시작 시 배경음악 재생
        if (musicEnabled) {
            sounds.bgm.loop = true;
            sounds.bgm.play().catch(error => console.log('BGM 재생 실패:', error));
        }
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
    playSound('powerup');
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
    const elements = {
        'infoGold': `골드: ${gameState.gold}`,
        'infoLives': `생명: ${gameState.lives}`,
        'infoWave': `웨이브: ${gameState.wave}`,
        'infoScore': `점수: ${gameState.score}`
    };

    for (const [id, text] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
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
    // 기존 팝업이 있다면 제거
    const existingPopup = document.getElementById('rewardPopup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // 새로운 팝업 생성
    const popup = document.createElement('div');
    popup.id = 'rewardPopup';
    popup.className = 'reward-popup';
    
    // 팝업 내용 설정
    popup.innerHTML = `
        <div class="reward-content">
            <h3>웨이브 완료!</h3>
            <p>보상: <span class="gold-amount">${amount}</span> 골드</p>
        </div>
    `;
    
    // 팝업을 body에 추가
    document.body.appendChild(popup);
    
    // 3초 후 팝업 제거
    setTimeout(() => {
        popup.remove();
    }, 3000);
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
        playSound('powerup');
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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

    // 좌표가 유효한 범위 내에 있는지 확인
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return;

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
            playSound('powerup');
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

function getSpecialDescription(type) {
    switch(type) {
        case 'ICE':
            return '범위 내 모든 적을 5초 동안 얼립니다.';
        case 'POISON':
            return '적에게 지속적인 독 데미지를 줍니다.';
        case 'SUPPORT':
            return '주변 타워의 공격력을 20% 증가시킵니다.';
        case 'BASIC':
            return '기본적인 공격력과 범위를 가진 타워입니다.';
        case 'SNIPER':
            return '관통 공격이 가능한 타워입니다.';
        case 'SPLASH':
            return '범위 공격과 감속 효과를 가진 타워입니다.';
        case 'LASER':
            return '지속적인 데미지를 주는 타워입니다.';
        default:
            return '특수 능력이 없습니다.';
    }
}

// CSS 스타일 추가
document.head.insertAdjacentHTML('beforeend', `
    <style>
        /* 타워 설치 메뉴 스타일 */
        .tower-build-menu {
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #4CAF50;
            border-radius: 10px;
            padding: 15px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
            width: 90%;
            max-width: 300px;
            max-height: 90vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%);
        }

        .tower-build-header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #4CAF50;
        }

        .tower-build-header h2 {
            margin: 0;
            color: #4CAF50;
            font-size: clamp(1.2rem, 4vw, 1.5rem);
        }

        .tower-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }

        .tower-card {
            background: rgba(76, 175, 80, 0.1);
            border-radius: 8px;
            padding: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            min-height: 120px;
        }

        .tower-card:hover {
            background: rgba(76, 175, 80, 0.2);
            transform: translateY(-2px);
        }

        .tower-card.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .tower-cost {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.7);
            padding: 4px 8px;
            font-size: clamp(0.8rem, 3vw, 0.9rem);
            color: gold;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .tower-card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 30px; /* 골드 표시 아래로 여백 추가 */
            margin-bottom: 8px;
        }

        .tower-icon {
            width: 32px;
            height: 32px;
            background: #4CAF50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2em;
            flex-shrink: 0;
        }

        .tower-name {
            font-weight: bold;
            color: #4CAF50;
            font-size: clamp(0.9rem, 3.5vw, 1rem);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tower-stats {
            font-size: clamp(0.7rem, 2.5vw, 0.8rem);
            color: #ccc;
            margin-top: 8px;
        }

        .tower-stat {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }

        .tower-stat-label {
            color: #888;
        }

        .tower-stat-value {
            color: #4CAF50;
            font-weight: bold;
        }

        .tower-description {
            font-size: clamp(0.7rem, 2.5vw, 0.8rem);
            color: #888;
            margin-top: 8px;
            line-height: 1.4;
        }

        .tower-range-preview {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.3;
            transition: all 0.3s ease;
            z-index: 999;
    }

        /* 모바일 터치 최적화 */
        @media (hover: none) {
            .tower-card:active:not(.disabled) {
                background: rgba(76, 175, 80, 0.2);
                transform: translateY(-2px);
            }
        }

        /* 스크롤바 스타일링 */
        .tower-build-menu::-webkit-scrollbar {
            width: 8px;
    }

        .tower-build-menu::-webkit-scrollbar-track {
            background: rgba(76, 175, 80, 0.1);
            border-radius: 4px;
        }

        .tower-build-menu::-webkit-scrollbar-thumb {
            background: #4CAF50;
            border-radius: 4px;
        }

        .tower-build-menu::-webkit-scrollbar-thumb:hover {
            background: #45a049;
        }

        /* 그리드 하이라이트 스타일 */
        .grid-highlight {
            position: absolute;
            background: rgba(76, 175, 80, 0.2);
            border: 2px solid #4CAF50;
            border-radius: 4px;
            pointer-events: none;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0.5; }
        }
    </style>
`);

// 타워 설치 메뉴 표시 함수 수정
function showTowerBuildMenu(x, y, clientX, clientY) {
    if (gameState.towerCount >= gameState.maxTowers) {
        showSaveLoadNotification('타워 설치 한도에 도달했습니다!');
        return;
    }
    
    const existingMenu = document.querySelector('.tower-build-menu');
    if (existingMenu && existingMenu.parentNode) {
        existingMenu.parentNode.removeChild(existingMenu);
    }

    const towerMenu = document.createElement('div');
    towerMenu.className = 'tower-build-menu';

    const header = document.createElement('div');
    header.className = 'tower-build-header';
    header.innerHTML = `
        <h2>타워 설치</h2>
        <p>골드: ${gameState.gold}</p>
    `;
    towerMenu.appendChild(header);

    const towerList = document.createElement('div');
    towerList.className = 'tower-list';

    Object.entries(TOWER_TYPES).forEach(([type, tower]) => {
        const card = document.createElement('div');
        card.className = `tower-card ${gameState.gold < tower.cost ? 'disabled' : ''}`;
        
        card.innerHTML = `
            <div class="tower-card-header">
                <div class="tower-icon" style="background: ${tower.color}">${type[0]}</div>
                <div class="tower-name">${tower.name}</div>
            </div>
            <div class="tower-cost">${tower.cost} 골드</div>
            <div class="tower-stats">
                <div class="tower-stat">
                    <span class="tower-stat-label">공격력</span>
                    <span class="tower-stat-value">${tower.damage}</span>
                </div>
                <div class="tower-stat">
                    <span class="tower-stat-label">범위</span>
                    <span class="tower-stat-value">${tower.range}</span>
                </div>
                <div class="tower-stat">
                    <span class="tower-stat-label">쿨다운</span>
                    <span class="tower-stat-value">${(tower.cooldown/60).toFixed(2)}초</span>
                </div>
            </div>
            <div class="tower-description">${getSpecialDescription(type)}</div>
        `;

            if (gameState.gold >= tower.cost) {
            card.onmouseover = () => showTowerRangePreview(x, y, tower.range, type);
            card.onmouseout = hideTowerRangePreview;
            
            card.onclick = () => {
                towers.push(new Tower(x, y, type));
                gameState.gold -= tower.cost;
                gameState.towerCount++;
                updateTowerLimit();
                playSound('tower_place');
                if (towerMenu.parentNode) {
                    towerMenu.parentNode.removeChild(towerMenu);
                }
                const highlight = document.querySelector('.grid-highlight');
                if (highlight) highlight.remove();
            };
        }
        
        towerList.appendChild(card);
    });

    towerMenu.appendChild(towerList);
    document.body.appendChild(towerMenu);
    setupMenuCloseHandler(towerMenu);
}

// 타워 업그레이드 메뉴 표시 함수 수정
function showTowerUpgradeMenu(tower, clientX, clientY) {
    const existingMenu = document.querySelector('.tower-menu');
    if (existingMenu && existingMenu.parentNode) {
        existingMenu.parentNode.removeChild(existingMenu);
    }

    const towerMenu = document.createElement('div');
    towerMenu.className = 'tower-menu';
    
    // 메뉴 위치 조정
    const menuWidth = 300;
    const menuHeight = 400;
    let menuX = clientX;
    let menuY = clientY;
    
    // 화면 경계 체크
    if (menuX + menuWidth > window.innerWidth) {
        menuX = window.innerWidth - menuWidth;
    }
    if (menuY + menuHeight > window.innerHeight) {
        menuY = window.innerHeight - menuHeight;
    }
    
    towerMenu.style.left = `${menuX}px`;
    towerMenu.style.top = `${menuY}px`;

    // 타워 헤더
    const header = document.createElement('div');
    header.className = 'tower-header';
    header.innerHTML = `
        <div class="tower-title">
            <h3>${TOWER_TYPES[tower.type].name}</h3>
            <span class="tower-level">Lv.${tower.level}</span>
        </div>
        <div class="tower-stats">
            <div class="stat-item">
                <span class="stat-icon">🎯</span>
                <span class="stat-value">${tower.range.toFixed(2)}</span>
                <span class="stat-level">(${tower.rangeLevel}/${tower.level})</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">⚔️</span>
                <span class="stat-value">${tower.damage.toFixed(2)}</span>
                <span class="stat-level">(${tower.damageLevel}/${tower.level})</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">⚡</span>
                <span class="stat-value">${(60/tower.maxCooldown).toFixed(2)}/초</span>
                <span class="stat-level">(${tower.speedLevel}/${tower.level})</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">🎯</span>
                <span class="stat-value">${tower.bulletCount}발</span>
                <span class="stat-level">(${tower.bulletLevel}/${tower.level})</span>
            </div>
        </div>
    `;
    towerMenu.appendChild(header);

    // 업그레이드 섹션
    const upgradeSection = document.createElement('div');
    upgradeSection.className = 'upgrade-section';
    
    const upgradeTypes = [
        { type: 'range', name: '사거리', icon: '🎯', description: '공격 범위 증가' },
        { type: 'damage', name: '데미지', icon: '⚔️', description: '공격력 증가' },
        { type: 'speed', name: '공격속도', icon: '⚡', description: '공격 속도 증가' },
        { type: 'bullet', name: '발사체', icon: '🎯', description: '동시 발사 수 증가' }
    ];

    upgradeTypes.forEach(({ type, name, icon, description }) => {
        const upgradeItem = document.createElement('div');
        upgradeItem.className = 'upgrade-item';
        
        const cost = tower.getUpgradeCost(type);
        const canUpgrade = tower.canUpgrade(type);
        
        upgradeItem.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-header">
                    <span class="upgrade-icon">${icon}</span>
                    <span class="upgrade-name">${name}</span>
                </div>
                <div class="upgrade-description">${description}</div>
                <div class="upgrade-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(tower[`${type}Level`] / tower.level) * 100}%"></div>
                    </div>
                    <span class="progress-text">${tower[`${type}Level`]}/${tower.level}</span>
                </div>
            </div>
            <button class="upgrade-button" ${!canUpgrade || gameState.gold < cost ? 'disabled' : ''}>
                ${cost} 골드
            </button>
        `;
        
        const upgradeButton = upgradeItem.querySelector('.upgrade-button');
        if (!canUpgrade) {
            upgradeButton.title = '타워 레벨을 올려야 더 업그레이드할 수 있습니다.';
        }
        
        upgradeButton.onclick = () => {
            if (tower.upgrade(type)) {
                showTowerUpgradeMenu(tower, clientX, clientY);
            }
        };
        
        upgradeSection.appendChild(upgradeItem);
    });
    
    towerMenu.appendChild(upgradeSection);

    // 판매 버튼
    const sellSection = document.createElement('div');
    sellSection.className = 'sell-section';
    const sellValue = tower.getSellValue();
    sellSection.innerHTML = `
        <button class="sell-button">
            <span class="sell-icon">💰</span>
            <span class="sell-text">판매</span>
            <span class="sell-value">${sellValue} 골드</span>
        </button>
    `;
    
    sellSection.querySelector('.sell-button').onclick = () => {
        gameState.gold += sellValue;
        towers = towers.filter(t => t !== tower);
        if (towerMenu.parentNode) {
            towerMenu.parentNode.removeChild(towerMenu);
        }
    };

    towerMenu.appendChild(sellSection);
    document.body.appendChild(towerMenu);
    setupMenuCloseHandler(towerMenu);
}

// 게임 시작 시 로딩 화면
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        updateTowerLimit();
        document.getElementById('waveStartButton').style.display = 'none';
        
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
    
    // 크리티컬 데미지 체크 (기본 데미지의 1.5배 이상일 때)
    const isCritical = damage >= 15;
    if (isCritical) {
        damageElement.classList.add('critical');
    }
    
    damageElement.textContent = Math.floor(damage);
    
    // 적의 현재 위치에 데미지 숫자를 표시
    const enemy = enemies.find(e => e.x === x && e.y === y);
    if (enemy) {
        const updatePosition = () => {
            damageElement.style.left = `${enemy.x * TILE_SIZE + TILE_SIZE/2}px`;
            damageElement.style.top = `${enemy.y * TILE_SIZE}px`;
        };
        
        // 초기 위치 설정
        updatePosition();
        
        // 애니메이션 중에 위치 업데이트
        const animationFrame = requestAnimationFrame(function animate() {
            updatePosition();
            if (damageElement.parentElement) {
                requestAnimationFrame(animate);
            }
        });
        
        document.querySelector('.game-area').appendChild(damageElement);
        
        // 1초 후에 요소 제거
        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            damageElement.remove();
        }, isCritical ? 1200 : 1000);
    }
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
    effect.innerHTML = `
        <div class="special-name">${name}</div>
        <div class="special-animation"></div>
    `;
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

// 미니맵 그리기 함수
function drawMinimap() {
    const minimapCanvas = document.getElementById('minimapCanvas');
    if (!minimapCanvas) return;
    
    const minimapCtx = minimapCanvas.getContext('2d');
    const minimapWidth = minimapCanvas.width;
    const minimapHeight = minimapCanvas.height;
    
    // 미니맵 배경 지우기
    minimapCtx.clearRect(0, 0, minimapWidth, minimapHeight);
    
    // 미니맵 배경색 설정
    minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    minimapCtx.fillRect(0, 0, minimapWidth, minimapHeight);
    
    // 경로 그리기
    minimapCtx.strokeStyle = '#4CAF50';
    minimapCtx.lineWidth = 3;
    minimapCtx.beginPath();
    
    const scaleX = minimapWidth / GRID_WIDTH;
    const scaleY = minimapHeight / GRID_HEIGHT;
    
    if (currentMap && currentMap.path) {
        currentMap.path.forEach((point, index) => {
            const x = point.x * scaleX;
            const y = point.y * scaleY;
            
            if (index === 0) {
                minimapCtx.moveTo(x, y);
            } else {
                minimapCtx.lineTo(x, y);
            }
        });
        
        minimapCtx.stroke();
        
        // 타워 표시
        towers.forEach(tower => {
            const x = tower.x * scaleX;
            const y = tower.y * scaleY;
            
            minimapCtx.fillStyle = tower.color;
            minimapCtx.beginPath();
            minimapCtx.arc(x, y, 3, 0, Math.PI * 2);
            minimapCtx.fill();
        });
        
        // 적 표시
        enemies.forEach(enemy => {
            const x = enemy.x * scaleX;
            const y = enemy.y * scaleY;
            
            minimapCtx.fillStyle = enemy.isBoss ? enemy.color : '#FF4444';
            minimapCtx.beginPath();
            minimapCtx.arc(x, y, 2, 0, Math.PI * 2);
            minimapCtx.fill();
        });

        // 시작점과 끝점 표시
        if (currentMap.path.length > 0) {
            // 시작점
            const start = currentMap.path[0];
            minimapCtx.fillStyle = '#4CAF50';
            minimapCtx.beginPath();
            minimapCtx.arc(start.x * scaleX, start.y * scaleY, 4, 0, Math.PI * 2);
            minimapCtx.fill();

            // 끝점
            const end = currentMap.path[currentMap.path.length - 1];
            minimapCtx.fillStyle = '#FF0000';
            minimapCtx.beginPath();
            minimapCtx.arc(end.x * scaleX, end.y * scaleY, 4, 0, Math.PI * 2);
            minimapCtx.fill();
        }
    }
}

// 타워 조합 체크 함수
// 이미 표시된 조합을 추적하는 전역 배열 추가
let shownCombos = [];

function checkTowerCombos() {
    Object.entries(TOWER_COMBOS).forEach(([comboKey, combo]) => {
        // 조합 조건을 만족하는지 확인
        const hasCombo = combo.condition ? combo.condition(towers) : true;
        
        if (hasCombo) {
            // 조합 효과 적용
            combo.effect(towers);
            
            // 조합 이펙트 표시 (이미 표시되지 않은 경우에만)
            if (!shownCombos.includes(comboKey)) {
                towers.forEach(tower => {
                    if (!tower.activeCombos) tower.activeCombos = [];
                    tower.activeCombos.push(comboKey);
                });
                showComboEffect(combo.name);
                shownCombos.push(comboKey);
            }
        } else {
            // 조합이 해제된 경우
            towers.forEach(tower => {
                if (tower.activeCombos) {
                    const index = tower.activeCombos.indexOf(comboKey);
                    if (index > -1) {
                        tower.activeCombos.splice(index, 1);
                    }
                }
            });
            // 조합이 해제되면 shownCombos에서도 제거
            const shownIdx = shownCombos.indexOf(comboKey);
            if (shownIdx > -1) {
                shownCombos.splice(shownIdx, 1);
            }
        }
    });
}

// 조합 이펙트 표시 함수
function showComboEffect(comboName) {
    const effect = document.createElement('div');
    effect.className = 'combo-effect';
    effect.innerHTML = `
        <h3>타워 조합 발견!</h3>
        <p>${comboName}</p>
    `;
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 3000);
}

// 게임 시작
gameLoop(); 

// 게임 통계 업데이트 함수
function updateStats() {
    // 통계 요소 업데이트
    document.getElementById('enemiesKilled').textContent = `처치한 적: ${gameStats.enemiesKilled}`;
    document.getElementById('bossesKilled').textContent = `처치한 보스: ${gameStats.bossesKilled}`;
    document.getElementById('totalGold').textContent = `총 획득 골드: ${gameStats.totalGold}`;
    document.getElementById('highestWave').textContent = `최고 웨이브: ${gameStats.highestWave}`;
    
    // 업적 업데이트
    Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
        const achievementElement = document.getElementById(`achievement-${key}`);
        if (achievementElement) {
            achievementElement.className = achievement.unlocked ? 'achievement unlocked' : 'achievement';
        }
    });
    
    // 이벤트 트리거 업데이트
    const eventsList = document.getElementById('eventsList');
    if (eventsList) {
        eventsList.innerHTML = gameStats.eventsTriggered
            .map(event => `<li>${SPECIAL_EVENTS[event].name}</li>`)
            .join('');
    }
}

// CSS 스타일 추가
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .combo-effect {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: gold;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        }

        .achievement {
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }

        .achievement.unlocked {
            opacity: 1;
            color: gold;
        }

        #eventsList {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        #eventsList li {
            padding: 5px 0;
            border-bottom: 1px solid #ccc;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
    </style>
`);

// 보스 패턴 정의
const BOSS_PATTERNS = {
    TANK: {
        name: '방어막',
        cooldown: 300,
        effect: (boss) => {
            boss.isInvincible = true;
            boss.defense = 50;
            setTimeout(() => {
                boss.isInvincible = false;
                boss.defense = 0;
            }, 5000);
        }
    },
    SPEED: {
        name: '돌진',
        cooldown: 200,
        effect: (boss) => {
            const currentIndex = boss.pathIndex;
            if (currentIndex + 3 < currentMap.path.length) {
                boss.x = currentMap.path[currentIndex + 3].x;
                boss.y = currentMap.path[currentIndex + 3].y;
                boss.pathIndex += 3;
            }
        }
    },
    SUMMONER: {
        name: '소환',
        cooldown: 400,
        effect: (boss) => {
            for (let i = 0; i < 3; i++) {
                const enemy = new Enemy(gameState.wave);
                enemy.x = boss.x;
                enemy.y = boss.y;
                enemy.health = 50;
                enemy.maxHealth = 50;
                enemy.speed = 0.03;
                enemies.push(enemy);
            }
        }
    }
};

// CSS 스타일 추가
document.head.insertAdjacentHTML('beforeend', `
    <style>
        /* 게임 컨테이너 스타일 */
        .game-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            background: #1a1a1a;
            min-height: 100vh;
        }

        /* 게임 영역 스타일 */
        .game-area {
            position: relative;
            background: #2a2a2a;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        /* 정보 바 스타일 */
        .info-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            padding: 15px;
            background: #2a2a2a;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: #333;
            border-radius: 8px;
            color: #fff;
        }

        .info-icon {
            font-size: 1.5em;
            color: #4CAF50;
        }

        /* 컨트롤 버튼 스타일 */
        .control-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 15px;
        }

        .control-button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            background: #4CAF50;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .control-button:hover {
            background: #45a049;
            transform: translateY(-2px);
        }

        /* 미니맵 스타일 */
        .minimap-container {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        #minimapCanvas {
            border: 2px solid #4CAF50;
            border-radius: 4px;
        }

        /* 웨이브 진행 바 스타일 */
        .wave-progress {
            width: 100%;
            height: 20px;
            background: #333;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 15px;
        }

        .wave-progress .fill {
            height: 100%;
            background: #4CAF50;
            transition: width 0.3s ease;
        }

        /* 알림 메시지 스타일 */
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from { transform: translate(-50%, -100%); }
            to { transform: translate(-50%, 0); }
        }

        /* 타워 메뉴 스타일 */
        .tower-menu {
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #4CAF50;
            border-radius: 10px;
            padding: 20px;
            color: white;
            z-index: 1000;
            min-width: 300px;
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
        }

        .tower-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #4CAF50;
        }

        .tower-menu-title {
            font-size: 1.2em;
            color: #4CAF50;
            font-weight: bold;
        }

        /* 업그레이드 버튼 스타일 */
        .upgrade-button {
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .upgrade-button:hover:not(:disabled) {
            background: #45a049;
        }

        .upgrade-button:disabled {
            background: #666;
            cursor: not-allowed;
        }

        /* 모바일 최적화 */
        @media (max-width: 768px) {
            .game-container {
                padding: 10px;
            }

            .info-bar {
                grid-template-columns: repeat(2, 1fr);
            }

            .control-buttons {
                flex-wrap: wrap;
            }

            .control-button {
                flex: 1 1 calc(50% - 10px);
            }

            .minimap-container {
                position: relative;
                top: 0;
                right: 0;
                margin-top: 15px;
            }
        }
    </style>
`);

// CSS 스타일 추가
document.head.insertAdjacentHTML('beforeend', `
    <style>
        /* 카운트다운 스타일 */
        .countdown {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 72px;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 1000;
        }

        /* 기존 스타일 */
        .combo-effect {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: gold;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        }

        .achievement {
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }

        .achievement.unlocked {
            opacity: 1;
            color: gold;
        }

        #eventsList {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        #eventsList li {
            padding: 5px 0;
            border-bottom: 1px solid #ccc;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
    </style>
`);

// 음향 설정 버튼 이벤트 리스너
document.getElementById('soundToggleBtn').addEventListener('click', function() {
    toggleSound();
    this.classList.toggle('muted');
    this.textContent = soundEnabled ? '🔊 효과음' : '🔇 효과음';
});

document.getElementById('musicToggleBtn').addEventListener('click', function() {
    toggleMusic();
    this.classList.toggle('muted');
    this.textContent = musicEnabled ? '🎵 배경음악' : '🎵 배경음악';
});

document.head.insertAdjacentHTML('beforeend', `
    <style>
        /* 미니맵 컨테이너 스타일 수정 */
        .minimap-container {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 170px;
        }

        #minimapCanvas {
            border: 2px solid #4CAF50;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.5);
            width: 150px;
            height: 150px;
        }

        /* 게임 설정 스타일 */
        .game-settings {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
        }

        .settings-row {
            display: flex;
            gap: 8px;
        }

        .setting-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .setting-item label {
            color: #4CAF50;
            font-size: 12px;
            font-weight: bold;
        }

        .setting-item select {
            padding: 4px;
            border-radius: 4px;
            border: 1px solid #4CAF50;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .setting-item select:hover {
            background: rgba(0, 0, 0, 0.9);
            border-color: #45a049;
        }

        .setting-item select:focus {
            outline: none;
            border-color: #45a049;
            box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
        }

        /* 다음 웨이브 버튼 스타일 */
        .wave-start-button {
            padding: 8px;
            background: linear-gradient(to bottom, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .wave-start-button:hover {
            background: linear-gradient(to bottom, #45a049, #3d8b40);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .wave-start-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
        }

        /* 사운드 컨트롤 스타일 */
        .sound-controls {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 4px;
            padding-top: 6px;
            border-top: 1px solid rgba(76, 175, 80, 0.3);
        }

        .sound-button {
            display: flex;
            align-items: center;
            padding: 6px 8px;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid #4CAF50;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }

        .sound-button:hover {
            background: rgba(0, 0, 0, 0.8);
            border-color: #45a049;
        }

        .sound-icon {
            font-size: 14px;
            margin-right: 6px;
            width: 20px;
            text-align: center;
        }

        .sound-label {
            flex-grow: 1;
            font-size: 12px;
            font-weight: bold;
        }

        .sound-status {
            font-size: 10px;
            padding: 1px 4px;
            background: rgba(76, 175, 80, 0.2);
            border-radius: 3px;
            color: #4CAF50;
        }

        .sound-button.muted .sound-status {
            background: rgba(255, 0, 0, 0.2);
            color: #ff4444;
        }

        .sound-button.muted .sound-status::after {
            content: "꺼짐";
        }

        .sound-button:not(.muted) .sound-status::after {
            content: "켜짐";
        }

        /* 모바일 최적화 */
        @media (max-width: 768px) {
            .minimap-container {
                position: relative;
                top: 0;
                right: 0;
                margin: 10px auto;
                width: 90%;
                max-width: 170px;
            }

            .settings-row {
                flex-direction: column;
                gap: 6px;
            }

            .setting-item {
                width: 100%;
            }

            .sound-button {
                padding: 4px 6px;
            }

            .sound-icon {
                font-size: 12px;
                margin-right: 4px;
            }

            .sound-label {
                font-size: 10px;
            }

            .sound-status {
                font-size: 8px;
                padding: 1px 3px;
            }
        }
    </style>
`);

// 초기 상태 설정
window.addEventListener('load', () => {
    const soundBtn = document.getElementById('soundToggleBtn');
    const musicBtn = document.getElementById('musicToggleBtn');
    
    soundBtn.classList.toggle('muted', !soundEnabled);
    musicBtn.classList.toggle('muted', !musicEnabled);
});

document.head.insertAdjacentHTML('beforeend', `
    <style>
        /* 기존 스타일 유지 */
        // ... existing code ...

        /* 게임 컨트롤 스타일 */
        .game-controls {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 4px;
            padding-top: 6px;
            border-top: 1px solid rgba(76, 175, 80, 0.3);
        }

        .control-button {
            padding: 4px 6px;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid #4CAF50;
            border-radius: 4px;
            color: white;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            text-align: center;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .control-button:hover {
            background: rgba(0, 0, 0, 0.8);
            border-color: #45a049;
            transform: translateY(-1px);
        }

        .control-button:active {
            transform: translateY(0);
        }

        #startBtn {
            background: linear-gradient(to bottom, #4CAF50, #45a049);
            border: none;
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        #startBtn:hover {
            background: linear-gradient(to bottom, #45a049, #3d8b40);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        #pauseBtn {
            background: linear-gradient(to bottom, #ff9800, #f57c00);
            border: none;
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        #pauseBtn:hover {
            background: linear-gradient(to bottom, #f57c00, #ef6c00);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        /* 다음 웨이브 버튼 스타일 수정 */
        .wave-start-button {
            padding: 0 8px;
            background: linear-gradient(to bottom, #2196F3, #1976D2);
            border: none;
            color: white;
            font-size: 12px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            text-align: center;
        }

        .wave-start-button:hover {
            background: linear-gradient(to bottom, #1976D2, #1565C0);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transform: translateY(-1px);
        }

        .wave-start-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
        }

        /* 모바일 최적화 */
        @media (max-width: 768px) {
            // ... existing code ...

            .control-button {
                padding: 3px 5px;
                font-size: 10px;
                height: 22px;
            }

            .wave-start-button {
                padding: 0 6px;
                font-size: 11px;
                height: 26px;
            }
        }
    </style>
`);
