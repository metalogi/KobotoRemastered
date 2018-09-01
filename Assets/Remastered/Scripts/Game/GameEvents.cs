//#define DEBUG_STATES
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public static class GameEvents  {

    public static EGameState gameState {get; private set;}


    #region GameState
    public delegate void GameStateChangeEventHandler(EGameState fromState, EGameState toState);
//    static event GameStateChangeEventHandler GameStateChanged;
//    public static void OnGameStateChange(EGameState fromState, EGameState toState) {
//        Debug.Log("Game state change " + fromState + " => " + toState);
//
//        if (GameStateChanged != null) {
//            GameStateChanged(fromState, toState);
//        }
//    }
//    public static void AddGameStateListener(GameStateChangeEventHandler listener) {
//        Debug.Log("Adding game state listener");
//        GameStateChanged -= listener;
//        GameStateChanged += listener;
//    }
//    public static void RemoveGameStateListener(GameStateChangeEventHandler listener) {
//        GameStateChanged -= listener;
//    }

    //Entered
    static event GameStateChangeEventHandler GameStateEntered;
    public static void OnGameStateEntered(EGameState toState, EGameState fromState) {
#if DEBUG_STATES
        Debug.Log("Game state entered " + toState + " from " + fromState);
#endif
        gameState = toState;
        if (GameStateEntered != null) {
            GameStateEntered(toState, fromState);
        }
    }
    public static void AddGameStateEnteredListener(GameStateChangeEventHandler listener) {
#if DEBUG_STATES
        Debug.Log("Adding game state entered listener");
#endif
        GameStateEntered -= listener;
        GameStateEntered += listener;
    }
    public static void RemoveGameStateEnteredListener(GameStateChangeEventHandler listener) {
        GameStateEntered -= listener;
    }

    //Will exit
    static event GameStateChangeEventHandler GameStateWillExit;
    public static void OnGameStateExit(EGameState fromState, EGameState toState) {
#if DEBUG_STATES
        Debug.Log("Game state will exit " + fromState + " => " + toState);
#endif

        if (GameStateWillExit != null) {
            GameStateWillExit(fromState, toState);
        }
    }
    public static void AddGameStateExitListener(GameStateChangeEventHandler listener) {
#if DEBUG_STATES
        Debug.Log("Adding game state exit listener");
#endif
        GameStateWillExit -= listener;
        GameStateWillExit += listener;
    }
    public static void RemoveGameStateExitListener(GameStateChangeEventHandler listener) {
        GameStateWillExit -= listener;
    }
    #endregion


    #region GameEvents


    public delegate void GameEventHandler();

    public class GameEvent {
        public  event GameEventHandler gEvent;

        public void Trigger() {
            if (gEvent != null) {
                gEvent();
            }
        }

        public void AddListener(GameEventHandler listener) {
            gEvent -= listener;
            gEvent += listener;
        }

        public void RemoveListener(GameEventHandler listener) {
            gEvent -= listener;
        }
    }
    #endregion

   

	
}
