using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class Utils {

    public static float TiltFromUpVector(Vector3 up) {
        float angle = Vector3.Angle(Vector3.up, up);
        if (up.z <0) angle *= -1;
        return angle;
    }
}
