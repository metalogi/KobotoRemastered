using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateTransitionStartLevel : GameStateTransitionBase {

//    public GameStateTransitionStartLevel(EGameState fromState, EGameState toState) : base (fromState, toState) {
//    }
//
    protected override IEnumerator DoTransition(GameManager game) {

        //        game.currentLevel.SpawnKobotos();
        //        Debug.Log("Spawning kobotos");
       // game.currentLevel.SetLevelNumbers(ProgressManager.CurrentWorldNumber, ProgressManager.CurrentLevelNumber);

        yield break;
    }

}
