private var rad = 35.0/2;
var coreType : GameObject;
var coreHeight : float = 4.0;
var stopLightType : GameObject;
var stopLightHeight : float = 40.0;
var startOffWith: GameObject;
var startMount:int;
var locked:boolean =true;

private var sim : SimManager;
private var mr : MeshRenderer;
private var minion : GameObject;
private var stopLight : GameObject;
private var originPos : Vector3;

function oldAwake()
{
	originPos = transform.position;
	
	sim = FindObjectOfType(SimManager);

/* taking out stoplights
	stopLight = Instantiate( stopLightType, transform.position + Vector3(0, stopLightHeight, 0), Quaternion.Euler(0,0,0) );
	stopLight.transform.parent = transform;
*/
	mr = GetComponentInChildren(MeshRenderer);
	minion = Instantiate( coreType, transform.position + Vector3(0, coreHeight, 0), Quaternion.Euler(0,0,0) );
	minion.transform.parent = transform;
	var minJunc:Juncore= minion.GetComponent( Juncore );
	//if (stopLightType) minJunc.SetStopHost(stopLight.GetComponent(StopGoLight));
	
	sim.AddJunction( minion );	
	//if (startOffWith) minJunc.AutoCreateAddon(startOffWith,locked);
}

function Spawn()
{
	originPos = transform.position;
	
	sim = FindObjectOfType(SimManager);

/* taking out stoplights
	stopLight = Instantiate( stopLightType, transform.position + Vector3(0, stopLightHeight, 0), Quaternion.Euler(0,0,0) );
	stopLight.transform.parent = transform;
*/
	mr = GetComponentInChildren(MeshRenderer);
	minion = Instantiate( coreType, transform.position + Vector3(0, coreHeight, 0), Quaternion.Euler(0,0,0) );
	minion.transform.parent = transform;
	var minJunc:Juncore= minion.GetComponent( Juncore );
	//if (stopLightType) minJunc.SetStopHost(stopLight.GetComponent(StopGoLight));
	
	sim.AddJunction( minion );	
	//if (startOffWith) minJunc.AutoCreateAddon(startOffWith,locked);
}

function ResetPosition()
{
	transform.position = originPos;
}
function GetOrigin()
{
	return originPos;
}
function SetNewOrigin( vec : Vector3 )
{
	originPos = vec;
}

function HideMe()
{
//   if( mr ) mr.enabled = false;
}

function ShowMe()
{
//   if( mr ) mr.enabled = true;
}

function Update()
{
}

function CheckForRayPenetration( origin:Vector3, direction:Vector3 )
{
	if( direction.y == 0 )
	{
		return 0.0;
	}
	else
	{
		var ht = origin.y - transform.position.y;
		var dist = ( ht==0.0 ? 0.0 : ht/-direction.y );
		var isect = origin + direction*dist;
				
		if( (isect - transform.position).magnitude < rad )
			return dist;
		else
			return 0.0;
	}
}