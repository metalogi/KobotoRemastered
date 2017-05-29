var lngth=25.0;
var wdth=10.0;
var JetForce = 0.0;

var force : Vector3;

var activateButton : Button;
private var isOn = false;

function Update () 
{
	if( activateButton.IsPressed() )
	{
		isOn=true;
	}

	if( isOn )
	{
		GetComponent.<Rigidbody>().AddTorque( force );
		
		var ForceDir = transform.forward.normalized;
		
		for( var curObj:Juncore in FindObjectsOfType(Juncore) )
		{
			var currGO = curObj.gameObject;
		
			var dist = Vector3.Dot(currGO.transform.position - transform.position, ForceDir);
			var itPoint = transform.position + ForceDir*dist;
			var offset = (itPoint-currGO.transform.position).magnitude;
		
			if( dist <= lngth && offset <= wdth && JetForce != 0 )
			{
				currGO.GetComponent.<Rigidbody>().AddForce( ForceDir*JetForce );
			}
		}
		
	}
}

function Reset(v:boolean)
{
	isOn = false;
}


function OnDrawGizmos()
{
	var ForceDir = transform.forward;
	var orth1 = transform.right;
	var orth2 = transform.up;
	var stp = Mathf.PI/5.05;
	
	if( JetForce )
	for( var l : float =0.0;l<Mathf.PI*2;l+=stp)
	{
		var st = transform.position + orth1*Mathf.Cos(l)*wdth + orth2*Mathf.Sin(l)*wdth;
		var lst = transform.position + orth1*Mathf.Cos(l-stp)*wdth + orth2*Mathf.Sin(l-stp)*wdth;
		var rise = ForceDir*lngth;
		Gizmos.DrawLine( st, lst );
		Gizmos.DrawLine( st, st+rise );
		Gizmos.DrawLine( st+rise, lst+rise );
	}
}