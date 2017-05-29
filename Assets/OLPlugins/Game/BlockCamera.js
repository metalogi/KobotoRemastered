var blockDirection : Vector3;

function OnTriggerEnter (col:Collider) {
	
	var cam : CameraManager = col.GetComponent(CameraManager);
	if (cam) {cam.stopDrag=true; cam.dragBlockDirection =blockDirection;}
	
}

function OnTriggerExit (col:Collider) {
	
	var cam : CameraManager = col.GetComponent(CameraManager);
	if (cam) {cam.stopDrag=false; cam.dragBlockDirection =Vector3.zero;}
	
}