using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public enum KEventEnum {
    Rescued,
    Died,
    Selected,
    FiredJetpack,
    PickedUpJetpack,
    Count = 5
}


public class KobotoEvents : GameEventBus<Koboto>   {

    public static KobotoEvents CreateEventBus()
    {
        return new KobotoEvents((int)KEventEnum.Count);
    }

    protected KobotoEvents(int eventCount) : base(eventCount) {}

    public void AddListener(KEventEnum eventType, GameEvent<Koboto>.GameEventHandler listener)
    {
        AddListener((int)eventType, listener);
    }

    public void RemoveListener(KEventEnum eventType, GameEvent<Koboto>.GameEventHandler listener)
    {
        RemoveListener((int)eventType, listener);
    }

    public void Trigger(KEventEnum eventType, Koboto koboto)
    {
        Trigger((int)eventType, koboto);
    }
}
