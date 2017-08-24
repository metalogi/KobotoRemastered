using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateIntro : GameStateBase {

    public override EGameState Update(GameManager game) {

        Level level = game.currentLevel;

        if (level.introCam == null || level.introCam.IntroFinished()) {
            return EGameState.Play;
        }
            
      
        return EGameState.Intro;
    }
}
