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

    Dictionary<EAttachmentTarget, Transform> attachmentTargetLookup;

    Dictionary<EAttachmentTarget, AttachmentBase> attachmentTargetContents;

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
        attachmentTargetContents = new Dictionary<EAttachmentTarget, AttachmentBase>();
        attachmentTargetLookup = new Dictionary<EAttachmentTarget, Transform>();
        currentAttachments = new Dictionary<EAttachmentType, AttachmentBase>();
        var attachPoints = GetComponentsInChildren<KobotoAttachPoint>();
        foreach (var point in attachPoints) {
            attachmentTargetLookup.Add(point.targetType, point.transform);
        }


        AddAttachment(EAttachmentType.Wheels);
    }

    public void ToggleAttachment(EAttachmentType type) {
        Debug.Log("Toggle attachment " + type);
        if (currentAttachments.ContainsKey(type)) {
            RemoveAttachmentOfType(type);
        } else {
            AddAttachment(type);
        }
    }

    public void AddAttachment(EAttachmentType type) {
        AttachmentBase attachment = Attachments.CreateNewAttachment(type);
        EAttachmentTarget target = Attachments.AttachmentTarget(type);

        RemoveAttachmentFromTarget(target);

       

      
        Transform attachToTransform = GetAttachmentTargetTransform(target);
        attachment.transform.SetParent(attachToTransform, false);
        attachmentTargetContents[target] = attachment;
        currentAttachments[attachment.attachmentType] = attachment;
    
        SetupCollider();

        attachment.OnAttachToKoboto(this);
    }

    public void RemoveAttachmentFromTarget(EAttachmentTarget target) {
        AttachmentBase attachment = null;


        if (attachmentTargetContents.TryGetValue(target, out attachment)) {
            attachment.Remove();
            EAttachmentType type = attachment.attachmentType;
            currentAttachments.Remove(type);
            attachmentTargetContents.Remove(target);
            SetupCollider();

        }
    }

    public void RemoveAttachmentOfType(EAttachmentType type) {
        AttachmentBase attachment = null;
        if (currentAttachments.TryGetValue(type, out attachment)) {
            attachment.Remove();
            EAttachmentTarget target = Attachments.AttachmentTarget(type);

            currentAttachments.Remove(type);
            attachmentTargetContents.Remove(target);
            SetupCollider();
        }
    }


    public Transform GetAttachmentTargetTransform(EAttachmentTarget target) {
        Transform t = transform;
        attachmentTargetLookup.TryGetValue(target, out t);
        return t;

    }

    void SetupCollider() {
     
        var attachments = new List<AttachmentBase>(currentAttachments.Values);
        bool useCapsule = attachments.Count > 0 && !(attachments.TrueForAll((AttachmentBase a) => a.colliderType == EColliderType.Box));

        boxCollider.enabled = !useCapsule;
        capsuleCollider.enabled = useCapsule;
      
        if (useCapsule) {
            activeCollider = capsuleCollider;
        } else {
            activeCollider = boxCollider;
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
            NoAttachmentsMoveForce(moveForce, inputData, sensors, parameters);
        } else {

            foreach (var attachmentType in attachmentOrder) {
                if (currentAttachments.ContainsKey(attachmentType)) {
                    AttachmentBase attachment = currentAttachments[attachmentType];
                    attachment.ModifyMoveForce(moveForce, inputData, sensors, parameters);
                }

            }
        }

        rb.AddForce(moveForce.groundMove);
       
        float tiltTarget = Utils.TiltFromUpVector(moveForce.upTarget);
        float currentTilt = Utils.TiltFromUpVector(transform.up);


        float tiltError = tiltTarget - currentTilt;

        float correction = tiltController.Update(tiltError, Time.fixedDeltaTime);
        rb.AddTorque(correction * Vector3.right);

    }

    public void NoAttachmentsMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
        if (sensors.onGround) {
            moveForce.upTarget = sensors.groundNormal;
        } else {
            moveForce.upTarget = Vector3.up;
        }
    }

   

}
