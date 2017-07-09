using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameStateVisibilty : KobotoMono {


    public EGameState stateMask;
    public bool play;
    public bool pause;
    public bool map;

    CanvasGroup canvasGroup;


    void Awake() {
        canvasGroup = GetComponent<CanvasGroup>();
    }

    protected override void DidEnterGameState (EGameState gameState, EGameState fromState)
    {
        base.DidEnterGameState(gameState, fromState);
        bool show  = ((gameState & stateMask) == gameState);
        Debug.Log("showing " + gameObject.name + " " + show);
        canvasGroup.interactable = show;
        canvasGroup.blocksRaycasts = show;
        canvasGroup.alpha = show? 1f : 0f;

            
    }

}
