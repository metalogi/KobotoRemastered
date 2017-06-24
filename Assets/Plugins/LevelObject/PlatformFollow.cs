using UnityEngine;
using System.Collections;

public class PlatformFollow : MonoBehaviour {
	
	public float followStrength =5f;
	Rigidbody mFollowRidge;
	
	void Start () {
		mFollowRidge = transform.parent.GetComponent<Rigidbody>();
		transform.parent = null;	
	}
	
	
	void LateUpdate () {
		transform.position = Vector3.Lerp(transform.position, mFollowRidge.position, followStrength*Time.deltaTime);
	
	}
}
