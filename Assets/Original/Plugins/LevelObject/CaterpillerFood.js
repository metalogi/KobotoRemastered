var cat : Caterpiller;
var seen :boolean =false;
var resetDrag:float = 0.2;
function TurnOn() {
	//rigidbody.velocity = Vector3.zero;
	GetComponent.<Rigidbody>().drag=1;
	//cat.Walk(transform);
}

function Reset(v:boolean)
{
	GetComponent.<Rigidbody>().isKinematic = false;
	GetComponent.<Rigidbody>().drag=resetDrag;
	GetComponent.<Renderer>().enabled =true;
	GetComponent.<Collider>().isTrigger=false;
	seen=false;
}



function Awake()
{
	resetDrag= GetComponent.<Rigidbody>().drag;
}