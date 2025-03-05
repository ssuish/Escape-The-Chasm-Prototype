import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Level1 } from "./levels/level1";
import { MainMenu } from "./scenes/MainMenu";
import { Achievements } from "./scenes/Achievements";
import { GameSettings } from "./scenes/GameSettings";
import { LevelSelection } from "./scenes/LevelSelection";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { Background } from "./scenes/Background";
import { gameConfig } from "./config/gameConfig";
import { BaseLevel } from "./levels/BaseLevel";
import { MusicToggle } from "./scenes/MusicToggle";

// TODO: Replace MainGame to LevelSelection
// Always add new scenes here!
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: gameConfig.screenWidth,
    height: gameConfig.screenHeight,
    parent: "game-container",
    scene: [
        Boot,
        Preloader,
        Background,
        MusicToggle,
        MainMenu,
        LevelSelection,
        BaseLevel,
        Level1,
        GameOver,
        Achievements,
        GameSettings
    ],
    physics: {
        default: "matter",
        matter: {
            debug: true,
        },
    },
    scale: gameConfig.scale,
};

// TODO: Remove the optional initial scene from the initialization
const StartGame = (parent: string) => {
    return new Game({ ...config, parent, scene: Level1 });
};

export default StartGame;

