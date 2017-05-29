var target:Rigidbody;

function OnTriggerEnter (col:Collider) {
	if (col.gameObject.GetComponent(Juncore)) target.isKinematic=false;
}

function Reset(v:boolean)

{
	target.isKinematic = true;
}

function Awake()
{
	target.isKinematic = true;
}
