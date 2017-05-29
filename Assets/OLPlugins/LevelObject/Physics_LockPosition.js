var startPos:Vector3;
var startRot:Quaternion;
var lockPosition: boolean =true;
var lockRotation: boolean =false;

function Awake()
{
	startPos=transform.position;
	startRot=transform.rotation;
}

function FixedUpdate () {
	if (lockPosition &&!GetComponent.<Rigidbody>().isKinematic)
	{
	transform.position = startPos;
	GetComponent.<Rigidbody>().velocity=Vector3.zero;
	GetComponent.<Rigidbody>().MovePosition(startPos);
	}
	if (lockRotation&&!GetComponent.<Rigidbody>().isKinematic)
	{
		transform.rotation = startRot;
		GetComponent.<Rigidbody>().angularVelocity=Vector3.zero;
		GetComponent.<Rigidbody>().MoveRotation(startRot);
	}
	
	}