// catapults work autonamously from the critter
// when anything steps in their detection zone they flip out
var on :boolean= true;
var regenTime : double = 1.0;
var flipTime : double = 0.5;
var flipForce : double = 10000;
var detectRange : double = 10.0;
private var activeTime = 0.0;

private var slowdown:float =0.85; //amount of velocity conserved
private var vert:float =1.2;  //vertical force
private var hori:float=0.2; //horizontal force
private var nudge:float=8; //shit target upwards by this amount to avoid hitting cataput

function FixedUpdate()
{
	if (on)
	{
	var fwd = transform.right;
	var hit : RaycastHit;
	var catapultTarget : Rigidbody;
	// cast a detection ray to find a suitable target to fling
	if( Physics.Raycast( Ray(transform.position+fwd*1, fwd), hit, detectRange, 1 << 9 ) )
	{
		if( activeTime <= 0 )
		{
			activeTime = regenTime+flipTime;
			var catapultTargetObj = hit.collider.gameObject;
			catapultTarget = catapultTargetObj.GetComponent( Rigidbody );
			if( catapultTarget && !catapultTarget.isKinematic ) 
			{
				if (catapultTarget.velocity.y<0) catapultTarget.velocity.y *= -0.2;
				catapultTarget.velocity *=slowdown;
			}
			var aud:AudioSource =GetComponent(AudioSource);
			aud.Play();
			var Junc:Juncore =catapultTargetObj.GetComponent(Juncore);
			if (Junc) PlayerPrefs.SetInt("FlippedKobotos", PlayerPrefs.GetInt("FlippedKobotos",0)+1);
			//GetComponent(AudioSource).Play();
			if( catapultTargetObj.GetComponent(AudioSource) )
				aud =catapultTargetObj.GetComponent(AudioSource);
				aud.Play();
		}
//		print( "trigger " + (catapultTargetObj?catapultTargetObj.name:"*") );
	}
	
	// if you have a target, the catapult will be active
	if( activeTime > 0 )
	{
		if( activeTime > regenTime )
		{
			if( catapultTarget && !catapultTarget.isKinematic )
			{	
				//var forc = flipForce*catapultTarget.mass*0.05/Time.deltaTime;
				var forc = 1.4*flipForce/Time.deltaTime;
				if( !catapultTarget.GetComponent(Juncore) ) forc *= 2;
				var fd = vert*transform.up-hori*transform.right;
				catapultTarget.position+= Vector3(0,nudge,0);
				catapultTarget.AddForce( fd*forc );
			}
			var rt = (activeTime - regenTime) * 45 / flipTime;
			transform.localRotation = Quaternion.Euler( transform.localRotation.x, transform.localRotation.y, rt );
		}
		else
		{
			catapultTarget = null;
			transform.localRotation = Quaternion.Euler( transform.localRotation.x, transform.localRotation.y, 0 );
		}

		
		activeTime -= Time.deltaTime;
	}
	}
}