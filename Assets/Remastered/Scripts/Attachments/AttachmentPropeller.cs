using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentPropeller : AttachmentBase {

    public float maxHeight = 15f;
    public float targetHeight = 10f;
    public float strength = 100f;
    public float motorP = 5f;
    public float motorD = 0.5f;

    bool resetMotor;
    PDController motorControl;

    public override void OnAttachToKoboto (Koboto koboto)
    {
        base.OnAttachToKoboto (koboto);
        motorControl = new PDController(motorP, motorD);
        resetMotor = true; 
    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {

        float height = sensors.heightAboveGround;
        bool overGround = sensors.aboveGround && height < maxHeight;

        if (overGround) {
            

            float heightError =  targetHeight - height;
           

            if (resetMotor) {
                motorControl.Reset(heightError);
                resetMotor = false;
            }

            float motorForce = motorControl.Update(heightError, Time.fixedDeltaTime);

            //motorControl.AdjustPD(motorP, motorD);
//            
//            float t = Mathf.Clamp01(sensors.heightAboveGround / targetHeight);
//            float force = forceCurve.Evaluate(t); 

            Debug.Log("Propellor force: " + motorForce);

            moveForce.airMove = motorForce * strength * sensors.upVector;

            moveForce.tiltAngle = 45f * input.move;
            moveForce.tiltStrength = 0.4f;
        }
    }
}
