import { Entity } from './Entity.js';

/**
 * 平台类 - 包括地面、砖块、水管等
 */
export class Platform extends Entity {
    constructor(x, y, width, height, blockType = 'ground') {
        super(x, y, width, height);
        this.type = 'platform';
        this.blockType = blockType; // ground, brick, question, pipe, pit
        this.empty = false;
        this.bounceOffset = 0;
        this.bounceSpeed = 0;
    }

    update(deltaTime) {
        // 问号砖块被顶起后的动画
        if (this.bounceOffset > 0) {
            this.bounceOffset += this.bounceSpeed;
            if (this.bounceOffset <= 0) {
                this.bounceOffset = 0;
                this.bounceSpeed = 0;
            }
        }
    }

    onHit() {
        // 砖块被顶起动画
        this.bounceOffset = 8;
        this.bounceSpeed = -200;
    }

    render(renderer) {
        const renderY = this.y + this.bounceOffset;

        switch (this.blockType) {
            case 'ground':
            case 'brick':
                renderer.drawBrick(this.x, renderY, this.width, this.height, 'brick');
                break;
            case 'question':
                renderer.drawBrick(this.x, renderY, this.width, this.height,
                                   this.empty ? 'empty' : 'question');
                break;
            case 'block':
                renderer.drawRect(this.x, renderY, this.width, this.height, '#95a5a6', '#7f8c8d');
                break;
            case 'pipe':
                renderer.drawPipe(this.x, renderY, this.width, this.height);
                break;
            default:
                renderer.drawRect(this.x, renderY, this.width, this.height, '#888');
        }
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