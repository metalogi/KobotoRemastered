

function Update () {
	transform.position.z +=  0*Mathf.Sin(0.3*Time.time);
	transform.position.y = 5 + 8* Mathf.Sin(3*Time.time);
	transform.eulerAngles.x =25* Mathf.Sin(3*Time.time);
}