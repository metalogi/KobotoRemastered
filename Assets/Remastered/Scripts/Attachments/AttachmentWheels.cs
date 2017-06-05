using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentWheels : AttachmentBase {


    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
        if (sensors.onGround) {
            Vector3 driveForce =  input.move * parameters.groundMoveStength * sensors.groundForward;
            Debug.Log("Adding wheel drive force " + driveForce);
            moveForce.groundMove += driveForce;

            moveForce.upTarget = sensors.groundNormal;
        } else {
            moveForce.upTarget = Quaternion.AngleAxis(input.move * 45f, Vector3.right) * Vector3.up;
        }
    }
	
}
