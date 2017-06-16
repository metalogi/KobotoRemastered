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

        const float magnetStrengthMax = 10f;
        const float magnetStrengthMin = 2f;
        const float magnetDist = 8f;

        if (belowMagnetic) {
            float t = Mathf.Clamp01((magnetDist - sensors.localCeilingDist)/magnetDist);
            moveForce.airMove += sensors.upVector * Mathf.Lerp(magnetStrengthMin, magnetStrengthMax, t);
        }

    }
}
