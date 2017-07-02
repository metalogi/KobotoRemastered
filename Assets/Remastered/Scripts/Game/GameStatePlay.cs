using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStatePlay : GameStateBase {

    public override EGameState Update(GameManager game) {

        Level level = game.currentLevel;
        if (level.AllKobotosRescued()) {
            return EGameState.Won;
        } else if (level.AnyKobotoDead()) {
            return EGameState.Lost;
        }

        if (game.requestedState == EGameState.Paused) {
            return EGameState.Paused;
        }
        return EGameState.Play;
    }
}
