//Sample Achievements Object
//Edit this code when the game play is finalized

export interface Achievement {
    rarity: string;
    id: string;
    name: string;
    description: string;
    event: string;
    earned: boolean;
    badge: string;
}

export const achievements: { [key: string]: Achievement } = {
    defeat5Enemies:{
        rarity: "silver",
        id: "defeat5Enemies",
        name: "Pentakill",
        description: "Defeat 5 enemies",
        event: "defeated5Enemies",
        earned: false,
        badge: 'silver' //(insert the NFT for the badge)
    },
    defeat10Enemies:{
        rarity: "silver",
        id: "defeat10Enemies",
        name: "Decakill",
        description: "Defeat 10 enemies",
        event: "defeated10Enemies",
        earned: false,
        badge: 'silver' //(insert the NFT for the badge)
    },
    suicidalEnemies:{
        rarity: "gold",
        id: "suicidalEnemies",
        name: "Kamikaze",
        description: "Defeat 5 enemies by letting them fall off the platform",
        event: "platform5Enemies",
        earned: false,
        badge: 'gold' //(insert the NFT for the badge)
    },
    overpoweredPlayer:{
        rarity: "platinum",
        id: "overpoweredPlayer",
        name: "Skilled Player",
        description: "Defeat 5 enemies without getting hit",
        event: "noDamage",
        earned: false,
        badge: 'platinum' //(insert the NFT for the badge)
    },
    //add more achievements here
}