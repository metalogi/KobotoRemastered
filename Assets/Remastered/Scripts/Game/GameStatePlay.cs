using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStatePlay : GameStateBase {

    public override EGameState Update(GameManager game) {
        if (game.currentLevel.AllKobotosRescued()) {
            return EGameState.Won;
        } 
        return EGameState.Play;
    }
}
