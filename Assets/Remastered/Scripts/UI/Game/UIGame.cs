using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIGame : KobotoMono {

    public RectTransform attachmentButtonParent;
    public RectTransform navButtonParent;
    public RectTransform navButtonGroupWin;
    public RectTransform buttonGroupPauseMenu;


    GameManager game;
    Dictionary<EAttachmentType, UIAttachmentButton> attachmentButtons;
    CanvasGroup attachmentButtonGroup;
    RectTransform currentNavButtons = null;
    Animator navButtonAnimator;
    RectTransform root;

    public void Init(GameManager gameManger) {
        root = (RectTransform)transform;
        attachmentButtonGroup = attachmentButtonParent.GetComponent<CanvasGroup> ();
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
        case EGameState.Play:
            ShowAttachmentButtons(game.currentLevel.availableAttachments);
            break;
        case EGameState.Won:
            ShowNavButtons (navButtonGroupWin);
            break;
        case EGameState.Paused:
            ShowNavButtons(buttonGroupPauseMenu);
            break;
        }
    }

    protected override void WillExitGameState(EGameState gameState, EGameState toState) {
        base.WillExitGameState(gameState, toState);
        switch(gameState) {
        case EGameState.Play:
            HideAttachmentButtons();
            break;
        case EGameState.Won:
        case EGameState.Paused:
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

    void ShowAttachmentButtons(List<EAttachmentType> availableAttachments) {
        foreach (var kvp in attachmentButtons) {
            kvp.Value.Show (availableAttachments.Contains (kvp.Key));
        }
        attachmentButtonGroup.alpha = 1f;
        attachmentButtonGroup.interactable = true;
        attachmentButtonGroup.blocksRaycasts = true;
    }

    void HideAttachmentButtons() {
        attachmentButtonGroup.alpha = 0f;
        attachmentButtonGroup.interactable = false;
        attachmentButtonGroup.blocksRaycasts = false;
    }


    public void AttachmentButtonPressed(UIAttachmentButton button, EAttachmentType type) {
        game.AttachmentButtonPressed(type);

    }

    public void JetpackButtonPressed(UIAttachmentButton button)
    {
        game.JetpackButtonPressed();
    }


    public void NextLevelButtonPressed(){
        game.LoadNextLevel();
    }

    public void RestartButtonPressed() {
        game.RestartCurrentLevel();
    }

    public void ResumeButtonPressed() {
        game.ResumeCurrentLevel();
    }

    public void MenuButtonPressed() {
        game.ReturnToMenu();
    }

    public void PauseButtonPressed() {
        game.Pause();
    }

    public void MapButtonPressed() {
        game.ShowMap();
    }

    public void MapBackButtonPressed() {
        game.HideMap();
    }
}
