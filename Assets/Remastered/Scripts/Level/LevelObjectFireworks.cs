using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectFireworks : LevelObjectBase{

    public GameObject fireworkVFXObj;

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState) {
        base.DidEnterGameState(gameState, fromState);
        bool on = (gameState == EGameState.Won);
        fireworkVFXObj.SetActive (on);
        ParticleSystem system = fireworkVFXObj.GetComponent<ParticleSystem> ();
        system.Play ();

    }
}
