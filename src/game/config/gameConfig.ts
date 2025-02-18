import { Boot } from "../scenes/Boot";
import { GameOver } from "../scenes/GameOver";
import { Game as MainGame } from "../scenes/Game";
import { MainMenu } from "../scenes/MainMenu";
import { Inventory } from "../scenes/Inventory";
import { Achievements } from "../scenes/Achievements";
import { GameSettings } from "../scenes/GameSettings";
import { LevelSelection } from "../scenes/LevelSelection";
import { AUTO, Game } from "phaser";
import { Preloader } from "../scenes/Preloader";

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Inventory,
        Achievements,
        GameSettings,
        LevelSelection,
    ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

