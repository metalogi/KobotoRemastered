using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestCam : MonoBehaviour {

    public Transform target;

    Vector3 startPos;
	// Use this for initialization
	void Start () {
        startPos = transform.position;
	}
	
	// Update is called once per frame
	void FixedUpdate () {
        if (target == null && GameManager.Instance.currentState == EGameState.Play) {
            target = GameManager.Instance.currentLevel.kobotos[0].transform;
        }
        if (target != null) {
            transform.position = Vector3.Lerp (transform.position, new Vector3 (startPos.x, target.position.y + 4f, target.position.z), 6f * Time.deltaTime);
        }
	}
}
