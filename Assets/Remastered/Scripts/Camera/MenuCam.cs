using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MenuCam : MonoBehaviour, UIDragDelegate {

    public UIDrag dragControl;
    Camera camera;

    Plane dragPlane;

    Vector2 dragStartPos;
    Vector3 camDragStartPos;

    Vector3 dragPlaneUp;
    Vector3 dragPlaneRight;


	void Start () {
        camera = GetComponent<Camera> ();
        dragControl.dragDelegate = this;
        dragPlane = new Plane (Vector3.right, Vector3.zero);
	}

    public void OnDragStart(Vector2 dragPosition) {
        dragStartPos = dragPosition;
        camDragStartPos = transform.position;

        Vector3 topLeftW = GetWorldSpaceDragPos (Vector2.zero);
        Vector3 bottomRightW = GetWorldSpaceDragPos(new Vector2(Screen.width, Screen.height));
        dragPlaneUp = (topLeftW.y - bottomRightW.y) * transform.up;
        dragPlaneRight = (topLeftW.z - bottomRightW.z) * transform.right;
    }

    public void OnDrag(Vector2 dragPosition, bool direct) {
     
        Vector2 dragDelta = dragPosition - dragStartPos;
        transform.position = camDragStartPos + dragPlaneRight * dragDelta.x / Screen.width + dragPlaneUp * dragDelta.y / Screen.height;

    }

    public void OnDirectDragStop(Vector2 dragPositon) {
    }

    public void OnDragStop(Vector2 dragPositon) {
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
