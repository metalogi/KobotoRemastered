using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelZoneWind : LevelZone {

    public float windSpeed = 1f;

    protected override void UpdateSensor(KobotoSensor kSense, Vector2 pointInZone)
    {
        float strength = (1f - pointInZone.x * pointInZone.x) * windSpeed;
        float velComp = Mathf.Clamp(Vector3.Dot(kSense.velocity, transform.forward), 0, strength);
        strength = strength - velComp;
        Debug.Log("wind strength " + strength);
        
        kSense.windSpeed += transform.forward * strength;

    }
}
