using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectHome : LevelObjectBase {

    bool isOccupied;

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState) {
        base.DidEnterGameState(gameState, fromState);
        if (gameState == EGameState.Play) {
            SetOccupied(false);
        }
    }

    protected override void OnKobotoEnter(Koboto koboto) {
        if (isOccupied) {
            return;
        }
        if (koboto.currentState == KobotoState.Alive || koboto.currentState == KobotoState.Asleep) {
            koboto.Rescue(this);
        }
    }

    void SetOccupied(bool status) {
        isOccupied = status;
        mainCollider.enabled = isOccupied;
        trigger.enabled = !isOccupied;
    }
}
