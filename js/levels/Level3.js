import { Player } from '../entities/Player.js';
import { Platform } from '../entities/Platform.js';
import { Enemy } from '../entities/Enemy.js';
import { Item } from '../entities/Item.js';

/**
 * 关卡3 - 城堡/堡垒（挑战）
 */
export class Level3 {
    constructor() {
        this.width = 4500;
        this.height = 600;
        this.spawnX = 100;
        this.spawnY = 400;

        this.player = new Player(this.spawnX, this.spawnY);
        this.entities = [];
        this.clouds = [];

        this.buildLevel();
    }

    buildLevel() {
        // 火焰场景没有云朵

        // ==== 入口桥梁 ====
        this.addPlatform(0, 500, 300, 100, 'brick');

        // ==== 岩浆上方跳跃区 ====
        this.addPlatform(350, 420, 60, 30, 'brick');
        this.addPlatform(470, 350, 60, 30, 'brick');
        this.addPlatform(590, 420, 60, 30, 'brick');
        this.addPlatform(710, 350, 60, 30, 'brick');
        this.addPlatform(830, 420, 60, 30, 'brick');

        // 安全平台
        this.addPlatform(950, 500, 200, 100, 'brick');

        // 水管
        this.addPlatform(1050, 400, 60, 100, 'pipe');
        this.addPlatform(1050, 320, 60, 80, 'pipe');

        // ==== 高墙区域 ====
        this.addPlatform(1200, 400, 40, 200, 'brick');
        this.addPlatform(1280, 320, 40, 280, 'brick');
        this.addPlatform(1360, 240, 40, 360, 'brick');
        this.addPlatform(1440, 320, 40, 280, 'brick');
        this.addPlatform(1520, 400, 40, 200, 'brick');

        // 第二安全平台
        this.addPlatform(1600, 500, 250, 100, 'brick');

        // ==== 移动平台模拟 ====
        this.addPlatform(1900, 400, 80, 30, 'brick');
        this.addPlatform(2050, 350, 80, 30, 'brick');
        this.addPlatform(2200, 400, 80, 30, 'brick');
        this.addPlatform(2350, 350, 80, 30, 'brick');
        this.addPlatform(2500, 400, 80, 30, 'brick');

        // 第三安全平台
        this.addPlatform(2650, 500, 200, 100, 'brick');

        // ==== 窄窄的台阶 ====
        this.addPlatform(2900, 450, 40, 30, 'brick');
        this.addPlatform(2980, 400, 40, 30, 'brick');
        this.addPlatform(3060, 350, 40, 30, 'brick');
        this.addPlatform(3140, 300, 40, 30, 'brick');
        this.addPlatform(3220, 350, 40, 30, 'brick');
        this.addPlatform(3300, 400, 40, 30, 'brick');
        this.addPlatform(3380, 450, 40, 30, 'brick');

        // 第四安全平台
        this.addPlatform(3500, 500, 300, 100, 'brick');

        // ==== 最终挑战 ====
        this.addPlatform(3850, 420, 60, 30, 'brick');
        this.addPlatform(3970, 350, 60, 30, 'brick');
        this.addPlatform(4090, 420, 60, 30, 'brick');
        this.addPlatform(4210, 350, 60, 30, 'brick');

        // 终点平台
        this.addPlatform(4330, 500, 200, 100, 'brick');

        // ==== 问号砖块 ====
        this.addQuestionBlock(400, 270);
        this.addQuestionBlock(520, 270);
        this.addQuestionBlock(1920, 290);
        this.addQuestionBlock(2070, 270);
        this.addQuestionBlock(2220, 290);
        this.addQuestionBlock(2370, 270);
        this.addQuestionBlock(2920, 390);
        this.addQuestionBlock(3060, 290);
        this.addQuestionBlock(3220, 290);
        this.addQuestionBlock(3870, 360);
        this.addQuestionBlock(3990, 270);

        // ==== 金币 ====
        this.addCoin(400, 360);
        this.addCoin(520, 290);
        this.addCoin(640, 360);
        this.addCoin(760, 290);

        this.addCoin(1320, 280);
        this.addCoin(1400, 200);
        this.addCoin(1480, 280);

        this.addCoin(1950, 290);
        this.addCoin(2100, 270);
        this.addCoin(2250, 290);
        this.addCoin(2400, 270);
        this.addCoin(2550, 290);

        this.addCoin(2940, 390);
        this.addCoin(3020, 290);
        this.addCoin(3100, 240);
        this.addCoin(3180, 290);
        this.addCoin(3260, 340);

        this.addCoin(3620, 350);
        this.addCoin(3720, 320);
        this.addCoin(3820, 290);

        this.addCoin(3900, 340);
        this.addCoin(4020, 270);
        this.addCoin(4140, 340);
        this.addCoin(4260, 270);

        // ==== 敌人（密集） ====
        this.addEnemy(1050, 468, 'goomba');
        this.addEnemy(1150, 468, 'goomba');
        this.addEnemy(1700, 468, 'goomba');
        this.addEnemy(1800, 468, 'goomba');
        this.addEnemy(1900, 468, 'goomba');
        this.addEnemy(2000, 468, 'goomba');
        this.addEnemy(2750, 468, 'goomba');
        this.addEnemy(2850, 468, 'goomba');
        this.addEnemy(2950, 468, 'goomba');
        this.addEnemy(3550, 468, 'goomba');
        this.addEnemy(3650, 468, 'goomba');
        this.addEnemy(3750, 468, 'goomba');
        this.addEnemy(3850, 468, 'goomba');

        // ==== 终点旗杆 ====
        this.flagpole = {
            x: 4400,
            y: 200,
            height: 300
        };

        this.addPlatform(4396, 500, 16, 100, 'block');
    }

    addPlatform(x, y, width, height, blockType) {
        const platform = new Platform(x, y, width, height, blockType);

        if (blockType === 'question') {
            platform.onHit = () => {
                const coin = new Item(x, y - 24, 'emerging_coin');
                coin.vy = -300;
                this.entities.push(coin);
            };
        }

        this.entities.push(platform);
    }

    addQuestionBlock(x, y) {
        this.addPlatform(x, y, 40, 40, 'question');
    }

    addCoin(x, y) {
        this.entities.push(new Item(x, y, 'coin'));
    }

    addEnemy(x, y, type) {
        const enemy = new Enemy(x, y, type);
        this.entities.push(enemy);
    }
}