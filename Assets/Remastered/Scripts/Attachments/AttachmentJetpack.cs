using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentJetpack : AttachmentBase {

    public int count;

    Koboto koboto;
    float burnTimeLeft;

    const float totalBurnTime = 0.9f;
    const float maxThrust = 400f;


    public void JetpackButtonPressed()
    {
        if (count > 0 && burnTimeLeft <= 0)
        {
            burnTimeLeft = totalBurnTime;

            count--;
            Debug.Log("Firing jetpack");
            KobotoEvents.Trigger(KEventEnum.FiredJetpack, koboto);

        }
    }

    public void PickupFuel()
    {
        count++;
        KobotoEvents.Trigger(KEventEnum.PickedUpJetpack, koboto);
    }

    public override void OnAttachToKoboto(Koboto koboto)
    {
        base.OnAttachToKoboto(koboto);
        this.koboto = koboto;
    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters)
    {
        if (burnTimeLeft <= 0)
        {
            return;
        }

        moveForce.airMove = sensors.upVector * maxThrust * burnTimeLeft / totalBurnTime;
        moveForce.airForcesSet = true;
        burnTimeLeft -= Time.fixedDeltaTime;

        if (burnTimeLeft <= 0)
        {
            burnTimeLeft = 0f;
            Debug.Log("Jetpack done");
        }
    }

}
