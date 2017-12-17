
var cutAway:boolean;
var cutAwayTime:float;

var lngth=25.0;
var wdth=10.0;
var JetForce = 0.0;
var spinSpeed = 1.0;

var starton:boolean=false;
var sound:AudioSource;
var on = false;
private var cam:CameraManager;
private var cutAwayReset:boolean;
function Awake ()
{
	sound=GetComponent(AudioSource);
	if (on && sound) sound.Play();
	cam=FindObjectOfType(CameraManager);
	cutAwayReset=cutAway;
	Reset(true);
	
	
}

function Reset(v:boolean)
{
	//on = ( buttons.length == 0 );
	on=starton;
	cutAway=cutAwayReset;
	if (on && sound) sound.Play();
}

private var onStrength = 0.0;
private var rotAngle = 0.0;
function Update () 
{

	
	if( on ) onStrength += Time.deltaTime;
	else onStrength -= Time.deltaTime;
	if( onStrength > 1.0 ) onStrength = 1.0;
	if( onStrength < 0.0 ) onStrength = 0.0;
	
	rotAngle += Time.deltaTime * onStrength * spinSpeed * 360.0;
	
	transform.localRotation = Quaternion.Euler(rotAngle,0,0);
}

function TestZone( target : Vector3 ) : Vector3
{
	var result = Vector3.zero;
	if (on)
	{
	var ForceDir = transform.right;
	
	var dist = Vector3.Dot(target - transform.position, ForceDir);
	var itPoint = transform.position + ForceDir*dist;
	var offset = (itPoint-target).magnitude;
		
	if( dist > 0 && dist <= lngth && offset <= wdth && JetForce != 0 )
	{
		result = dist *ForceDir*JetForce;
	}
	}
		
	return result;
}

function OnDrawGizmos()
{
	var ForceDir = transform.right;
	var orth1 = transform.forward;
	var orth2 = transform.up;
	var stp = Mathf.PI/5.05;
	
	if( JetForce )
	for( var l: float =0.0;l<Mathf.PI*2;l+=stp)
	{
		var st = transform.position + orth1*Mathf.Cos(l)*wdth + orth2*Mathf.Sin(l)*wdth;
		var lst = transform.position + orth1*Mathf.Cos(l-stp)*wdth + orth2*Mathf.Sin(l-stp)*wdth;
		var rise = ForceDir*lngth;
		Gizmos.DrawLine( st, lst );
		Gizmos.DrawLine( st, st+rise );
		Gizmos.DrawLine( st+rise, lst+rise );
	}
}