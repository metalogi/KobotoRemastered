using System.Collections;
using System.Collections.Generic;
using UnityEngine;




public class KobotoSensor {

    public bool onGround;
    public Vector3 groundForward;
    public Vector3 groundNormal;

    public bool onCeiling;
    public Vector3 ceilingForward;
    public Vector3 ceilingNormal;

    public bool aboveGround;
    public float heightAboveGround;
    public Vector3 aboveGroundPoint;
    public Collider aboveGroundCollider;

    public bool localAboveGround;
    public float localGroundDist;
    public Vector3 localAboveGroundPoint;

    public bool belowCeiling;
    public float belowCeilingDist;
    public Vector3 belowCeilingPoint;

    public bool localBelowCeiling;
    public float localCeilingDist;
    public Vector3 localBelowCeilingPoint;
    public Collider localBelowCeilingCollider;


    public bool landedThisFrame;
    public bool launchedThisFrame;

    public float onGroundTime;
    public float onCeilingTime;
    public float inAirTime;

  
    public Vector3 upVector;
    public Vector3 velocity;
    public List<Vector3> positionTrail = new List<Vector3>();

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
    const float onCeilingTestDist = 0.3f;
    const float onCeilingTestAngle = 45f;
    const int positionTrailSize = 10;

    float lastSampleTime;

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
        onCeiling = false;
        landedThisFrame = false;
        launchedThisFrame = false;
    }


    public void UpdateAll(Transform transform, Collider activeCollider) {

        bool wasOnGround = onGround;
        bool wasOnCeiling = onCeiling;

        Reset();

        upVector = transform.up;

        positionTrail.Insert(0, transform.position);

        if (positionTrail.Count > positionTrailSize) {
            positionTrail.RemoveRange(positionTrailSize, positionTrail.Count - positionTrailSize);
        }



        if (positionTrail.Count >= 2) {
            velocity = (positionTrail[0] - positionTrail[1])/Time.fixedDeltaTime;
        } else  {
            velocity = Vector3.zero;
        }



        foreach (Probe probe in AllProbes()) {
            probe.Update(transform, activeCollider);
        }



        bool closeToGround = localDownProbe.didHit && localDownProbe.hit.distance < onGroundTestDist;
        if (closeToGround) {

            Vector3 normal = localDownProbe.hit.normal;
            bool alignedToGround = Vector3.Angle(normal, transform.up) < onGroundTestAngle;
            if (alignedToGround) {
                onGround = true;
                groundNormal = normal;
                groundForward = Vector3.Cross( Vector3.right, normal);
            }
        }
            

        bool closeToCeiling = localUpProbe.didHit && localUpProbe.hit.distance < onCeilingTestDist;
        if (!onGround && closeToCeiling) {

            Vector3 normal = localUpProbe.hit.normal;
            bool alignedToCeiling = Vector3.Angle(normal, -transform.up) < onCeilingTestAngle;
            if (alignedToCeiling) {
                onCeiling = true;
                ceilingNormal = normal;
                ceilingForward = Vector3.Cross( Vector3.right, -normal);
            }
        }

        aboveGround = downProbe.didHit;
        if (aboveGround) {
            heightAboveGround = downProbe.hit.distance;
            aboveGroundPoint = downProbe.hit.point;
            aboveGroundCollider = downProbe.hit.collider;
        }

        localBelowCeiling = localUpProbe.didHit;
        if (localBelowCeiling) {
            localCeilingDist = localUpProbe.hit.distance;
            localBelowCeilingPoint = localUpProbe.hit.point;
            localBelowCeilingCollider = localUpProbe.hit.collider;
        }

        if ((onGround && !wasOnGround) || (onCeiling && !wasOnCeiling)) {
            landedThisFrame = true;
            onGroundTime = 0;
            onCeilingTime = 0;
        } else if ((!onGround && wasOnGround) || (!onCeiling && wasOnCeiling)) {
            launchedThisFrame = true;
            inAirTime = 0;
        } else if (onGround) {
            onGroundTime += Time.fixedDeltaTime;
        } else if (onCeiling) {
            onCeilingTime += Time.fixedDeltaTime;
        } else {
            inAirTime += Time.fixedDeltaTime;
        }

        lastSampleTime = Time.time;

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
