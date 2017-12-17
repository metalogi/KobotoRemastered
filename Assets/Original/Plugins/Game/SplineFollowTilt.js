var on:boolean=false;
var paused:boolean=false;
var spline:Spline;
private var baseRot:Quaternion;
private var tiltSpeed:float;
private var ridge:Rigidbody;
var pathSpeed:float =0.1;
var startT:float;
var t:float;

var blockUp : boolean = false;
var blockDown : boolean =false;

function Awake(){
	ridge=GetComponent(Rigidbody);
	baseRot = transform.rotation;
	Reset(true);
}
function FixedUpdate () {
	if ((on)&&!paused)
	{
	if ((t<=1)&&(t>=0)){if ((tiltSpeed>0 && !blockUp) || (tiltSpeed<0 && !blockDown)) t+=tiltSpeed;}
	t=Mathf.Clamp(t,0,1);
	ridge.MovePosition(spline.ReadSpline(t));
	}
}

function TiltControl(tilt:float)
{
	tiltSpeed = 0.01 *tilt *pathSpeed;
}

function Reset(v:boolean)
{
	//on =false;
	paused=false;
	tiltSpeed=0;
	transform.position=spline.ReadSpline(startT);
	t=startT;
	transform.rotation=baseRot;
	blockUp = false;
	blockDown = false;
	
}


function GeneralPause(val:boolean)
{
	paused=val;
}