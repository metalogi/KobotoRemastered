function GetTilt()
{
	var acc:Vector3 =Vector3.zero;
	var horiz:float=0;
	//acc=iPhoneInput.acceleration;
	acc=LowPassFilterAccelerometer();
	horiz =-acc.y*Time.deltaTime;
	//horiz=1;
	return horiz;
}


var AccelerometerUpdateInterval : float = 1.0 / 60.0;
private var LowPassFilterFactor : float = AccelerometerUpdateInterval / 0.1; // tweakable
private var lowPassValue : Vector3 = Vector3.zero;

function LowPassFilterAccelerometer() : Vector3 
{
	lowPassValue = Vector3.Lerp(lowPassValue, Input.acceleration, LowPassFilterFactor);
	return lowPassValue;
}
	
var MoveForce:Vector3;
private var ForceScale:float=4;
private var tSpeed:float;
private var transAngle:float;
var tilt:float;
var tiltFactor:float=1;
var on:boolean =true;

var velo:Vector3;

class MoveDef
{
	var accel:float =80;
	var brakes:float =120;
	var wheelSpeed:float =2;
	var ObjGravity =100;
}
var move:MoveDef;

function erewrqwFixedUpdate ()
{
	MoveForce= Vector3.zero;
	tilt= GetTilt();
	
	tSpeed =1000*move.wheelSpeed*tilt;
	
	ZSpeedMatchByForce(tSpeed);
	MoveForce.y -= 9.81*Time.deltaTime *move.ObjGravity;
	
	
	GetComponent.<Rigidbody>().AddForce(ForceScale*MoveForce);
	//rigidbody.AddForce(0,0,200*Mathf.Sin(Time.time*300));
	velo=GetComponent.<Rigidbody>().velocity;
	
	
}


function ZSpeedMatchByForce(desired:float)
{
	var ZmatchForce:double;
	var deltaSpeed:float = desired - GetComponent.<Rigidbody>().velocity.z;
	if (on) ZmatchForce= (1+tiltFactor*tilt)*deltaSpeed*move.accel;
	else ZmatchForce= deltaSpeed*move.brakes;
	
	MoveForce += Vector3(0,0,ZmatchForce);
}