using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum EAttachmentType {
    Wheels,
    DoubleWheels,
    Spring,
    Magnet,
    Propellor,
    Parachute,
    Hammer
}

public enum EAttachmentTarget {
    Wheels,
    Bottom,
    Top,
    Front
}

public enum EColliderType {
    Box,
    Capsule
}

public static class Attachments  {

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

    public static EAttachmentTarget AttachmentTarget(EAttachmentType type) {
        switch (type) {
        case EAttachmentType.Wheels:
            return EAttachmentTarget.Wheels;

        case EAttachmentType.Spring:
            return EAttachmentTarget.Bottom;

        case EAttachmentType.Hammer:
            return EAttachmentTarget.Front;
        }
        
        return EAttachmentTarget.Top;
    }

}
