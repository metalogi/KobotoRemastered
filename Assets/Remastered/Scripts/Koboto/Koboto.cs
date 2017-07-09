using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public class KobotoMoveForce {
    public Vector3 groundMove;
    public float dynamicFriction;
    public float staticFriction;

    public Vector3 airMove;
    public float airDrag;

    public Quaternion upRotation;
    public float tiltAngle;
    public float tiltStrength;

    public void Clear(KobotoParameters parameters) {
        groundMove.Set(0,0,0);
        airMove.Set(0,0,0);
        upRotation = Quaternion.identity;
        tiltAngle = 0f;
        dynamicFriction = parameters.defaultDynamicFriction;
        staticFriction = parameters.defaultStaticFriction;
        airDrag = parameters.defaultAirDrag;
    }

    public Vector3 TotalForce() {
       // Debug.Log("Ground: " + groundMove + " Air: " + airMove);
        return groundMove + airMove;
    }
}

public enum KobotoState {
    Asleep,
    Alive,
    Rescued,
    Dead
}

public enum KobotoDeath {
    Imapaled,
    Lost,
    Drowned,
    Squashed
}


public class Koboto : KobotoMonoRigidbody {

    public BoxCollider boxCollider;
    public CapsuleCollider capsuleCollider;

    public KobotoState currentState {get; private set;}
    float stateTime;

    Dictionary<EAttachmentTarget, Transform> attachmentTargetLookup;

    Dictionary<EAttachmentTarget, AttachmentBase> attachmentTargetContents;

    Dictionary<EAttachmentType, AttachmentBase> currentAttachments;

    List<EAttachmentType> attachmentOrder = new List<EAttachmentType>(){
        EAttachmentType.Wheels,
        EAttachmentType.Magnet,
        EAttachmentType.Spring,
        EAttachmentType.Propellor,
        EAttachmentType.DoubleWheels,
        EAttachmentType.Parachute
    };

    KobotoParameters parameters;

    Collider activeCollider;
    PhysicMaterial physMat;
    Vector3 colliderBaseCenter;
    Vector3 colliderBaseSize;

    Vector3 colliderCenterTarget;
    Vector3 colliderSizeTarget;
    KobotoSensor sensors;
    KobotoMoveForce moveForce;

    PIDController tiltController;
    // for testing pd values at runtime
    [SerializeField]
    float tiltControllerP = 6f;
    [SerializeField]
    float tiltControllerI = 0.05f;
    [SerializeField]
    float tiltControllerD = 0.8f;
    [SerializeField]
    bool tiltControllerEditParams;

    Quaternion upRotation;
    float tiltAngle;

    bool levelBoundsSet;
    Bounds levelBounds;

    Transform defaultParent;

    bool doFixedUpdate;

	

    protected override void Init(EGameState gameState) {
        parameters = GetComponent<KobotoParameters>();

        tiltController = new PIDController(tiltControllerP, tiltControllerI, tiltControllerD);
      
        sensors = new KobotoSensor();
        moveForce = new KobotoMoveForce();
        colliderBaseCenter = boxCollider.center;
        colliderBaseSize = boxCollider.size;

        physMat = boxCollider.material;
        capsuleCollider.sharedMaterial = boxCollider.sharedMaterial;

        physMat.name = "KobotoPhysMat";

        upRotation = Quaternion.identity;
        tiltAngle = 0f;


        attachmentTargetContents = new Dictionary<EAttachmentTarget, AttachmentBase>();
        attachmentTargetLookup = new Dictionary<EAttachmentTarget, Transform>();
        currentAttachments = new Dictionary<EAttachmentType, AttachmentBase>();
        var attachPoints = GetComponentsInChildren<KobotoAttachPoint>();
        foreach (var point in attachPoints) {
            attachmentTargetLookup.Add(point.targetType, point.transform);
        }


      //  AddAttachment(EAttachmentType.Wheels);
        doFixedUpdate = (gameState == EGameState.Play);
        SetupCollider ();
        defaultParent = transform.parent;
        Debug.Log("Koboto init in state: " + gameState);
    }



    protected override void DidEnterGameState(EGameState gameState, EGameState fromState) {
        base.DidEnterGameState(gameState, fromState);
        Debug.Log("Koboto detected game state change : " + gameState);
        doFixedUpdate = (gameState == EGameState.Play);

       
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

        Debug.Log("Adding attachment: " + type + " to " + target);
    
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
            Debug.Log("Removeing attachment: " + type + " from " + target);

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

    public void SetLevelBounds(Bounds bounds) {
        levelBounds = bounds;
        levelBoundsSet = true;
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



    public void Rescue(LevelObjectHome home) {
        SetState(KobotoState.Rescued);
        KobotoEvents.Trigger(KEventEnum.Rescued, this);
    }

    public void Kill(KobotoDeath deathType, Transform killer) {
        SetState(KobotoState.Dead);

        switch (deathType) {
        case KobotoDeath.Imapaled:
            StartCoroutine(ImpaleAnim(killer));
            break;
        }
    }

    IEnumerator ImpaleAnim(Transform impaler) {

        rb.isKinematic = true;

        Vector3 sink = -1.0f * impaler.up;

        rb.MoveRotation(rb.rotation * Quaternion.AngleAxis(Random.Range(-15f,15f), Vector3.right));

        while (currentState == KobotoState.Dead) {
            Vector3 pos = rb.position + sink * Time.deltaTime;
            sink *= 0.98f;
            rb.MovePosition(pos);
            yield return null;
        }
        yield break;
    }

    public void ParentToTransform(Transform t) {
        transform.parent = t;
    }
        

    public void SetState(KobotoState newState) {
        if (newState != currentState) {
            currentState = newState;
            stateTime = 0f;
        }

        switch (currentState) {

        case KobotoState.Alive:
            rb.isKinematic = false;
            ParentToTransform (defaultParent);
            break;

        case KobotoState.Asleep:
            rb.isKinematic = false;
         
            break;

        case KobotoState.Rescued:
            rb.isKinematic = true;
            break;
        }
    }

    public float TimeInCurrentState() {
        return stateTime;
    }

    public float GetSpeed() {
        return sensors.velocity.magnitude;
    }

    public void FixedUpdate() {

        if (!doFixedUpdate) {
            return;
        }

        if (tiltControllerEditParams) {
            tiltController.AdjustPD (tiltControllerP, tiltControllerI, tiltControllerD);
        }

        switch (currentState) {
        case KobotoState.Alive:
            SetMoveForceFromInput();
            if (levelBoundsSet && !levelBounds.Contains(transform.position)) {
                Kill(KobotoDeath.Lost, null);
            }
            break;
        }
        stateTime += Time.fixedDeltaTime;
    }

    void SetMoveForceFromInput() {

        moveForce.Clear(parameters);
        InputData inputData = InputManager.Instance.Read();


        sensors.UpdateAll(transform, activeCollider);

        NoAttachmentsMoveForce(moveForce, inputData, sensors, parameters);
        if (currentAttachments.Count == 0) {
           // NoAttachmentsMoveForce(moveForce, inputData, sensors, parameters);
        } else {

            foreach (var attachmentType in attachmentOrder) {
                if (currentAttachments.ContainsKey(attachmentType)) {
                    AttachmentBase attachment = currentAttachments[attachmentType];
                    attachment.ModifyMoveForce(moveForce, inputData, sensors, parameters);
                }

            }
        }

        physMat.dynamicFriction = moveForce.dynamicFriction;
        physMat.staticFriction = moveForce.staticFriction;
        rb.drag = moveForce.airDrag;

        rb.AddForce(moveForce.TotalForce());

        upRotation = Quaternion.Lerp(upRotation, moveForce.upRotation, 0.5f);
        tiltAngle = Mathf.Lerp(tiltAngle, moveForce.tiltAngle, moveForce.tiltStrength);

        float tiltTargetAngle = Utils.AngleFromWorldUp(upRotation) + tiltAngle;
        float currentTiltAngle = Utils.AngleFromWorldUp(transform.up);


        float tiltAngleError = tiltTargetAngle - currentTiltAngle;

        float correction = tiltController.Update(tiltAngleError, Time.fixedDeltaTime);
        rb.AddTorque(correction * Vector3.right);

    }

    public void NoAttachmentsMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
        if (sensors.onGround) {
            moveForce.upRotation = Utils.TiltFromUpVector(sensors.groundNormal);
            moveForce.tiltAngle = 0f;
            moveForce.tiltStrength = 1f;
        } else {
            moveForce.upRotation = Quaternion.identity;
            moveForce.tiltAngle = 0f;
            moveForce.tiltStrength = 0.5f;

            moveForce.airMove = input.move * Vector3.forward * parameters.airMoveStrength;
        }
    }

   

}
