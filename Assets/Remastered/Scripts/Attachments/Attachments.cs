using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Attachments  {

    static Dictionary<EAttachmentType, GameObject> templates;


    public static AttachmentBase CreateNewAttachment(EAttachmentType type) {
        if (templates == null) {
            templates = new Dictionary<EAttachmentType, GameObject>();
        }

        GameObject template = null;
        if (!templates.TryGetValue(type, out template)) {
            template = Resources.Load<GameObject>("Prefabs/Attachments/" + type.ToString());
            templates[type] = template;
        }

        var attachmentObj = GameObject.Instantiate(template);
        return attachmentObj.GetComponent<AttachmentBase>();

    }
}
