using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public class KobotoMoveForce {
    public Vector3 groundMove;
    public float dynamicFriction;
    public float staticFriction;

    public Vector3 airMove;
    public float airDrag;

    public float airMoveResponse;
    public float airTiltResponse;

    public Quaternion upRotation;
    public float tiltAngle;
    public float tiltStrength;

    public ForceMode forceMode;

    public bool airForcesSet;
    public bool groundForcesSet;
    public bool alignToCeiling;

    public bool useGravity;

    public void Clear(KobotoParameters parameters) {
        groundMove.Set(0,0,0);
        airMove.Set(0,0,0);
        upRotation = Quaternion.identity;
        tiltAngle = 0f;
        dynamicFriction = parameters.defaultDynamicFriction;
        staticFriction = parameters.defaultStaticFriction;
        airDrag = parameters.defaultAirDrag;
        forceMode = ForceMode.Force;
        airForcesSet = false;
        groundForcesSet = false;
        alignToCeiling = false;
        airMoveResponse = 0f;
        airTiltResponse = 0f;
        useGravity = true;
    }

    public Vector3 TotalForce() {
      //  Debug.Log("Ground: " + groundMove + " Air: " + airMove);
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
    [HideInInspector]
    public KobotoSoundPlayer soundPlayer;

    public KobotoState currentState {get; private set;}
    float stateTime;

    Dictionary<EAttachmentTarget, Transform> attachmentTargetLookup;

    Dictionary<EAttachmentTarget, AttachmentBase> attachmentTargetContents;

    Dictionary<EAttachmentType, AttachmentBase> currentAttachments;

    List<EAttachmentType> attachmentOrder = new List<EAttachmentType>(){
        EAttachmentType.Jetpack,
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
    List<LevelZone> levelZones;

    Transform defaultParent;

    bool doFixedUpdate;

    Vector3 defaultCom;

	

    protected override void Init(EGameState gameState) {
        parameters = GetComponent<KobotoParameters>();
        soundPlayer = GetComponent<KobotoSoundPlayer> ();

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

        defaultCom = rb.centerOfMass;


        attachmentTargetContents = new Dictionary<EAttachmentTarget, AttachmentBase>();
        attachmentTargetLookup = new Dictionary<EAttachmentTarget, Transform>();
        currentAttachments = new Dictionary<EAttachmentType, AttachmentBase>();
        var attachPoints = GetComponentsInChildren<KobotoAttachPoint>();
        foreach (var point in attachPoints) {
            attachmentTargetLookup.Add(point.targetType, point.transform);
        }

        doFixedUpdate = (gameState == EGameState.Play);
        SetupCollider ();
        defaultParent = transform.parent;
        Debug.Log("Koboto init in state: " + gameState);
    }



    protected override void DidEnterGameState(EGameState gameState, EGameState fromState) {
        base.DidEnterGameState(gameState, fromState);
        Debug.Log("Koboto detected game state change : " + gameState);
        doFixedUpdate = (gameState == EGameState.Play);

        if (fromState == EGameState.Play) {
            soundPlayer.StopRoll ();
        }

       
    }

    public void ToggleAttachment(EAttachmentType type) {
        Debug.Log("Toggle attachment " + type);
        if (currentAttachments.ContainsKey(type)) {
            RemoveAttachmentOfType(type);
        } else {
            AddAttachment(type);
        }
    }

    public void JetpackButtonPressed()
    {
        var jetpack = GetAttachment<AttachmentJetpack>(EAttachmentType.Jetpack);
        jetpack.JetpackButtonPressed();
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

            attachment.OnRemoveFromKoboto(this);
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

    public T GetAttachment<T>(EAttachmentType type) where T : AttachmentBase
    {
        if (currentAttachments.ContainsKey(type))
        {
            return (T)currentAttachments[type];
        }
        return null;
    }

    public void SetLevelBounds(Bounds bounds) {
        levelBounds = bounds;
        levelBoundsSet = true;
    }

    public void SetLevelZones(List<LevelZone> zones)
    {
        levelZones = zones;
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
        case KobotoDeath.Drowned:
            StartCoroutine(DrownAnim());
            break;
        }
    }

    public void SetCenterOfMassOffset(Vector3 offset)
    {
        rb.centerOfMass = offset;
    }

    public void ResetCenterOfMass()
    {
        rb.centerOfMass = defaultCom;
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

    IEnumerator DrownAnim()
    {
        RemoveAttachmentOfType(EAttachmentType.Parachute);
        float drownStart = transform.position.y;
        rb.useGravity = false;
        rb.drag = 3f;
      

        rb.centerOfMass += transform.up;

        rb.angularVelocity *= 5f;

        const float bouyency = 10f;

        while (currentState == KobotoState.Dead)
        {
            float depth = drownStart - transform.position.y;
            if (depth < 0)
                depth = 0;

            rb.AddForce(bouyency * depth * Vector3.up);

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
        foreach (var attachment in currentAttachments.Values) {
            attachment.KobotoEnteredState(this, newState);
        }
    }

    public float TimeInCurrentState() {
        return stateTime;
    }

    public float GetSpeed() {
        return sensors.velocity.magnitude;
    }

    public void GetCameraInfo(out Vector3 focus, out float dist, out float tilt)
    {
        focus = transform.position;
        dist = sensors.cameraPushOut;
        bool nearCeiling = sensors.onCeiling ||( sensors.closeToCeiling && sensors.distanceToCeiling < 1.5f);
        tilt = nearCeiling ? -18f : 0f;
    }

    public void Update() {
        if (currentGameState == EGameState.Play) {
            foreach (AttachmentBase attachment in currentAttachments.Values) {
                attachment.UpdateKoboto (this, sensors);
            }
        }
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
        sensors.UpdateZones(levelZones);


        foreach (var attachmentType in attachmentOrder) {
            if (currentAttachments.ContainsKey(attachmentType)) {
                AttachmentBase attachment = currentAttachments[attachmentType];
                attachment.ModifyMoveForce(moveForce, inputData, sensors, parameters);
            }

        }
        
        ProcessMoveForce(moveForce, inputData, sensors, parameters);

        physMat.dynamicFriction = moveForce.dynamicFriction;
        physMat.staticFriction = moveForce.staticFriction;
        rb.drag = moveForce.airDrag;

        rb.useGravity = moveForce.useGravity;


        rb.AddForce(moveForce.TotalForce(), moveForce.forceMode);
        

        upRotation = Quaternion.Lerp(upRotation, moveForce.upRotation, 0.5f);
        tiltAngle = Mathf.Lerp(tiltAngle, moveForce.tiltAngle, moveForce.tiltStrength);

        float tiltTargetAngle = Utils.AngleFromWorldUp(upRotation) + tiltAngle;
        float currentTiltAngle = Utils.AngleFromWorldUp(transform.up);


        float tiltAngleError = tiltTargetAngle - currentTiltAngle;

        float correction = tiltController.Update(tiltAngleError, Time.fixedDeltaTime);
        rb.AddTorque(correction * Vector3.right);

    }

    public void ProcessMoveForce(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
        if (sensors.onGround)
        {
            if (!moveForce.groundForcesSet)
            {
                moveForce.upRotation = Utils.TiltFromUpVector(sensors.groundNormal);
                moveForce.tiltAngle = 0f;
                moveForce.tiltStrength = 1f;
            }
        } else
        {
            if (!moveForce.airForcesSet)
            {
                const float alignToGroundStartDist = 4f;
                const float alignToGroundEndDist = 1f;

                const float alignToCeilingStartDist = 5f;
                const float alignToCeilingEndDist = 2f;

                float speed = sensors.velocity.magnitude;

               // float alignStart = alignToGroundStartDist;
               // float alignEnd = alignToGroundEndDist;

                if (moveForce.alignToCeiling && sensors.inAirTime > 0f && speed > 0.1f
                 && sensors.closeToCeiling
                 && sensors.distanceToCeiling < alignToCeilingStartDist
                 && Vector3.Dot(sensors.velocity.normalized, sensors.closestCeilingNormal) < 0f)
                {

                    Quaternion ceilingAlign = Utils.TiltFromUpVector(-sensors.closestCeilingNormal);
                    Quaternion currentRot = Utils.TiltFromUpVector(sensors.upVector);
                    if (sensors.distanceToCeiling > alignToCeilingEndDist)
                    {
                        ceilingAlign = Quaternion.Lerp(currentRot, ceilingAlign, 24f * Time.fixedDeltaTime);
                    }
                    float t = Mathf.Clamp01((alignToCeilingStartDist - sensors.distanceToCeiling) / (alignToCeilingStartDist - alignToCeilingEndDist));
                    moveForce.upRotation = Quaternion.Lerp(sensors.airBaseRotation, ceilingAlign, t);
                    moveForce.tiltStrength = Mathf.Clamp01(1f - 8f * t);
                    moveForce.useGravity = false;
                    moveForce.airMove += 20.0f *  t * -sensors.closestCeilingNormal;

                    Debug.DrawRay(sensors.closestCeilingPoint, -3.0f * sensors.closestCeilingNormal, Color.yellow);
                }

                //align to ground if headed towards it
                else if (sensors.inAirTime > 0.5f
                    && speed > 0.1f
                    && sensors.closeToGround
                    && sensors.distanceToGround < alignToGroundStartDist
                    && Vector3.Dot(sensors.velocity.normalized, sensors.closestGroundNormal) < 0.1f)
                {

                    Quaternion groundAlign = Utils.TiltFromUpVector(sensors.closestGroundNormal);
                    Quaternion currentRot = Utils.TiltFromUpVector(sensors.upVector);
                    if (sensors.distanceToGround > alignToGroundEndDist) {
                        groundAlign = Quaternion.Lerp(currentRot, groundAlign, 6f * Time.fixedDeltaTime);
                    }
                    float t = Mathf.Clamp01((alignToGroundStartDist - sensors.distanceToGround) / (alignToGroundStartDist - alignToGroundEndDist));
                    moveForce.upRotation = Quaternion.Lerp(sensors.airBaseRotation, groundAlign, t);
                    moveForce.tiltStrength = Mathf.Clamp01(1f - 4f * t);
                }
                else
                {
                    // apply air move + tilt
                    moveForce.upRotation = sensors.airBaseRotation;
                    moveForce.tiltStrength = 1f;
                    moveForce.tiltAngle = moveForce.airTiltResponse * input.move * parameters.maxAirTilt ;

                    moveForce.airMove = input.move * Vector3.forward * parameters.airMoveStrength * moveForce.airMoveResponse;
                    //float inputTiltAmount = 45f * Mathf.Clamp01(sensors.inAirTime - 0.5f);
                   // moveForce.tiltAngle = inputTiltAmount * input.move;

                   // moveForce.airMove = input.move * Vector3.forward * parameters.airMoveStrength;
                }
            } 
        }
    }

    public static void ApplyAirForces(KobotoMoveForce moveForce, InputData input, KobotoSensor sensors, KobotoParameters parameters) {
    }



    }
