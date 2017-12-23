using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentSpring : AttachmentBase {

    public float conserve = 0.8f;
    public float preferredHeight = 10f;

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
        if (sensors.onGround) {
           
            moveForce.groundMove = Vector3.zero;

            moveForce.upRotation = Utils.TiltFromUpVector(sensors.groundNormal);
        } else {
          //  moveForce.upRotation = Utils.TiltFromInput(input.move, Vector3.up, 45f);
        }
    }
}
