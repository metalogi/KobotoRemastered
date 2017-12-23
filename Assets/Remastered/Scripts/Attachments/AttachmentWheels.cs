using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentWheels : AttachmentBase {

    Quaternion airBaseRotation;

    public override void UpdateKoboto(Koboto koboto, KobotoSensor sensors) {
        float rollVol = 0f;
        if (sensors.onGround) {
            rollVol = Mathf.Clamp01 (sensors.velocity.magnitude / 10f);
        }
        koboto.soundPlayer.PlayRoll (rollVol);
       
    }

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

            const float alignToGroundStartDist = 6f;
            const float alignToGroundEndDist = 2f;

            float speed = sensors.velocity.magnitude;

            float alignStart = alignToGroundStartDist;
            float alignEnd = alignToGroundEndDist;

            if (sensors.inAirTime > 0.5f 
                && speed > 0.1f
                && sensors.closeToGround &&
                sensors.distanceToGround < alignStart &&
                sensors.closestGroundNormal.y > 0.1f &&
                Vector3.Dot(sensors.velocity.normalized, sensors.closestGroundNormal) < 0.1f) {

                Quaternion groundAlign = Utils.TiltFromUpVector(sensors.closestGroundNormal);
                Quaternion currentRot = Utils.TiltFromUpVector(sensors.upVector);
                if (sensors.distanceToGround > alignEnd) {
                    groundAlign = Quaternion.Lerp(currentRot, groundAlign, 8f * Time.fixedDeltaTime);
                }
                float t = Mathf.Clamp01((alignStart - sensors.distanceToGround)/(alignStart - alignEnd));
                moveForce.upRotation = Quaternion.Lerp(airBaseRotation, groundAlign, t);
                moveForce.tiltStrength = Mathf.Clamp01(1f - 4f*t);
            } else {

                moveForce.upRotation = airBaseRotation;
                moveForce.tiltStrength = 1f;
                float inputTiltAmount = 45f * Mathf.Clamp01(sensors.inAirTime - 0.5f);
                moveForce.tiltAngle = inputTiltAmount * input.move;
            }


            if (sensors.inAirTime > 0.5f) {
                airBaseRotation = Quaternion.Lerp(airBaseRotation, Quaternion.identity, 4f * Time.fixedDeltaTime);
            }


        }
    }
	
}
