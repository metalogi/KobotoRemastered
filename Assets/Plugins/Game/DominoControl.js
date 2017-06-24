var dummy : GameObject;
var real : GameObject;
var base : GameObject;

private var basePosition : Vector3;
private var domBasePosition:Vector3;

function Awake()
{
	if (!base) base = transform.parent.gameObject;
	basePosition = base.transform.position;
	domBasePosition=real.transform.localPosition;
}

function OnTriggerEnter(col:Collider) {
	var rShell : rollingShell = col.GetComponent(rollingShell);
	if (rShell || col.gameObject.tag == "domino") 
	{
		real.GetComponent.<Renderer>().enabled =true;
		dummy.GetComponent.<Renderer>().enabled = false;
		real.GetComponent.<Rigidbody>().freezeRotation=false;
		real.GetComponent.<Rigidbody>().angularVelocity.x =2;
	}
}




function Reset(v:boolean)
{print ("resseting domino");

base.transform.position = basePosition;
real.GetComponent.<Rigidbody>().isKinematic = true;
	real.GetComponent.<Renderer>().enabled =false;
	dummy.GetComponent.<Renderer>().enabled = true;
	real.transform.localEulerAngles = Vector3.zero;
	real.transform.localPosition = domBasePosition;
	real.GetComponent.<Rigidbody>().freezeRotation=true;
	real.GetComponent.<Rigidbody>().isKinematic = false;
	real.GetComponent.<Rigidbody>().velocity = Vector3.zero;
	real.GetComponent.<Rigidbody>().angularVelocity = Vector3.zero;
	
}
