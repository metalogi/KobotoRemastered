
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
	
	if (!paused)
	{
		runTime+=Time.deltaTime;
		if (cycleComplete) {cycleComplete=false;Idle();}
	}
	
}

function FixedUpdate()
{
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
	
	while (idle_state && (runTime - startTime) < idleTime)
	{
		if (kill) return;
		yield;
	}
	
	Stomp();
	idle_state = false;
}

function Stomp()
{
	stomp_state=true;
	startTime = runTime;
	shaftScale *= 1-antip;
	
	while(stomp_state&&shaftScale < stompRange+stompOverShoot)
	{
		
		if (!paused)
		if((runTime - startTime) >antipTime){deathZone.on=true; shaftScale += stompSpeed*Time.deltaTime;}
		
		yield;
	}
	shaftScale = stompRange;
	
	if (stomp_state&&!oneShot) Down();
	stomp_state=false;
}

function Down()
{
	down_state =true;
	startTime = runTime;
	
	while (down_state&&(runTime - startTime) < downTime)
	{
		yield;
	}
	
	if (down_state&&!oneShot) Up();
	down_state =false;
}

function Up()
{
	up_state =true;
	deathZone.on=false;
	//shaft.localScale.y *=1+antip/2;
	while(up_state&&shaftScale > 1)
	{
		if (kill) return;
		if (!paused) shaftScale -= upSpeed*Time.deltaTime;
		yield;
	}
	shaftScale = 1;
	cycleComplete = true;
	up_state =false;
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
