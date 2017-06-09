using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateTransitionBase  {

    public EGameState fromState { get; private set; }
    public EGameState toState { get; private set; }

    public GameStateTransitionBase(EGameState fromState, EGameState toState) {
        this.fromState = fromState;
        this.toState = toState;
    }

    public virtual bool Update(GameManager level) {
        return true;
    }
}
