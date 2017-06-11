using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentWheels : AttachmentBase {


    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
        moveForce.dynamicFriction = 0f;
        moveForce.staticFriction = 0f;

        if (sensors.onGround) {
           // moveForce.airDrag = 0f;

            Vector3 driveForce =  input.move * parameters.groundMoveStength * sensors.groundForward;
            moveForce.groundMove += driveForce;

            moveForce.upRotation = Utils.TiltFromUpVector(sensors.groundNormal);
            moveForce.tiltAngle = 0f;
            moveForce.tiltStrength = 1f;
        } else {
           // moveForce.airDrag = 0.3f;
            Vector3 airMove = input.move * parameters.airMoveStrength * Vector3.forward;
            moveForce.airMove += airMove;
            moveForce.upRotation = Quaternion.identity;
//            float speed = sensors.velocity.magnitude;
//            Vector3 direction = sensors.velocity.normalized;
//
//            float speedContribution = Mathf.Clamp(speed, 0f, 1f) * (1f - Mathf.Abs(direction.y));
//
//            Quaternion speedRot = Utils.TiltFromUpVector(Vector3.Cross(sensors.velocity.normalized, Vector3.right));
//            moveForce.upRotation = Quaternion.Lerp(Quaternion.identity, speedRot, speedContribution);


            moveForce.tiltAngle = 45f * input.move;
            moveForce.tiltStrength = 0.1f * Mathf.Clamp(sensors.inAirTime, 0f, 1f);
        }
    }
	
}
