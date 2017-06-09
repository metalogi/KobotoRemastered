using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateTransitionBase  {

    public EGameState fromState { get; private set; }
    public EGameState toState { get; private set; }

    public bool complete {get; private set;}

    public GameStateTransitionBase(EGameState fromState, EGameState toState) {
        this.fromState = fromState;
        this.toState = toState;
    }

    public void StartTransition(GameManager game) {
        complete = false;
        game.StartCoroutine(TransitionCoroutine(game));
    }

    IEnumerator TransitionCoroutine(GameManager game) {
        yield return game.StartCoroutine(DoTransition(game));
        complete = true;
    }

    protected virtual IEnumerator DoTransition(GameManager game) {
        yield break;
    }

//    public virtual bool Update(GameManager game) {
//        return true;
//    }
}
