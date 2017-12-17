
private var startPos:Vector3;
private var startRot:Quaternion;
private var boxC:BoxCollider;

private var incomingForce : boolean;
private var inForce : Vector3;
private var inForcePos: Vector3;

var maxRot:float=30;

function Awake(){
	startPos=transform.position;
	startRot=transform.rotation;
	
	boxC=GetComponent(BoxCollider);
	var allColl:BoxCollider[] = FindObjectsOfType(BoxCollider);
	for (var coll:BoxCollider in allColl)
	{
		var go:GameObject= coll.gameObject;
		if (go.layer==8 && boxC!=coll) Physics.IgnoreCollision(boxC,coll);
	}
}

function SetIncomingForce(Finc:Vector3, FincPos:Vector3, onoff:boolean)
{
	incomingForce=onoff;
	inForce=Finc;
	inForcePos=FincPos;
}

function FixedUpdate () {
	transform.position = startPos;
	GetComponent.<Rigidbody>().MovePosition(startPos);
	if (!GetComponent.<Rigidbody>().isKinematic)
	{
	GetComponent.<Rigidbody>().angularVelocity.y=0;
	GetComponent.<Rigidbody>().angularVelocity.z=0;
	}
	//if (incomingForce) rigidbody.AddForceAtPosition(inForce, inForcePos);
	
	var rot : Vector3 =transform.eulerAngles;
	
	GetComponent.<Rigidbody>().MoveRotation(Quaternion.Euler(0,90,rot.z));
	//if (Mathf.Abs(transform.eulerAngles.x - startRot.eulerAngles.x) > maxRot) {rigidbody.angularVelocity.x=0;}

	
}

function Reset(v:boolean)
{
	transform.position=startPos;
	transform.rotation = startRot;
	
	if (!GetComponent.<Rigidbody>().isKinematic) GetComponent.<Rigidbody>().angularVelocity=Vector3.zero;
	
}