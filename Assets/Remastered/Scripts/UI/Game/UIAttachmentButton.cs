using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

[RequireComponent (typeof(Button))]
public class UIAttachmentButton : MonoBehaviour {

    public EAttachmentType attachmentType;
    protected Button button;
    protected UIGame uiGame;
   

    public virtual void Init(UIGame uiGame) {
        this.uiGame = uiGame;
    }

    public void OnEnable() {
        if (button == null) {
            button = GetComponent<Button> ();
        }

        button.onClick.AddListener(OnClick);
    }

    public void OnDisable() {
        button.onClick.RemoveListener(OnClick);
    }


    public void Show(bool show) {
        gameObject.SetActive (show);
    }


    protected virtual void OnClick() {
        if (uiGame == null) {
            return;
        }
        uiGame.AttachmentButtonPressed(this, attachmentType);

    }

  
        
}
