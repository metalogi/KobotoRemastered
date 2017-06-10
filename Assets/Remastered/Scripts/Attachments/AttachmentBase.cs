using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public class AttachmentBase : MonoBehaviour {


    public EAttachmentType attachmentType;
    //public EAttachmentTarget attachmentTarget;

    // size to add to koboto collider when attached
   // public float kobotoColliderExtendUp;
   // public float kobotoColliderExtendDown;

    public EColliderType colliderType;

    public void Remove() {
        GameObject.Destroy(gameObject);
    }

    public virtual void OnAttachToKoboto(Koboto koboto) {
        
    }

    public virtual void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
    }


	
}
