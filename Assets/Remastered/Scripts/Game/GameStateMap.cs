using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateMap : GameStateBase {

    public override EGameState Update(GameManager game) {

        if (game.requestedState == EGameState.Play) {
            return EGameState.Play;
        }

        return EGameState.Map;
       
    }
}
