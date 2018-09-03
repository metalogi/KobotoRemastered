//#define DEBUG_STATES
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public enum EGameEvent
{
    CollectedBonusToken
}

public static class GameEvents
{

    static Dictionary<EGameEvent, GameEventBase> events = new Dictionary<EGameEvent, GameEventBase>
    {
        {EGameEvent.CollectedBonusToken, new GameEvent<BonusTokenData>()}
    };

    public abstract class GameEventData{}
    public abstract class GameEventBase{}

    public class GameEventNoData : GameEventBase
    {
        public delegate void GameEventHandler();
        public event GameEventHandler gEvent;

        public void Trigger()
        {
            if (gEvent != null)
            {
                gEvent();
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

    public class GameEvent<T> : GameEventBase  where T : GameEventData
    {
        public delegate void GameEventHandler(T args);
        public event GameEventHandler gEvent;

        public void Trigger(T args)
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

    public static void AddListener(EGameEvent eventType, GameEventNoData.GameEventHandler listener)
    {
        GameEventBase e;
        if (events.TryGetValue(eventType, out e) && (e is GameEventNoData))
        {
            ((GameEventNoData)e).AddListener(listener);
        }
    }

    public static void RemoveListener(EGameEvent eventType, GameEventNoData.GameEventHandler listener)
    {
        GameEventBase e;
        if (events.TryGetValue(eventType, out e) && (e is GameEventNoData))
        {
            ((GameEventNoData)e).RemoveListener(listener);
        }
    }

    public static void Trigger(EGameEvent eventType)
    {
        GameEventBase e;
        if (events.TryGetValue(eventType, out e) && (e is GameEventNoData))
        {
            ((GameEventNoData)e).Trigger();
        }
    }


    public static void AddListener<T>(EGameEvent eventType, GameEvent<T>.GameEventHandler listener) where T:GameEventData
    {
        GameEventBase e;
        if (events.TryGetValue(eventType, out e) && (e is GameEvent<T>))
        {
            ((GameEvent<T>)e).AddListener(listener);
        }
    }

    public static void RemoveListener<T>(EGameEvent eventType, GameEvent<T>.GameEventHandler listener) where T : GameEventData
    {
        GameEventBase e;
        if (events.TryGetValue(eventType, out e) && (e is GameEvent<T>))
        {
            ((GameEvent<T>)e).RemoveListener(listener);
        }
    }

    public static void Trigger<T>(EGameEvent eventType, T args) where T:GameEventData
    {
        GameEventBase e;
        if (events.TryGetValue(eventType, out e) && (e is GameEvent<T>))
        {
            ((GameEvent<T>)e).Trigger(args);
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
