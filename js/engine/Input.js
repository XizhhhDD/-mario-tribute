/**
 * 输入系统 - 处理键盘和触摸输入
 */
export class Input {
    constructor() {
        this.keys = {};
        this.touch = null;
        this.touchStarted = null;

        this.bindKeyboard();
        this.bindTouch();
    }

    bindKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    bindTouch() {
        const canvas = document.getElementById('gameCanvas');

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            this.touchStarted = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            this.touch = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touch = null;
        });
    }

    isKeyDown(keyCode) {
        return this.keys[keyCode] === true;
    }

    isLeftPressed() {
        return this.isKeyDown('ArrowLeft') ||
               this.isKeyDown('KeyA') ||
               (this.touch && this.touch.x < window.innerWidth / 3);
    }

    isRightPressed() {
        return this.isKeyDown('ArrowRight') ||
               this.isKeyDown('KeyD') ||
               (this.touch && this.touch.x > window.innerWidth * 2 / 3);
    }

    isJumpPressed() {
        return this.isKeyDown('Space') ||
               this.isKeyDown('KeyW') ||
               this.isKeyDown('ArrowUp') ||
               (this.touch && this.touch.y < window.innerHeight * 0.6 && this.touchStarted && this.touchStarted.y > window.innerHeight * 0.6);
    }

    reset() {
        this.keys = {};
        this.touch = null;
        this.touchStarted = null;
    }
}