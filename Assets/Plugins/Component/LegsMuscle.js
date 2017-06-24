var regenTime : double = 1.0;
var flipTime : double = 0.5;
var jumpSpeed : double = 20;
var detectRange : double = 10.0;
private var activeTime = 0.0;

function GetBalance()
{
	var facing : Vector3 = transform.forward;
	var result : double = 0.0;
	if( facing.x > 0.5 ) result = 1;
	if( facing.x < -0.5 ) result = -1;
	return result;
}

function FixedUpdate()
{
	var fwd = transform.right;
	var hit : RaycastHit;
	var catapultTarget : Rigidbody; if(transform.parent && transform.parent.parent) catapultTarget = transform.parent.parent.GetComponent(Rigidbody);
	if( !Physics.Raycast( Ray(transform.position-fwd*detectRange, Vector3(0,-1,0)), hit, 20, 1 << 8 ) /*&& hit.distance != 0*/ )
	if( Physics.Raycast( Ray(transform.position+fwd*1, Vector3(0,-1,0)), hit, 10, 1 << 8 ) /*&& hit.distance != 0*/ )
	{
		if( activeTime <= 0 )
		{
			activeTime = regenTime+flipTime;
		}
//		print( "trigger " + (catapultTarget?catapultTarget.gameObject.name:"*") );
	}
	
	if( activeTime > 0 )
	{
		if( activeTime > regenTime )
		{
			if( catapultTarget && !catapultTarget.isKinematic )
			{
				catapultTarget.velocity = Vector3.zero;
				var fd = transform.up-transform.right;
				catapultTarget.velocity = ( fd*jumpSpeed );
			}
			var rt = (activeTime - regenTime) * 45 / flipTime;
			transform.localRotation = Quaternion.Euler( transform.localRotation.x, transform.localRotation.y, -rt );
		}
		else
		{
			catapultTarget = null;
			transform.localRotation = Quaternion.Euler( transform.localRotation.x, transform.localRotation.y, 0 );
		}

		
		activeTime -= Time.deltaTime;
	}
}