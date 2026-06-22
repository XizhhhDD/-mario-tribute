import { Entity } from './Entity.js';
import { Physics } from '../engine/Physics.js';

/**
 * 玩家类 (Mario)
 */
export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 40);

        this.moveSpeed = 200;
        this.jumpForce = -450;
        this.isGrounded = false;
        this.isJumping = false;
        this.facingRight = true;
        this.isAlive = true;
        this.jumpTime = 0;
        this.isInvincible = false;
        this.invincibleTimer = 0;
    }

    update(deltaTime, game) {
        if (!this.isAlive) return;

        // 处理输入
        this.handleInput(game.input);

        // 应用重力
        Physics.applyGravity(this, deltaTime);

        // 获取平台列表
        const platforms = game.entities.filter(e => e.type === 'platform');

        // 碰撞检测和响应
        const oldY = this.y;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // 水平碰撞检测
        this.handleHorizontalCollisions(platforms);

        // 垂直碰撞检测
        this.isGrounded = this.handleVerticalCollisions(platforms, oldY);

        // 更新跳跃状态
        if (this.isGrounded) {
            this.isJumping = false;
            this.jumpTime = 0;
        }

        // 边界检测
        this.handleBounds(game);

        // 无敌时间倒计时
        if (this.isInvincible) {
            this.invincibleTimer -= deltaTime;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
            }
        }
    }

    handleInput(input) {
        if (input.isLeftPressed()) {
            Physics.applyHorizontalMovement(this, 0.016, 'left');
            this.facingRight = false;
        } else if (input.isRightPressed()) {
            Physics.applyHorizontalMovement(this, 0.016, 'right');
            this.facingRight = true;
        } else {
            // 停止时应用摩擦力
            this.vx *= Physics.FRICTION;
            if (Math.abs(this.vx) < 1) {
                this.vx = 0;
            }
        }

        // 跳跃
        if (input.isJumpPressed() && this.isGrounded && !this.isJumping) {
            this.jump();
        }

        // 可变跳跃高度（按住空格跳得更高）
        if (this.isJumping && !input.isJumpPressed()) {
            this.vy *= 0.5; // 快速下落
        }
    }

    jump() {
        this.vy = this.jumpForce;
        this.isJumping = true;
        this.isGrounded = false;
        this.jumpTime = 0;
    }

    handleHorizontalCollisions(platforms) {
        const bounds = this.getBounds();

        for (const platform of platforms) {
            if (platform.type === 'platform' && Physics.checkAABB(bounds, platform)) {
                const info = Physics.getCollisionInfo(bounds, platform);

                if (info.direction === 'left') {
                    this.x = platform.x - this.width;
                    this.vx = 0;
                } else if (info.direction === 'right') {
                    this.x = platform.x + platform.width;
                    this.vx = 0;
                }
            }
        }
    }

    handleVerticalCollisions(platforms, oldY) {
        const bounds = this.getBounds();
        let onGround = false;

        for (const platform of platforms) {
            if (platform.type === 'platform' && Physics.checkAABB(bounds, platform)) {
                const info = Physics.getCollisionInfo(bounds, platform);

                if (info.direction === 'top') {
                    // 从下方碰撞（顶砖块）
                    this.y = platform.y + platform.height;
                    this.vy = 0;
                    this.onHitBlock(platform);
                } else if (info.direction === 'bottom') {
                    // 从上方碰撞（站在平台上）
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    onGround = true;
                }
            }
        }

        return onGround;
    }

    onHitBlock(platform) {
        // 如果是问号砖块且还有物品，弹出物品
        if (platform.blockType === 'question' && !platform.empty) {
            platform.empty = true;
            platform.onHit();
        }
    }

    handleBounds(game) {
        // 左边界
        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }

        // 右边界（关卡宽度）
        if (this.x + this.width > game.levelWidth) {
            this.x = game.levelWidth - this.width;
            this.vx = 0;
        }
    }

    takeDamage(game) {
        if (this.isInvincible || !this.isAlive) return;

        this.isInvincible = true;
        this.invincibleTimer = 2; // 2秒无敌时间

        // 简化：受伤直接死亡
        this.die();
    }

    die() {
        this.isAlive = false;
    }

    render(renderer, frameCount) {
        if (!this.isAlive) return;

        // 无敌闪烁效果
        if (this.isInvincible && Math.floor(frameCount / 5) % 2 === 0) {
            return;
        }

        const colors = {
            main: '#e74c3c',      // 红色身体
            detail: '#2c3e50',    // 蓝色裤子/帽子
            outline: '#c0392b'    // 深红边框
        };

        // 绘制Mario风格的精灵
        const screenX = this.x - renderer.cameraX;
        const screenY = this.y - renderer.cameraY;

        // 身体（红色）
        renderer.ctx.fillStyle = colors.main;
        renderer.ctx.fillRect(screenX, screenY, this.width, this.height);

        // 裤子（蓝色）
        renderer.ctx.fillStyle = colors.detail;
        renderer.ctx.fillRect(screenX, screenY + this.height * 0.6, this.width, this.height * 0.4);

        // 帽子（蓝色）
        renderer.ctx.fillStyle = colors.detail;
        renderer.ctx.fillRect(screenX - 2, screenY - 5, this.width + 4, this.height * 0.25);

        // 帽子前沿（红色）
        renderer.ctx.fillStyle = colors.main;
        renderer.ctx.fillRect(screenX, screenY + this.height * 0.05, this.width, this.height * 0.08);

        // 眼睛
        const eyeX = this.facingRight ? screenX + this.width * 0.6 : screenX + this.width * 0.15;
        renderer.ctx.fillStyle = '#fff';
        renderer.ctx.fillRect(eyeX, screenY + this.height * 0.3, this.width * 0.12, this.height * 0.12);
        renderer.ctx.fillStyle = '#000';
        renderer.ctx.fillRect(
            this.facingRight ? eyeX + this.width * 0.04 : eyeX + this.width * 0.04,
            screenY + this.height * 0.32,
            this.width * 0.06,
            this.height * 0.08
        );

        // 鼻子
        renderer.ctx.fillStyle = '#f4d03f';
        const noseX = this.facingRight ? screenX + this.width * 0.7 : screenX + this.width * 0.05;
        renderer.ctx.fillRect(noseX, screenY + this.height * 0.4, this.width * 0.15, this.height * 0.08);

        // 胡子
        renderer.ctx.fillStyle = '#4a2c2a';
        const mustacheX = this.facingRight ? screenX + this.width * 0.55 : screenX + this.width * 0.1;
        renderer.ctx.fillRect(mustacheX, screenY + this.height * 0.48, this.width * 0.35, this.height * 0.06);

        // 边框
        renderer.ctx.strokeStyle = colors.outline;
        renderer.ctx.lineWidth = 2;
        renderer.ctx.strokeRect(screenX, screenY, this.width, this.height);
    }
}