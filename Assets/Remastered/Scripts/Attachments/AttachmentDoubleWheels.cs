using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentDoubleWheels : AttachmentBase
{

    float minUpForce = 10f;
    float maxUpForce = 400f;
    public override void UpdateKoboto(Koboto koboto, KobotoSensor sensors)
    {
        float rollVol = 0f;
        if (sensors.onGround)
        {
            rollVol = Mathf.Clamp01(sensors.velocity.magnitude / 10f);
        }
        koboto.soundPlayer.PlayRoll(rollVol);

    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters)
    {
        if (sensors.onGround)
        {
            // moveForce.airDrag = 0f;
            moveForce.dynamicFriction = 0f;
            moveForce.staticFriction = 0f;

            float groundV = Vector3.Dot(sensors.forwardWheelForward, sensors.velocity);
            float targetV = input.move * parameters.groundMoveSpeed;

            float forceMultiplier = 1f;
            if (Mathf.Sign(targetV) == Mathf.Sign(groundV))
            {
                float t = Mathf.Clamp01(Mathf.Abs(groundV) / parameters.groundMoveSpeed);
                forceMultiplier = parameters.groundAccelerationCurve.Evaluate(t);
            }

            Vector3 driveForce = forceMultiplier * input.move * parameters.groundMoveStength * sensors.forwardWheelForward;
            moveForce.groundMove += driveForce;

            moveForce.upRotation = Utils.TiltFromUpVector(sensors.forwardWheelNormal);

            moveForce.tiltAngle = 0f;
            moveForce.tiltStrength = 1f;

            moveForce.groundForcesSet = true;
        }
        else if (sensors.onCeiling)
        {
            // moveForce.airDrag = 0f;
            moveForce.dynamicFriction = 0f;
            moveForce.staticFriction = 0f;

            float groundV = Vector3.Dot(sensors.topForwardWheelForward, sensors.velocity);
            float targetV = input.move * parameters.groundMoveSpeed;

            float forceMultiplier = 1f;
            if (Mathf.Sign(targetV) == Mathf.Sign(groundV))
            {
                float t = Mathf.Clamp01(Mathf.Abs(groundV) / parameters.groundMoveSpeed);
                forceMultiplier = parameters.groundAccelerationCurve.Evaluate(t);
            }

            Vector3 driveForce = forceMultiplier * input.move * parameters.groundMoveStength * sensors.topForwardWheelForward;
            moveForce.groundMove += driveForce;

            moveForce.upRotation = Utils.TiltFromUpVector(-sensors.topForwardWheelNormal);

            moveForce.tiltAngle = 0f;
            moveForce.tiltStrength = 1f;

            moveForce.groundForcesSet = true;

            moveForce.airMove = -sensors.topForwardWheelNormal * maxUpForce;
            moveForce.airForcesSet = true;
            moveForce.useGravity = false;
        }
        else
        {
            //if (sensors.belowCeiling && sensors.belowCeilingDist < 1.5f)
            //{
            //    Debug.Log("Near ceiling");
            //    moveForce.upRotation = Utils.TiltFromUpVector(-sensors.topForwardWheelNormal);
            //    moveForce.tiltAngle = 0f;
            //    moveForce.tiltStrength = 1f - sensors.belowCeilingDist / 1.5f;
            //    moveForce.useGravity = false;
            //    moveForce.airForcesSet = true;
            //}
            //else
            {
                moveForce.alignToCeiling = true;
            }
            //moveForce.airTiltResponse = 0.5f * Mathf.Clamp01(sensors.inAirTime - 0.5f);
            //moveForce.airMoveResponse = 1f;
            

        }
    }

}
