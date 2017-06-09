using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public delegate void KobotoEventHandler(Koboto koboto);

public enum KEventEnum {
    Rescued,
    Died
}


public static class KobotoEvents   {

    static Dictionary<KEventEnum, KEvent> events = new Dictionary<KEventEnum, KEvent> {
        {KEventEnum.Rescued, new KEvent()},
        {KEventEnum.Died, new KEvent()}

    };


    public class KEvent {
        public  event KobotoEventHandler kEvent;

        public void Trigger(Koboto koboto) {
            if (kEvent != null) {
                kEvent(koboto);
            }
        }

        public void AddListener(KobotoEventHandler listener) {
            kEvent -= listener;
            kEvent += listener;
        }

        public void RemoveListener(KobotoEventHandler listener) {
            kEvent -= listener;
        }
    }
        

    public static void AddListener(KEventEnum eventType, KobotoEventHandler listener) {
        KEvent e;
        if (events.TryGetValue(eventType, out e)) {
            e.AddListener(listener);
        }
    }

    public static void Trigger(KEventEnum eventType, Koboto koboto) {
        KEvent e;
        if (events.TryGetValue(eventType, out e)) {
            e.Trigger(koboto);
        }
    }



}
