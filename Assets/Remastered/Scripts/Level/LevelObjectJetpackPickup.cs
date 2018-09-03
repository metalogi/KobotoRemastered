using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectJetpackPickup : LevelObjectBase {

    bool canPickup;

    Animator animator;

    protected override void Init(EGameState gameState)
    {
        base.Init(gameState);
        animator = GetComponent<Animator>();
    }

    protected override void OnKobotoEnter(Koboto koboto)
    {
        base.OnKobotoEnter(koboto);

        if (!canPickup)
        {
            return;
        }

        var jetpack = koboto.GetAttachment<AttachmentJetpack>(EAttachmentType.Jetpack);
        if (jetpack != null)
        {
            jetpack.PickupFuel();
            animator.Play("Collect");
            SetCanPickup(false);
        }
    }

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState)
    {
        base.DidEnterGameState(gameState, fromState);
        if (gameState == EGameState.Play && (fromState != EGameState.Paused && fromState != EGameState.Map))
        {
            SetCanPickup(true);
        }
    }

    void SetCanPickup(bool b)
    {
        Debug.Log("Can pickup " + b);
        canPickup = b;

        if (canPickup)
        {
            FadeAlpha(1.0f, 3f);
        }
        else
        {
            FadeAlpha(0.0f, 3f, 0.15f);
        }
        
        FadeAlpha(canPickup ? 1.0f : 0f, canPickup ? 3f : 3f);
    }
}
