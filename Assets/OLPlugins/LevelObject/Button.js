var depressionTime = 1.0;
var depression = 0.0;
var onlyOnce = false;
private var dontPressAgain=false;

var target:GameObject;

var disabled : boolean =false;

var camInterest:boolean;
var cam:CameraManager;
var sidePush : GameObject;
private var sidePushReset : Vector3;
function Awake()
{
	if( sidePush ) sidePushReset = sidePush.transform.position;
	if (camInterest) cam = GetComponent.<Camera>().main.GetComponent(CameraManager);
}

function Reset(v:boolean)
{
	dontPressAgain = false;
	if( GetComponent.<Renderer>() ) GetComponent.<Renderer>().enabled = true;
	
	if( sidePush ) sidePush.transform.position = sidePushReset;
	depression = 0;
	disabled =false;
}

function Update () 
{
	if( depression > 0 )
	{
	 	depression -= Time.deltaTime;
	 	if( depression <= 0 && !onlyOnce )
	 	{
	 		Reset(true);
	 	}
	}
}

function IsPressed()
{
	return (depression > 0);
}

function OnTriggerEnter( other : Collider )
{
	if( other.gameObject )
		ForcePress( other.gameObject );
	if (target && !disabled)
	{
		var junc:Juncore =other.GetComponent(Juncore);
		if (junc) target.BroadcastMessage("Activate",true);
		if (camInterest) cam.SetInterest(target.transform, 0.5);
		Cooldown();
	}
		
}

function Cooldown()
{
	disabled = true;
	yield WaitForSeconds(1.5);
	disabled =false;
}

function ForcePress( other : GameObject )
{ var aud:AudioSource =GetComponent(AudioSource);
	if( !dontPressAgain && other.layer == 9 )
	{
		if( sidePush ) sidePush.transform.localPosition.x -= 6.5;
		depression = depressionTime;
		if( aud ) aud.Play();
		if( onlyOnce )
		{
			dontPressAgain = true;
			if( GetComponent.<Renderer>() ) GetComponent.<Renderer>().enabled = false;
		}
	}
}

@script RequireComponent(GeneralReset)
