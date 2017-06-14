using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StraightLine : MonoBehaviour {

    public Transform start;
    public Transform end;

    public Vector3 ReadPoint(float t) {
        t = Mathf.Clamp01(t);
        return Vector3.Lerp(start.position, end.position, t);
    }
}
