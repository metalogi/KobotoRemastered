var levelName : String;
var world : int =1;
var startPosition : Vector3;


// a class of constant preferences used by the Camera
class CAMPreferences
{
	private var EditorCameraPitch = 20.0;
	var ExtraElevation = 8.0;
	var snapSpeed = 5.0;
	var inPositionSnapSpeed = 100.0;
	var simTargetAttractSpeed:float= 4;
	var initialPauseTime:float =2;
	var levelPanTime:float=2;
	var introSpline:Spline;
	var maxSpin:float=40;
	var zoomedOutDistance : float = 600;
	var minimumDist:float =200;
	
	function GetCameraPitch() { return EditorCameraPitch; }
	function GetExtraElevation() { return ExtraElevation; }
} 
var musicVolume:float=0.5;
var aud:AudioSource;
var backgroundColorEnd:Color = Color(0.39, 0.37, 0.31,0);
var camPrefs : CAMPreferences;
var coreObject : GameObject;
var intro:boolean;
private var cameraAngle : float;
private var originPoint : Vector3;
private var pauseTimer:float;
private var gen : GenericFunctions;
private var smg : SoundManagerScript;
private var man:UIManager;
private var sim:SimManager;
private var edit : UIEditor;
//function DropSound() { smg.DropSound(); }
function PickUpSound() { smg.PickUpSound(); }
function KobotoSound() { smg.KobotoSound(); }
function TossSound() { smg.TossSound(); }
//function DeselectSound() { smg.DeselectSound(); }
function KbOnSound() { smg.KbOnSound(); }
function KbOffSound() { smg.KbOffSound(); }
//function StartSound() { smg.StartSound(); }
//function StopSound() { smg.StopSound(); }
function WinSound() { smg.WinSound(); }
//function PwUpCollectSound() { smg.PwUpCollectSound(); }
//function PwUpJackhammerSound() { smg.PwUpJackhammerSound(); }
//function fireworksPopSound() { smg.fireworksPopSound(); }
function SplatSound(){print ("splat!");smg.SplatSound();}
function SplashSound(){smg.splash.Play();}
function ZoomOutSound(){smg.zoomOut.Play();}
function ZoomInSound(){smg.zoomIn.Play();}

function KillMusic() { if (aud) aud.Stop(); }
function SetMusicVolume(vol:float) {if (aud) aud.volume=0.7*vol;PlayerPrefs.SetFloat("MusicVolume", vol);}
function GetMusicVolume() {if (aud) return aud.volume;}
var overrideWorldBG : boolean=false;
var pointer : Transform;

var realLevelNo :int;
var worldDefs : WorldObjectDefs;

function Start()
{	
return;
	Camera.main.nearClipPlane =10;
	Camera.main.farClipPlane =8000;
	//Camera.main.fieldOfView = 46;
	Camera.main.fieldOfView = GameplayParameters.Instance().CameraSettings.FOV;
	
	//Hide UI layer
	var mask = Camera.main.cullingMask;
	mask &= ~(1<<16);
	Camera.main.cullingMask = mask;
	
	if (world ==3 ) Camera.main.farClipPlane =20000;
	worldDefs = new WorldObjectDefs();
	realLevelNo = Application.loadedLevel +1;
	var levelNos : int[] = new int[4];
	levelNos=worldDefs.GetNumberOfLevels();
	for (var wi : int = 0; wi<world; wi++)
	{
		realLevelNo -= levelNos[wi];
	}
	//PlayerPrefs.SetInt("CurrentLevel" ,Application.loadedLevel);
	
	
	print ("currentLevel: " + (PlayerPrefs.GetInt("CurrentLevel")+1));
	print ("levels Completed: " + PlayerPrefs.GetInt("LevelsCompleted"));
	
	if (!overrideWorldBG)
	{
	
	worldDefs.SetBGColors(world);
	backgroundColorEnd=Camera.main.backgroundColor;
	}
	Shader.SetGlobalColor("_sceneFog", Camera.main.backgroundColor);
	/*
	var oldAud:AudioSource = GetComponent(AudioSource);
	if (oldAud) Destroy(oldAud);
	//backgroundColorEnd=Color(0.59, 0.57, 0.51,0);
	//aud= GetComponent(AudioSource);
	var audObj : GameObject;
    if ((realLevelNo-1) %3  ==0) audObj =Instantiate(Resources.Load("W1Music"));
    if  ((realLevelNo-1) %3  ==1) audObj =Instantiate(Resources.Load("W2Music"));
    if  ((realLevelNo-1) %3  ==2)  audObj =Instantiate(Resources.Load("W3Music"));
	aud=audObj.GetComponent(AudioSource);
	*/
	var audObj : GameObject = GameObject.FindWithTag ("musicPlayer");
	if (audObj) aud=audObj.GetComponent(AudioSource);
	musicVolume = PlayerPrefs.GetFloat("MusicVolume",0.5);
	if (aud) aud.volume = 0.7*musicVolume;
	//print ("music Volume set to: " + aud.volume);
	
	var smgPrefab:GameObject = Resources.Load("SoundManager");
	var smgObj:GameObject = Instantiate( smgPrefab );
	//var smgObj:GameObject =GameObject.FindWithTag  ("soundManager");
	
	var pointerObj :GameObject = Instantiate(Resources.Load("pointer"));
	pointer = pointerObj.transform;
	pointer.GetComponent.<Renderer>().enabled=false;
	pointer.parent = transform;
	
	var parentTransform: Transform =transform;
	smgObj.transform.parent = parentTransform;
	smg = smgObj.GetComponent( SoundManagerScript );
	
	man = coreObject.GetComponent(UIManager);
	edit =coreObject.GetComponent(UIEditor);
	gen = coreObject.GetComponent(GenericFunctions);
	sim = coreObject.GetComponent(SimManager);
	originPoint = observationPoint.position;
	originPoint.x =camPrefs.minimumDist;
	
	baseAngle=Mathf.Tan( GameplayParameters.Instance().CameraSettings.Angle *Mathf.Deg2Rad);
	//baseY = observationPoint.position.y - observationPoint.position.x *baseAngle;
	
	
	SetSimTarget(null);
	
	pauseTimer=camPrefs.initialPauseTime+camPrefs.levelPanTime;
	camStartPosition= transform.position;
	camStartRotation=transform.rotation;
	intro=true;
	PosStack.Init(2);
	//cameraAngle = observationPoint.rotation.eulerAngles.x;
	cameraAngle = GameplayParameters.Instance().CameraSettings.Angle;
	//print ("base.." + observationPoint.rotation.eulerAngles.x +baseAngle);
	introSplinePos=0;
	
	yield WaitForSeconds(0.3);
	
	JuncList=sim.RequestJunctionList();
	GetFocusInfo();
	obs =cameraFocus;
	PosStack.SetAll(cameraFocus);
	
	//hard code some stuff to make sure its the same in each level
	 
	//baseY =50;
	baseY = GameplayParameters.Instance().CameraSettings.Height;
	
	minMapZoom = GameplayParameters.Instance().CameraSettings.Distance;
	maxMapZoom = 2*minMapZoom;
	roamTime =4;
	cameraAngle = GameplayParameters.Instance().CameraSettings.Angle;
	observationPoint.rotation.eulerAngles.x=0;
	observationPoint.rotation.eulerAngles.y=0;
	obs.x = GameplayParameters.Instance().CameraSettings.Distance;;
	obs.y += baseAngle*minMapZoom+baseY;
	transform.eulerAngles.y =270;
	//transform.eulerAngles.x =0;
	transform.eulerAngles.x = GameplayParameters.Instance().CameraSettings.Angle;
	
	if (camPrefs.introSpline) 
	{
		camPrefs.introSpline.splinePoints[0].position = transform.position;
		camPrefs.introSpline.splinePoints[2].position = obs;
	}
	
	introGoalPosition = obs;
	
	
	
	
}
function IsIntroPlaying()
{
	return intro;
}
var scrollArea : Rect = Rect(0,100,400,250);
 var minMapZoom : double = 150.0;
 var maxMapZoom : double = 700.0;
private var scrollSpeed : float = 600;
private var flingSpeed : float = 3500;

// a point in space the main camera retreats to when the level is played
var observationPoint : Transform;
var obs : Vector3;
private var inPosition : boolean;
var simTgt: GameObject;
private var simTgtJunc:Juncore;
private var simTgtRotate:float=0;
private var sGoalPosition:Vector3;
private var camStartPosition:Vector3;
private var camStartRotation:Quaternion;

var cameraFocus:Vector3;
var cameraFocusDist:float;
var interestingObjects:InterestingObject[];
var useInterestingObjects:boolean =false;
var baseAngle:float;
var baseY:float =50;
var moveTilt:float; 
var dragOffset:Vector3;
var rotationOffset:Vector3; //how much to move camera due to rotation around target

// a class containing data about the current state of the UI editor
class EditorState
{
	@System.NonSerialized
	var tgt : GameObject;
	@System.NonSerialized
	var spin : double = 270.0;
	
	private var zoom : double = 50.0;
	private var minZoom : double = 50.0;
	private var maxZoom : double = 250.0;
	
	function GetZoom() { return zoom; }
	function SetZoom( Val : double ) 
	{ 
		zoom = Val; 
		if( zoom < minZoom ) zoom = minZoom;
		if( zoom > maxZoom ) zoom = maxZoom;
	}
} var editor : EditorState;


function ResetLocation() { obs = originPoint; obs.x = GameplayParameters.Instance().CameraSettings.Distance;}
var simTargetTest:GameObject;

function SetSimTarget(newTgt:GameObject)
{
	if (newTgt) print ("setting simTgt: " + newTgt.name);
	else print ("clearing simTgt");
	if (gmode!=4)
	{
	simTgtRotate=270;
	
	transform.eulerAngles.x= cameraAngle;
	//rotationOffset=Vector3.zero;
	if (simTgt != newTgt) dragOffset=Vector3.zero;
	JuncList=sim.RequestJunctionList();
	for(var obj:GameObject in JuncList)
	{
		var j:Juncore = obj.GetComponent(Juncore);
		if (j) j.Select(false);
	}
		
	//if(newTgt) newTgt= simTargetTest;
	if(newTgt) 
	{	simTgtRotate=270;
		//if (newTgt.GetComponent(EndGate)) simTgtRotate=305;
		PosStack.SetAll(newTgt.transform.position);
		simTgtJunc=newTgt.GetComponent(Juncore);
		obs.x = GameplayParameters.Instance().CameraSettings.Distance;
		if(simTgtJunc){simTgtJunc.Select(true); FollowOffset=simTgtJunc.GetFollowOffset();}
		print("Setting target: " + newTgt.transform.name);
	}
	else 
	{	
		//print("AAAAAAAIIIIIIIEEEE!!!!!!");
		obs.x = GameplayParameters.Instance().CameraSettings.Distance;
		
		GetFocusInfo();
		PosStack.SetAll(cameraFocus);
	}
	
	simTgt =newTgt;
	}
	
	//if (!simTgt) print("no simTgt");
	//else print(simTgt.name);
}
function GetSimTarget()
{
	return simTgt;
}
// accessor functions
function GetEditorTarget() { return editor.tgt; }

function SetEditorTarget( newTgt : GameObject ) 
{	
	//if (!newTgt) print("cleanup..3");
	editor.tgt = newTgt; 
	if( newTgt && newTgt.GetComponent(Juncore) )
		{
			transform.parent = newTgt.transform;
		}
	
	else 
	{
	var tgtAdd:Addon;
	if( newTgt) tgtAdd = newTgt.GetComponent(Addon); 
		if(newTgt&& tgtAdd && tgtAdd.GetHostMountPoint() )
		{
			transform.parent = tgtAdd.GetHostMountPoint().GetHostJuncore().transform;
		}
	
		else
		{
		
		//print("parent to worl");
		transform.parent = null;
		}
	}
}
	
function GetEditorSpin() { return editor.spin; }
function SetEditorSpin(value : double) { editor.spin = value; }
function AddEditorSpin(value : double)
{ 
	editor.spin += value; 
	if ((editor.spin)>(270+camPrefs.maxSpin)) editor.spin = (270+camPrefs.maxSpin);
	if ((editor.spin)<(270-camPrefs.maxSpin)) editor.spin = (270-camPrefs.maxSpin);
 }
function GetEditorZoom() { return editor.GetZoom(); }
function SetEditorZoom(value : double) 
{ 
	editor.SetZoom( value );
}
function AddEditorZoom(value : double) 
{ 
	SetEditorZoom( GetEditorZoom() + value*Time.deltaTime*scrollSpeed ); 
	
}

function GetTargetDistance()
{
	return (editor.tgt==null)?0.0:(editor.tgt.transform.position - transform.position).magnitude;
}


private var iPhoneDragSpeed:float =0.1;
var FollowOffset:Vector3=Vector3.zero;
var roamTimer:float;
var roamTime:float=2;
var roamXTarget:float=400;
var roamX:float=0;
var touching:boolean;
var onScreen:boolean;
var screenPos:Vector3;
var gmode:int;


// main camera update
function LateUpdate()
{
	return;
	gmode = man.GetGameMode();
	if (gmode==2) IntroCam();
	//if (gmode==0) EditorCam();
	if (gmode==1) GameCam();
	if (gmode==3) PauseCam();
	if (gmode==4) EndCam();
	if (gmode==5) LookCam();
}

private var oldTarget:GameObject;
private var cutAwayTimer:float;
private var introSplinePos:float;

function CutAway( target:GameObject, cTime:float)
{
	
	print("CutAway..");
	oldTarget=GetSimTarget();
	SetSimTarget(target);
	gen.GlobalPause(false);
	var sep:float =100;
	if(oldTarget) sep= (target.transform.position -oldTarget.transform.position).magnitude;
	yield new WaitForSeconds (cTime);
	SetSimTarget(oldTarget);
	yield new WaitForSeconds (sep/200);
	gen.GlobalUnPause(false);
	
}
var introGoalPosition : Vector3;
function IntroCam()
{

	//var goalRotation = observationPoint.rotation;  // -keeping camera straight at all times now
	//introGoalPosition= obs;
	//Debug.Log ("startPosition =" + camStartPosition);
	//Debug.Log ("goalPosition =" + introGoalPosition);
	//Debug.Log ("position =" + transform.position);
	if(pauseTimer>0) 
	{
		
		pauseTimer -= Time.deltaTime;
		if(pauseTimer<camPrefs.levelPanTime)
		{	var interp:float=pauseTimer/camPrefs.levelPanTime;
		if (camPrefs.introSpline)
		{
			transform.position = camPrefs.introSpline.ReadSpline(camPrefs.introSpline.SmoothT((1-interp),1,1));
			
			//transform.rotation=Quaternion.Slerp(goalRotation,camStartRotation, interp);
		}
		else
		{
			interp =Mathf.Pow(interp,2);
			transform.localPosition=Vector3.Lerp(introGoalPosition, camStartPosition, interp);
			//transform.rotation=Quaternion.Slerp(goalRotation,camStartRotation, interp);
		}
		}
		if (pauseTimer<=0.3) {intro =false;GetFocusInfo();}
	}
	
}

function PauseCam()
{
}
/*
function EditorCam()
{
	
if(!editor.tgt) FingerDrag();

var goalRotation = observationPoint.rotation;
var goalPosition = obs+dragOffset;
	
inPosition = false;
// if we have a target, zoom up to it
if( editor.tgt )
	{
		goalRotation.eulerAngles = Vector3(camPrefs.GetCameraPitch(), editor.spin, 0);
		var parentPos:Vector3=(transform.parent)? transform.parent.position : Vector3.zero;
		var rotTemp = transform.rotation;
		if (transform.parent) transform.rotation = goalRotation * Quaternion.Inverse(transform.parent.rotation);
		var antiUp = transform.up;
		var antiFwd = transform.forward;
		transform.rotation = rotTemp;
		var edJunc:Juncore= editor.tgt.GetComponent(Juncore);
		var offset:float = (edJunc)? 	edJunc.cameraRaiseOffset : 0;
		goalPosition = (editor.tgt.transform.position - parentPos) - antiFwd*editor.GetZoom() + antiUp*(camPrefs.GetExtraElevation() + offset);
		
		if( ( transform.localPosition - goalPosition ).magnitude < 0.1 ) inPosition = true;
	}
	
if( inPosition )
	{
		transform.localPosition = Vector3.Lerp( transform.localPosition, goalPosition, Time.deltaTime * camPrefs.inPositionSnapSpeed );
		transform.rotation = Quaternion.Slerp( transform.rotation, goalRotation, Time.deltaTime * camPrefs.inPositionSnapSpeed );
	}
	else
	{
		transform.localPosition = Vector3.Lerp( transform.localPosition, goalPosition, Time.deltaTime * camPrefs.snapSpeed );
		transform.rotation = Quaternion.Slerp( transform.rotation, goalRotation, Time.deltaTime * camPrefs.snapSpeed );
	}
}
*/

function EndCam(Gate:GameObject)
{
	man.SetGameMode(0);
	SetEditorTarget(Gate);
	editor.SetZoom(200);
	SetEditorSpin(Gate.transform.rotation.y*90);
	
}

private var endCamera:Transform;
function SetEndCamera(endT:Transform){endCamera=endT;}

function EndCam()
{
	if (endCamera)
	{
	var goalPosition:Vector3= endCamera.position;
	var goalRotation:Quaternion = endCamera.rotation;
	transform.localPosition = Vector3.Lerp( transform.localPosition, goalPosition, Time.deltaTime * camPrefs.snapSpeed );
	transform.rotation = Quaternion.Slerp( transform.rotation, goalRotation, Time.deltaTime * camPrefs.snapSpeed );
	
	GetComponent.<Camera>().backgroundColor= Color.Lerp(GetComponent.<Camera>().backgroundColor, backgroundColorEnd,Time.deltaTime*0.4);
	}
	
	
}

var returnPosition : Vector3;
var returnDragOffset : Vector3;
var returnVol:float;
var zoomPosition : Vector3;
var returnPointer : boolean;
function StartLookMode()
{
	returnPosition = transform.position;
	returnDragOffset = dragOffset;
	returnPointer = pointer.GetComponent.<Renderer>().enabled;
	returnVol = aud.volume;
	zoomPosition = transform.position + Vector3(camPrefs.zoomedOutDistance,0,0);
	var zoomTime : float =0.5;
	var timer : float =0;
	var t :float=0;
	while (timer<zoomTime)
	{
		t=timer/zoomTime;
		t = 1-Mathf.Pow((1-t),2);
		transform.position = Vector3.Lerp(returnPosition, zoomPosition,t);
		aud.volume = Mathf.Lerp(returnVol, returnVol*0.3, t);
		timer += Time.deltaTime;
		yield;
	}
	pointer.GetComponent.<Renderer>().enabled=false;
	dragOffset = Vector3.zero;
	man.gameMode =5;
}

function EndLookMode()
{
	gen.UnMuteSound();
	startPosition = transform.position;
	
	var zoomTime : float =0.5;
	var timer : float =0;
	var t :float=0;
	while (timer<zoomTime)
	{
		t=timer/zoomTime;
		t = 1-Mathf.Pow((1-t),2);
		transform.position = Vector3.Lerp(startPosition, returnPosition,t);
		aud.volume = Mathf.Lerp(returnVol*0.3, returnVol, t);
		timer += Time.deltaTime;
		yield;
	}
	gen.GlobalUnPause(false);
	
	man.gameMode =1;
	
	dragOffset = returnDragOffset;
	pointer.GetComponent.<Renderer>().enabled =returnPointer;
	aud.volume = returnVol;
}



var lookTarget : Vector3;
function LookCam()
{
	FingerDrag();
	lookTarget = zoomPosition + dragOffset;
	transform.position = Vector3.Lerp(transform.position, lookTarget, Time.deltaTime *camPrefs.simTargetAttractSpeed);
	
	
}



private var JuncList:Array;
function SetDragOffset(v:Vector3){	dragOffset=v;}




var g0:GameObject;
var g1:GameObject ;
var j0 : Juncore ;
var j1 : Juncore;


var offScreenJunc : Juncore;


function GameCam()
{	
	JuncList=sim.RequestJunctionList();
	GetFocusInfo();
	
	
	//onScreen=false;
	/*
		for (var tgt:GameObject in JuncList)
	 //find out if target is on screen
	{
		screenPos = Camera.main.WorldToScreenPoint(tgt.transform.position);
		//print(tgt.name + screenPos);
		//if   ( (  Vector2(screenPos.x,screenPos.y)- Vector2(Screen.width/2, Screen.height/2)   ).magnitude  <  200) onScreen=true;
	}
	*/
	
	if (offScreenJunc) 
	{
		pointer.position = gen.FixedScreenToWorldPoint(Vector3(sim.offScreenButtonCenter.x,sim.offScreenButtonCenter.y,15));
		//pointer.localPosition.z =15;
		pointer.GetComponent.<Renderer>().material.color = offScreenJunc.pointerColor;
		pointer.GetComponent.<Renderer>().enabled =true;
		pointer.LookAt(Vector3(pointer.position.x,offScreenJunc.trans.position.y,offScreenJunc.trans.position.z), Vector3(1,0,0));
	}
	else pointer.GetComponent.<Renderer>().enabled =false;
	
	var goalRotation = observationPoint.rotation;
	var goalPosition = obs;
	/*
	if (!onScreen &&(Mathf.Abs(gen.GetTilt()-moveTilt) <0.01) ) 
	{
		roamTimer -= Time.deltaTime;
		if (roamTimer<roamTime/2) dragOffset*= (1-2*Time.deltaTime);
		if (roamTimer<0.1) dragOffset=Vector3.zero;
	}
	*/
	var smooth:Vector3;
	
	//var camAngle:float=simTgtRotate-270;
	
		var speedAngleModifier:float=0;
		var simTgtSpeed:float=0;
		if (simTgt)
		{
			
			
			//PosStack.AddP(simTgt.transform.position);
			PosStack.AddP(cameraFocus);
			smooth=PosStack.GetAv();
			
			sGoalPosition.z=smooth.z;
			sGoalPosition.x=obs.x;
			sGoalPosition.y=smooth.y+baseAngle*sGoalPosition.x+baseY*0.6 ;
			sGoalPosition +=dragOffset;
			if (simTgtJunc) 
			{
			//sGoalPosition+=(simTgtJunc.IsOn())?FollowOffset:FollowOffset/2;
			//if (simTgtJunc.IsStuckToCeiling()) sGoalPosition.y-=50;
			
			if(simTgt.GetComponent.<Rigidbody>())
			{
			//speedAngleModifier = simTgt.rigidbody.velocity.z *0.012;
			simTgtSpeed =0.1*simTgt.GetComponent.<Rigidbody>().velocity.magnitude;
			}
			if (!simTgtJunc.isAlive() || simTgtJunc.IsSaved()) {print("simTgt dead");SetSimTarget(null);}
			}
			if (JuncList.length==2)
			
			if (interest)
			{
				
				var interestDist :float =(interest.position- simTgt.transform.position).magnitude;
				print (interestDist);
				var newXs=obs.x + 0.6*interestDist;
				if (newXs<maxMapZoom) sGoalPosition.x=newXs; 
				
				if (interestDist>450) interest=null;
			}
			if (cameraFocusDist<300  &&  ySep<160) 
			{
				//if ((simTgt == g0) && !j1.on) j1.TurnOn();
				//if ((simTgt == g1) && !j0.on) j0.TurnOn();
				if (offScreenJunc) offScreenJunc.offscreen=false;
				SetSimTarget(null);
				offScreenJunc=null;
			}
			
			//if (Mathf.Abs(transform.eulerAngles.y-simTgtRotate)>3) transform.RotateAround(simTgt.transform.position, Vector3.up, (transform.eulerAngles.y-simTgtRotate)*Time.deltaTime);
		}
		
		else
		{
			
			
			
			PosStack.AddP(cameraFocus);
			smooth=PosStack.GetAv();
			var newX=obs.x + 0.6*cameraFocusDist;
			if (newX<maxMapZoom) sGoalPosition.x=newX; 
			//else simTgt =sim.RequestJunctionList()[0];
			sGoalPosition.y=smooth.y+baseAngle*sGoalPosition.x+baseY;
			sGoalPosition.z=smooth.z;
			sGoalPosition +=dragOffset;
			
			if (cameraFocusDist>450 || ySep>170) //switch focus to fastest moving active Juncore
			{
				if (JuncList.length==2)
				{
				var newfocus:GameObject = null;
				var juncToTurnOff:Juncore;
				
				if (j0 && j0.on && j0.ridge.velocity.magnitude > j1.ridge.velocity.magnitude)  {newfocus = g0;juncToTurnOff = j1;}
				if (j1 && j1.on && j1.ridge.velocity.magnitude > j0.ridge.velocity.magnitude)  {newfocus = g1;juncToTurnOff = j0;}
				
				
				if (newfocus&&!juncToTurnOff.saved)
				{
					
					offScreenJunc =juncToTurnOff;
					
					SetSimTarget(newfocus);
					print ("turningOff:"+ juncToTurnOff.gameObject.name);
					juncToTurnOff.offscreen = true;
					//juncToTurnOff.TurnOff();
					
					edit.SelectedKoboto = newfocus;

				}
				}
				if (interest) interest=null;
			
			}
			else
			{
				if (offScreenJunc) 
				{offScreenJunc.offscreen=false;
		
				offScreenJunc=null;
				}
			}
			
		}
		
			// cap the map position
	/*	
	if( sGoalPosition.x < minMapZoom )
		sGoalPosition.x = minMapZoom;
	if( sGoalPosition.x > maxMapZoom )
		sGoalPosition.x = maxMapZoom;

	if( sGoalPosition.z < scrollArea.xMin )
		sGoalPosition.z = scrollArea.xMin;
	if( sGoalPosition.z > scrollArea.xMin+scrollArea.width )
		sGoalPosition.z = scrollArea.xMin+scrollArea.width;

	if( sGoalPosition.y < scrollArea.yMin )
		sGoalPosition.y = scrollArea.yMin;
	if( sGoalPosition.y > scrollArea.yMin+scrollArea.height )
		sGoalPosition.y = scrollArea.yMin+scrollArea.height;
		*/
		
		//rotationOffset.x= -sGoalPosition.x*(1-Mathf.Cos(Mathf.Deg2Rad*(simTgtRotate-270+speedAngleModifier)));
		//rotationOffset.z= -sGoalPosition.x*(Mathf.Sin(Mathf.Deg2Rad*(simTgtRotate-270+speedAngleModifier)));
		
		transform.position = Vector3.Lerp(transform.position, sGoalPosition,Time.deltaTime *(camPrefs.simTargetAttractSpeed+simTgtSpeed));
		//transform.eulerAngles.y = Mathf.Lerp (transform.eulerAngles.y,simTgtRotate+speedAngleModifier,3*Time.deltaTime);
		//transform.rotation =observationPoint.rotation;
		//transform.eulerAngles.x = Mathf.Lerp (transform.eulerAngles.x,cameraAngle,3*Time.deltaTime);
		//if ( Mathf.Abs(transform.eulerAngles.y-simTgtRotate)>3)
		 //transform.RotateAround(smooth, Vector3.up, 10*(simTgtRotate-transform.eulerAngles.y)*Time.deltaTime);
		//if (Mathf.Abs(transform.eulerAngles.y-270)>5) transform.eulerAngles.y= Mathf.Lerp(transform.eulerAngles.y,270,Time.deltaTime *camPrefs.simTargetAttractSpeed );
		obs.y =transform.position.y;
		obs.z =transform.position.z;
		
}

var stopDrag : boolean;
var dragBlockDirection : Vector3;

function FingerDrag()
{	
touching=false;
//see if user is dragging finger on screenand move camera accordingly
if (gen.IsTouching())
	{
		touching=true;
		var touchInfo:Touch = gen.GetTouchInfo(0);
		if ((touchInfo.phase == TouchPhase.Moved)&&(Input.touchCount==1))
			{	//SetSimTarget(null);
			
				//roamTimer =roamTime;
				//moveTilt=gen.GetTilt();
				
				
				
				var zShift:float = -iPhoneDragSpeed*touchInfo.deltaPosition.x*Time.deltaTime*(scrollSpeed+0.1*(obs.x+dragOffset.x));
				
				if (((zShift<0)&&( transform.position.z > scrollArea.xMin ) &&(!stopDrag || dragBlockDirection.z != -1)) 
				||
				 ((zShift>0)&&( transform.position.z < scrollArea.xMin+scrollArea.width)&&(!stopDrag || dragBlockDirection.z != 1)) )
				dragOffset.z +=  zShift;				
				
				var yShift : float = -iPhoneDragSpeed*touchInfo.deltaPosition.y*Time.deltaTime*(scrollSpeed+0.1*(obs.x+dragOffset.x));
				
				if (((yShift<0)&&( transform.position.y > scrollArea.yMin)&&(!stopDrag || dragBlockDirection.y != -1)) 
				||
				 ((yShift>0)&&( transform.position.y < scrollArea.yMin+scrollArea.height )&&(!stopDrag || dragBlockDirection.y != 1)) )
				dragOffset.y +=  yShift;
				
				
				
			}
			if (gen.GetTouchCount()==2)
			{
				roamTimer =roamTime;
				var touchInfo2:Touch =gen.GetTouchInfo(1);
				if ((touchInfo.phase ==TouchPhase.Moved)&&(touchInfo.phase ==TouchPhase.Moved))
				{	var spread:float;
					var separation:float =(touchInfo.position -touchInfo2.position).magnitude;
					var newSep:float = ((touchInfo.position +touchInfo.deltaPosition)-(touchInfo2.position +touchInfo2.deltaPosition)).magnitude;
					spread =newSep-separation;
					
					var xShift : float = -iPhoneDragSpeed*spread*Time.deltaTime*scrollSpeed;
					if (((xShift<0)&&( transform.position.x > 100)) || ((xShift>0)&&( transform.position.x < maxMapZoom )) )
					dragOffset.x += xShift;
					//if(( sGoalPosition.x < maxMapZoom )&&( sGoalPosition.x > minMapZoom ))
					//dragOffset.x -= iPhoneDragSpeed*spread*Time.deltaTime*scrollSpeed;
				}
			}
			if (dragOffset.x<-700) dragOffset.x =-700;
	}
	
	/*	
	// cap the map position
		
	if( observationPoint.position.x < minMapZoom )
		observationPoint.position.x = minMapZoom;
	if( observationPoint.position.x > maxMapZoom )
		observationPoint.position.x = maxMapZoom;

	if( observationPoint.position.z < scrollArea.xMin )
		observationPoint.position.z = scrollArea.xMin;
	if( observationPoint.position.z > scrollArea.xMin+scrollArea.width )
		observationPoint.position.z = scrollArea.xMin+scrollArea.width;

	if( observationPoint.position.y < scrollArea.yMin )
		observationPoint.position.y = scrollArea.yMin;
	if( observationPoint.position.y > scrollArea.yMin+scrollArea.height )
		observationPoint.position.y = scrollArea.yMin+scrollArea.height;
		*/

}
	



function GetFocusInfoOld()
{
	var count:int=0;
	var iCount:int=0;
	cameraFocus=Vector3.zero;
	var minZ:float =10000;
	var maxZ:float=-10000;
	var minY:float =10000;
	var maxY:float=-10000;
	var juncPos:Vector3 =Vector3.zero;
	var T:Transform;
	for (var junc:GameObject in JuncList)
	{
		T = junc.GetComponent(Transform);
		var core:Juncore=junc.GetComponent(Juncore);
		if (core&&!core.saved)
		{
		
		juncPos =T.position;
		cameraFocus+=juncPos;
		if (juncPos.y > maxY) maxY= juncPos.y;
		if (juncPos.y < minY) minY= juncPos.y;
		if (juncPos.z > maxZ) maxZ= juncPos.z;
		if (juncPos.z < minZ) minZ= juncPos.z;
		count++;
		}
	}
	/*
	if (useInterestingObjects) for(var IO:InterestingObject in interestingObjects)
	{
		if(IO.GetInterest()  )
		{
		T=IO.GetComponent(Transform);
		juncPos =T.position;
		cameraFocus+=juncPos;
		if (juncPos.y > maxY) maxY= juncPos.y;
		if (juncPos.y < minY) minY= juncPos.y;
		if (juncPos.z > maxZ) maxZ= juncPos.z;
		if (juncPos.z < minZ) minZ= juncPos.z;
		iCount++;
		}		
		
	}
	*/
	cameraFocus/=(count+iCount);
	cameraFocusDist = Mathf.Max( (maxZ-minZ), (maxY-minY) );
}

var interest : Transform;
var interestWeight : float;
function SetInterest( newInterest : Transform, newWeight : float)
{
	if ((j0.trans.position-newInterest.position).magnitude>430 ||(j1.trans.position-newInterest.position).magnitude>430) return;
	else
	{
		interest = newInterest;
		interestWeight = newWeight;
	}
	
}

var ySep:float;
function GetFocusInfo()
{
	if (JuncList.length==2)
	{
	g0 = JuncList[0];
	g1 = JuncList[1];
	j0  = g0.GetComponent(Juncore);
	j1  = g1.GetComponent(Juncore);
	}
	else {
		g0 = JuncList[0];
		j0=g0.GetComponent(Juncore);
		g1=g0;j1=j0;
		}
	if (JuncList.length==2 )
	{	
		
		
			if  (j0.saved)
			{
				cameraFocus = j1.trans.position;
				cameraFocusDist =0;
			}
			if  (j1.saved)
			{
				cameraFocus = j0.trans.position;
				cameraFocusDist =0;
			}
			if (!j0.saved && !j1.saved)
			{
				if(simTgt) cameraFocus =simTgt.transform.position;
				else cameraFocus = (j0.trans.position+j1.trans.position)/2;
				cameraFocusDist = (j0.trans.position-j1.trans.position).magnitude;
				ySep =Mathf.Abs((j0.trans.position-j1.trans.position).y);
		
			}
		
		if (interest)
		{	
			cameraFocus = Vector3.Lerp(cameraFocus, interest.position, interestWeight);
			if (!simTgt)
			{
			if  (!j1.saved) cameraFocusDist =Mathf.Max(cameraFocusDist, (j1.trans.position-interest.position).magnitude);
			if  (!j0.saved) cameraFocusDist =Mathf.Max(cameraFocusDist, (j0.trans.position-interest.position).magnitude);
			}
			//else cameraFocusDist = (simTgt.transform.position-interest.position).magnitude;
			//cameraFocus = Vector3.Lerp((j0.trans.position+j1.trans.position)/2, interest.position, interestWeight);
			//cameraFocusDist =Mathf.Max((j0.trans.position-j1.trans.position).magnitude, (j0.trans.position-interest.position).magnitude);
			//cameraFocusDist =Mathf.Max(cameraFocusDist, (j1.trans.position-interest.position).magnitude);
		} 
		
		
		
	}
	else 
	{
		if (interest) 
		{
			cameraFocus =Vector3.Lerp(j0.trans.position, interest.position, interestWeight);
			cameraFocusDist = (j0.trans.position-interest.position).magnitude;
		}
		else
		{
		cameraFocus = j0.trans.position;
		cameraFocusDist =0;
		}
	}
	
}


function UseInterestZone(val:boolean){ useInterestingObjects=val;}



function MoveDragOffset(offset : Vector3, moveSpeed: float)
{
	while((dragOffset-offset).magnitude>2 && !touching)
	{
		dragOffset = Vector3.Lerp(dragOffset, offset, moveSpeed*Time.deltaTime);
		yield;
	}
}

// draw the view-range of the camera in the editor
function OnDrawGizmos()
{
	var topLeft = Vector3( 0, scrollArea.y, scrollArea.x );
	var topRight = Vector3( 0, scrollArea.y, scrollArea.x+scrollArea.width );
	var bottomLeft = Vector3( 0, scrollArea.y+scrollArea.height, scrollArea.x );
	var bottomRight = Vector3( 0, scrollArea.y+scrollArea.height, scrollArea.x+scrollArea.width );
	
	Gizmos.DrawLine( topLeft, topRight );
	Gizmos.DrawLine( topRight, bottomRight );
	Gizmos.DrawLine( bottomRight, bottomLeft );
	Gizmos.DrawLine( bottomLeft, topLeft );
}

class PStack  //class for averageing out position info over n frames
{
	var PStack:Vector3[];
	var stackSize:int;
	function Init(n:int)
	{
		PStack=new Vector3[n];
		stackSize=n;
	}
	function AddP(newP:Vector3)
	{
		for(var i:int=0;i<(stackSize-1);i++)
		{
			PStack[i]=PStack[i+1];
		}
		PStack[(stackSize-1)] = newP;
	}
	function GetAv()
	{
		var av:Vector3=Vector3.zero;
		for(var j:int=0;j<stackSize;j++) av+=PStack[j]/stackSize;
		return av;
	}
	function SetAll(vec:Vector3)
	{
		for(var k:int=0;k<(stackSize);k++) PStack[k] = vec;
	}
}
var PosStack:PStack;

