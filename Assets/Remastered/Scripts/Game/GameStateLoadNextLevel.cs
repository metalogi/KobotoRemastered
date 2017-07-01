﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateLoadNextLevel : GameStateBase {

    public override EGameState Update(GameManager game) {
        if (game.requestedState == EGameState.Play) {
            return EGameState.Play;
        }
        return EGameState.LoadNextLevel;
        
    }
}
