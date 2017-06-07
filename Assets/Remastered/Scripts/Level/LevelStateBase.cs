using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelStateBase  {

    protected ELevelState state;

    public virtual ELevelState Update(LevelManager level) {
        return state;
    }


}
