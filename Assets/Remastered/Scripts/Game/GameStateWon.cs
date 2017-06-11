using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateWon : GameStateBase {

    public override EGameState Update(GameManager game) {
        if (game.TimeInState() > 2f) {
            return EGameState.Play;
        }
        return EGameState.Won;
    }

}
