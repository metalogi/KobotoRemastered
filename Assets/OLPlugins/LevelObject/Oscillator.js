var basePos:Vector3;
var amp:float;
var frq:float =1;

var amp2:float;
var frq2:float;
var phase2:float;



var axis:Vector3 = Vector3.up;
var axis2:Vector3 = Vector3.forward;

function Awake()
{
	basePos=transform.position;
	
}


function FixedUpdate () {
	GetComponent.<Rigidbody>().MovePosition (basePos + axis *amp* Mathf.Sin(Time.time *frq) +axis2 *amp2* Mathf.Sin((Time.time+phase2) *frq2) );
	
}

function GetVelocity()
{
	var vel:Vector3;
	vel = axis *amp* Mathf.Cos(Time.time *frq) +axis2 *amp2* Mathf.Cos((Time.time+phase2) *frq2);
	return vel;
}