using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class Utils {

    public static float AngleFromWorldUp(Vector3 up) {
        float angle = Vector3.Angle(Vector3.up, up);
        if (up.z <0) angle *= -1;
        return angle;
    }

    public static float AngleFromWorldUp(Quaternion tilt) {
        Vector3 up = tilt * Vector3.up;
        return AngleFromWorldUp(up);
    }

    public static Quaternion TiltFromUpVector(Vector3 upVector) {
        return Quaternion.FromToRotation(Vector3.up, upVector);
    }

    public static Quaternion TiltFromInput(float input, Vector3 upVector, float maxAngle) {
        Vector3 newUp = Quaternion.AngleAxis(input * maxAngle, Vector3.right) * upVector;
        return Quaternion.FromToRotation(Vector3.up, newUp);
    }

    public static Vector2 GamePlaneVector(Vector3 v)
    {
        return new Vector2(v.z, v.y);
    }
}
