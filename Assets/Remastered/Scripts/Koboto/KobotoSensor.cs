using System.Collections;
using System.Collections.Generic;
using UnityEngine;




public class KobotoSensor {

    public bool onGround;
    public Vector3 groundForward;
    public Vector3 groundNormal;

    public bool forwardWheelOnGround;
    public Vector3 forwardWheelForward;
    public Vector3 forwardWheelNormal;


    public bool onCeiling;
    public Vector3 ceilingForward;
    public Vector3 ceilingNormal;

    public bool aboveGround;
    public float heightAboveGround;
    public Vector3 aboveGroundPoint;
    public Collider aboveGroundCollider;

    public bool closeToGround;
    public float distanceToGround;
    public Vector3 closestGroundPoint;
    public Vector3 closestGroundNormal;
    public Collider closestGroundCollider;



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


    const float onGroundTestDist = 0.3f;
    const float onGroundTestAngle = 115f;
    const float onCeilingTestDist = 0.3f;
    const float onCeilingTestAngle = 45f;
    const int positionTrailSize = 10;

    float lastSampleTime;

    Probe downProbe;
    Probe upProbe;
    Probe frontProbe;
    Probe backProbe;

    Probe localDownProbe;
    Probe localUpProbe;
    Probe localForwardProbe;
    Probe localBackProbe;

    Probe frontWheelProbe;
    Probe backWheelProbe;

    Probe[] airProbes;
    const int airProbesPerQuadrant = 6;

    public KobotoSensor() {

        int airProbeCount = airProbesPerQuadrant * 4;
        airProbes = new Probe[airProbeCount];

        float airProbeAngle = 0f;

        for (int i=0; i<airProbeCount; i++) {
            Vector3 airProbeDirection = new Vector3(0, Mathf.Cos(airProbeAngle), Mathf.Sin(airProbeAngle));
            string label = ("AirProbe_" + (airProbeAngle * Mathf.Rad2Deg).ToString());
            Probe airProbe = new Probe(true, Vector3.zero, airProbeDirection, label);
            airProbes[i] = airProbe;

            airProbeAngle += 2.0f * Mathf.PI / airProbeCount;

        }
        upProbe = airProbes[0];
        frontProbe = airProbes[airProbesPerQuadrant];
        downProbe = airProbes[airProbesPerQuadrant * 2];
        backProbe = airProbes[airProbesPerQuadrant * 3];

        
        //downProbe = new Probe(true, Vector3.zero, Vector3.down, "down");
        //upProbe = new Probe(true, Vector3.zero, Vector3.up, "up");
        //frontProbe = new Probe(true, Vector3.zero, Vector3.forward, "front");
        //backProbe = new Probe(true, Vector3.zero, Vector3.back, "back");

        localDownProbe = new Probe(false, 0.9f*Vector3.down, Vector3.down, "localDown");
        localUpProbe = new Probe(false, 0.9f*Vector3.up, Vector3.up, "local up");
        localForwardProbe = new Probe(false, 0.9f*Vector3.forward, Vector3.forward, "local forward");
        localBackProbe = new Probe(false, 0.9f*Vector3.forward, Vector3.back, "local back");

        Vector3 frontWheelStart = 0.8f*Vector3.down + 0.9f*Vector3.forward;
        Vector3 frontWheelStartOut =  4f*Vector3.forward;
        Vector3 frontWheelDown = Vector3.down;

        Vector3 backWheelStart = 0.8f*Vector3.down - 0.9f*Vector3.forward;
        Vector3 backWheelStartOut =  -4f*Vector3.forward;
        Vector3 backWheelDown = Vector3.down;

        frontWheelProbe = new Probe(false, frontWheelStart, frontWheelDown, "wheel front");
        backWheelProbe = new Probe(false, backWheelStart, backWheelDown, "wheel back");

        frontWheelProbe.SetPeturbedStartPoint(frontWheelStartOut);
        backWheelProbe.SetPeturbedStartPoint(backWheelStartOut);
    }

    #if UNITY_EDITOR

    public bool visualize = true;

    void OnGUI() {
        if (visualize) {
            Visualize();
        }
    }
    void Visualize() {
        Color[] colors = new Color[] {
            Color.red, Color.blue, Color.black, Color.green, Color.yellow, Color.magenta, Color.grey
        };

        int colorI = 0;

        foreach (Probe p in AllProbes()) {
            int c = colorI++ % colors.Length;
            p.Visualize(colors[c]);
        }
        
    }



    #endif

    private IEnumerable AllProbes(){
        foreach (var airProbe in airProbes) {
            yield return airProbe;
        }

        yield return localDownProbe;
        yield return localUpProbe;
        yield return localForwardProbe;
        yield return localBackProbe;
        yield return frontWheelProbe;
        yield return backWheelProbe;
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
            float peturb = 0f;
            if (probe == frontWheelProbe) {
                peturb = Mathf.Clamp01 (Vector3.Dot (velocity, Vector3.forward));
            } else if (probe == backWheelProbe) {
                peturb = Mathf.Clamp01 (Vector3.Dot (velocity, Vector3.back));
            }
            probe.Update(transform, activeCollider, peturb);
        }

        // forward is direction of travel
        bool frontIsForward = Vector3.Dot(velocity, Vector3.forward) > 0f;
        if (frontIsForward) {
            forwardWheelOnGround = frontWheelProbe.didHit;
            if (forwardWheelOnGround) {
                forwardWheelNormal = frontWheelProbe.hit.normal;
                forwardWheelForward = Vector3.Cross (Vector3.right, forwardWheelNormal);
            }
        } else {
            forwardWheelOnGround = backWheelProbe.didHit;
            if (forwardWheelOnGround) {
                forwardWheelNormal = backWheelProbe.hit.normal;
                forwardWheelForward = Vector3.Cross (Vector3.right, forwardWheelNormal);
            }
        }



        bool adjacentToGround = localDownProbe.didHit && localDownProbe.hit.distance < onGroundTestDist;
        if (adjacentToGround) {
           // Debug.Log("Hit ground: " + localDownProbe.hit.collider.name);

            Vector3 normal = localDownProbe.hit.normal;
            bool alignedToGround = Vector3.Angle(normal, transform.up) < onGroundTestAngle;
            if (alignedToGround) {
                onGround = true;
                groundNormal = normal;
                groundForward = Vector3.Cross( Vector3.right, normal);
            }
        }


            

        bool adjacentToCeiling = localUpProbe.didHit && localUpProbe.hit.distance < onCeilingTestDist;
        if (!onGround && adjacentToCeiling) {


          //  Debug.Log("Hit ceiling: " + localUpProbe.hit.collider.name);

            Vector3 normal = localUpProbe.hit.normal;
            bool alignedToCeiling = Vector3.Angle(normal, -transform.up) < onCeilingTestAngle;
            if (alignedToCeiling) {
                onCeiling = true;
                ceilingNormal = normal;
                ceilingForward = Vector3.Cross( Vector3.right, -normal);
            }
        }
        closeToGround = false;

        if (!onGround && !onCeiling) { // in air
            // Find closest ground point
            bool foundGround = false;
            float closestDist = float.MaxValue;
            int closestHitIndex = 0;
            for (int i=0; i<airProbes.Length; i++) {
                var probe = airProbes[i];
                if (!probe.didHit) {
                    continue;
                }
                if (probe.hit.distance < closestDist) {
                    closestHitIndex = i;
                    foundGround = true;
                }
            }
            if (foundGround) {
                RaycastHit closestHit = airProbes[closestHitIndex].hit;
                closeToGround = true;
                closestGroundPoint = closestHit.point;
                closestGroundNormal = closestHit.normal;
                closestGroundCollider = closestHit.collider;
                distanceToGround = closestHit.distance;
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
    private bool peturbStartPoint;
    private Vector3 peturbedStart;

    private Vector3 worldSpaceOrigin;

    const float maxDistance = 200f;

    internal bool didHit;
    internal RaycastHit hit;
    internal string name;



    int layerMask;

    internal Probe(bool worldSpace, Vector3 startPos, Vector3 direction, string name) {
        this.name = name;
        this.startPosLocal = startPos;
        this.direction = direction;
        this.directionInWorldSpace = worldSpace;
        layerMask = LayerMask.GetMask ("Default", "Koboto");
       
    }

    internal void SetPeturbedStartPoint(Vector3 peturbedStart) {
        peturbStartPoint = true;
        this.peturbedStart = peturbedStart;
    }

    internal void Update(Transform t, Collider c, float peturb) {
        Vector3 fixedStartPoint = peturbStartPoint ? Vector3.Lerp (startPosLocal, peturbedStart, peturb) : startPosLocal;
        Vector3 scaledStartPos = Vector3.zero;
        if (c is BoxCollider) {
            BoxCollider bc = (BoxCollider)c;
            scaledStartPos = bc.center + Vector3.Scale(bc.size/2f, fixedStartPoint);
        } else if (c is CapsuleCollider) {
            CapsuleCollider cc = (CapsuleCollider)c;
            scaledStartPos = cc.center + new Vector3(0f, (cc.height/2f)*fixedStartPoint.y, (cc.radius * fixedStartPoint.z)); 
        }
        worldSpaceOrigin = t.TransformPoint(scaledStartPos);
        Vector3 worldDirection = directionInWorldSpace? direction : t.TransformDirection(direction);

        if (!directionInWorldSpace) {
            Debug.DrawRay(worldSpaceOrigin, worldDirection);
        }

        didHit = Physics.Raycast(worldSpaceOrigin, worldDirection, out hit, maxDistance, layerMask);

        //if (didHit )
        //{
        //    Debug.Log(name + "Probe hit: " + hit.collider.name, hit.collider.gameObject);
        //}
        

    }

    internal void Visualize(Color color) {
        if (didHit) {
            Vector3 worldSpaceVector = hit.point - worldSpaceOrigin;

            Debug.DrawLine(worldSpaceOrigin, hit.point, color);
        }
    }

}
