using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public interface UIDragDelegate {
    void OnDragStart(Vector2 dragPosition);
    void OnDrag(Vector2 dragPosition, bool direct);
    void OnDirectDragStop(Vector2 dragPosition);
    void OnDragStop(Vector2 dragPosition);

    void OnPointerDown(Vector2 position);
}

public class UIDrag : MonoBehaviour, IBeginDragHandler, IEndDragHandler, IDragHandler, IPointerDownHandler {

    public UIDragDelegate dragDelegate;
    public float slowdown = 1f;

    Vector2 dragStartPos;
    Vector2 dragPos;

    bool touching;
    bool afterTouch;
    Vector2 deltaPos;




    public void OnBeginDrag (PointerEventData eventData){
        dragStartPos = eventData.position;
        dragPos = dragStartPos;
        touching = true;
        deltaPos = Vector2.zero;
        dragDelegate.OnDragStart (dragPos);
    }

    public void OnEndDrag (PointerEventData eventData) {
        dragPos = eventData.position;
        deltaPos = eventData.delta;

        touching = false;
        afterTouch = true;
        dragDelegate.OnDragStop (dragPos);
    }

    public void OnDrag (PointerEventData eventData) {
        dragPos = eventData.position;


        
    }

    public void OnPointerDown(PointerEventData eventData) {
        dragDelegate.OnPointerDown(eventData.position);
    }

    void FixedUpdate() {
        if (touching) {
            dragDelegate.OnDrag (dragPos, true);

            
        } else if (afterTouch) {
            deltaPos *= 1f - slowdown * Time.deltaTime;
            dragPos += deltaPos;
            dragDelegate.OnDrag (dragPos, false);

            if (deltaPos.sqrMagnitude < 0.1f) {
                afterTouch = false;
            }
        }


    }

	
}
