using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateReturnToMenu : GameStateBase {

    public override EGameState Update(GameManager game) {
        if (game.requestedState == EGameState.Unloaded) {
            return EGameState.Unloaded;
        }
        return EGameState.ReturnToMenu;

    }
}
