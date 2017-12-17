var target : Rigidbody;

var impulse : Vector3;
var torq : Vector3;
var col:Collider;

function OnTriggerEnter (c:Collider) {
	if (c.GetComponent(Juncore))
	{
	target.AddForce(impulse, ForceMode.Impulse);
	target.AddTorque(torq, ForceMode.Impulse);
	WaitForSeconds(0.5);
	col.isTrigger=true;
	}
}

function Reset(v:boolean)
{
	col.isTrigger = false;
}