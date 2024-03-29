﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public class AttachmentBase : MonoBehaviour {


    public EAttachmentType attachmentType;

    Quaternion airBaseRotation;

    public EColliderType colliderType;

    public bool alwaysAttached = false;

    public void Remove() {
        GameObject.Destroy(gameObject);
    }

    public virtual void OnAttachToKoboto(Koboto koboto) {
        
    }

    public virtual void OnRemoveFromKoboto(Koboto koboto)
    {

    }

    public virtual void UpdateKoboto(Koboto koboto, KobotoSensor sensor) {
    }

    public virtual void KobotoEnteredState(Koboto koboto, KobotoState state) {

    }

    public virtual void ModifyMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
    }

    public virtual void ModifyCameraPivot(ref Vector3 cameraPivotOffset)
    {

    }

    protected virtual void ApplyStandardModification(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {

       


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
