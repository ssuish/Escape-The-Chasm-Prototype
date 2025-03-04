//Sample Achievements Object
//Edit this code when the game play is finalized

const achievements = {
    earn5Stars:{
        rarity: "silver",
        id: "earn5Stars",
        name: "Starstruck",
        description: "Earn 5 stars in all levels",
        //condition: (Sample condition, edit when correct functions are complete)
        earned: false,
        //badge: (insert the NFT for the badge)
    },
    defeat10Enemies:{
        rarity: "silver",
        id: "defeat10Enemies",
        name: "Robot Massacre",
        description: "Defeat 10 enemies in a single level",
        //condition: (Sample condition, edit when correct functions are complete)
        earned: false,
        //badge: (insert the NFT for the badge)
    },
    doubleJumper:{
        rarity: "gold",
        id: "doubleJumper",
        name: "Spiderman",
        description: "Attack an enemy using a double jump",
        //condition: (Sample condition, edit when correct functions are complete)
        earned: false,
        //badge: (insert the NFT for the badge)
    },
    //add more achievements here
}

//Tracking Achievements from Player Movements
function earn10Stars() {/* add function */}
function defeat10Enemies() {/* add function */}
function doubleJumper() {/* add function */}
//add more functions here

//in the function update(){
//    add this in the game logic
//}

//Check the achievement conditions
if (!achievements.earn5Stars.earned /*&& achievements.earn5Stars.condition()*/){
    earnAchievement("earn5Stars");
}
if (!achievements.defeat10Enemies.earned /*&& achievements.earn5Stars.condition()*/){
    earnAchievement("defeat10Enemies");
}
if (!achievements.doubleJumper.earned /*&& achievements.earn5Stars.condition()*/){
    earnAchievement("doubleJumper");
}

//Checks the Achievement, making it true
function earnAchievement(achievementID: string){
    //achievements[achievementID].earned = true;
}