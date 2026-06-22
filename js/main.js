import { Game } from './engine/Game.js';

/**
 * 马里奥致敬游戏 - 主入口
 */
// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 初始化游戏
    const game = new Game();

    // 将游戏实例挂载到window以便调试
    window.game = game;
});