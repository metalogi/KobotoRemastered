using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StraightLine : AbstractLine {

    public Transform start;
    public Transform end;

    public bool hidePoints = true;

    public void Awake() {
        if (hidePoints) {
            Renderer r = start.GetComponent<Renderer>();
            if (r != null) {
                r.enabled = false;
            }
            r = end.GetComponent<Renderer>();
            if (r != null) {
                r.enabled = false;
            }
        }
        
    }

    public override Vector3 ReadPoint(float t) {
        t = Mathf.Clamp01(t);
        return Vector3.Lerp(start.position, end.position, t);
    }
}
