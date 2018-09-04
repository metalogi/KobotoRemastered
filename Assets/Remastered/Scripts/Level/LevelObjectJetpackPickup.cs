using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectJetpackPickup : LevelObjectBase {

    public bool replenish;
    public bool replenishIfEmpty;
    public float replenishTime = 5f;

    bool canPickup;
    bool refillTrigger;
    Koboto kobotoRefillTarget;

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
            kobotoRefillTarget = koboto;
            jetpack.PickupFuel();
            animator.Play("Collect");
            SetCanPickup(false);

            if (replenish || replenishIfEmpty)
            {
                DoActionAfterUnpausedTime(() => Replenish(), replenishTime);
            }
        }
    }


    protected override void DidRestartLevel()
    {
        SetCanPickup(true);
    }

    protected override void UpdatePlay()
    {
        base.UpdatePlay();
        if (refillTrigger && kobotoRefillTarget != null)
        {
            if (replenishIfEmpty)
            {
                
                var jetpack = kobotoRefillTarget.GetAttachment<AttachmentJetpack>(EAttachmentType.Jetpack);
                if (jetpack != null)
                {
                    if (jetpack.count == 0)
                    {
                        Refill();
                    }
                }
                
            }
            else if (replenish)
            {
                Refill();
            }
        }
    
    }

    void Replenish()
    {
        refillTrigger = true;
    }

    void Refill()
    {
        refillTrigger = false;
        kobotoRefillTarget = null;
        animator.Play("Replenish");
        SetCanPickup(true);
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
