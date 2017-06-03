using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum EAttachmentType {
    Wheels,
    DoubleWheels,
    Spring,
    Parachute
}

public enum EAttachmentTarget {
    Wheels
}

public class AttachmentBase : MonoBehaviour {

    public EAttachmentType attachmentType;
    public EAttachmentTarget attachmentTarget;

    // size to add to koboto collider when attached
    public float kobotoColliderExtendUp;
    public float kobotoColliderExtendDown;


    public virtual void OnAttachToKoboto(Koboto koboto) {
        
    }


	
}
