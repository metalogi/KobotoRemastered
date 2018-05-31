using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentParachute : AttachmentBase {

    public GameObject chute;
    public GameObject pack;

    bool open;

    PDController dragControl;
    float dragP = 5f;
    float dragD = 0.1f;

    const float downSpeedForOpen = -0.2f;

    const float terminalVelocity= -0.1f;


    public override void OnAttachToKoboto(Koboto koboto)
    {
        base.OnAttachToKoboto(koboto);
        dragControl = new PDController(dragP, dragD);
        chute.SetActive(false);

    }

    public override void OnRemoveFromKoboto(Koboto koboto)
    {
        base.OnRemoveFromKoboto(koboto);
        koboto.ResetCenterOfMass();
    }

    public override void UpdateKoboto(Koboto koboto, KobotoSensor sensor)
    {
        base.UpdateKoboto(koboto, sensor);
        bool shouldOpen = false;
        bool shouldClose = false;
        shouldClose |= sensor.onGround;
        shouldClose |= sensor.onCeiling;

        shouldClose |= sensor.velocity.y > 0f;

        shouldOpen = !shouldClose && sensor.velocity.y < downSpeedForOpen;

     //   Debug.Log("speed " + sensor.velocity.y + " should open " + shouldOpen + " should close " + shouldClose);

        if (!open && shouldOpen)
        {
            Open(koboto);
        }
        else if (open && shouldClose)
        {
            Close(koboto);
        }
    }

    void Open(Koboto k)
    {
        Debug.Log("Open");
        pack.SetActive(false);
        chute.SetActive(true);
        open = true;
        k.SetCenterOfMassOffset(Vector3.up * 3f);
    }

    void Close(Koboto k)
    {
        Debug.Log("Close");
        pack.SetActive(true);
        chute.SetActive(false);
        open = false;
        k.ResetCenterOfMass();
    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters)
    {
        if (!open)
        {
            return;
        }
        float speedError = terminalVelocity - sensors.velocity.y;
        float upDragForce = dragControl.Update(speedError, Time.fixedDeltaTime);

      //  float upDragForce = 15f;
      //  Debug.Log("Up force " + upDragForce);

        moveForce.tiltAngle = -25f * input.move;
        moveForce.tiltStrength = 0.2f;
        moveForce.airDrag = 1f;


        moveForce.airMove += Vector3.up * upDragForce + sensors.forwardVector * input.move * 80f;
        moveForce.airMove += sensors.windSpeed;
        moveForce.airForcesSet = true;

        
    }
}
