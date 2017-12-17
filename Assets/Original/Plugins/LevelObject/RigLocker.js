var ridge : Rigidbody;
var trans : Transform;

/*
function FixedUpdate () 
{
	trans.position.x = 0;
	if( !ridge.isKinematic )
	{
		ridge.angularVelocity = Vector3(ridge.angularVelocity.x,0,0);
		//rigidbody.angularVelocity.y = 0;
		//rigidbody.angularVelocity.z = 0;
	}
}

function Awake()
{
	trans = GetComponent(Transform);
	ridge= GetComponent(Rigidbody);
}
*/
@script RequireComponent(Rigidbody)