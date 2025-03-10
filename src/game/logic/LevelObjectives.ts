//Sample objective object
//Edit this code once gameplay is finalized

interface StarObjective {
  objective: string;
  event: string;
}

interface LevelData {
  name: string;
  stars: StarObjective[];
}

export const levelObjectives: { [key: string]: LevelData } = {
    level1: {
      name: "First Escape",
      stars: [
        {
          objective: "Defeat 10 enemies",
          event: 'defeated5Enemies'
        },
        {
          objective: "Defeat 5 enemies",
          event: 'defeated10Enemies'
        },
        {
          objective: "Complete the stage with 25% health or above",
          event: 'percent25Health'
        },
      ],
    },
    /*level2: {
      name: "Second Escape",
      stars: [
        {
          objective: "Defeat 10 enemies",
          event: 'defeated5Enemies'

        },
        {
          objective: "Complete the stage with 50% health or above",
          event: '_50percentHealth'
        },
        {
          objective: "Complete the stage with 25% health or above",
          event: '_25percentHealth'
        },
      ],
    },*/
}
