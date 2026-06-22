import { Input } from './Input.js';
import { Renderer } from './Renderer.js';
import { Level1 } from '../levels/Level1.js';
import { Level2 } from '../levels/Level2.js';
import { Level3 } from '../levels/Level3.js';

/**
 * 游戏主引擎 - 管理游戏循环和状态
 */
export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.input = new Input();

        this.isRunning = false;
        this.isPaused = false;
        this.lastTime = 0;

        this.level = null;
        this.player = null;
        this.entities = [];
        this.particles = [];

        this.cameraX = 0;
        this.levelWidth = 0;
        this.currentLevelNum = 1;
        this.totalLevels = 3;

        this.lives = 3;
        this.coins = 0;
        this.score = 0;

        this.state = 'start'; // start, playing, paused, gameover, levelcomplete, gamecomplete
        this.frameCount = 0;

        this.bindUI();
    }

    bindUI() {
        // 开始按钮
        document.getElementById('start-button').addEventListener('click', () => {
            this.start();
        });

        // 重新开始按钮
        document.getElementById('restart-button').addEventListener('click', () => {
            this.restart();
        });

        // 下一关按钮
        document.getElementById('next-level-button').addEventListener('click', () => {
            this.nextLevel();
        });

        // 再玩一次按钮
        document.getElementById('play-again-button').addEventListener('click', () => {
            this.restart();
        });
    }

    async init() {
        console.log('Initializing level', this.currentLevelNum);

        // 使用静态导入的关卡类
        const levelClasses = [null, Level1, Level2, Level3];
        const LevelClass = levelClasses[this.currentLevelNum];

        if (!LevelClass) {
            console.error('Level not found:', this.currentLevelNum);
            return;
        }

        this.level = new LevelClass();
        this.levelWidth = this.level.width;

        this.player = this.level.player;
        this.entities = this.level.entities;
        this.cameraX = 0;

        console.log('Level initialized:', this.level);
        this.updateHUD();
    }

    start() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('level-complete-screen').classList.add('hidden');
        document.getElementById('game-complete-screen').classList.add('hidden');

        this.state = 'playing';
        this.isRunning = true;
        this.isPaused = false;  // 重置暂停状态
        this.frameCount = 0;    // 重置帧计数
        this.lastTime = performance.now();

        this.init().then(() => {
            this.gameLoop();
        });
    }

    restart() {
        this.lives = 3;
        this.coins = 0;
        this.score = 0;
        this.currentLevelNum = 1;
        this.input.reset();
        this.start();
    }

    nextLevel() {
        this.currentLevelNum++;
        if (this.currentLevelNum > this.totalLevels) {
            this.showGameComplete();
        } else {
            document.getElementById('level-complete-screen').classList.add('hidden');
            this.start();
        }
    }

    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.state === 'playing' && !this.isPaused) {
            this.update(deltaTime);
            this.render();
            this.frameCount++;
        }

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // 限制deltaTime防止卡顿时出现异常
        const cappedDelta = Math.min(deltaTime, 0.1);

        // 更新玩家
        if (this.player) {
            this.player.update(cappedDelta, this);

            // 检查玩家是否掉出地图
            if (this.player.y > this.canvas.height + 100) {
                this.playerDie();
            }
        }

        // 更新所有实体
        this.entities = this.entities.filter(entity => {
            entity.update(cappedDelta, this);
            return !entity.shouldRemove;
        });

        // 更新粒子效果
        this.particles = this.particles.filter(particle => {
            particle.update(cappedDelta);
            return particle.life > 0;
        });

        // 更新相机
        this.updateCamera();

        // 检查是否到达终点
        if (this.level && this.player) {
            const flagpole = this.level.flagpole;
            if (flagpole && this.player.x >= flagpole.x) {
                this.levelComplete();
            }
        }
    }

    render() {
        // 清空画布
        this.renderer.clear();

        // 设置相机位置
        this.renderer.setCamera(this.cameraX, 0);

        // 绘制背景元素（云朵）
        if (this.level && this.level.clouds) {
            this.level.clouds.forEach(cloud => {
                this.renderer.drawCloud(cloud.x, cloud.y, cloud.scale || 1);
            });
        }

        // 绘制所有实体
        this.entities.forEach(entity => {
            entity.render(this.renderer, this.frameCount);
        });

        // 绘制玩家
        if (this.player && this.player.isAlive) {
            this.player.render(this.renderer, this.frameCount);
        }

        // 绘制旗杆
        if (this.level && this.level.flagpole) {
            const fp = this.level.flagpole;
            this.renderer.drawFlagpole(fp.x, fp.y, fp.height || 400);
        }

        // 绘制粒子
        this.particles.forEach(particle => {
            particle.render(this.renderer);
        });
    }

    updateCamera() {
        if (!this.player) return;

        // 相机跟随玩家，但不能向左移动
        const targetX = this.player.x - this.canvas.width / 3;
        this.cameraX = Math.max(this.cameraX, targetX);
        this.cameraX = Math.min(this.cameraX, this.levelWidth - this.canvas.width);
    }

    playerDie() {
        this.lives--;

        if (this.lives <= 0) {
            this.showGameOver();
        } else {
            // 暂停游戏，1秒后重生
            this.isPaused = true;
            setTimeout(() => {
                this.respawnPlayer();
                this.isPaused = false;
            }, 1000);
        }

        this.updateHUD();
    }

    respawnPlayer() {
        if (this.level) {
            this.player.x = this.level.spawnX;
            this.player.y = this.level.spawnY;
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.isAlive = true;
        }
    }

    levelComplete() {
        this.state = 'levelcomplete';
        this.isPaused = true;

        // 计算得分
        const timeBonus = Math.max(0, 300 - Math.floor(this.frameCount / 60));
        this.score += 1000 + timeBonus * 10;

        setTimeout(() => {
            document.getElementById('level-complete-screen').classList.remove('hidden');
            this.updateHUD();
        }, 1000);
    }

    showGameOver() {
        this.state = 'gameover';
        this.isRunning = false;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over-screen').classList.remove('hidden');
    }

    showGameComplete() {
        this.state = 'gamecomplete';
        this.isRunning = false;
        document.getElementById('total-score').textContent = this.score;
        document.getElementById('game-complete-screen').classList.remove('hidden');
    }

    addCoin() {
        this.coins++;
        this.score += 100;

        // 每100金币奖励一条命
        if (this.coins >= 100) {
            this.coins = 0;
            this.lives++;
        }

        this.updateHUD();
    }

    addScore(points) {
        this.score += points;
        this.updateHUD();
    }

    updateHUD() {
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('coins').textContent = this.coins;
        document.getElementById('level').textContent = this.currentLevelNum;
    }

    addParticle(particle) {
        this.particles.push(particle);
    }

    removeEntity(entity) {
        entity.shouldRemove = true;
    }

    // 移除 get canvas getter，改用构造函数初始化
}