private var basePos : Vector3;
var returnForceStrength : float = 4;

function Awake()
{
	basePos = transform.position;
}

function FixedUpdate () {
	GetComponent.<Rigidbody>().AddForce ((basePos - transform.position)*returnForceStrength*Time.deltaTime*GetComponent.<Rigidbody>().mass);
}