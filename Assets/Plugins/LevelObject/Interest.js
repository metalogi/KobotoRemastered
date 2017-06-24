var cam : CameraManager;
//var trans : Transform;
var enter: boolean=true;
var exit : boolean =false;

function Start () {
	cam = GetComponent.<Camera>().main.GetComponent(CameraManager);
	
}

function OnTriggerEnter(col:Collider)
{
	if (enter)
	{
	var junc = col.GetComponent(Juncore);
	if (junc) {cam.interest = transform; cam.interestWeight =0.5;}
	}
}

function OnTriggerExit(col:Collider)
{
	if (exit)
	{
	var junc = col.GetComponent(Juncore);
	if (junc) {cam.interest = null; cam.interestWeight =0;}
	}
}

/*
function OnCollisionEnter(col:Collider)
{print ("setting Interest");
	var junc = col.GetComponent(Juncore);
	if (junc) {cam.interest = transform; cam.interestWeight =0.5;}
}
*/