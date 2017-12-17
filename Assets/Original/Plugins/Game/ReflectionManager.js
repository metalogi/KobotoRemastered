var refPlane : GameObject;
var real : Transform;

function Update () {
	
	transform.position.x = 0;
	transform.position.y = refPlane.transform.position.y-(real.transform.position.y-refPlane.transform.position.y);
	transform.position.z = real.transform.position.z;
	
	transform.eulerAngles = real.transform.eulerAngles;
	if (GetComponent.<Renderer>())
	{
	if (transform.position.y > refPlane.transform.position.y-2) GetComponent.<Renderer>().enabled =false;
	else if (!GetComponent.<Renderer>().enabled) GetComponent.<Renderer>().enabled =true;
	}

	 
}