﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateWon : GameStateBase {

    public override EGameState Update(GameManager game) {
        if (game.requestedState == EGameState.LoadNextLevel) {
            return EGameState.LoadNextLevel;
        }

        if (game.requestedState == EGameState.ReturnToMenu) {
            return EGameState.ReturnToMenu;
        }

        return EGameState.Won;
    }

}
