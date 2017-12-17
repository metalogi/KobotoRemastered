var oc:OceanWave;
var wake:GameObject;
var yFollow:float=0.5;
var zFollow:float=0.1;
var bouy:float=50;
var grav:float=50;
var selfRighting:float =5;
var maxDepth:float=20;

var floatForce:Vector3;
var followOffset:float;
var basePos:Vector3;
var baseRot:Quaternion;
var waterLevel:float;
var autoWaterLevel:boolean =true;
private var trans:Transform;
private var ridge:Rigidbody;
var rotationOveride:boolean;

var rotateTarget:float;
var rotateStrength:float;

var forwardForce:float=0;

private var wakeT:Transform;
private var wakeStartPos:Transform;

function Awake()
{
	trans=transform;
	ridge=GetComponent.<Rigidbody>();
	basePos=transform.position;
	baseRot=transform.rotation;
	
	rotateStrength=selfRighting;
	if (wake) {wakeT = wake.transform;
	wakeStartPos= wakeT;}
}
var tiltAngle:float;
var restoreForce:Vector3;
function FixedUpdate () 
{
	if (!ridge.isKinematic)
	{
	
	var wavePosition:Vector3=oc.GetPosition(followOffset);
	var oDepth:float;
	if (autoWaterLevel) oDepth=  basePos.y-trans.position.y;
	else oDepth=waterLevel-trans.position.y;
	//print ("depth=" +oDepth);
	if((forwardForce==0)&&(oDepth>-50))
	ridge.MovePosition(Vector3(basePos.x, trans.position.y +yFollow*Time.deltaTime *wavePosition.y,trans.position.z + zFollow*Time.deltaTime *wavePosition.z));
	
	
	if (oDepth>maxDepth)
	{
		ridge.AddForce(ridge.mass*Vector3(0,oDepth*bouy,forwardForce));
	}
	else ridge.AddForce(ridge.mass*Vector3(0,oDepth*grav,forwardForce));
	
	trans.eulerAngles.y=0;
	trans.eulerAngles.z=0;
	ridge.velocity.x=0;
	//ridge.angularVelocity.x*=5*Time.deltaTime;
	ridge.angularVelocity.y = 0;
	ridge.angularVelocity.z = 0;
	
	/*
	tiltAngle = (trans.rotation.eulerAngles.x<180)? trans.rotation.eulerAngles.x-baseRot.eulerAngles.x :
	(trans.rotation.eulerAngles.x-baseRot.eulerAngles.x-360);
	
	//restoreForce=Vector3(ridge.mass*tiltAngle * selfRighting*Time.deltaTime,0,0);
	restoreForce=Vector3(-ridge.mass*50*selfRighting*tiltAngle,0,0);
	ridge.AddTorque (restoreForce);
	*/
	RotateTarget (rotateTarget,rotateStrength);
	
	}
	
	
	
}

function SetForward(fdForce:float)
{
	forwardForce=fdForce*Time.deltaTime;
}

function TiltControl(t:float)
{
	forwardForce=t;
	rotateTarget=t*0.01;
	if (wake)
	{

	wakeT.position.z = Mathf.Sign(t) * wakeStartPos.position.z;
	wakeT.eulerAngles.y= (t>0)? 0:180;}
}

function SetTargetRot(ang:float,overRide:boolean, strength:float)
{
	rotateTarget=ang;
	if (overRide) rotateStrength=strength;
	else rotateStrength=selfRighting;
}

function RotateTarget(targRot:float, strength:float)
{
	
	tiltAngle = (trans.rotation.eulerAngles.x-targRot<180)? trans.rotation.eulerAngles.x-targRot :
	(trans.rotation.eulerAngles.x-targRot-360);
	
	//restoreForce=Vector3(ridge.mass*tiltAngle * selfRighting*Time.deltaTime,0,0);
	restoreForce=Vector3(-ridge.mass*50*strength*tiltAngle,0,0);
	ridge.AddTorque (restoreForce);
}

function Reset(v:boolean)
{
	transform.position =basePos;
	transform.rotation=baseRot;
	rotateStrength=selfRighting;
	forwardForce=0;
	if(wake)
	{
	wakeT.position = wakeStartPos.position;
	wakeT.rotation = wakeStartPos.rotation;
	}
	
}
