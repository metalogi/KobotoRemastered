var buttons : Button[];
var cutAway:boolean=true;
private var cutAwayReset : boolean;
var cutAwayTime:float=2;
var dontPause : boolean =false;
var cam:CameraManager;

var pathSpeed:float;
var endHoldTime:float;
var holdTime : float;

var spline:Spline;

var cycle:boolean=true;
var cycleTime:float=0;
var pingPong:boolean=false;

var onAtStart:boolean =true;
var pauseDuringIntro : boolean =false;
var startT:float=0;


var animateRotation:boolean =false;
var roll:boolean = false;
var rollSpeed : float =5;
var followStrength:float=1;
var followInvert:boolean=false;

var on:boolean=false;

var EndPointSmooth:boolean=true;
var startSmooth:float;
var endSmooth:float;



private var baseTime:float;
var moveTime:float;
private var baseRot:Quaternion;
private var basePosition :Vector3;
private var activeTime:float;
private var updateMe:boolean=false;

private var ridge:Rigidbody;
var t:float;

private var paused:boolean=false;
private var sLength:float;
private var deltaT:float;

private var plat:platform;
private var sim:SimManager;

var speedModifier : float = 1.0;

var sound :AudioSource;
function Awake()
{
	sound = GetComponent(AudioSource);
	 speedModifier= 1.0;
	baseRot = transform.rotation;
	ridge=GetComponent(Rigidbody);
	transform.position=spline.ReadSpline(startT);
	basePosition = transform.position;
	sLength=spline.GetLength();
	deltaT=pathSpeed/sLength;
	cam=GetComponent.<Camera>().main.GetComponent(CameraManager);
	if (onAtStart&&!pauseDuringIntro) Activate(true);
	else Activate(false);
	plat=GetComponent(platform);
	sim=FindObjectOfType(SimManager);
	cutAwayReset=cutAway;
	
}

function SetDeltaT()
{
	deltaT=pathSpeed/sLength;
}

function Activate (boo:boolean) {
	if (boo)
	{
		if (sound) {sound.Play();sound.volume =1;}
		
	if (!on)
	{
	//print("Activate");
	on=true;
	speedModifier= 1.0;
	t=Mathf.Clamp(startT,0,1);
	if (pathSpeed>0) moveTime= t * sLength / pathSpeed;
	if (pathSpeed<0) moveTime= (t-1) * sLength / pathSpeed;
	//print ("MoveTime="+ moveTime);
	baseTime=Time.deltaTime;
	}
	}
	else 
	{
		on=false;
		if (sound) sound.volume =0;
	}
	
}

function Hold(holdTime:float)
{
	on=false;
	yield WaitForSeconds(holdTime);
	baseTime=Time.time;
	moveTime=0;
	//print ("Ending Hold");
	if (cycle) on=true;
}

function FixedUpdate()
{	
	//if (on) print ("platformOn");
	if ((on)&&!paused)
	{	
		//print("movingPlatform");
		var lookAheadPos:Vector3;
		
		t+=Time.deltaTime*deltaT;
		moveTime+=Time.deltaTime;
		 var updatePos:Vector3;
		if ((t>=1)||(t<=0))
		{
			t=Mathf.Clamp(t,0,1);
			if (cycle) if (pingPong) deltaT*=-1; else t=(1-t);
			if (!cycle) on=false;
			if (cycleTime) {var holdTime:float =cycleTime-moveTime;
			//print ("elapsed: "+ moveTime);
			//print ("holdTime: " + holdTime);
			baseTime=Time.time;
			moveTime=0;
			if (holdTime>0) Hold(holdTime);
			}
			else if (endHoldTime) Hold(endHoldTime);
		}
		
		if (!EndPointSmooth) updatePos=spline.ReadSpline(t);
		else updatePos=spline.ReadSpline(spline.SmoothT(t,startSmooth,endSmooth)); 
		//transform.position = updatePos;
		ridge.MovePosition(updatePos);
		
		if ((animateRotation) &&(t<0.95)&&(t>0))
		{
			if (!EndPointSmooth) lookAheadPos=spline.ReadSpline(t+0.05);
			else lookAheadPos=spline.ReadSpline(spline.SmoothT((t+0.05),startSmooth,endSmooth));
			
			
			var followRot:Quaternion = Quaternion.FromToRotation (Vector3.forward, lookAheadPos-updatePos);
			//transform.LookAt(lookAheadPos);
			var followEuler:Vector3=followRot.eulerAngles;
			followEuler.y=followEuler.z=0;
			if (followInvert) followEuler.x=baseRot.eulerAngles.x-followEuler.x;
			followRot=Quaternion.Lerp(baseRot,Quaternion.Euler(followEuler),followStrength);
			ridge.MoveRotation(followRot);
		}
		
		if (roll) 
		{
			
			
			ridge.MoveRotation(ridge.rotation * Quaternion.Euler(rollSpeed*ridge.velocity.z,0,0));
		}
		
		
	}
	
	if (!on)
	{
		if (pauseDuringIntro && !cam.IsIntroPlaying()){pauseDuringIntro =false; Activate(true);}
		ridge.isKinematic=true;
	for( curButton in buttons )
	{
		if( curButton.IsPressed() )
		{	//print("Activating Platform due to button Press");
			Activate(true);
			if ((cutAway))
			{
			cutAway=false;
			cam.CutAway(this.gameObject,cutAwayTime);
			GeneralPause(false);
			for (var juncGO:GameObject in sim.RequestJunctionList())
			{var junc:Juncore = juncGO.GetComponent(Juncore);
				if (junc&&((junc.IsOnPlatform()==plat)||dontPause)) 
				{
					var jPause:PauseAction =junc.GetComponent(PauseAction);
					jPause.UnPauseMe();
				}
			}
			}
			
			
		}
	}
	}
	
}



function Reset(v:boolean)
{
	//ridge.MovePosition(spline.ReadSpline(startT));
	//transform.position=spline.ReadSpline(startT);
	ridge.isKinematic =true;
	on = onAtStart;
	paused =false;
	transform.position = basePosition;
	transform.rotation=baseRot;
	//ridge.velocity = Vector3.zero;
	holdTime=0;
	on=false;
	 Activate(onAtStart);
	SetDeltaT();
	cutAway=cutAwayReset;
	t=startT;
}


function GeneralPause(val:boolean)
{
	paused=val;
}