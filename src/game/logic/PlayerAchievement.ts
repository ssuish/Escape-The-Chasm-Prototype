//Sample Achievements Object
//Edit this code when the game play is finalized


const achievements = {
    defeat5Enemies:{
        rarity: "silver",
        id: "defeat5Stars",
        name: "Robot Killer",
        description: "Earn 5 stars in all levels",
        //condition: incrementDefeatedEnemies() = 5,
        earned: false,
        //badge: (insert the NFT for the badge)
    },
    defeat10Enemies:{
        rarity: "silver",
        id: "defeat10Enemies",
        name: "Robot Massacre",
        description: "Defeat 10 enemies in a single level",
        //condition: incrementDefeatedEnemies() = 10,
        earned: false,
        //badge: (insert the NFT for the badge)
    },
    suicidalEnemies:{
        rarity: "gold",
        id: "suicidalEnemies",
        name: "Suicidal Enemies",
        description: "Defeat 5 enemies by letting them fall off the platform",
        //condition: (Sample condition, edit when correct functions are complete)
        earned: false,
        //badge: (insert the NFT for the badge)
    },
    //add more achievements here
}

//Tracking Achievements from Player Movements
function earn10Stars() {/* add function */}
function defeat10Enemies() {/* add function */}
function suicidalEnemies() {/* add function */}
//add more functions here

//in the function update(){
//    add this in the game logic
//}

//Check the achievement conditions
if (!achievements.defeat5Enemies.earned /*&& achievements.earn5Stars.condition()*/){
    earnAchievement("earn5Stars");
}
if (!achievements.defeat10Enemies.earned /*&& achievements.earn5Stars.condition()*/){
    earnAchievement("defeat10Enemies");
}
if (!achievements.suicidalEnemies.earned /*&& achievements.earn5Stars.condition()*/){
    earnAchievement("doubleJumper");
}

//Checks the Achievement, making it true
function earnAchievement(achievementID: string){
    //achievements[achievementID].earned = true;
}

function incrementDefeatedEnemies() {
    throw new Error("Function not implemented.");
}
