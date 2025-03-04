//Sample objective object
//Edit this code once gameplay is finalized

const levelObjectives = {
    level1: {
      name: "First Escape",
      stars: [
        {
          objective: "Defeat 10 enemies",
          //condition: (player, finishLine) =>
            //player.x > finishLine.x,
        },
        {
          objective: "Defeat 5 enemies",
          //condition: (coinCount) => coinCount >= 10,
        },
        {
          objective: "Complete the level under 2 minutes",
          //condition: (startTime, currentTime) =>
            //currentTime - startTime <= 30000, // 30000 milliseconds
        },
      ],
    },
    /*level2: {
        name: "Second Escape",
        stars: [
          {
            objective: "Defeat 5 enemies in 1 minute",
            //condition: (player, finishLine) =>
              //player.x > finishLine.x,
          },
          {
            objective: "Defeat 5 enemies",
            //condition: (coinCount) => coinCount >= 10,
          },
          {
            objective: "Complete the level under 2 minutes",
            //condition: (startTime, currentTime) =>
              //currentTime - startTime <= 30000, // 30000 milliseconds
          },
        ],
      },
      */
  }
 
