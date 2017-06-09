using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateBase  {

    protected EGameState state;

    public virtual EGameState Update(GameManager game) {
        return state;
    }


}
