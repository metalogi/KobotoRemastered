using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentPropeller : AttachmentBase {

    public float maxHeight = 15f;
    public float targetHeight = 10f;
    public float strength = 100f;
    public float motorP = 5f;
    public float motorD = 0.5f;

    public float visualBladeSpeedMax = 50f;
    public float visualBladeSpeedMin = 20f;
    public float visualBladeSpeedSlowdown = 8f;

    public Transform bladeTransform;
    public GameObject dustVFX;

    bool resetMotor;
    PDController motorControl;
    float bladeSpeed;

    public override void OnAttachToKoboto (Koboto koboto)
    {
        base.OnAttachToKoboto (koboto);
        motorControl = new PDController(motorP, motorD);
        bladeTransform.rotation = Quaternion.identity;
        resetMotor = true; 
        dustVFX.SetActive(false);
    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {

        float height = sensors.heightAboveGround;
        bool overGround = sensors.aboveGround && height < maxHeight;

        if (overGround) {

            dustVFX.transform.position = sensors.aboveGroundPoint;
            dustVFX.SetActive(true);
           
            float heightError =  targetHeight - height;
           

            if (resetMotor) {
                motorControl.Reset(heightError);
                resetMotor = false;
            }

            float motorForce = motorControl.Update(heightError, Time.fixedDeltaTime);

            float propSpeed = Mathf.Clamp01(motorForce/100f);
            bladeSpeed = Mathf.Lerp(visualBladeSpeedMin, visualBladeSpeedMax, propSpeed);

            //motorControl.AdjustPD(motorP, motorD);
//            
//            float t = Mathf.Clamp01(sensors.heightAboveGround / targetHeight);
//            float force = forceCurve.Evaluate(t); 

            Debug.Log("Propellor force: " + motorForce);

            moveForce.airMove = motorForce * strength * sensors.upVector;

            moveForce.tiltAngle = 45f * input.move;
            moveForce.tiltStrength = 0.4f;
        } else {
            bladeSpeed *= 1f - visualBladeSpeedSlowdown * Time.fixedDeltaTime;
            dustVFX.SetActive(false);
        }

        bladeTransform.Rotate(Vector3.up * bladeSpeed, Space.Self);
    }

    public override void KobotoEnteredState(Koboto koboto, KobotoState state) {
        base.KobotoEnteredState(koboto, state);
        if (state != KobotoState.Alive) {
            dustVFX.SetActive(false);
        }
    }
}
