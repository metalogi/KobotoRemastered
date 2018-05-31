using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelZoneCameraModifier : LevelZone {

    public float camDistance;

    protected override void UpdateSensor(KobotoSensor kSense, Vector2 pointInZone)
    {
        kSense.cameraPushOut = camDistance;

    }
}
