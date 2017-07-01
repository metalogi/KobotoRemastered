using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SwipeCam : KCam {

    public Vector3 targetOffset;

    List<Vector3> targetPoints;
    int currentTargetIndex;

    public override void Start() {
        base.Start();
        targetPoints = new List<Vector3>();
    }

    public void AddTarget(Vector3 targetPos) {
        targetPoints.Add(targetPos);
    }

    public void JumpToTarget(int targetIndex) {
        currentTargetIndex = targetIndex;
        transform.position = targetPoints[targetIndex] + targetOffset;
    }


//    public override void OnDragStart(Vector2 dragPosition) {
//
//    }
//
//    public override void OnDrag(Vector2 dragPosition, bool direct) {
//
//  
//    }
//
//    public override void OnDirectDragStop(Vector2 dragPositon) {
//    }
//
//    public override void OnDragStop(Vector2 dragPositon) {
//    }

}
