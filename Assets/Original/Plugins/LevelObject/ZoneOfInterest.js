
private var cam:CameraManager;
private var juncCount:int=0;
var startCount:int;
var watchPlayer:boolean=true;
var watchObjects:boolean=true;

private var thisIO:InterestingObject;

function Awake(){
return;
cam= GetComponent.<Camera>().main.GetComponent(CameraManager);juncCount=startCount; thisIO=GetComponent(InterestingObject);
}


function OnTriggerEnter (other:Collider) {
	var obj:InterestingObject = other.GetComponent(InterestingObject);
	if (obj) obj.SetInterest(true);	
	var junc:Juncore=other.GetComponent(Juncore);
	if (junc) {juncCount++; if (juncCount>0) {if (thisIO) thisIO.SetInterest(true);cam.UseInterestZone(true);}}
}

function OnTriggerExit (other:Collider) {
	var obj:InterestingObject = other.GetComponent(InterestingObject);
	if (obj) obj.SetInterest(false);	
	var junc:Juncore=other.GetComponent(Juncore);
	if (junc) {juncCount--; if (juncCount==0) {if (thisIO) thisIO.SetInterest(true);cam.UseInterestZone(false);}}	
}