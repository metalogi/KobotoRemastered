using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIJetpackButton : UIAttachmentButton {

    public Text countText;
    int count;

    Koboto targetKoboto;

    public override void Init(UIGame uiGame)
    {
        base.Init(uiGame);
        KobotoEvents.AddListener(KEventEnum.Selected, OnKobotoSelect);
        KobotoEvents.AddListener(KEventEnum.FiredJetpack, OnKobotoJetpackEvent);
        KobotoEvents.AddListener(KEventEnum.PickedUpJetpack, OnKobotoJetpackEvent);
    }

    protected override void OnClick()
    {
        if (uiGame == null)
        {
            return;
        }
        uiGame.JetpackButtonPressed(this);
        Debug.Log("Jet pack button pressed");
    }

    void OnKobotoSelect(Koboto koboto)
    {
        targetKoboto = koboto;
        UpdateCount();
    }

    void OnKobotoJetpackEvent(Koboto koboto)
    {
        if (koboto == targetKoboto)
        {
            UpdateCount();
        }
    }

    void UpdateCount()
    {
        count = 0;
        if (targetKoboto != null)
        {
            var jetpack = targetKoboto.GetAttachment<AttachmentJetpack>(EAttachmentType.Jetpack);
            if (jetpack != null)
            {
                count = jetpack.count;
            }
        }

        countText.text = count.ToString();

        button.image.color = count>0? Color.white : new Color(1.0f, 1.0f, 1.0f, 0.5f);
    }
}
