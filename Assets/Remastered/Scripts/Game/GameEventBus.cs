using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class GameEventBus<T> where T : class
{
    GameEvent<T>[] events;

    protected GameEventBus(int eventCount)
    {
        events = new GameEvent<T>[eventCount];
        for (int i = 0; i < eventCount; ++i)
        {
            events[i] = new GameEvent<T>();
        }
    }

    protected void AddListener(int eventIndex, GameEvent<T>.GameEventHandler listener)
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }

        events[eventIndex].AddListener(listener);
    }

    protected void RemoveListener(int eventIndex, GameEvent<T>.GameEventHandler listener)
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }

        events[eventIndex].RemoveListener(listener);
    }

    protected void Trigger(int eventIndex, T eventData)
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }

        events[eventIndex].Trigger(eventData);
    }
}

public abstract class GameEventBusNoData
{
    GameEventNoData[] events;

    protected GameEventBusNoData(int eventCount)
    {
        events = new GameEventNoData[eventCount];
        for (int i = 0; i < eventCount; ++i)
        {
            events[i] = new GameEventNoData();
        }
    }

    protected void AddListener(int eventIndex, GameEventNoData.GameEventHandler listener)
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }

        events[eventIndex].AddListener(listener);
    }

    protected void RemoveListener(int eventIndex, GameEventNoData.GameEventHandler listener)
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }

        events[eventIndex].RemoveListener(listener);
    }

    protected void Trigger(int eventIndex)
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }

        events[eventIndex].Trigger();
    }
}

public abstract class GenericEventBus
{
    GameEventBase[] events;

    protected GenericEventBus(List<GameEventBase> eventList)
    {
        events = eventList.ToArray();
    }

    protected void AddListener<T>(int eventIndex, GameEvent<T>.GameEventHandler listener) where T : class
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }
        ((GameEvent<T>)events[eventIndex]).AddListener(listener);
    }

    protected void RemoveListener<T>(int eventIndex, GameEvent<T>.GameEventHandler listener) where T : class
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }
        ((GameEvent<T>)events[eventIndex]).RemoveListener(listener);
    }

    protected void Trigger<T>(int eventIndex, T data) where T : class
    {
        if (eventIndex < 0 || eventIndex >= events.Length)
        {
            Debug.LogAssertion("Event index out of range");
            return;
        }
        ((GameEvent<T>)events[eventIndex]).Trigger(data);
    }
}

