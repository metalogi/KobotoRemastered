var kickOutDistance : float =60;

function OnTriggerEnter (other:Collider) {
	var ridge : Rigidbody =other.GetComponent.<Rigidbody>();
	
	if (ridge && other.gameObject.layer ==9)
	{
	ridge.MovePosition(ridge.position +kickOutDistance*transform.up);
	ridge.velocity = transform.forward*Vector3.Dot(ridge.velocity, transform.forward);
	}
	}

function Start()
{
	if (GetComponent.<Renderer>()) GetComponent.<Renderer>().enabled = false;
}