using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SwipeCam : KCam {

    public Vector3 targetOffset;

    List<Vector3> targetPoints;
    int currentTargetIndex;

    public void Start() {
        targetPoints = new List<Vector3>();
    }

    public void AddTarget(Vector3 targetPos) {
        targetPoints.Add(targetPos);
    }

    public void JumpToTarget(int targetIndex) {
        currentTargetIndex = targetIndex;
        transform.position = targetPoints[targetIndex] + targetOffset;
    }

    void Update() {
        transform.position = targetPoints[currentTargetIndex] + targetOffset;
    }




}
