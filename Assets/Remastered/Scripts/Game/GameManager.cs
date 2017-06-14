﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum EGameState {
    None,
    Unloaded,
    Transition,
    Intro,
    Play,
    Lost,
    Won,
    LoadNextLevel,
    ReturnToMenu
}






public class GameManager : MonoBehaviour {

    public Level currentLevel;
    public UIGame gameUI;

    public EGameState currentState{ get; private set; }
    GameStateBase currentStateFunctions;
    GameStateTransitionBase currentStateTransition;

    Dictionary<EGameState, GameStateBase> stateFunctions;
    Dictionary<EGameState, Dictionary<EGameState, GameStateTransitionBase>> stateTransitions;

    float stateTime;
    public EGameState requestedState {get; private set;}

    static GameManager instance;

    public static GameManager Instance {
        get { return instance; }
    }

    void Awake() {
        if (instance != null) {
            GameObject.Destroy (this);
            return;
        }
        SetupStates ();

        gameUI.Init(this);
        instance = this;
        SetState (EGameState.Unloaded, true);
    }
        


	void Update () {
        GameStateUpdate();
        requestedState = EGameState.None;
    }

    public void RequestState(EGameState state) {
        requestedState = state;
    }

    #region StateMachine
    void GameStateUpdate() {
        if (currentStateTransition != null) {
           // bool done = currentStateTransition.Update(this);
            if (currentStateTransition.complete) {
                SetState(currentStateTransition.toState);

            }
        } else if (currentStateFunctions != null) {
            stateTime += Time.deltaTime;
            EGameState desiredState = currentStateFunctions.Update(this);
            if (desiredState != currentState) {
                TransitionToState(desiredState);
            }
        }
    }


    void SetupStates() {
        stateFunctions = new Dictionary<EGameState, GameStateBase>();
        stateTransitions = new Dictionary<EGameState, Dictionary<EGameState, GameStateTransitionBase>> ();

        stateFunctions.Add(EGameState.Unloaded, new GameStateUnloaded());
        stateFunctions.Add(EGameState.Play, new GameStatePlay());
        stateFunctions.Add(EGameState.Lost, new GameStateLost());
        stateFunctions.Add(EGameState.Won, new GameStateWon());

        AddTransition<GameStateTransitionStartLevel>(EGameState.Unloaded, EGameState.Play);
        AddTransition<GameStateTransitionRestart>(EGameState.Lost, EGameState.Play);
        AddTransition<GameStateTransitionRestart>(EGameState.Won, EGameState.Play);

       
    }

    void AddTransition<T>(EGameState fromState, EGameState toState)  where T : GameStateTransitionBase, new() {
        T transition = new T();
        transition.SetFromToStates(fromState, toState);


        Dictionary<EGameState, GameStateTransitionBase> transitionsFrom = null;
        if (!stateTransitions.TryGetValue(fromState, out transitionsFrom)) {
            transitionsFrom = new Dictionary<EGameState, GameStateTransitionBase>();
            stateTransitions[fromState] = transitionsFrom;
        }
        transitionsFrom.Add(toState, transition);
    }





    void TransitionToState(EGameState state) {
        GameEvents.OnGameStateExit(currentState, state);
        bool foundTransition = false;
        Dictionary<EGameState, GameStateTransitionBase> toTransitions;
        if (stateTransitions.TryGetValue(currentState, out toTransitions)) {
            GameStateTransitionBase transition;
            if (toTransitions.TryGetValue(state, out transition)) {
                currentStateTransition = transition;
                currentStateTransition.StartTransition(this);
                foundTransition = true;
            }
        }

        if (!foundTransition) {
            SetState(state);
        }
    }

    void SetState(EGameState state, bool force = false) {
        if (state == currentState && !force) {
            return;
        }
        stateTime = 0f;
        EGameState fromState = currentState;
        currentState = state;
        if (stateFunctions.ContainsKey (currentState)) {
            currentStateFunctions = stateFunctions[currentState];
        } else {
            currentStateFunctions = null;
        }
        currentStateTransition = null;
        GameEvents.OnGameStateEntered(currentState, fromState);
        //GameEvents.OnGameStateChange(fromState, currentState);
    }

    public float TimeInState() {
        return stateTime;
    }



    #endregion









}
