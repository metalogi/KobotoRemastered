
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public abstract class GameEventBase { }

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

public class GameEvent<T> : GameEventBase where T : class
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







