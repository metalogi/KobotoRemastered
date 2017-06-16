using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LineAttachTrigger : KobotoMono {

    public LevelObjectLineAttach lineAttach;

    public bool onceOnly;
    public bool freezeOnExit;

    bool onceOnlyTriggered;

    protected override void DidEnterGameState (EGameState gameState, EGameState fromState){
        base.DidEnterGameState (gameState, fromState);
        if (gameState == EGameState.Play) {
            onceOnlyTriggered = false;
        }
    }

    protected virtual void OnKobotoEnter(Koboto koboto) {
        if (onceOnly) {
            if (onceOnlyTriggered) {
                return;
            }
            onceOnlyTriggered = true;
        }
        lineAttach.Freeze(false);
    } 

    protected virtual void OnKobotoExit(Koboto koboto) {
        lineAttach.Freeze(true);
    } 
}
