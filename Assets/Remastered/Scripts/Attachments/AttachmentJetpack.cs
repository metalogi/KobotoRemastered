using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class AttachmentJetpack : AttachmentBase {

    internal int count;

    Koboto koboto;
    float burnTimeLeft;

    const float totalBurnTime = 0.9f;
    const float maxThrust = 350f;

    Animator animator;
    AudioSource burnSound;


    public void JetpackButtonPressed()
    {
        if (count > 0 && burnTimeLeft <= 0)
        {
            burnTimeLeft = totalBurnTime;

            count--;
            Debug.Log("Firing jetpack");
            animator.Play("Fire");
            burnSound.Play();
            Koboto.Events.Trigger(KEventEnum.FiredJetpack, koboto);
        }
    }

    public void PickupFuel()
    {
        count++;
        Koboto.Events.Trigger(KEventEnum.PickedUpJetpack, koboto);
    }

    public override void OnAttachToKoboto(Koboto koboto)
    {
        base.OnAttachToKoboto(koboto);
        this.koboto = koboto;
        animator = GetComponent<Animator>();
        burnSound = GetComponent<AudioSource>();
    }

    public override void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters)
    {
        if (burnTimeLeft <= 0)
        {
            return;
        }

        float t = 1f - burnTimeLeft / totalBurnTime; // normalized time

        Func<float, float> f_sin = (float s) => Mathf.Sin(s * Mathf.PI);
        Func<float, float> f_parab = (float s) => 1 - (s - 1) * (s - 1);
        Func<float, float, float> f_skewedSin = (float s, float skew) => f_sin(Mathf.Lerp(t, f_parab(t), skew));

        t = f_skewedSin(t, 0.5f);
        

        moveForce.airMove = sensors.upVector * maxThrust * t;
       
        burnTimeLeft -= Time.fixedDeltaTime;

        moveForce.tiltAngle = 25f * input.move;
        moveForce.tiltStrength = 0.2f;
        moveForce.airDrag = 1f;

        moveForce.airMove += sensors.forwardVector * input.move * 120f;

        moveForce.airForcesSet = true;


        if (burnTimeLeft <= 0)
        {
            burnTimeLeft = 0f;
            Debug.Log("Jetpack done");
        }
    }

}
