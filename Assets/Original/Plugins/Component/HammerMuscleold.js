// the hammerMuscle script works in tandem with the ShatterBlast script

var regenTime : double = 1.0;
var flipTime : double = 0.5;
var detectRange : double = 10.0;
var activeTime = 0.0;
var hammerTarget : ShatterBlast;
var wall : BreakableWall;
var ridge : Rigidbody;
var on : boolean =true;
var hitEnabled:boolean=true;

// update on the hammer component for breaking breakable things
function FixedUpdate()
{
	if(on)
	{
	var fwd = transform.right;
	var hit : RaycastHit;
	
	glineStart=transform.position+fwd*1;
	glineEnd=glineStart+ fwd*detectRange*30;
	//print (glineStart);
	// attemped to find an object in front of the hammer
	if( Physics.Raycast( Ray(transform.position+fwd*1, fwd), hit, detectRange) )
	{
		//print("found"+ hit.collider.gameObject.name);
		if( activeTime <= 0 )
		{
			hammerTarget = hit.collider.gameObject.GetComponent( ShatterBlast );
			wall=hit.collider.gameObject.GetComponent( BreakableWall );
			ridge=hit.collider.gameObject.GetComponent.<Rigidbody>();
			if( hammerTarget || wall|| ridge) activeTime = regenTime+flipTime;
		}
	}
	// if that failed, attempt to find a target below the hammer
	if( !hammerTarget &&
		Physics.Raycast( Ray(transform.position+fwd*detectRange, Vector3(0,-1,0)), hit,detectRange ) )
	{
		//print("found"+ hit.collider.gameObject.name);
		if( activeTime <= 0 )
		{
			hammerTarget = hit.collider.gameObject.GetComponent( ShatterBlast );
			wall=hit.collider.gameObject.GetComponent( BreakableWall );
			ridge=hit.collider.gameObject.GetComponent.<Rigidbody>();
			if( hammerTarget ||wall || ridge ) activeTime = regenTime+flipTime;
		}
	}
	
	// if we have a targt...
	if( activeTime > 0 )
	{ 
		print("foundShatter");
		if( activeTime > regenTime )
		{
			if (hitEnabled&&ridge) {print ("Hitting with Hammer");ridge.AddForce(Vector3(0,0,8000), ForceMode.Impulse);
			HitCoolDown(regenTime);}
			if( hammerTarget )
			{
				// tell the target to break apart
				hammerTarget.Blast();
			}
			if (wall) wall.Blast();
			
			var rt = (activeTime - regenTime) * 45 / flipTime;
			transform.localRotation = Quaternion.Euler( transform.localRotation.x, transform.localRotation.y, -rt );
		}
		else
		{
			transform.localRotation = Quaternion.Euler( transform.localRotation.x, transform.localRotation.y, 0 );
		}
		
		activeTime -= Time.deltaTime;
	}
	}
}

function ResetHammer()
{
	hammerTarget = null;
	wall=null;
	activeTime=0;
}
var glineStart:Vector3;
var glineEnd:Vector3;

function HitCoolDown(tim : float)
{
	hitEnabled =false;
	yield WaitForSeconds(tim);
	hitEnabled =true;
	
}
function OnDrawGizmos()
{
	Gizmos.DrawLine(transform.position,Vector3.zero);
	Gizmos.DrawLine(glineStart, glineEnd);
}