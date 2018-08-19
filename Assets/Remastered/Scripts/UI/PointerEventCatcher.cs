using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class PointerEventCatcher  : MonoBehaviour, IBeginDragHandler, IEndDragHandler, IDragHandler, IPointerDownHandler {

    public void OnBeginDrag (PointerEventData eventData){
        UIEvents.Trigger(EPointerEvent.DragStart, eventData);
    }

    public void OnEndDrag (PointerEventData eventData) {
        UIEvents.Trigger(EPointerEvent.DragEnd, eventData);
    }

    public void OnDrag (PointerEventData eventData) {
        UIEvents.Trigger(EPointerEvent.Drag, eventData);
    }


    public void OnPointerDown(PointerEventData eventData) {
        UIEvents.Trigger(EPointerEvent.PointerDown, eventData);
    }

	
}
