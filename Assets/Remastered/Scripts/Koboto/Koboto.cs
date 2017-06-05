using System.Collections;
using System.Collections.Generic;
using UnityEngine;




public class KobotoSensor {

    public bool onGround;
    public Vector3 groundForward;
    public Vector3 groundNormal;


    Transform transform;
    BoxCollider boxCollider;

    Probe downProbe = new Probe(true, Vector3.zero, Vector3.down);
    Probe upProbe = new Probe(true, Vector3.zero, Vector3.up);
    Probe forwardProbe = new Probe(true, Vector3.zero, Vector3.forward);
    Probe backProbe = new Probe(true, Vector3.zero, Vector3.back);

    Probe localDownProbe = new Probe(false, 0.9f*Vector3.down, Vector3.down);
    Probe localUpProbe = new Probe(false, 0.9f*Vector3.up, Vector3.up);
    Probe localForwardProbe = new Probe(false, 0.9f*Vector3.forward, Vector3.forward);
    Probe localBackProbe = new Probe(false, 0.9f*Vector3.forward, Vector3.forward);



    const float onGroundTestDist = 0.3f;
    const float onGroundTestAngle = 45f;

    private IEnumerable AllProbes(){
        yield return downProbe;
        yield return upProbe;
        yield return forwardProbe;
        yield return backProbe;
        yield return localDownProbe;
        yield return localUpProbe;
        yield return localForwardProbe;
        yield return localBackProbe;
    }

    public void Reset() {
        onGround = false;
    }


    public void UpdateAll(Transform transform, Collider activeCollider) {

        Reset();
         
        foreach (Probe probe in AllProbes()) {
            probe.Update(transform, activeCollider);
        }

     

        bool closeToGround = localDownProbe.didHit && localDownProbe.hit.distance < onGroundTestDist;
        if (closeToGround) {
            Debug.Log("Close to ground");
            Vector3 normal = localDownProbe.hit.normal;
            bool alignedToGround = Vector3.Angle(normal, transform.up) < onGroundTestAngle;
            if (alignedToGround) {
                onGround = true;
                groundNormal = normal;
                groundForward = Vector3.Cross( Vector3.right, normal);
            }

        }

    }




}

internal class Probe {

    private Vector3 startPosLocal;
    private Vector3 direction;
    private bool directionInWorldSpace;

    const float maxDistance = 20f;

    internal bool didHit;
    internal RaycastHit hit;

    internal Probe(bool worldSpace, Vector3 startPos, Vector3 direction) {
        this.startPosLocal = startPos;
        this.direction = direction;
        this.directionInWorldSpace = worldSpace;
    }

    internal void Update(Transform t, Collider c) {
        Vector3 scaledStartPos = Vector3.zero;
        if (c is BoxCollider) {
            BoxCollider bc = (BoxCollider)c;
            scaledStartPos = bc.center + Vector3.Scale(bc.size/2f, startPosLocal);
        } else if (c is CapsuleCollider) {
            CapsuleCollider cc = (CapsuleCollider)c;
            scaledStartPos = cc.center + new Vector3(0f, (cc.height/2f)*startPosLocal.y, (cc.radius * startPosLocal.z)); 
        }
        Vector3 origin = t.TransformPoint(scaledStartPos);
        Vector3 worldDirection = directionInWorldSpace? direction : t.TransformDirection(direction);

        if (!directionInWorldSpace) {
            Debug.DrawRay(origin, worldDirection);
        }

        didHit = Physics.Raycast(origin, worldDirection, out hit, maxDistance);

    }

}

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


public class Koboto : MonoBehaviour {

    public BoxCollider boxCollider;
    public CapsuleCollider capsuleCollider;

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

        tiltController = new PDController(5f, 0.4f);
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

//    void RecalculateColliderBounds() {
//        float minY = colliderBaseCenter.y - colliderBaseSize.y/2f;
//        float maxY = colliderBaseCenter.y + colliderBaseSize.y/2f;
//
//        foreach (var attachment in currentAttachments.Values) {
//            minY = Mathf.Min(minY, colliderBaseCenter.y - colliderBaseSize.y/2f - attachment.kobotoColliderExtendDown);
//            maxY = Mathf.Max(maxY, colliderBaseCenter.y + colliderBaseSize.y/2f + attachment.kobotoColliderExtendUp);
//        }
//
//        float centerY = (minY + maxY)/2f;
//        float sizeY = maxY - minY;
//
//        colliderCenterTarget = new Vector3(colliderBaseCenter.x, centerY, colliderBaseCenter.z);
//        colliderSizeTarget = new Vector3(colliderBaseSize.x, sizeY, colliderBaseSize.z);
//
//        boxCollider.center = colliderCenterTarget;
//        boxCollider.size = colliderSizeTarget;
//        
//    }



    public void FixedUpdate() {

        moveForce.Clear();
        InputData inputData = InputManager.Instance.Read();

        Debug.Log("Move input " + inputData.move);

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

        Debug.Log("Up " + moveForce.upTarget + " Tilt target " + tiltTarget + " current " + currentTilt);

        float tiltError = tiltTarget - currentTilt;

        float correction = tiltController.Update(tiltError, Time.fixedDeltaTime);
        rb.AddTorque(correction * Vector3.right);



    }

    public void NoAttachmentsFixedUpdate() {
    }

   

}
