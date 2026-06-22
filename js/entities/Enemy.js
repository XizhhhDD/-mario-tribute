import { Entity } from './Entity.js';
import { Physics } from '../engine/Physics.js';

/**
 * 敌人类 - Goomba（板栗仔）等
 */
export class Enemy extends Entity {
    constructor(x, y, type = 'goomba') {
        super(x, y, 32, 32);
        this.type = 'enemy';
        this.enemyType = type;
        this.moveSpeed = 80;
        this.vx = this.moveSpeed;
        this.vy = 0;
        this.isAlive = true;
        this.direction = 1; // 1 = right, -1 = left
        this.squashTimer = 0;
    }

    update(deltaTime, game) {
        if (!this.isAlive) {
            if (this.squashTimer > 0) {
                this.squashTimer -= deltaTime;
                if (this.squashTimer <= 0) {
                    this.shouldRemove = true;
                }
            }
            return;
        }

        // 应用重力
        Physics.applyGravity(this, deltaTime);

        // 获取平台列表
        const platforms = game.entities.filter(e => e.type === 'platform');

        // 水平移动
        this.x += this.vx * deltaTime;

        // 水平碰撞检测
        this.handleHorizontalCollisions(platforms);

        // 垂直移动
        this.y += this.vy * deltaTime;

        // 垂直碰撞检测
        this.handleVerticalCollisions(platforms);

        // 边界检测
        this.handleBounds(game);

        // 检测与玩家碰撞
        if (game.player && game.player.isAlive && !game.player.isInvincible) {
            if (Physics.checkEnemyCollision(game.player, this)) {
                if (Physics.isStomp(game.player, this)) {
                    this.stomp(game);
                } else {
                    game.player.takeDamage(game);
                }
            }
        }
    }

    handleHorizontalCollisions(platforms) {
        const bounds = this.getBounds();

        for (const platform of platforms) {
            if (platform.blockType !== 'pit' && Physics.checkAABB(bounds, platform)) {
                const info = Physics.getCollisionInfo(bounds, platform);

                if (info.direction === 'left' || info.direction === 'right') {
                    // 碰到障碍物，转向
                    this.direction *= -1;
                    this.vx = this.moveSpeed * this.direction;
                    // 修正位置
                    if (info.direction === 'left') {
                        this.x = platform.x - this.width;
                    } else {
                        this.x = platform.x + platform.width;
                    }
                    return;
                }
            }
        }
    }

    handleVerticalCollisions(platforms) {
        const bounds = this.getBounds();
        let onGround = false;

        for (const platform of platforms) {
            if (platform.blockType !== 'pit' && Physics.checkAABB(bounds, platform)) {
                const info = Physics.getCollisionInfo(bounds, platform);

                if (info.direction === 'bottom') {
                    // 站在地上
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    onGround = true;
                }
            }
        }

        return onGround;
    }

    handleBounds(game) {
        // 简单边界检测
        if (this.x < -100) {
            this.shouldRemove = true;
        }
    }

    stomp(game) {
        this.isAlive = false;
        this.squashTimer = 0.3; // 0.3秒后消失
        game.addScore(100);
        game.player.vy = -200; // 玩家弹跳

        // 添加粒子效果
        for (let i = 0; i < 5; i++) {
            game.addParticle({
                x: this.x + this.width / 2,
                y: this.y,
                vx: (Math.random() - 0.5) * 100,
                vy: -Math.random() * 100,
                life: 0.5,
                color: '#c84c0c',
                update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt; },
                render(renderer) {
                    renderer.drawRect(this.x, this.y, 6, 6, this.color);
                }
            });
        }
    }

    render(renderer, frameCount) {
        if (!this.isAlive && this.squashTimer <= 0) return;

        const screenX = this.x - renderer.cameraX;
        const screenY = this.y - renderer.cameraY;

        if (this.enemyType === 'goomba') {
            if (!this.isAlive) {
                // 被压扁的样子
                renderer.ctx.fillStyle = '#c84c0c';
                renderer.ctx.fillRect(screenX, screenY + this.height * 0.5, this.width, this.height * 0.5);
            } else {
                // 正常Goomba
                const walkFrame = Math.floor(frameCount / 15) % 2;

                // 身体
                renderer.ctx.fillStyle = '#c84c0c';
                renderer.ctx.fillRect(screenX, screenY + this.height * 0.3, this.width, this.height * 0.7);

                // 头部
                renderer.ctx.beginPath();
                renderer.ctx.arc(screenX + this.width / 2, screenY + this.height * 0.35,
                                this.width / 2, Math.PI, 0);
                renderer.ctx.fill();

                // 眼睛
                renderer.ctx.fillStyle = '#fff';
                renderer.ctx.fillRect(screenX + this.width * 0.2, screenY + this.height * 0.2,
                                      this.width * 0.2, this.height * 0.15);
                renderer.ctx.fillRect(screenX + this.width * 0.6, screenY + this.height * 0.2,
                                      this.width * 0.2, this.height * 0.15);

                renderer.ctx.fillStyle = '#000';
                renderer.ctx.fillRect(screenX + this.width * 0.25, screenY + this.height * 0.22,
                                      this.width * 0.08, this.height * 0.1);
                renderer.ctx.fillRect(screenX + this.width * 0.65, screenY + this.height * 0.22,
                                      this.width * 0.08, this.height * 0.1);

                // 脚（动画）
                renderer.ctx.fillStyle = '#2c3e50';
                if (walkFrame === 0) {
                    renderer.ctx.fillRect(screenX + 2, screenY + this.height - 8, 10, 8);
                    renderer.ctx.fillRect(screenX + this.width - 12, screenY + this.height - 8, 10, 8);
                } else {
                    renderer.ctx.fillRect(screenX + 5, screenY + this.height - 8, 8, 8);
                    renderer.ctx.fillRect(screenX + this.width - 13, screenY + this.height - 8, 8, 8);
                }

                // 边框
                renderer.ctx.strokeStyle = '#8b3209';
                renderer.ctx.lineWidth = 2;
                renderer.ctx.strokeRect(screenX, screenY + this.height * 0.3, this.width, this.height * 0.7);
            }
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}