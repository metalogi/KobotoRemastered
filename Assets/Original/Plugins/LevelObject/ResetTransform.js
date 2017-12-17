var startPos:Vector3;
var startRot:Quaternion;

function Start()
{
	startPos = transform.position;
	startRot = transform.rotation;
}



function Reset(v:boolean)
{
	 transform.position =startPos;
	 transform.rotation =startRot;
	 GetComponent.<Rigidbody>().velocity = Vector3.zero;
	 GetComponent.<Rigidbody>().angularVelocity = Vector3.zero;
}