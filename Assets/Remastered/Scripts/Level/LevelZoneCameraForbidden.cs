using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelZoneCameraForbidden : LevelZone
{
    public float strengthMax = 1f;
    public float strengthMin;

    public void UpdateCamera(KCam cam)
    {
        var pos = cam.camera.transform.position;
        Vector2 relPos = Vector2.zero;
        if (Test(pos, ref relPos))
        {
            cam.inForbiddenZone = true;
            float vPos = (1f - Mathf.Clamp(relPos.y, 0, 1f));
            cam.forbiddenStrength = Mathf.Lerp(strengthMin, strengthMax, vPos);
            Debug.Log("Forbidden: " + cam.forbiddenStrength);

            cam.forbiddenDirection = -transform.up;
            cam.forbiddenExit = pos + transform.up * vPos * extentVPos;
        }
    }
}
