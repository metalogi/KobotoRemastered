using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateUnloaded : GameStateBase {

    public override EGameState Update(GameManager game) {
        if (game.currentLevel != null) {
            return EGameState.Play;
        }
        return EGameState.Unloaded;
    }
	
}
