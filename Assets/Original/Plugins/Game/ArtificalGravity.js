var strength : float =1;
function FixedUpdate () {
	GetComponent.<Rigidbody>().AddForce(Vector3(0,-65*GetComponent.<Rigidbody>().mass*strength,0));
}