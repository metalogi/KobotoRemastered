using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateUnloaded : GameStateBase {

    public override EGameState Update(GameManager game) {
        if (game.requestedState == EGameState.Intro ) {
            return EGameState.Intro;
        }
        if (game.requestedState == EGameState.Play ) {
            return EGameState.Play;
        }
        return EGameState.Unloaded;
    }
	
}
