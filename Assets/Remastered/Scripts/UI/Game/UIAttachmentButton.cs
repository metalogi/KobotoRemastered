using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

[RequireComponent (typeof(Button))]
public class UIAttachmentButton : MonoBehaviour {

    public EAttachmentType attachmentType;
    Button button;

    public void Init(UIGame uiGame) {
        if (button == null) button = GetComponent<Button>();
        button.onClick.AddListener(()=> uiGame.AttachmentButtonPressed(this, attachmentType));
    }

  
        
}
