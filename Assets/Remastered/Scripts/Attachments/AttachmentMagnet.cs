using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentMagnet : AttachmentBase {
   
    LineRenderer lineRenderer;

    public override void OnAttachToKoboto (Koboto koboto){
        base.OnAttachToKoboto (koboto);
        lineRenderer = GetComponent<LineRenderer>();

    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {

        bool belowMagnetic = sensors.localBelowCeiling && sensors.localBelowCeilingCollider.tag == "magnetic";

      

        const float magnetStrengthMax = 1000f;
        const float magnetStrengthMin = 100f;
        const float magnetDist = 20f;

        if (belowMagnetic) {
            
            float t = Mathf.Clamp01((magnetDist - sensors.localCeilingDist)/magnetDist);
            Vector3 magnetForce = sensors.upVector * Mathf.Lerp(magnetStrengthMin, magnetStrengthMax, t);
            moveForce.airMove += magnetForce;
           // Debug.Log("Magnet force: " + magnetForce);
        }

    }
}
