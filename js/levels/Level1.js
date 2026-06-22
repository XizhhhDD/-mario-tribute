import { Player } from '../entities/Player.js';
import { Platform } from '../entities/Platform.js';
import { Enemy } from '../entities/Enemy.js';
import { Item } from '../entities/Item.js';

/**
 * 关卡1 - 草地世界（入门）
 */
export class Level1 {
    constructor() {
        this.width = 3200; // 关卡宽度
        this.height = 600;
        this.spawnX = 100;
        this.spawnY = 400;

        this.player = new Player(this.spawnX, this.spawnY);
        this.entities = [];
        this.clouds = [];

        this.buildLevel();
    }

    buildLevel() {
        // 添加云朵（背景装饰）
        this.clouds = [
            { x: 200, y: 80, scale: 1 },
            { x: 600, y: 120, scale: 0.8 },
            { x: 1000, y: 60, scale: 1.2 },
            { x: 1400, y: 100, scale: 0.9 },
            { x: 1800, y: 70, scale: 1 },
            { x: 2200, y: 130, scale: 0.7 },
            { x: 2600, y: 90, scale: 1.1 },
        ];

        // ==== 地面和平台 ====

        // 起始地面
        this.addPlatform(0, 500, 600, 100, 'ground');

        // 第一个坑洞后的地面
        this.addPlatform(700, 500, 400, 100, 'ground');

        // 高平台区域
        this.addPlatform(1150, 400, 100, 30, 'brick');
        this.addPlatform(1300, 350, 100, 30, 'question');
        this.addPlatform(1450, 300, 100, 30, 'brick');

        // 管道
        this.addPlatform(1650, 420, 60, 80, 'pipe');
        this.addPlatform(1650, 360, 60, 60, 'pipe');

        // 地面继续
        this.addPlatform(1750, 500, 400, 100, 'ground');

        // 第二个坑洞区域
        this.addPlatform(2200, 500, 100, 30, 'brick');
        this.addPlatform(2350, 420, 100, 30, 'brick');
        this.addPlatform(2500, 350, 100, 30, 'brick');

        // 更长的地面
        this.addPlatform(2650, 500, 550, 100, 'ground');

        // ==== 问号砖块（有金币） ====
        this.addQuestionBlock(780, 350);
        this.addQuestionBlock(820, 350);
        this.addQuestionBlock(1320, 290);

        // ==== 金币 ====
        this.addCoin(200, 350);
        this.addCoin(300, 320);
        this.addCoin(400, 300);
        this.addCoin(500, 330);
        this.addCoin(1200, 330);
        this.addCoin(1380, 280);
        this.addCoin(1900, 350);
        this.addCoin(2000, 320);
        this.addCoin(2100, 290);
        this.addCoin(2300, 350);
        this.addCoin(2450, 320);
        this.addCoin(2850, 350);
        this.addCoin(2950, 320);
        this.addCoin(3050, 290);

        // ==== 敌人 ====
        this.addEnemy(850, 468, 'goomba');
        this.addEnemy(1150, 468, 'goomba');
        this.addEnemy(1800, 468, 'goomba');
        this.addEnemy(2000, 468, 'goomba');
        this.addEnemy(2800, 468, 'goomba');

        // ==== 终点旗杆 ====
        this.flagpole = {
            x: 3100,
            y: 200,
            height: 300
        };

        // 旗杆基座
        this.addPlatform(3096, 500, 16, 100, 'block');
    }

    addPlatform(x, y, width, height, blockType) {
        const platform = new Platform(x, y, width, height, blockType);

        // 问号砖块设置弹出金币
        if (blockType === 'question') {
            platform.onHit = () => {
                // 创建弹出的金币
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