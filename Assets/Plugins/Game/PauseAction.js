


var pauseVelocity:Vector3;
var pauseAngularVelocity:Vector3;
private var ridge:Rigidbody;
private var wasKinematic:boolean=false;
private var junc : Juncore;


function Awake()
{
	
	ridge =GetComponent(Rigidbody);
	junc = GetComponent(Juncore);
	
}

function PauseMe()
{
	if (junc)
	{
		junc.Pause();
	}
	
	else
	{
		 if (ridge)
		{
		wasKinematic = ridge.isKinematic;
		pauseVelocity=ridge.velocity;
		pauseAngularVelocity=ridge.angularVelocity;
		ridge.isKinematic=true;
		}
		
		if (GetComponent.<Animation>())
		{
			for (var animState : AnimationState in GetComponent.<Animation>())
			{
				animState.speed=0;
			}
		}
		
	SendMessage ("GeneralPause",true,SendMessageOptions.DontRequireReceiver);
	}

}

function UnPauseMe()
{
	if (junc)
	{
		junc.unPause();
	}
	else 
	{
		if (ridge)
		{
		if (!wasKinematic) 
			{
			ridge.isKinematic=false;
			ridge.velocity=pauseVelocity;
			ridge.angularVelocity=pauseAngularVelocity;
			}
		}
			if (GetComponent.<Animation>())
		{
			for (var animState : AnimationState in GetComponent.<Animation>())
			{
				animState.speed=1;
			}
		}
	SendMessage ("GeneralPause",false,SendMessageOptions.DontRequireReceiver);
	}
	
}