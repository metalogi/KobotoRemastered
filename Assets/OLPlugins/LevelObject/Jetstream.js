var buttons : Button[];

var lngth=25.0;
var wdth=10.0;
var JetForce = 0.0;
var maxSpeed = 20.0;

var cutAway:boolean=true;
var cutAwayReset:boolean;
var cutAwayTime:float=1.0;
var startDelay:float= 0.5;


var on = false;
private var cam:CameraManager;
function Awake ()
{
	cutAwayReset=cutAway;
	Reset(true);
	cam=GetComponent.<Camera>().main.GetComponent(CameraManager);
	
}

function Reset(v:boolean)
{
	on = ( buttons.length == 0 );
	GetComponent.<ParticleEmitter>().emit = on;
	cutAway=cutAwayReset;
}
function Update()
{
	for( curButton in buttons )
	{
		if( curButton.IsPressed() )
		{
			if ((cutAway)&&!(on))
			{cutAway=false;cam.CutAway(this.gameObject,cutAwayTime);}
			TurnOn();
			
		}
	}
	
	GetComponent.<ParticleEmitter>().emit = on;
}

function TurnOn()
{
	yield new WaitForSeconds(startDelay);
	on = true;
}


function GetForce(pos:Vector3)
{
	var ForceDir:Vector3 = transform.up.normalized;
	var returnForce:Vector3 =Vector3.zero;
	if (on&&transform.position.y<=pos.y) 
	{
	var dist:float = Vector3.Dot(pos - transform.position, ForceDir);
	var itPoint:Vector3 = transform.position + ForceDir*dist;
	var offset:float = (itPoint-pos).magnitude;
		
		if( dist <= lngth && offset <= wdth && JetForce != 0 )
		{
			returnForce = ForceDir*JetForce ;
		}
	}
	
	
	return returnForce;
	
	
}

function OnDrawGizmos()
{
	var ForceDir = transform.up;
	var orth1 = transform.right;
	var orth2 = transform.forward;
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