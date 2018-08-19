using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class DragCam : KCam {

    Plane dragPlane;

    Vector2 dragStartPos;
    Vector3 camDragStartPos;

    Vector3 dragPlaneUp;
    Vector3 dragPlaneRight;

    Vector2 dragPos;

    bool dragging;

    bool cancelled;


	public void Start() {

        //dragControl.dragDelegate = this;
        dragPlane = new Plane (Vector3.right, Vector3.zero);
	}

    public override void SetActive (bool active)
    {
        base.SetActive (active);
//        if (active) {
//            cancelled = false;
//        }
    }

    public void SetFocus(Vector3 focus, float depth) {
       
        transform.position = focus - transform.forward * depth;
    }


    protected override void OnDragStart(PointerEventData eventData) {
        if (!isActive) {
            return;
        }

        dragging = true;

        Debug.Log("Drag cam start");

        cancelled = false;
        dragStartPos =  eventData.position;
        camDragStartPos = transform.position;

        dragPos = dragStartPos;

        Vector3 topLeftW = GetWorldSpaceDragPos (Vector2.zero);
        Vector3 bottomRightW = GetWorldSpaceDragPos(new Vector2(Screen.width, Screen.height));
        dragPlaneUp = (topLeftW.y - bottomRightW.y) * Vector3.up;
        dragPlaneRight = (topLeftW.z - bottomRightW.z) * Vector3.forward;
    }

    protected override void OnDrag(PointerEventData eventData) {
     
        if (!isActive || cancelled) {
            return;
        }
        Vector3 topLeftW = GetWorldSpaceDragPos (Vector2.zero);
        Vector3 bottomRightW = GetWorldSpaceDragPos(new Vector2(Screen.width, Screen.height));
        dragPlaneUp = (topLeftW.y - bottomRightW.y) * Vector3.up;
        dragPlaneRight = (topLeftW.z - bottomRightW.z) * Vector3.forward;

        Vector2 dragDelta = eventData.delta;

        Vector3 dragDeltaWorld = new Vector3(0, -eventData.delta.y, -eventData.delta.x);

        if (eventData.delta.sqrMagnitude > 0f && inForbiddenZone && Vector3.Dot(dragDeltaWorld, forbiddenDirection) > 0)
        {

            dragDelta = Vector2.Lerp(dragDelta, Vector2.zero, forbiddenStrength);
        }

        dragPos += dragDelta;

        Vector2 dragTotalDelta = dragPos - dragStartPos;

        Vector3 pos = camDragStartPos + dragPlaneRight * dragTotalDelta.x / Screen.width + dragPlaneUp * dragTotalDelta.y / Screen.height;

        transform.position = pos;
    }

    protected override void OnDragStop(PointerEventData eventData)
    {
        dragging = false;
    }

    public void LateUpdate()
    {
        if (!dragging && inForbiddenZone)
        {
            transform.position = Vector3.Lerp(transform.position, forbiddenExit, 3f * Time.fixedDeltaTime);
        }
    }


    Vector3 GetWorldSpaceDragPos(Vector2 screenSpacePos) {
        float planeDist;
        Ray camRay = camera.ScreenPointToRay (screenSpacePos);
        if (dragPlane.Raycast (camRay, out planeDist)) {
            return camRay.origin + camRay.direction * planeDist;
        }
        return Vector3.zero;
    }
	

}
