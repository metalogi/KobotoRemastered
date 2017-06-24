var keyComponent : GameObject;
var delay : float =1.5;
var layer : LayerMask ;

function Awake()
{
	Reset(true);
	
}

function Reset(v:boolean)
{	
	print("resetting shatter");
	var meshR:MeshRenderer =GetComponent(MeshRenderer);
	if( meshR ) meshR.enabled = true;
	var BoxC:BoxCollider = GetComponent(BoxCollider);
	BoxC.isTrigger = false;
	layer  = 1 << 8;
	BoxC.center.x=0;
	GetComponent.<Animation>().Stop();
	GetComponent.<Animation>().Rewind();

	if( keyComponent )
 	{
 		for( var oc:Transform in transform )
 		{
 			var on = (oc.gameObject == keyComponent);
 			var ocR:MeshRenderer =oc.GetComponent(MeshRenderer);
 			ocR.enabled = on;
 		}
 	}
}

function OnCollisionEnter( other : Collision )
{
	
	print( other.collider.gameObject.name );
var rShell : rollingShell = other.collider.gameObject.GetComponent(rollingShell);
if (!rShell&& other.collider.transform.parent) rShell = other.collider.transform.parent.GetComponent(rollingShell);
	if( rShell || other.collider.gameObject.name == "rollingshell" )
	{
		print ("smashedByObject");
		Blast();
	}
}

function Blast()
{	print("blast");
	if( keyComponent )
 	{
 		for( var oc:Transform in transform )
 		{
 			var on = (oc.gameObject != keyComponent);
 			var ocR:MeshRenderer =oc.GetComponent(MeshRenderer);
 			ocR.enabled = on;
 		}
 		
 		
 	}
	var meshR:MeshRenderer =GetComponent(MeshRenderer);
	if( meshR ) meshR.enabled = false;
	var BoxC :BoxCollider = GetComponent(BoxCollider);
	
	yield WaitForSeconds(delay);
	if( keyComponent )
	{
		GetComponent.<Animation>().Play();
 		var aud :AudioSource =GetComponent(AudioSource);
 		aud.Play();
	}
	BoxC.isTrigger = true;
	BoxC.center.x=-500;
	//BoxC.enabled=false;
	layer = 0;
//	transform.position.x -= 100;
}

function GeneralPause (val:boolean) 
{
	for (var state : AnimationState in GetComponent.<Animation>())
	
	state.speed=val? 0 : 1;
	
}

@script RequireComponent(GeneralReset)
