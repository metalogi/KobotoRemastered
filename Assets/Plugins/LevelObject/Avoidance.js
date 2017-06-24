var target:GameObject;
var strength:float=30;
var maxDist:float=50;
function OnTriggerEnter (col:Collider) {
	if (col.gameObject.GetComponent.<Rigidbody>()) target.SendMessage("SetAvoid", true);
}

function OnTriggerExit(col:Collider)
{
	if (col.gameObject.GetComponent.<Rigidbody>()) target.SendMessage("SetAvoid", false);
}

function OnTriggerStay(col:Collider)
{
	
	if (col.gameObject.GetComponent.<Rigidbody>()) {
		var vec:Vector3= transform.position-col.gameObject.transform.position;
		print("AAAaaa"+vec);
		var mag:float;
		mag =Mathf.Lerp(strength,0, (vec.magnitude/maxDist));
		vec.x=0;
		if (vec.y <0) vec.y=0; else vec.y*=0.7;
		target.SendMessage("SetAvoidanceForce", mag*vec);
	}
}