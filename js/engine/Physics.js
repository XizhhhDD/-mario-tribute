/**
 * 物理系统 - 处理重力、碰撞检测
 */
export class Physics {
    static GRAVITY = 800;           // 重力加速度 (像素/秒²)
    static TERMINAL_VELOCITY = 500; // 最大下落速度
    static JUMP_FORCE = -450;       // 跳跃力
    static MOVE_SPEED = 200;        // 移动速度
    static FRICTION = 0.85;         // 摩擦力系数

    /**
     * AABB碰撞检测
     * 检测两个矩形是否相交
     */
    static checkAABB(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    /**
     * 获取碰撞信息（碰撞方向和重叠量）
     */
    static getCollisionInfo(rect1, rect2) {
        const overlapX = Math.min(
            rect1.x + rect1.width - rect2.x,
            rect2.x + rect2.width - rect1.x
        );

        const overlapY = Math.min(
            rect1.y + rect1.height - rect2.y,
            rect2.y + rect2.height - rect1.y
        );

        let direction = '';
        let depth = 0;

        if (overlapX < overlapY) {
            // 水平碰撞
            depth = overlapX;
            if (rect1.x < rect2.x) {
                direction = 'right';
            } else {
                direction = 'left';
            }
        } else {
            // 垂直碰撞
            depth = overlapY;
            if (rect1.y < rect2.y) {
                direction = 'bottom';
            } else {
                direction = 'top';
            }
        }

        return { direction, depth };
    }

    /**
     * 应用重力
     */
    static applyGravity(entity, deltaTime) {
        entity.vy += this.GRAVITY * deltaTime;
        entity.vy = Math.min(entity.vy, this.TERMINAL_VELOCITY);
    }

    /**
     * 应用水平移动
     */
    static applyHorizontalMovement(entity, deltaTime, direction) {
        if (direction === 'left') {
            entity.vx = -entity.moveSpeed || -this.MOVE_SPEED;
        } else if (direction === 'right') {
            entity.vx = entity.moveSpeed || this.MOVE_SPEED;
        } else {
            // 应用摩擦力
            entity.vx *= this.FRICTION;
            // 停止微小移动
            if (Math.abs(entity.vx) < 1) {
                entity.vx = 0;
            }
        }
    }

    /**
     * 检测玩家与平台/砖块的碰撞
     * 返回碰撞信息数组
     */
    static checkPlatformCollisions(player, platforms) {
        const collisions = [];

        platforms.forEach(platform => {
            if (this.checkAABB(player, platform)) {
                const info = this.getCollisionInfo(player, platform);
                collisions.push({ platform, ...info });
            }
        });

        // 按碰撞深度排序，先处理深度小的（避免卡住）
        collisions.sort((a, b) => a.depth - b.depth);

        return collisions;
    }

    /**
     * 处理碰撞响应
     * 根据碰撞方向调整玩家位置
     */
    static resolveCollisions(player, platforms) {
        let onGround = false;

        // 获取当前帧的碰撞
        const playerRect = {
            x: player.x + player.vx * 0.016,
            y: player.y + player.vy * 0.016,
            width: player.width,
            height: player.height
        };

        const collisions = this.checkPlatformCollisions(playerRect, platforms);

        collisions.forEach(collision => {
            const { direction, depth, platform } = collision;

            switch (direction) {
                case 'top':
                    // 玩家从下方碰撞（顶砖块）
                    player.y = platform.y + platform.height;
                    player.vy = 0;
                    break;

                case 'bottom':
                    // 玩家从上方碰撞（站在平台上）
                    player.y = platform.y - player.height;
                    player.vy = 0;
                    onGround = true;
                    break;

                case 'left':
                    // 玩家从左侧碰撞
                    player.x = platform.x - player.width;
                    player.vx = 0;
                    break;

                case 'right':
                    // 玩家从右侧碰撞
                    player.x = platform.x + platform.width;
                    player.vx = 0;
                    break;
            }
        });

        return onGround;
    }

    /**
     * 检测玩家与敌人的碰撞
     */
    static checkEnemyCollision(player, enemy) {
        return this.checkAABB(player, enemy);
    }

    /**
     * 判断是踩踏还是被伤害
     * 如果玩家底部在敌人顶部附近，且玩家正在下落，则为踩踏
     */
    static isStomp(player, enemy) {
        const playerBottom = player.y + player.height;
        const enemyTop = enemy.y;
        const tolerance = 10; // 容差像素

        return playerBottom < enemyTop + tolerance &&
               playerBottom > enemyTop - tolerance &&
               player.vy > 0;
    }

    /**
     * 简单的点与矩形碰撞（用于金币检测）
     */
    static pointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }

    /**
     * 检测玩家与坑洞的碰撞
     * 返回玩家是否掉入坑洞
     */
    static checkPitfall(player, levelHeight) {
        return player.y > levelHeight;
    }
}