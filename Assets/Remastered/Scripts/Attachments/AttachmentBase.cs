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

    public virtual void UpdateKoboto(Koboto koboto, KobotoSensor sensor) {
    }

    public virtual void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
    }

    protected Quaternion TiltFromUpVector(Vector3 upVector) {
        return Quaternion.FromToRotation(Vector3.up, upVector);
    }

    protected Quaternion TiltFromInput(InputData input, Vector3 upVector, float maxAngle) {
        Vector3 newUp = Quaternion.AngleAxis(input.move * maxAngle, Vector3.right) * upVector;
        return Quaternion.FromToRotation(Vector3.up, newUp);
    }

//    protected Vector3 TiltFromInput(InputData input, Vector3 upVector, float maxAngle) {
//        return Quaternion.AngleAxis(input.move * maxAngle, Vector3.right) * upVector;
//    }

	
}
