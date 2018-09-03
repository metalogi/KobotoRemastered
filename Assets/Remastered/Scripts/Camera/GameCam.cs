using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameCam : KCam {

    public Transform target;
    public int stackSize = 20;
    public float aimYOffset = 0.1f;
    public float baseOutDist = 10f;
    public float baseTilt = 11f;

    public float speedOutDistMultilpier = 1f;
    public float maxOutDist = 20f;
    public float zoomOutSpeed = 4f;
    public float zoomInSpeed =1f;

   

    float outDist;
    float targetOutDist;
    float tilt;

    bool triggerReset;


    Vector3 baseOutVector;

    Koboto targetK;

    PStack posStack;

    Vector3 startPos;



	// Use this for initialization
	void Start () {
        startPos = transform.position;
        Koboto.Events.AddListener(KEventEnum.Selected, OnKobotoSelected);
        posStack = new PStack(stackSize);
        outDist = baseOutDist;
        targetOutDist = baseOutDist;
        baseOutVector = Quaternion.Euler(baseTilt, 270f, 0) * Vector3.forward;
    }

    public void SetTarget(Transform t) {
        posStack.SetAll(t.position);
        target = t;
    }

    void OnKobotoSelected(Koboto koboto) {
        targetK = koboto;
        target = koboto.transform;
        posStack.SetAll(target.position);
  

    }
	
	// Update is called once per frame
	void FixedUpdate () {
        
        if (currentGameState != EGameState.Play)
        {
            return;
        }
        if (target != null) {

          
            Vector3 targetPos;
            float pushOut = 0;
            float targetTilt = 0;

            targetK.GetCameraInfo(out targetPos, out pushOut, out targetTilt);

            if (triggerReset)
            {
                tilt = 0;
                targetOutDist = baseOutDist;
                outDist = targetOutDist;
                transform.position = targetPos - baseOutVector * outDist;
                transform.LookAt(targetPos);
                posStack.SetAll(targetPos + aimYOffset * Vector3.up);
                triggerReset = false;
            } 
            else
            {
                float targetSpeed = targetK.GetSpeed();
                if (pushOut > 0) Debug.Log("push out  " + pushOut);

                posStack.Record(targetPos + aimYOffset * Vector3.up);
                Vector3 aimAt = posStack.Read();
                targetOutDist = Mathf.Min(maxOutDist, baseOutDist + targetSpeed * speedOutDistMultilpier) + pushOut;

                if (targetOutDist > outDist)
                {
                    outDist = Mathf.Lerp(outDist, targetOutDist, zoomOutSpeed * Time.fixedDeltaTime);
                }
                else
                {
                    outDist = Mathf.Lerp(outDist, targetOutDist, zoomInSpeed * Time.fixedDeltaTime);
                }

                float snap = 12f;
                float rotateSnap = 12f;
                float tiltSnap = 4f;
                tilt = Mathf.Lerp(tilt, targetTilt, tiltSnap * Time.fixedDeltaTime);


                Vector3 camOut = Quaternion.AngleAxis(tilt, Vector3.forward) * baseOutVector;
                Vector3 moveTo = aimAt - camOut * outDist;

                if (inForbiddenZone)
                {
                    moveTo = Vector3.Lerp(moveTo, forbiddenExit, forbiddenStrength);
                }

                transform.position = Vector3.Lerp(transform.position, moveTo, snap * Time.fixedDeltaTime);
                Quaternion rotateTo = Quaternion.LookRotation(aimAt - transform.position);

                transform.rotation = Quaternion.Lerp(transform.rotation, rotateTo, rotateSnap * Time.fixedDeltaTime);
                transform.LookAt(aimAt, Vector3.up);
            }
        }
	}

    public void Reset()
    {
        triggerReset = true;
    }

}

public class PStack {//class for averageing out position info over n frames

    Vector3[] values;
    int size;

    public PStack(int n) {
        values = new Vector3[n];
        size = n;
    }

    public void Record(Vector3 p) {
        for(int i=0; i<(size-1); i++)
        {
            values[i] = values[i+1];
        }
        values[size-1] = p;
    }

    public Vector3 Read() {
        Vector3 av = Vector3.zero;
        for(int i=0; i<size; i++) {
            av += values[i]/size;
        }
        return av;
    }

    public void SetAll(Vector3 p) {
        for(int i=0; i<size; i++) {
            values[i] = p;
        }
    }
}
