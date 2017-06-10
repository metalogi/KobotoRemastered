using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UIGame : MonoBehaviour {

    public RectTransform attachmentButtonParent;

    GameManager game;
    Dictionary<EAttachmentType, UIAttachmentButton> attachmentButtons;

    public void Init(GameManager gameManger) {
        game = gameManger;
        attachmentButtons = new Dictionary<EAttachmentType, UIAttachmentButton>();
        foreach (var attachmentButton in attachmentButtonParent.GetComponentsInChildren<UIAttachmentButton>()) {
            attachmentButton.Init(this);
            attachmentButtons.Add(attachmentButton.attachmentType, attachmentButton);
        }
    }

    public void AttachmentButtonPressed(UIAttachmentButton button, EAttachmentType type) {
        game.currentLevel.ToggleAttachmentOnSelectedKoboto(type);
    }
}
