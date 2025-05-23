// 게임 상태
let score = 0;
let gameOver = false;
let soundEnabled = true;

// Three.js 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 배경 설정
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.1
});

const starsVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 플레이어 우주선 생성
function createPlayerShip() {
    const geometry = new THREE.ConeGeometry(0.5, 2, 8);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.2,
        shininess: 100
    });
    const ship = new THREE.Mesh(geometry, material);
    ship.rotation.x = Math.PI / 2;
    ship.position.z = 5;
    return ship;
}

const player = createPlayerShip();
scene.add(player);

// 총알 배열
const bullets = [];

// 적 배열
const enemies = [];

// 총알 생성 함수
function createBullet() {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5
    });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(player.position);
    bullet.position.z -= 1;
    scene.add(bullet);
    bullets.push(bullet);

    // 총알 발사 효과
    const light = new THREE.PointLight(0x00ffff, 1, 3);
    light.position.copy(bullet.position);
    scene.add(light);
    setTimeout(() => scene.remove(light), 100);
}

// 적 생성 함수
function createEnemy() {
    const geometry = new THREE.OctahedronGeometry(0.8);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.2,
        shininess: 100
    });
    const enemy = new THREE.Mesh(geometry, material);
    enemy.position.x = (Math.random() - 0.5) * 10;
    enemy.position.y = (Math.random() - 0.5) * 10;
    enemy.position.z = -20;
    scene.add(enemy);
    enemies.push(enemy);
}

// 충돌 감지 함수
function checkCollision(obj1, obj2) {
    const distance = obj1.position.distanceTo(obj2.position);
    return distance < 1;
}

// 폭발 효과 생성
function createExplosion(position) {
    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        scene.add(particle);
        particles.push(particle);
    }

    // 1초 후 파티클 제거
    setTimeout(() => {
        particles.forEach(particle => scene.remove(particle));
    }, 1000);

    return particles;
}

// 키보드 입력 처리
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && !gameOver) {
        createBullet();
    }
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 창 크기 조절 처리
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 게임 업데이트
function updateGame() {
    if (gameOver) return;

    // 플레이어 이동
    if (keys['ArrowLeft']) player.position.x -= 0.1;
    if (keys['ArrowRight']) player.position.x += 0.1;
    if (keys['ArrowUp']) player.position.y += 0.1;
    if (keys['ArrowDown']) player.position.y -= 0.1;

    // 플레이어 회전 효과
    player.rotation.z = (keys['ArrowLeft'] ? 0.1 : 0) + (keys['ArrowRight'] ? -0.1 : 0);
    player.rotation.x = (keys['ArrowUp'] ? -0.1 : 0) + (keys['ArrowDown'] ? 0.1 : 0);

    // 총알 업데이트
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.position.z -= 0.5;

        // 화면 밖으로 나간 총알 제거
        if (bullet.position.z < -50) {
            scene.remove(bullet);
            bullets.splice(i, 1);
        }
    }

    // 적 업데이트
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.position.z += 0.1;
        enemy.rotation.x += 0.01;
        enemy.rotation.y += 0.01;

        // 플레이어와 적 충돌 체크
        if (checkCollision(player, enemy)) {
            gameOver = true;
            createExplosion(player.position);
            document.getElementById('score').innerHTML = `Game Over! Final Score: ${score}`;
            return;
        }

        // 총알과 적 충돌 체크
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[j], enemy)) {
                createExplosion(enemy.position);
                scene.remove(enemy);
                scene.remove(bullets[j]);
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                document.getElementById('score').innerHTML = `Score: ${score}`;
                break;
            }
        }

        // 화면 밖으로 나간 적 제거
        if (enemy.position.z > 10) {
            scene.remove(enemy);
            enemies.splice(i, 1);
        }
    }

    // 배경 회전
    stars.rotation.y += 0.0001;
}

// 적 생성 타이머
setInterval(() => {
    if (!gameOver) {
        createEnemy();
    }
}, 2000);

// 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    updateGame();
    renderer.render(scene, camera);
}

// 게임 시작
animate(); 