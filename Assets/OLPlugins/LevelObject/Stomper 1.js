
var on : boolean =true;

var oneShot : boolean =false;

var shaft : Transform;
var head : Transform;
var headP : Transform;
var headRidge : Rigidbody;

var antip : float;
var antipTime : float;
var stompRange : float;
var stompOverShoot : float;
var stompSpeed : float;
var idleTime : float;
var downTime : float;
var upSpeed : float;

var angry : boolean;
var paused : boolean;
var angrySpeed : float;
var angryUpSpeed : float;
var angryIdle : float;
var angryDownTime : float;

var runTime : float;

var startTime: float;
var deathZone :DeathZone;

private var cycleComplete:boolean = false;
private var baseLength:Vector3;
private var headOffset:Vector3;
private var idleTimeReset : float;
private var stompSpeedReset : float;
private var upSpeedReset : float;
private var downTimeReset : float;
private var onReset : boolean;

var idle_state : boolean =false;
var stomp_state : boolean =false;
var down_state : boolean =false;
var up_state : boolean =false;

private var kill : boolean =false;

var shaftScale : float;
var headPosition : float;
function Start()
{
	headRidge = head.GetComponent(Rigidbody);
	baseLength =headP.position-shaft.position;
	headOffset = head.position - headP.position;
	
	idleTimeReset = idleTime;
	stompSpeedReset= stompSpeed;
	upSpeedReset= upSpeed;
	downTimeReset = downTime; 
	
	onReset = on;
	
	Reset(true);
	//Idle();
	
	
}

function Activate(v:boolean)
{
	Stomp();
}

function Reset(v:boolean)
{
idle_state = false;
stomp_state = false;
up_state = false;
down_state = false;
	on=onReset;
	deathZone.on=false;
	runTime=0;
	
	Anger(false);
	shaftScale = 1;
	shaft.localScale.y = 1;
	if (on) Idle();
	/*
	idleTime = idleTimeReset;
	stompSpeed= stompSpeedReset;
	downTime = downTimeReset;
	upSpeed= upSpeedReset;
	*/
}


function GeneralPause(val:boolean)
{
	paused=val;
}

function Update () {
	//if (headRidge) headRidge.MovePosition(shaft.position +baseLength * shaft.localScale.y + headOffset);
	//else
	//head.position = shaft.position +baseLength * shaft.localScale.y + headOffset;
	
	
	
}

function FixedUpdate()
{
	if (!paused)
	{
		runTime+=Time.deltaTime;
		if (cycleComplete) {cycleComplete=false;Idle();}
	}
	
	if (idle_state)
	{
	if ((runTime - startTime) > idleTime) {idle_state = false;Stomp();}
	}
	
	if (stomp_state && !paused)
	{
		if (shaftScale > stompRange+stompOverShoot)
		{
			shaftScale = stompRange;
		if (!oneShot){stomp_state=false;Down();}
		
		}
		else
		if((runTime - startTime) >antipTime){deathZone.on=true; shaftScale += stompSpeed*Time.deltaTime;}
		
	}
	if (down_state)
	{
		if((runTime - startTime) > downTime)
		if (!oneShot) {down_state =false; Up();}

	}
	
	if (up_state)
	{
		if (shaftScale < 1)
		{
			shaftScale = 1;
			cycleComplete = true;
			up_state =false;
		}
		else
		{
			if (!paused) shaftScale -= upSpeed*Time.deltaTime;
		}
	}
	
	headRidge.MovePosition(shaft.position +baseLength * shaftScale + headOffset);
}

function LateUpdate()
{
	 shaft.localScale.y = shaftScale;
	head.position = shaft.position +baseLength * shaftScale + headOffset;
}

function Idle()
{
	
	idle_state = true;
	startTime = runTime;
	
}

function Stomp()
{
	stomp_state=true;
	startTime = runTime;
	shaftScale *= 1-antip;
	

}

function Down()
{
	down_state =true;
	startTime = runTime;
	
}

function Up()
{
	up_state =true;
	deathZone.on=false;
	//shaft.localScale.y *=1+antip/2;

}

function Anger(flag : boolean)
{
	if (flag)
	{
		angry = true;
		idleTime = angryIdle;
	stompSpeed= angrySpeed;
	downTime = angryDownTime;
	upSpeed= angryUpSpeed;
	}
	else 
	{
		angry = false;
	idleTime = idleTimeReset;
	stompSpeed= stompSpeedReset;
	downTime = downTimeReset;
	upSpeed= upSpeedReset;
	}
}
