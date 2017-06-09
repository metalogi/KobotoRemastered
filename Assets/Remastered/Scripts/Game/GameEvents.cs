using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public static class GameEvents  {

    #region GameState
    public delegate void GameStateChangeEventHandler(EGameState fromState, EGameState toState);
    static event GameStateChangeEventHandler GameStateChanged;
    public static void OnGameStateChange(EGameState fromState, EGameState toState) {
        Debug.Log("Game state change " + fromState + " => " + toState);
        if (GameStateChanged != null) {
            GameStateChanged(fromState, toState);
        }
    }
    public static void AddGameStateListener(GameStateChangeEventHandler listener) {
        Debug.Log("Adding game state listener");
        GameStateChanged -= listener;
        GameStateChanged += listener;
    }
    public static void RemoveGameStateListener(GameStateChangeEventHandler listener) {
        GameStateChanged -= listener;
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
