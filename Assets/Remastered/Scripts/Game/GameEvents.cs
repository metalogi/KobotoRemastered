//#define DEBUG_STATES
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;


public static class GameEvents  {

    public enum GameEventEnum
    {
        CollectedBonusToken
    }

    static Dictionary<GameEventEnum, GameEvent> events = new Dictionary<GameEventEnum, GameEvent> {
        {GameEventEnum.CollectedBonusToken, new GameEvent()}
    };

    public abstract class GameEventArguments
    {

    }
    public delegate void GameEventHandler(GameEventArguments args);

    public class GameEvent
    {
        public event GameEventHandler gEvent;

        Type argumentType;
            

        public void Trigger(GameEventArguments args)
        {
            if (gEvent != null)
            {
                gEvent(args);
            }
        }

        public void AddListener(GameEventHandler listener)
        {
            gEvent -= listener;
            gEvent += listener;
        }

        public void RemoveListener(GameEventHandler listener)
        {
            gEvent -= listener;
        }
    }


    public static void AddListener(GameEventEnum eventType, GameEventHandler listener)
    {
        GameEvent e;
        if (events.TryGetValue(eventType, out e))
        {
            e.AddListener(listener);
        }
    }

    public static void Trigger(GameEventEnum eventType, GameEventArguments args)
    {
        GameEvent e;
        if (events.TryGetValue(eventType, out e))
        {
            e.Trigger(args);
        }
    }

    

    #region GameState

    public static EGameState gameState {get; private set;}



    public delegate void GameStateChangeEventHandler(EGameState fromState, EGameState toState);

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




   

	
}
