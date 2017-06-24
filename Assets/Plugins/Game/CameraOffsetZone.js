var offset : Vector3;
var speed :float =4;

//var overrideFinger : boolean =false;
var clearInterest : boolean= false;
private var cam : CameraManager;

var select : boolean=false;

function Awake()
{
	cam =GetComponent.<Camera>().main.GetComponent(CameraManager);
}

function OnTriggerEnter (col : Collider) {
	var Guy:Juncore =col.GetComponent(Juncore);
	if(Guy)
	{
		//if (select) {cam.SetSimTarget(Guy.gameObject); cam.SetDragOffset(offset);}
		//else
		//if (overrideFinger || cam.dragOffset.magnitude < 1)
		if (clearInterest) {cam.interest ==null;}
		cam.MoveDragOffset(offset,speed);
	}
}