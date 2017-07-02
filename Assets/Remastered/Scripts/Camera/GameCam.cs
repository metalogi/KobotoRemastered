using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameCam : KCam {

    public Vector3 defaultOffset = new Vector3(10, 3, 0);
    public Transform target;

    Vector3 startPos;
	// Use this for initialization
	void Start () {
        startPos = transform.position;
        KobotoEvents.AddListener(KEventEnum.Selected, OnKobotoSelected);
	}

    public void SetTarget(Transform t) {
        target = t;
    }

    void OnKobotoSelected(Koboto koboto) {
        SetTarget(koboto.transform);

    }
	
	// Update is called once per frame
	void FixedUpdate () {
        
        if (target != null) {
            transform.position = Vector3.Lerp (transform.position, target.position + defaultOffset, 6f * Time.deltaTime);
        }
	}
}
