var floatyness:float =30.0;
var lockZ:boolean=true;
var allowDownwardMotion=false;

var maxY : float = 500;

private var startPos:Vector3;
private var startRot:Quaternion;

function Awake()
{
	startPos=transform.position;
	startRot= transform.rotation;
}

function FixedUpdate () {
	
	if(!GetComponent.<Rigidbody>().isKinematic)
	{
	if (lockZ) GetComponent.<Rigidbody>().velocity.z=0;
	if((!allowDownwardMotion) && GetComponent.<Rigidbody>().velocity.y<0)GetComponent.<Rigidbody>().velocity.y=0;
	if (transform.position.y < maxY) GetComponent.<Rigidbody>().AddForce(floatyness*Vector3.up*GetComponent.<Rigidbody>().mass/80);
	//if (transform.position.y > maxY) Reset(true);
	}
}

function Reset(v:boolean)
{
	transform.position=startPos;
	transform.rotation=startRot;
}