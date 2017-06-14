using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIGame : KobotoMono {

    public RectTransform attachmentButtonParent;
    public RectTransform navButtonParent;
    public RectTransform navButtonGroupWin;


    GameManager game;
    Dictionary<EAttachmentType, UIAttachmentButton> attachmentButtons;
    RectTransform currentNavButtons = null;
    Animator navButtonAnimator;
    RectTransform root;

    public void Init(GameManager gameManger) {
        root = (RectTransform)transform;
        game = gameManger;
        attachmentButtons = new Dictionary<EAttachmentType, UIAttachmentButton>();
        foreach (var attachmentButton in attachmentButtonParent.GetComponentsInChildren<UIAttachmentButton>()) {
            attachmentButton.Init(this);
            attachmentButtons.Add(attachmentButton.attachmentType, attachmentButton);
        }
        navButtonAnimator = navButtonParent.GetComponent<Animator>();
    }

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState) {
        base.DidEnterGameState(gameState, fromState);
        switch(gameState) {
        case EGameState.Won:
            ShowNavButtons(navButtonGroupWin);
            break;
        }
    }

    protected override void WillExitGameState(EGameState gameState, EGameState toState) {
        base.WillExitGameState(gameState, toState);
        switch(gameState) {
        case EGameState.Won:
            HideNavButtons();
            break;
        }
    }

    void ShowNavButtons(RectTransform buttonGroupTransform) {
        if (currentNavButtons != null) {
            currentNavButtons.SetParent(root, false);
            currentNavButtons.gameObject.SetActive(false);
        }
        currentNavButtons = buttonGroupTransform;
        buttonGroupTransform.SetParent(navButtonParent, false);
        buttonGroupTransform.gameObject.SetActive(true);
        navButtonAnimator.SetTrigger("Show");

    }

    void HideNavButtons() {
        navButtonAnimator.SetTrigger("Hide");
    }




    public void AttachmentButtonPressed(UIAttachmentButton button, EAttachmentType type) {
        game.currentLevel.ToggleAttachmentOnSelectedKoboto(type);
    }

    public void NextLevelButtonPressed(){
        game.RequestState(EGameState.LoadNextLevel);
    }
}
