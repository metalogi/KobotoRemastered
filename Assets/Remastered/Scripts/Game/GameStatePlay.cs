using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStatePlay : GameStateBase {

    public override EGameState Update(GameManager game) {
        Level level = game.currentLevel;
        if (level.AllKobotosRescued()) {
            return EGameState.Won;
        } else if (level.AnyKobotoDeadOrLost()) {
            return EGameState.Lost;
        }
        return EGameState.Play;
    }
}
