
/*
function OnCollisionEnter (col:Collision) {
	print("aligning to ramp");	col.gameObject.transform.rotation =Quaternion.FromToRotation(col.gameObject.transform.up, transform.up);
	    for (var contact : ContactPoint in col.contacts) {
        Debug.DrawRay(contact.point, contact.normal, Color.white);
    }
}

function OnCollisionStay (col:Collision) {
	col.gameObject.transform.rotation =Quaternion.FromToRotation(col.gameObject.transform.up, transform.up);
}
*/

function Start()
{
	/*
	var thisCol:MeshCollider = GetComponent(MeshCollider);
	if(thisCol)
	{
	var allColl:BoxCollider[] = FindObjectsOfType(BoxCollider);
	for (var coll:BoxCollider in allColl)
	{
		var junc:Juncore = coll.gameObject.GetComponent(Juncore);
		if (!junc) Physics.IgnoreCollision(coll, thisCol);
	}
	}
	*/
	
}
function OnTriggerEnter (col:Collider) {
	
	var ridge:Rigidbody=col.gameObject.GetComponent(Rigidbody);
	if (ridge)
	{print("lifting");
	if(ridge.velocity.z>0)
	{ridge.AddForce(3000*Vector3.up);
		/*
		col.gameObject.transform.position +=0.01*ridge.velocity.magnitude * Vector3(0,1,0);
		col.gameObject.transform.eulerAngles.x-=5;
		*/
	}
	}
	
	var junc:Juncore =col.gameObject.GetComponent(Juncore);
	if (junc) junc.SetRamp(true);
}

function OnTriggerExit (col:Collider) {
	
var junc:Juncore =col.gameObject.GetComponent(Juncore);
	if (junc) junc.SetRamp(false);
}