var cam : CameraManager;
private var sim :SimManager;
private var edit : UIEditor;
var playerT : Vector3;

function Awake()
{
	cam = GetComponent.<Camera>().main.GetComponent(CameraManager);
	edit = FindObjectOfType(UIEditor);
	sim = FindObjectOfType(SimManager);
}

function Update () {
	if (edit.SelectedKoboto) playerT =edit.SelectedKoboto.transform.position;
	else
	{ 
		var GO:GameObject =  sim.RequestJunctionList()[0];
		 playerT =GO.transform.position;
	}
	
	playerT.y = transform.position.y;
	playerT.x +=60;
	transform.LookAt(playerT);
	
}