import { Player } from '../entities/Player.js';
import { Platform } from '../entities/Platform.js';
import { Enemy } from '../entities/Enemy.js';
import { Item } from '../entities/Item.js';

/**
 * 关卡2 - 地下/洞穴（进阶）
 */
export class Level2 {
    constructor() {
        this.width = 4000;
        this.height = 600;
        this.spawnX = 100;
        this.spawnY = 400;

        this.player = new Player(this.spawnX, this.spawnY);
        this.entities = [];
        this.clouds = [];

        this.buildLevel();
    }

    buildLevel() {
        // 地下关卡没有云朵
        this.clouds = [];

        // ==== 入口区域 ====
        this.addPlatform(0, 500, 500, 100, 'brick');

        // ==== 第一平台跳跃区 ====
        this.addPlatform(550, 420, 80, 30, 'brick');
        this.addPlatform(680, 350, 80, 30, 'brick');
        this.addPlatform(810, 420, 80, 30, 'brick');
        this.addPlatform(940, 350, 80, 30, 'brick');
        this.addPlatform(1070, 420, 500, 100, 'brick');

        // 水管
        this.addPlatform(1200, 340, 60, 80, 'pipe');
        this.addPlatform(1200, 280, 60, 60, 'pipe');

        // ==== 高平台区域 ====
        this.addPlatform(1320, 300, 60, 30, 'question');
        this.addPlatform(1440, 250, 60, 30, 'brick');
        this.addPlatform(1560, 200, 60, 30, 'question');
        this.addPlatform(1680, 250, 60, 30, 'brick');
        this.addPlatform(1800, 300, 60, 30, 'brick');

        // 第二地面
        this.addPlatform(1900, 500, 300, 100, 'brick');

        // ==== 狭窄通道 ====
        this.addPlatform(2250, 420, 60, 30, 'brick');
        this.addPlatform(2370, 350, 60, 30, 'brick');
        this.addPlatform(2490, 420, 60, 30, 'brick');
        this.addPlatform(2610, 350, 60, 30, 'brick');
        this.addPlatform(2730, 420, 60, 30, 'brick');
        this.addPlatform(2850, 350, 60, 30, 'brick');

        // 第三地面
        this.addPlatform(2970, 500, 400, 100, 'brick');

        // ==== 上升阶梯 ====
        this.addPlatform(3400, 450, 100, 30, 'brick');
        this.addPlatform(3520, 380, 100, 30, 'brick');
        this.addPlatform(3640, 310, 100, 30, 'brick');
        this.addPlatform(3760, 500, 240, 100, 'brick');

        // ==== 问号砖块 ====
        this.addQuestionBlock(620, 250);
        this.addQuestionBlock(1340, 220);
        this.addQuestionBlock(1580, 160);
        this.addQuestionBlock(2200, 380);
        this.addQuestionBlock(3440, 350);
        this.addQuestionBlock(3560, 280);

        // ==== 金币 ====
        // 第一跳跃区金币
        this.addCoin(580, 360);
        this.addCoin(710, 290);
        this.addCoin(840, 360);
        this.addCoin(970, 290);

        // 高平台金币
        this.addCoin(1500, 190);
        this.addCoin(1740, 190);

        // 狭窄通道金币
        this.addCoin(2280, 360);
        this.addCoin(2400, 290);
        this.addCoin(2520, 360);
        this.addCoin(2640, 290);
        this.addCoin(2760, 360);
        this.addCoin(2880, 290);

        // 终点前金币
        this.addCoin(3100, 350);
        this.addCoin(3200, 320);
        this.addCoin(3300, 290);

        // ==== 敌人 ====
        this.addEnemy(1150, 468, 'goomba');
        this.addEnemy(1250, 468, 'goomba');
        this.addEnemy(1350, 468, 'goomba');
        this.addEnemy(1950, 468, 'goomba');
        this.addEnemy(2050, 468, 'goomba');
        this.addEnemy(2350, 468, 'goomba');
        this.addEnemy(3050, 468, 'goomba');
        this.addEnemy(3150, 468, 'goomba');
        this.addEnemy(3250, 468, 'goomba');
        this.addEnemy(3650, 468, 'goomba');
        this.addEnemy(3750, 468, 'goomba');

        // ==== 终点旗杆 ====
        this.flagpole = {
            x: 3900,
            y: 200,
            height: 300
        };

        this.addPlatform(3896, 500, 16, 100, 'block');
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