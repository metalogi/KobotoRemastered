using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectBonusToken : LevelObjectBase {

    static Material defaultMaterial;
    static Material ghostMaterial;

    public int index;

    bool alreadyCollected;
    bool collected;
    MeshRenderer[] renderers;

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState)
    {
        base.DidEnterGameState(gameState, fromState);
        if (gameState == EGameState.Intro || (gameState == EGameState.Play && fromState == EGameState.Lost))
        {
            if (defaultMaterial == null)
            {
                defaultMaterial = Resources.Load<Material>("Materials/tokenDefault");
            }
            if (ghostMaterial == null)
            {
                ghostMaterial = Resources.Load<Material>("Materials/tokenFade");
            }
            if (renderers == null)
            {
                renderers = GetComponentsInChildren<MeshRenderer>();
            }
            
            LoadCollectedState();
            
        }
        else if (gameState == EGameState.Won)
        {
            if (collected && !alreadyCollected)
            {
                GameEvents.Trigger<BonusTokenData>(EGameEvent.CollectedBonusToken, new BonusTokenData { worldNumber = worldNumber, levelNumber = levelNumber, index = index });
            }
        }
    }

    void LoadCollectedState()
    {
        if (ProgressManager.instance != null)
        {
            alreadyCollected = ProgressManager.instance.GetBonusTokenCollected(ProgressManager.CurrentWorldNumber, ProgressManager.CurrentWorldNumber, index);
        }
        
        SetCollected(alreadyCollected);
    }

    void SetCollected(bool state)
    {
        collected = state;
        if (collected)
        {
            foreach(var renderer in renderers)
            {
                renderer.sharedMaterial = ghostMaterial;
            }
        }
        else
        {
            foreach (var renderer in renderers)
            {
                renderer.sharedMaterial = defaultMaterial;
            }
        }
    }

    protected override void OnKobotoEnter(Koboto koboto)
    {
        base.OnKobotoEnter(koboto);
        SetCollected(true);
    }

}

public class BonusTokenData : GameEvents.GameEventData
{
    public int worldNumber;
    public int levelNumber;
    public int index;
}
