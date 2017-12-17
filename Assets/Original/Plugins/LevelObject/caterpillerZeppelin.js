var on:boolean=false;
private var ridge:Rigidbody;
private var boxC: BoxCollider;
private var boxCstartSize:Vector3;
private var boxCstartCenter:Vector3;
var niceY:float;
var floatyness:float;
var turbulance:float;
var avoid:boolean;
var avoidanceForce:Vector3;

var zeppelin:BoxCollider;

var startPos:Vector3;

function Awake()
{
	ridge=GetComponent(Rigidbody);
	startPos=transform.position;
	ridge.isKinematic=true;
	boxC=GetComponent(BoxCollider);
	boxCstartSize=boxC.size;
	boxCstartCenter=boxC.center;
	zeppelin.isTrigger=true;
}

function Activate () {
	on=true;
	ridge.isKinematic=false;
	//boxC.size.z*=4;
	//boxC.size.y*=3;
	//boxC.center.y+=15;
	zeppelin.isTrigger=false;
	
	
}
function SetAvoid(v:boolean){avoid=v;}
function SetAvoidanceForce(vec:Vector3){avoidanceForce=vec;}

function OnCollisionEnter(col:Collision)
{
	if (!on &&col.rigidbody) 
	{
		GetComponent.<Animation>().Play();
		yield WaitForSeconds(0.5);
		Activate();
		ridge.velocity.z=0;
		col.rigidbody.velocity*=-1;
	}
}
function Reset(v:boolean)
{
	print ("reseting caterpiller");
	on=false;
	GetComponent.<Animation>().Stop();
	GetComponent.<Animation>().Rewind();
	transform.position=startPos;
	zeppelin.isTrigger=true;
	boxC.size=boxCstartSize;
	boxC.center=boxCstartCenter;
}

function FixedUpdate()
{
	if (on)
	{
		var floatForce:Vector3;
		if (transform.position.y < niceY) floatForce= Vector3(0,floatyness*(niceY-transform.position.y)/(niceY-startPos.y),0);
		else floatForce=Vector3(0,-floatyness,0);
		print ("ff"+floatForce);
		if (turbulance>0) floatForce += turbulance * Random.insideUnitSphere;
		if (avoid) floatForce+=avoidanceForce;
		floatForce.x=0;
		ridge.AddForce(floatForce*ridge.mass);
		transform.position.x=0;
	}
	else ridge.isKinematic=true;
	
}