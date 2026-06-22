/**
 * 渲染系统 - 处理Canvas绘制
 */
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cameraX = 0;
        this.cameraY = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    clear(color = '#5c94fc') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setCamera(x, y = 0) {
        this.cameraX = x;
        this.cameraY = y;
    }

    /**
     * 绘制矩形（基础图元）
     */
    drawRect(x, y, width, height, color, borderColor = null) {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(screenX, screenY, width, height);

        if (borderColor) {
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(screenX, screenY, width, height);
        }
    }

    /**
     * 绘制圆形
     */
    drawCircle(x, y, radius, color) {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    /**
     * 绘制精灵（简单色块精灵）
     */
    drawSprite(x, y, width, height, colors, facingRight = true) {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        this.ctx.fillStyle = colors.main;
        this.ctx.fillRect(screenX, screenY, width, height);

        // 添加一些细节
        if (colors.detail) {
            this.ctx.fillStyle = colors.detail;
            // 帽子
            this.ctx.fillRect(screenX, screenY, width, height * 0.25);
            // 眼睛
            const eyeX = facingRight ? screenX + width * 0.6 : screenX + width * 0.15;
            this.ctx.fillRect(eyeX, screenY + height * 0.35, width * 0.15, height * 0.15);
        }

        if (colors.outline) {
            this.ctx.strokeStyle = colors.outline;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(screenX, screenY, width, height);
        }
    }

    /**
     * 绘制砖块
     */
    drawBrick(x, y, width, height, type = 'normal') {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        let colors;
        switch (type) {
            case 'question':
                colors = { main: '#ffd700', dark: '#cc9900' };
                break;
            case 'brick':
                colors = { main: '#c84c0c', dark: '#8b3209' };
                break;
            case 'ground':
                colors = { main: '#8b4513', dark: '#5d2e0a' };
                break;
            default:
                colors = { main: '#888888', dark: '#555555' };
        }

        // 主体
        this.ctx.fillStyle = colors.main;
        this.ctx.fillRect(screenX, screenY, width, height);

        // 边框
        this.ctx.strokeStyle = colors.dark;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(screenX, screenY, width, height);

        // 砖块纹理
        if (type === 'brick' || type === 'ground') {
            this.ctx.strokeStyle = colors.dark;
            this.ctx.lineWidth = 2;
            // 横线
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, screenY + height / 2);
            this.ctx.lineTo(screenX + width, screenY + height / 2);
            this.ctx.stroke();
            // 竖线
            this.ctx.beginPath();
            this.ctx.moveTo(screenX + width / 2, screenY);
            this.ctx.lineTo(screenX + width / 2, screenY + height / 2);
            this.ctx.moveTo(screenX + width / 4, screenY + height / 2);
            this.ctx.lineTo(screenX + width / 4, screenY + height);
            this.ctx.moveTo(screenX + width * 0.75, screenY + height / 2);
            this.ctx.lineTo(screenX + width * 0.75, screenY + height);
            this.ctx.stroke();
        }

        // 问号砖块
        if (type === 'question') {
            this.ctx.fillStyle = '#333';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('?', screenX + width / 2, screenY + height / 2);
        }
    }

    /**
     * 绘制金币
     */
    drawCoin(x, y, size = 24, frame = 0) {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        const scaleX = Math.abs(Math.sin(frame * 0.1));
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.ellipse(screenX + size / 2, screenY + size / 2,
                         size / 2 * scaleX, size / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#cc9900';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 金币闪光效果
        if (Math.sin(frame * 0.15) > 0) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.beginPath();
            this.ctx.ellipse(screenX + size / 2 - size / 4, screenY + size / 2 - size / 4,
                            size / 8, size / 8, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * 绘制旗杆
     */
    drawFlagpole(x, y, height) {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        // 杆子
        this.ctx.fillStyle = '#2d2d44';
        this.ctx.fillRect(screenX, screenY, 8, height);

        // 顶部圆球
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(screenX + 4, screenY, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // 旗帜
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.moveTo(screenX + 8, screenY + 10);
        this.ctx.lineTo(screenX + 50, screenY + 30);
        this.ctx.lineTo(screenX + 8, screenY + 50);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * 绘制云朵
     */
    drawCloud(x, y, scale = 1) {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

        const drawCircle = (cx, cy, r) => {
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
            this.ctx.fill();
        };

        const s = scale;
        drawCircle(screenX, screenY, 25 * s);
        drawCircle(screenX + 25 * s, screenY - 10 * s, 30 * s);
        drawCircle(screenX + 50 * s, screenY, 25 * s);
        drawCircle(screenX + 25 * s, screenY + 10 * s, 20 * s);
    }

    /**
     * 绘制水管
     */
    drawPipe(x, y, width, height, facing = 'right') {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        // 水管主体
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(screenX, screenY, width, height);

        // 水管顶部
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(screenX - 4, screenY, width + 8, 40);

        // 高光
        this.ctx.fillStyle = '#58d68d';
        this.ctx.fillRect(screenX + 5, screenY + 40, 10, height - 40);

        // 水管口
        this.ctx.fillStyle = '#1e8449';
        this.ctx.fillRect(screenX, screenY, width, 5);
    }

    /**
     * 绘制文字
     */
    drawText(text, x, y, color = '#fff', fontSize = 24) {
        const screenX = x - this.cameraX;
        const screenY = y - this.cameraY;

        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(text, screenX, screenY);
    }
}