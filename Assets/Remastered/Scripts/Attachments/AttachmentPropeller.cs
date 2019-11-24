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

    bool overGround;
    Vector3 groundPoint;
    Vector3 groundVector;

    public override void OnAttachToKoboto (Koboto koboto)
    {
        base.OnAttachToKoboto (koboto);
        motorControl = new PDController(motorP, motorD);
        bladeTransform.rotation = Quaternion.identity;
        resetMotor = true; 
        dustVFX.SetActive(false);
    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {


        bool wasOverGround = overGround;
        bool overGroundLocal = sensors.localAboveGround && sensors.localGroundDist < maxHeight;
        bool overGroundVertical = sensors.aboveGround && sensors.heightAboveGround < maxHeight;

        overGround = overGroundLocal || overGroundVertical;

        if (overGround)
        {
            Vector3 point;
            if (overGround && overGroundLocal)
            {
                point = (sensors.aboveGroundPoint + sensors.localAboveGroundPoint) * 0.5f;
            }
            else
            {
                point = overGroundLocal ? sensors.localAboveGroundPoint : sensors.aboveGroundPoint;
            }
            if (!wasOverGround)
            {
                groundPoint = point;
            }
            else
            {
                groundPoint = Vector3.Lerp(groundPoint, point, 4f * Time.fixedDeltaTime);
            }

            groundVector =  groundPoint - sensors.positionTrail[0];
            float height = groundVector.magnitude;
          
            dustVFX.transform.position = groundPoint;
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

    public override void ModifyCameraPivot(ref Vector3 cameraPivotOffset)
    {
        float amount = 0.25f;
        float yAmount = 0.5f;
        cameraPivotOffset.Set(amount* groundVector.x, yAmount * groundVector.y, amount * groundVector.z);
    }

    public override void KobotoEnteredState(Koboto koboto, KobotoState state) {
        base.KobotoEnteredState(koboto, state);
        if (state != KobotoState.Alive) {
            dustVFX.SetActive(false);
            overGround = false;
        }
    }
}
