using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentWheels : AttachmentBase {

    Quaternion airBaseRotation;

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
        

        if (sensors.onGround) {
         
           // moveForce.airDrag = 0f;
            moveForce.dynamicFriction = 0f;
            moveForce.staticFriction = 0f;

            float groundV = Vector3.Dot(sensors.forwardWheelForward, sensors.velocity);
            float targetV = input.move * parameters.groundMoveSpeed;

            float forceMultiplier = 1f;
            if (Mathf.Sign(targetV) == Mathf.Sign(groundV)) {
                float t = Mathf.Clamp01(Mathf.Abs(groundV)/parameters.groundMoveSpeed);
                forceMultiplier = parameters.groundAccelerationCurve.Evaluate(t);
            }

            Vector3 driveForce =  forceMultiplier * input.move * parameters.groundMoveStength * sensors.forwardWheelForward;
            moveForce.groundMove += driveForce;

            moveForce.upRotation = Utils.TiltFromUpVector(sensors.forwardWheelNormal);
            airBaseRotation = moveForce.upRotation;
            moveForce.tiltAngle = 0f;
            moveForce.tiltStrength = 1f;
        } else {


            Debug.Log ("Off ground");
           // moveForce.airDrag = 0.3f;
  
            moveForce.upRotation = airBaseRotation;

            moveForce.tiltStrength = 1f;

            float inputTiltAmount = 45f * Mathf.Clamp01(sensors.inAirTime - 0.5f);

            moveForce.tiltAngle = inputTiltAmount * input.move;

            if (sensors.inAirTime > 0.5f) {
                airBaseRotation = Quaternion.Lerp (airBaseRotation, Quaternion.identity, 4f * Time.fixedDeltaTime);
            }


        }
    }
	
}
