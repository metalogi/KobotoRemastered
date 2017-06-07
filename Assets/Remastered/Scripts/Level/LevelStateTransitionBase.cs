using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelStateTransitionBase  {

    public ELevelState fromState { get; private set; }
    public ELevelState toState { get; private set; }

    public LevelStateTransitionBase(ELevelState fromState, ELevelState toState) {
        this.fromState = fromState;
        this.toState = toState;
    }

    public virtual bool Update(LevelManager level) {
        return true;
    }
}
