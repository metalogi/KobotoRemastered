using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public enum EPointerEvent {
    PointerDown,
    PointerUp,
    DragStart,
    Drag,
    DragEnd
}

public static class UIEvents  {

    public delegate void PointerEventHandler(PointerEventData eventData);



    static Dictionary<EPointerEvent, KPointerEvent> events = new Dictionary<EPointerEvent, KPointerEvent> {
        {EPointerEvent.PointerDown, new KPointerEvent()},
        {EPointerEvent.DragStart, new KPointerEvent()},
        {EPointerEvent.Drag, new KPointerEvent()}
    };

    public static void AddListener(EPointerEvent eventType, PointerEventHandler listener) {
        KPointerEvent e;
        if (events.TryGetValue(eventType, out e)) {
            e.AddListener(listener);
        }
    }

    public static void RemoveListener(EPointerEvent eventType, PointerEventHandler listener) {
        KPointerEvent e;
        if (events.TryGetValue(eventType, out e)) {
            e.RemoveListener(listener);
        }
    }

    public static void Trigger(EPointerEvent eventType, PointerEventData pointerData) {
        KPointerEvent e;
        if (events.TryGetValue(eventType, out e)) {
            Debug.Log("Pointer event " + eventType);
            e.Trigger(pointerData);
        }
    }


    public class KPointerEvent {
        public event PointerEventHandler pEvent;

        public void Trigger(PointerEventData pointerData) {
            if (pEvent != null) {
                pEvent(pointerData);

            }
        }

        public void AddListener(PointerEventHandler listener) {
            pEvent -= listener;
            pEvent += listener;
        }

        public void RemoveListener(PointerEventHandler listener) {
            pEvent -= listener;
        }
    }


       



}
