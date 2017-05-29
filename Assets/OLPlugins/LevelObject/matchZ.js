var target : Transform;
var lag : float;
function Update () {
	transform.position.z = Mathf.Lerp (transform.position.z, target.position.z, lag*Time.deltaTime);
}