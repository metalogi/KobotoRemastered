using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentWheels : AttachmentBase {

    public List<Transform> spokeTransforms;

    const float wheelRadius = 1f;
    private float wheelSpeed;



    public override void UpdateKoboto(Koboto koboto, KobotoSensor sensors) {
        float rollVol = 0f;
        if (sensors.onGround) {
            rollVol = Mathf.Clamp01 (sensors.velocity.magnitude / 10f);
        }
        
        koboto.soundPlayer.PlayRoll (rollVol);

        foreach (var spoke in spokeTransforms)
        {
            Debug.Log("Rotating wheel: " + wheelSpeed);
            spoke.Rotate(Vector3.right, wheelSpeed * Time.fixedDeltaTime);
        }

    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {

        // m/s to degrees/s
        const float degreesPerSecMultiplier = 180f / (Mathf.PI * wheelRadius);

        float targetV = input.move * parameters.groundMoveSpeed;

        float targetWheelSpeed = targetV;

        if (sensors.onGround) {
         
           // moveForce.airDrag = 0f;
            moveForce.dynamicFriction = 0f;
            moveForce.staticFriction = 0f;

            float groundV = Vector3.Dot(sensors.forwardWheelForward, sensors.velocity);
            
            float forceMultiplier = 1f;
            if (Mathf.Sign(targetV) == Mathf.Sign(groundV)) {
                float t = Mathf.Clamp01(Mathf.Abs(groundV)/parameters.groundMoveSpeed);
                forceMultiplier = parameters.groundAccelerationCurve.Evaluate(t);
            }

            Vector3 driveForce =  forceMultiplier * input.move * parameters.groundMoveStength * sensors.forwardWheelForward;
            moveForce.groundMove += driveForce;

            moveForce.upRotation = Utils.TiltFromUpVector(sensors.forwardWheelNormal);
           
            moveForce.tiltAngle = 0f;
            moveForce.tiltStrength = 1f;

            moveForce.groundForcesSet = true;

            float groundWheelSpeed = Vector3.Dot(sensors.velocity, sensors.forwardWheelForward);

            float spinFactor = Mathf.Abs(targetWheelSpeed) * Mathf.Abs((targetWheelSpeed - groundWheelSpeed));
            float minSpin = 0.1f;
            float maxSpin = 8f;

            wheelSpeed = Mathf.Lerp(groundWheelSpeed, targetWheelSpeed, Utils.Smoothstep(minSpin, maxSpin, spinFactor)) * degreesPerSecMultiplier;

           
      

        } else {
            moveForce.airTiltResponse = Mathf.Clamp01(sensors.inAirTime * 2f);
            moveForce.airMoveResponse = 1f;
            moveForce.upRotation = Quaternion.identity;

            wheelSpeed = targetWheelSpeed * degreesPerSecMultiplier * 1.5f;
            

        }
    }
	
}
