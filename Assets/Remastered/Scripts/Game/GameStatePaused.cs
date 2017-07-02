using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStatePaused : GameStateBase {

    public override EGameState Update(GameManager game) {
        if (game.requestedState == EGameState.Play) {
            return EGameState.Play;
        }
        if (game.requestedState == EGameState.ReturnToMenu) {
            return EGameState.ReturnToMenu;
        }
        return EGameState.Paused;
    }
}
