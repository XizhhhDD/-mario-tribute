import { Entity } from './Entity.js';
import { Physics } from '../engine/Physics.js';

/**
 * 道具类 - 金币、蘑菇等
 */
export class Item extends Entity {
    constructor(x, y, type = 'coin') {
        super(x, y, 24, 24);
        this.type = 'item';
        this.itemType = type;
        this.vy = 0;
        this.baseY = y;
        this.bounceOffset = 0;
        this.collected = false;
    }

    update(deltaTime, game) {
        if (this.collected) {
            this.shouldRemove = true;
            return;
        }

        if (this.itemType === 'coin') {
            // 金币浮动动画
            this.bounceOffset = Math.sin(Date.now() * 0.003) * 5;

            // 检测与玩家碰撞
            if (game.player && game.player.isAlive) {
                const playerBounds = game.player.getBounds();
                const coinBounds = {
                    x: this.x,
                    y: this.y + this.bounceOffset,
                    width: this.width,
                    height: this.height
                };

                if (Physics.checkAABB(playerBounds, coinBounds)) {
                    this.collect(game);
                }
            }
        } else if (this.itemType === 'emerging_coin') {
            // 从砖块弹出的金币
            Physics.applyGravity(this, deltaTime);
            this.y += this.vy * deltaTime;

            if (this.y >= this.baseY) {
                this.y = this.baseY;
                this.collect(game);
            }
        }
    }

    collect(game) {
        this.collected = true;
        if (this.itemType === 'coin' || this.itemType === 'emerging_coin') {
            game.addCoin();
        }
    }

    render(renderer, frameCount) {
        if (this.collected) return;

        const renderY = this.y + this.bounceOffset;
        renderer.drawCoin(this.x, renderY, this.width, frameCount);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y + this.bounceOffset,
            width: this.width,
            height: this.height
        };
    }
}

/**
 * 粒子效果类
 */
export class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.vy += 200 * deltaTime; // 重力
        this.life -= deltaTime;
    }

    render(renderer) {
        const alpha = this.life / this.maxLife;
        renderer.ctx.fillStyle = this.color;
        renderer.ctx.globalAlpha = alpha;
        renderer.ctx.fillRect(this.x - renderer.cameraX, this.y, 6, 6);
        renderer.ctx.globalAlpha = 1;
    }
}