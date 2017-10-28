using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameCam : KCam {

    public Transform target;
    public int stackSize = 20;
    public float aimYOffset = 0.1f;
    public float baseOutDist = 10f;

    public float speedOutDistMultilpier = 1f;
    public float maxOutDist = 20f;
    public float zoomOutSpeed = 4f;
    public float zoomInSpeed =1f;

    float outDist;
    float targetOutDist;

    Koboto targetK;

    PStack posStack;

    Vector3 startPos;



	// Use this for initialization
	void Start () {
        startPos = transform.position;
        KobotoEvents.AddListener(KEventEnum.Selected, OnKobotoSelected);
        posStack = new PStack(stackSize);
        outDist = baseOutDist;
        targetOutDist = baseOutDist;
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
        
        if (target != null) {
            posStack.Record(target.position + aimYOffset * Vector3.up);

            Vector3 aimAt = posStack.Read();

            float targetSpeed = targetK.GetSpeed();

            targetOutDist = Mathf.Min(maxOutDist, baseOutDist + targetSpeed * speedOutDistMultilpier);

            if (targetOutDist > outDist) {
                outDist = Mathf.Lerp(outDist, targetOutDist, zoomOutSpeed * Time.fixedDeltaTime);
            } else {
                outDist = Mathf.Lerp(outDist, targetOutDist, zoomInSpeed * Time.fixedDeltaTime);
            }

            Vector3 moveTo = aimAt - transform.forward * outDist;

            float snap = 12f;

            transform.position = Vector3.Lerp (transform.position, moveTo, snap * Time.fixedDeltaTime);
        }
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
