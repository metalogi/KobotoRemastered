using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateTransitionRestart : GameStateTransitionBase {

    protected override IEnumerator DoTransition(GameManager game) {

//        game.currentLevel.ResetKobotos();
//        Debug.Log("Reseting kobotos");

        yield return new WaitForSeconds(1f);

        yield break;
    }
}
