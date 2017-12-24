using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentSpring : AttachmentBase {

    float conserve = 0.8f;
    float preferredBounceSpeed = 18f;

    public float onGroundTime = 0.5f;
    bool firstBounce;
    bool charging;

    float bounceVelNormal;
    float bounceVelTangent;

    Quaternion landingRotation;

    public override void OnAttachToKoboto(Koboto koboto) {
        base.OnAttachToKoboto(koboto);
        firstBounce = true;
    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
        if (sensors.onGround) {

            if (firstBounce) {
                charging = true;
                bounceVelNormal = preferredBounceSpeed * 0.8f;
                bounceVelTangent = 0f;

                landingRotation = Utils.TiltFromUpVector(sensors.groundNormal);
                
            } else if (!charging && sensors.landedThisFrame){
                charging = true;
                Debug.Log("Land " + sensors.velocity);

                landingRotation = Utils.TiltFromUpVector(sensors.upVector);
                
                if (sensors.positionTrail.Count < 2 ) {
                    bounceVelNormal = preferredBounceSpeed * 0.8f;
                    bounceVelTangent = 0f;
                } else {
                    Vector3 incoming = sensors.velocity;
                    bounceVelNormal = Vector3.Dot(-incoming, sensors.groundNormal);
                    bounceVelTangent = 0.35f * Vector3.Dot(incoming, sensors.groundForward);

                    float speed = incoming.magnitude;
                    bounceVelNormal = Mathf.Lerp(speed, preferredBounceSpeed, 0.8f);
                }

            }
           
            moveForce.groundMove = Vector3.zero;
            moveForce.airMove = Vector3.zero;

            moveForce.upRotation = Utils.TiltFromUpVector(sensors.groundNormal);
      

            if (charging && sensors.onGroundTime >= onGroundTime) {
                // Bounce!
                charging = false;
                firstBounce = false;

                moveForce.airMove = sensors.upVector * bounceVelNormal + sensors.groundForward * bounceVelTangent;
                moveForce.forceMode = ForceMode.VelocityChange;

            } else {
                moveForce.dynamicFriction = 1f;
                moveForce.staticFriction = 1f;

                moveForce.upRotation = landingRotation;
                moveForce.tiltStrength = 1f;

            }
        } else {
            moveForce.airMoveResponse = 1.5f;
            moveForce.airTiltResponse = 0.8f;
          
        }
    }
}
