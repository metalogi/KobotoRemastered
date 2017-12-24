using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentPropeller : AttachmentBase {

    public float maxHeight = 15f;
    public float targetHeight = 10f;
    public float strength = 100f;
    public float motorP = 5f;
    public float motorD = 0.5f;

    public float lift = 1f;

    public float visualBladeSpeedMax = 50f;
    public float visualBladeSpeedMin = 20f;
    public float visualBladeSpeedSlowdown = 8f;

    public Transform bladeTransform;
    public GameObject dustVFX;

    float motorForce;

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

            motorForce = motorControl.Update(heightError, Time.fixedDeltaTime);

            float propSpeed = Mathf.Clamp01(motorForce/100f);
            bladeSpeed = Mathf.Lerp(visualBladeSpeedMin, visualBladeSpeedMax, propSpeed);


            moveForce.tiltAngle = 45f * input.move;
            moveForce.tiltStrength = 0.4f;
        } else {
            motorForce *= 1f - 0.2f * visualBladeSpeedSlowdown * Time.fixedDeltaTime;
            bladeSpeed *= 1f - visualBladeSpeedSlowdown * Time.fixedDeltaTime;
            dustVFX.SetActive(false);
        }

        moveForce.airMove = motorForce * strength * sensors.upVector;

        float glide = Mathf.Abs(Vector3.Dot(sensors.velocity, sensors.forwardVector));

        glide = Mathf.Clamp(glide, 0, 6f);

        Vector3 liftForce = glide * lift * sensors.upVector;

        moveForce.airMove += liftForce;

        moveForce.airForcesSet = true;

        bladeTransform.Rotate(Vector3.up * bladeSpeed, Space.Self);
    }

    public override void KobotoEnteredState(Koboto koboto, KobotoState state) {
        base.KobotoEnteredState(koboto, state);
        if (state != KobotoState.Alive) {
            dustVFX.SetActive(false);
        }
    }
}
