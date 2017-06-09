using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public class KobotoMoveForce {
    public Vector3 groundMove;
    public float groundFriction;

    public Vector3 airMove;
    public float airDrag;

    public Vector3 upTarget;

    float defaultGroundFriction = 0;
    float defaultAirDrag = 0;


    public void Clear() {
        groundMove.Set(0,0,0);
        airMove.Set(0,0,0);
        groundFriction = defaultGroundFriction;
        airDrag = defaultAirDrag;

    }
}

public enum KobotoState {
    Asleep,
    Alive,
    Rescued,
    Dead
}


public class Koboto : MonoBehaviour {

    public BoxCollider boxCollider;
    public CapsuleCollider capsuleCollider;

    public KobotoState currentState {get; private set;}

    Dictionary<EAttachmentTarget, Transform> attachmentPointLookup;

    Dictionary<EAttachmentTarget, AttachmentBase> attachmentPointContents;

    Dictionary<EAttachmentType, AttachmentBase> currentAttachments;

    List<EAttachmentType> attachmentOrder = new List<EAttachmentType>(){
        EAttachmentType.Wheels
    };

    KobotoParameters parameters;

    Collider activeCollider;
    Rigidbody rb;
    Vector3 colliderBaseCenter;
    Vector3 colliderBaseSize;

    Vector3 colliderCenterTarget;
    Vector3 colliderSizeTarget;
    KobotoSensor sensors;
    KobotoMoveForce moveForce;

    PDController tiltController;

	

    public void Awake() {
        parameters = GetComponent<KobotoParameters>();

        tiltController = new PDController(12f, 0.8f);
        rb = GetComponent<Rigidbody>();
        sensors = new KobotoSensor();
        moveForce = new KobotoMoveForce();
        colliderBaseCenter = boxCollider.center;
        colliderBaseSize = boxCollider.size;
        attachmentPointContents = new Dictionary<EAttachmentTarget, AttachmentBase>();
        attachmentPointLookup = new Dictionary<EAttachmentTarget, Transform>();
        currentAttachments = new Dictionary<EAttachmentType, AttachmentBase>();
        var attachPoints = GetComponentsInChildren<KobotoAttachPoint>();
        foreach (var point in attachPoints) {
            attachmentPointLookup.Add(point.targetType, point.transform);
        }


        AddAttachment(EAttachmentType.Wheels);
    }



    public void AddAttachment(EAttachmentType type) {
        var attachment = Attachments.CreateNewAttachment(type);

        Transform attachToTransform = GetAttachmentTargetTransform(attachment.attachmentTarget);
        attachment.transform.SetParent(attachToTransform, false);
        attachmentPointContents[attachment.attachmentTarget] = attachment;
        currentAttachments[attachment.attachmentType] = attachment;
        //RecalculateColliderBounds();
        SetupCollider(attachment.colliderType);

        attachment.OnAttachToKoboto(this);
    }

    public Transform GetAttachmentTargetTransform(EAttachmentTarget target) {
        Transform t = transform;
        attachmentPointLookup.TryGetValue(target, out t);
        return t;

    }

    void SetupCollider(EColliderType colType) {
        switch (colType) {
        case EColliderType.Box:
            boxCollider.enabled = true;
            capsuleCollider.enabled = false;
            activeCollider = boxCollider;
            break;
        case EColliderType.Capsule:
            boxCollider.enabled = false;
            capsuleCollider.enabled = true;
            activeCollider = capsuleCollider;
            break;
        }


        
    }

    public void SetState(KobotoState newState) {
        if (newState != currentState) {
            currentState = newState;
        }

        switch (currentState) {

        case KobotoState.Alive:
            rb.isKinematic = false;
            break;

        case KobotoState.Asleep:
            rb.isKinematic = false;
            break;

        case KobotoState.Rescued:
            rb.isKinematic = true;
            break;

        

        }
    }

    public void Rescue(LevelObjectHome home) {
        SetState(KobotoState.Rescued);
        KobotoEvents.Trigger(KEventEnum.Rescued, this);
    }



    public void FixedUpdate() {

        if (currentState == KobotoState.Alive) {
            SetMoveForceFromInput();
        }
    }

    void SetMoveForceFromInput() {

        moveForce.Clear();
        InputData inputData = InputManager.Instance.Read();


        sensors.UpdateAll(transform, activeCollider);

        if (currentAttachments.Count == 0) {
            NoAttachmentsFixedUpdate();
            return;
        }

        float targetSpeed = 0;


        foreach (var attachmentType in attachmentOrder) {
            if (currentAttachments.ContainsKey(attachmentType)) {
                AttachmentBase attachment = currentAttachments[attachmentType];
                attachment.ModifyMoveForce(moveForce, inputData, sensors, parameters);
            }

        }

        rb.AddForce(moveForce.groundMove);
       
        float tiltTarget = Utils.TiltFromUpVector(moveForce.upTarget);
        float currentTilt = Utils.TiltFromUpVector(transform.up);


        float tiltError = tiltTarget - currentTilt;

        float correction = tiltController.Update(tiltError, Time.fixedDeltaTime);
        rb.AddTorque(correction * Vector3.right);

    }

    public void NoAttachmentsFixedUpdate() {
    }

   

}
