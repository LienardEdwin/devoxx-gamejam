import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { HouseScene } from './scenes/HouseScene';
import { AtticScene } from './scenes/AtticScene';
import { BasementScene } from './scenes/BasementScene';
import { GardenScene } from './scenes/GardenScene';
import { Victory } from './scenes/Victory';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        },
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        HouseScene,
        AtticScene,
        BasementScene,
        GardenScene,
        GameOver,
        Victory,
    ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
