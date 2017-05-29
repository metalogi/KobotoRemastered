       #pragma strict
#pragma implicit
#pragma downcast
var camObj : Camera;
var tiltSensitivity:float = 1.8;
var tiltCurve:float=0.8;
private var cam :CameraManager;
private var editor:UIEditor;
private var manager:UIManager;
private var sim:SimManager;
private var plates: Array = new Array();
private var pauses: Array= new Array();
var menu:boolean =false;
private var menuCam:MenuCamera;

private var stopSignTex:Texture2D;
private var camSignTex:Texture2D;


var overrideTimeStep : boolean;
var timeStep:float =0.01; 
//private var wiiMoteId = 1;
//private var mkMode = false;

class curSettings
{
var cursorTexture : Texture;
}
var cur : curSettings;



function ResetPlayerPrefs()
{
	
	Debug.Log ("wiping saveData");
	PlayerPrefs.SetInt("WorldNumber",1);
	PlayerPrefs.SetInt("WorldsUnlocked",1);
	PlayerPrefs.SetInt("LevelsCompleted", 6);
	PlayerPrefs.SetFloat("1MenuCamZ", -32 );
	PlayerPrefs.SetFloat("1MenuCamY", -4 );
	PlayerPrefs.SetFloat("2MenuCamZ", -32 );
	PlayerPrefs.SetFloat("2MenuCamY", -4 );
	PlayerPrefs.SetFloat("3MenuCamZ", -32 );
	PlayerPrefs.SetFloat("3MenuCamY", -4 );
	PlayerPrefs.SetFloat("MenuFocusZ", -32 );
	PlayerPrefs.SetFloat("MenuFocusY", -4 );
	//PlayerPrefs.SetFloat("TiltSensitivity", 4);
	SetTiltSensitivity(0.5);
	PlayerPrefs.SetFloat("MusicVolume", 0.5);
	PlayerPrefs.SetFloat("GlobalVolume",1);
	
	PlayerPrefs.SetInt("SavedKobotos", 0);
	PlayerPrefs.SetInt("TotalBonusTokens", 0);
	PlayerPrefs.SetInt("DeadKobotos", 0);
	PlayerPrefs.SetInt("DrownedKobotos", 0);
	PlayerPrefs.SetInt("SquashedKobotos", 0);
	PlayerPrefs.SetInt("ImpaledKobotos", 0);
	PlayerPrefs.SetInt("JetPacksUsed", 0);
	PlayerPrefs.SetInt("FlippedKobotos", 0);
	PlayerPrefs.SetInt("ThingsSmashed", 0);
	
	PlayerPrefs.SetInt("CurrentLevel",6);
	PlayerPrefs.SetInt("GameComplete",0);
	//cam.positionTarget.y =-4;
	//cam.positionTarget.z=-32;
	for (var i : int = 0; i<Application.levelCount; i++)
	{
		var countString : String = i.ToString() + "_BonusStarCount";
		var foundString : String = i.ToString() + "_BonusStarsFound";
		if (PlayerPrefs.HasKey(countString)) { print("deletingKey..  " +countString); PlayerPrefs.DeleteKey (countString);}
		if (PlayerPrefs.HasKey(foundString)) { print("deletingKey..  " +foundString); PlayerPrefs.DeleteKey (foundString);}
		
		for(var id:int =-100; id<100; id++)
		{
		var starString : String = i.ToString() + "_bonus_" + id.ToString();
		if (PlayerPrefs.HasKey(starString)) { print("deletingKey..  " + starString); PlayerPrefs.DeleteKey(starString);}
		}
	}
}	




//function GetMKMode() { return mkMode; }
//function SetMKMode( val : boolean ) { mkMode = val; }
var listener :AudioListener;
function GlobalSoundToggle()
{
	var vol:float = listener.volume;
	var timer:float=0;
	if (PlayerPrefs.GetFloat("GlobalVolume")==0)
	{
		
		
		listener.pause =false;
		while (timer<0.5)
		{
		timer += Time.deltaTime;
		listener.volume = Mathf.Lerp(0,1, timer/0.5);
		yield;
		}
		listener.volume=1;
		PlayerPrefs.SetFloat("GlobalVolume",1);
	}
	else
	{
		
		
		
		while (timer<0.5)
		{
		timer += Time.deltaTime;
		listener.volume = Mathf.Lerp(vol,0, timer/0.5);
		yield;
		}
		listener.volume=0;
		listener.pause =true;
		PlayerPrefs.SetFloat("GlobalVolume",0);
	}
}
var splashScreen : boolean =false;
function Awake()
{
	if (!splashScreen)
	{
	camObj = Camera.main;
	listener = camObj.GetComponent(AudioListener);
	listener.volume = PlayerPrefs.GetFloat("GlobalVolume");
	if (listener.volume==0) listener.pause = true;
	}
	if (overrideTimeStep) Time.fixedDeltaTime = timeStep;
	// link up the camera
	if (!menu) cam = camObj.GetComponent(CameraManager);
	else menuCam = camObj.GetComponent(MenuCamera);
	
	editor=GetComponent(UIEditor);
	manager=GetComponent(UIManager);
	sim=GetComponent(SimManager);
tiltBar=false;
	// store the spawnPoints in an array for later use
	plates = FindObjectsOfType(SpawnPoint);
	

	
	/* store previous cursor locations for smoothing
	prevPos.Add( Vector3(Screen.width/2,Screen.height/2) );
	prevPos.Add( Vector3(Screen.width/2,Screen.height/2) );
	prevPos.Add( Vector3(Screen.width/2,Screen.height/2) );
	prevPos.Add( Vector3(Screen.width/2,Screen.height/2) );
	prevPos.Add( Vector3(Screen.width/2,Screen.height/2) );
	*/
	
	//tiltSensitivity=4;
	//tiltSensitivity = PlayerPrefs.GetFloat("TiltSensitivity",4);
	tiltCurve=1;
	stopSignTex = Resources.Load("stopsign");
	camSignTex =Resources.Load("cameraIcon");
}
var tCount:int;
var input:Touch[];
var touching:boolean;

function Start()
{
	if(GetComponent(SimManager) == null) gameObject.AddComponent(SimManager);
	SetOrientation();
	input =Input.touches;

	Input.gyro.enabled = true;
}

function SetOrientation()
{
	Screen.orientation = ScreenOrientation.LandscapeLeft;
   //iPhoneKeyboard.autorotateToPortrait = false; 
   //iPhoneKeyboard.autorotateToPortraitUpsideDown = false; 
   //iPhoneKeyboard.autorotateToLandscapeLeft = false; 
  // iPhoneKeyboard.autorotateToLandscapeRight = false;
}

function SetTiltSensitivity(inTilt : float)
{
	tiltSensitivity=Mathf.Lerp(2,4, inTilt);
	//tiltCurve = Mathf.Lerp(1.3, 1.1,inTilt);
	PlayerPrefs.SetFloat("TiltSensitivity", inTilt);
}

/*
function ResetPlayerPrefs()
{
	print ("wiping saveData");
	PlayerPrefs.SetInt("LevelsCompleted", 0);
	PlayerPrefs.SetFloat("MenuCamZ", GetCameraObject().transform.position.z );
	PlayerPrefs.SetFloat("MenuCamY", GetCameraObject().transform.position.y );
	
	for (var i : int = 0; i<Application.levelCount; i++)
	{
		var countString : String = i.ToString() + "_BonusStarCount";
		var foundString : String = i.ToString() + "_BonusStarsFound";
		if (PlayerPrefs.HasKey(countString)) { print("deletingKey..  " +countString); PlayerPrefs.DeleteKey (countString);}
		if (PlayerPrefs.HasKey(foundString)) { print("deletingKey..  " +foundString); PlayerPrefs.DeleteKey (foundString);}
		
		for(var id:int =-100; id<100; id++)
		{
		var starString : String = i.ToString() + "_bonus_" + id.ToString();
		if (PlayerPrefs.HasKey(starString)) { print("deletingKey..  " + starString); PlayerPrefs.DeleteKey(starString);}
		}
	}
}
*/

function Update() //store input data per frame
{
	tCount=Input.touchCount;
	input =Input.touches;
	touching = (Input.touchCount >0);
	ReadAccel();
}

// checks if an arbitrary 2D vector (ignores z component) falls inside a rect.
function VectorInsideRect( pt : Vector3, zone : Rect )
{
	var result : boolean = ( pt.x >= zone.x &&
							 pt.y >= zone.y &&
							 pt.x <= zone.x + zone.width &&
							 pt.y <= zone.y + zone.height );
	return result;
}

// check if the mouse/wiimote/finger is inside a rect
function MouseOverRect( zone : Rect )
{
	//return VectorInsideRect( GetTouch(), zone );
	return zone.Contains(GetTouch());
}

// get the vector from the camera position that the mousepointer is pointing toward
function GetMouseFaceVector() : Vector3
{
	var testPosition : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(GetTouch().x,GetTouch().y,50));
	var camPosition:Vector3;
	if (!menu) camPosition= cam.transform.position;
	else camPosition =menuCam.transform.position;
	var mouseLookVector:Vector3 = (testPosition - camPosition).normalized;
	
	return mouseLookVector;
}

function GetCameraObject()
{
	return camObj;
}

// figure out where the mouse cursor is in the 2d plane of the game
function GetMouseSpacePoint( distance : double )
{
	return cam.transform.position + GetMouseFaceVector()*distance;
}

// The next batch of functions should really be combined.

// check for a spawn point under the mouse cursor
function GetHighlightedSpawnPoint( ignorePlate )
{
	var dist:float = 0.0;
	var closestPlate : SpawnPoint;
	for( var curPlate:SpawnPoint in plates )
	if( curPlate.gameObject != ignorePlate )
	{
		var testDist = curPlate.CheckForRayPenetration( cam.transform.position, GetMouseFaceVector() );
		
		if( testDist && (!closestPlate || testDist < dist) )
		{
			closestPlate = curPlate;
			dist = testDist;
		}
	}
	
	return closestPlate;
}

// check for a critter core under the mouse cursor
function GetHighlightedJuncore( objectList )
{
	var result : GameObject = null;
	var resultDist:float=0;

	var testPosition : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(GetTouch().x,GetTouch().y, 50));
	var camPosition:Vector3 = cam.transform.position;
	var mouseLookVector:Vector3 = (testPosition - cam.transform.position).normalized;

	for( var currGO : GameObject in objectList )
	{
		var objectPosition:Vector3 = currGO.transform.position;
		var distFromCamera:float = ( objectPosition - camPosition).magnitude;
		var projectPoint:Vector3 = camPosition + mouseLookVector*distFromCamera;
		var JuncGo:Juncore =currGO.GetComponent(Juncore);
		if( (projectPoint - objectPosition).magnitude < JuncGo.selectionSize )
		{
			if( !result )
			{
				result = currGO;
				resultDist = distFromCamera;
			}
			else if( distFromCamera < resultDist )
			{
				result = currGO;
				resultDist = distFromCamera;
			}
		}
			
	}
	var res_mp:MountPoint =result.GetComponent(MountPoint);
	/*
	if( result && res_mp.GetMirror() )
		result = res_mp.GetMirror().gameObject;
		*/
	
	return result;
}

// check for a component addon under the mouse cursor
function GetHighlightedAddon()
{
	var selection : Addon=null;
	var hit : RaycastHit;
	var rand:Vector3;
	for(var i:int=0;i<10;i++)
	{rand= 10*Random.insideUnitSphere;
	if( Physics.Raycast( Ray( cam.transform.position+rand, GetMouseFaceVector() ), hit, Mathf.Infinity ) )
	{	var leaf:AddonLeaf=hit.collider.GetComponent(AddonLeaf);
		if( hit.collider && hit.collider.GetComponent(Addon) ) selection = hit.collider.GetComponent(Addon);
		if( hit.collider && hit.collider.GetComponent(AddonLeaf) ) selection = leaf.GetAddonRoot();
		if(selection) i=100;
	}
	}
	
	if( !selection )
	{
		var obj:GameObject = GetHighlightedObject( FindObjectsOfType(GameObject), 7, 10, true );
		if( obj && obj.GetComponent(Addon) ) selection = obj.GetComponent(Addon);
	}
	
	return selection;
}

private var addons:Addon;

function GetHighlightedAddonFromJuncore(Junk:Juncore, GO:GameObject)
{
	var result : Addon = null;
	var resultDist:float=0;
	
	
	var testPosition : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(GetTouch().x,GetTouch().y, 50));
	var camPosition:Vector3 = cam.transform.position;
	var mouseLookVector:Vector3 = (testPosition - cam.transform.position).normalized;
	
	for( var ad:Addon in GO.GetComponentsInChildren(Addon) )
	{	
		
		var trans:Transform=ad.GetComponent(Transform);
		
		var screenPos:Vector3= Camera.main.WorldToScreenPoint(trans.position);
		
		var screenDist= (Vector2(screenPos.x,screenPos.y) -Vector2(GetTouch().x,GetTouch().y)).magnitude;
		
		if( screenDist < 120)
		{//print("found " +ad.GetProperName() +"at distance "+ screenDist);
			if( !result )
			{
				result = ad;
				resultDist = screenDist;
				print ("result= " +ad.GetProperName());
			}
			else if( screenDist < resultDist )
			{	print("hmm");
				result = ad;
				resultDist = screenDist;
				print ("new result= " +ad.GetProperName());
			}
		}
	}
	
	return result;
}

function GetNearestOnScreen(objectList, searchDistance:double, forceNodesAndJunctions:boolean)
{
	var result : GameObject = null;
	var resultDist:float=0;
	var testPosition : Vector3;
	var inputPosition : Vector3;
	
	if (Application.isEditor )
	{
		inputPosition = Vector3(Input.mousePosition.x,Input.mousePosition.y, 50);
	}
	else inputPosition = Vector3(GetTouch().x,GetTouch().y, 50);
	
	testPosition = Camera.main.ScreenToWorldPoint(inputPosition);
	var camPosition:Vector3 = cam.transform.position;
	var mouseLookVector:Vector3 = (testPosition - cam.transform.position).normalized;
	
	for( var GO:GameObject in objectList )
	if( !forceNodesAndJunctions || (GO.tag == "Node" || GO.tag == "Junction") )
	{	
		var trans:Transform=GO.GetComponent(Transform);
		var screenPos:Vector3= Camera.main.WorldToScreenPoint(trans.position);
		//var screenDist= (Vector2(screenPos.x,screenPos.y) -Vector2(GetTouch().x,GetTouch().y)).magnitude;
		var screenDist = (Vector2(screenPos.x,screenPos.y) -Vector2(inputPosition.x,inputPosition.y)).magnitude;
		
		if( screenDist < searchDistance)
		{
			if( !result )
			{
				result = GO;
				resultDist = screenDist;
			}
			else if( screenDist < resultDist )
			{	
				result = GO;
				resultDist = screenDist;	
			}
		}
	}
	return result;
	
}

// figure out which mountpoint is under the mouse cursor
function GetHighlightedSnap( objectList, objectSize : double, typeMask : String,finger:Vector3 )
{
	var result : GameObject = null;
	var resultDist:float=0;

	var testPosition : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(GetTouch().x,GetTouch().y, 50));
	testPosition+=finger;
	var camPosition:Vector3 = cam.transform.position;
	var mouseLookVector:Vector3 = (testPosition - cam.transform.position).normalized;

	for( var currGO : GameObject in objectList )
	{	var mpGO:MountPoint =currGO.GetComponent(MountPoint);
		var ht = mpGO.GetMountType();
		var validType:boolean = false;
		for( i=0; i<typeMask.length; i++ )
			if( typeMask[i] == ht[0] )
				validType = true;

		if( validType )
		{
			var objectPosition:Vector3 = currGO.transform.position;
			var distFromCamera:float = ( objectPosition - camPosition).magnitude;
			var projectPoint:Vector3 = camPosition + mouseLookVector*distFromCamera;
		
			if( (projectPoint - objectPosition).magnitude < objectSize )
			{
				if( !result )
				{
					result = currGO;
					resultDist = distFromCamera;
				}
				else if( distFromCamera < resultDist )
				{
					result = currGO;
					resultDist = distFromCamera;
				}
			}
			
		}
	}
if (result) var mpMirr:MountPoint =result.GetComponent(MountPoint);
/*
	if( result && mpMirr.GetMirror() )
		result = mpMirr.GetMirror().gameObject;
		*/
	
	return result;
}

// find which object on a prespecified list is under the mouse cursor
function GetHighlightedObject( objectList, objectSize : double, rightOffset : double, forceNodesAndJunctions : boolean )
{
	var result : GameObject = null;
	var resultDist:float=0;

	var testPosition : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(GetTouch().x,GetTouch().y, 50));
	var camPosition:Vector3 = cam.transform.position;
	var mouseLookVector:Vector3 = (testPosition - cam.transform.position).normalized;

	for( var currGO : GameObject in objectList )
	if( !forceNodesAndJunctions || (currGO.tag == "Node" || currGO.tag == "Junction") )
	{
		var objectPosition:Vector3 = currGO.transform.position + currGO.transform.right * rightOffset;
		var distFromCamera:float = ( objectPosition - camPosition).magnitude;
		var projectPoint:Vector3 = camPosition + mouseLookVector*distFromCamera;
		
		if( (projectPoint - objectPosition).magnitude < objectSize )
		{
			if( !result )
			{
				result = currGO;
				resultDist = distFromCamera;
			}
			else if( distFromCamera < resultDist )
			{
				result = currGO;
				resultDist = distFromCamera;
			}
		}
	}
	
	return result;
}

function GetHighlighted()
{	var hit:RaycastHit;
	var testPosition : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(GetTouch().x,GetTouch().y, 50));
	var campos= cam.transform.position;
	var MouseLook= GetMouseFaceVector();
	if(Physics.Raycast(campos, MouseLook, hit)) return hit.collider;
}

function FixedWorldToScreenPoint(w:Vector3) //takes into account iPhone orientation
{
	var screenPoint:Vector3 = camObj.WorldToScreenPoint(w);
	//if (iPhoneInput.orientation == iPhoneOrientation.LandscapeLeft)
	//{
		screenPoint.y = Screen.height - screenPoint.y;
	//}
	
	
	return screenPoint;
}

function FixedScreenToWorldPoint(s:Vector3) //takes into account iPhone orientation
{
	s.y =Screen.height - s.y;
	var worldPoint:Vector3 = camObj.ScreenToWorldPoint(s);
	//if (iPhoneInput.orientation == iPhoneOrientation.LandscapeLeft)
	//{
	
	//}
	
	
	return worldPoint;
}

// this function renders a pulsing green circle of a certain size at a certain position
function GreenCircle( posIn : Vector3, bottom : float, top : float )
{
	var speed:float = 13;
	var pulseSize:float = 2;
	
	var pulse : int = Mathf.Sin(Time.time*speed)*pulseSize;
	//var camera : Camera = FindObjectOfType( Camera );
    var pos : Vector3 = camObj.WorldToScreenPoint( posIn + Vector3(0,transform.localScale.y*bottom,0) );
    var posTop : Vector3 = camObj.WorldToScreenPoint( posIn + Vector3(0,transform.localScale.y*top,0) );
    var size:float = posTop.y - pos.y + pulse;
			
	GUI.contentColor = Color(1,1,1,.85 + Mathf.Sin(Time.time*speed)*.15);
	GUI.Label( Rect( pos.x-size, (Screen.height-pos.y)-size, size*2, size*2), Resources.Load("circle") );
	GUI.contentColor = Color.white;
}

// render the stop-sign overlay icon at a location

function StopSign( location : Rect )
{
	GUI.Label(Rect(location.x+location.width-location.width/2,location.y+location.height-location.height/2, location.width/3, location.height/3), stopSignTex );
}
function CamSign( location : Rect )
{
	GUI.Label(Rect(location.x,location.y, location.width/2, location.height/2), camSignTex );
}

var waitTimer:float;
function WaitFor(waitTime:float)
{
waitTimer=waitTime;
while (waitTimer>0)
	{
		waitTimer=Time.deltaTime;
		yield;
	}
}

var paused:boolean;
var restoreGameMode:int;
var volumeBuffer: float[];
var noises : AudioSource[];
function GlobalPause(camPause:boolean)
{
	pauses =FindObjectsOfType(PauseAction);
	
	//for(var p:PauseAction in pauses){ print("PAuses:" + p.gameObject.name);}
	
	if((camPause)&&(!paused))
	{
	restoreGameMode= manager.GetGameMode();
	manager.SetGameMode(3);
	}
	paused=true;
	for (var p:PauseAction in pauses)
	{
		p.PauseMe();
	}
	

}

function MuteSound()
{
	//yield WaitForSeconds(0.8);
		var noiseArray : Array= FindObjectsOfType(AudioSource);
	volumeBuffer=new float[noiseArray.length];
	noises = new AudioSource[noiseArray.length];
	noises= noiseArray.ToBuiltin(AudioSource);
	for (var i:int=0; i<noises.length;i++)
	{
		if (
		(noises[i].gameObject.tag != "musicPlayer")
		&& (noises[i].gameObject.tag !="interfaceSound")
		)
		
		{
		volumeBuffer[i] = noises[i].volume;
		noises[i].volume=0;
		}
	}
}

function UnMuteSound()
{
	//yield WaitForSeconds(0.8);
		for (var i:int=0; i<noises.length;i++)
	{
		if (
		(noises[i].gameObject.tag != "musicPlayer")
		&& (noises[i].gameObject.tag !="interfaceSound")
		)
		noises[i].volume=volumeBuffer[i];
		
	}
}

function GlobalUnPause(camPause:boolean)
{
	pauses =FindObjectsOfType(PauseAction);
	
	//for(var p:PauseAction in pauses){ print("PAuses:" + p.gameObject.name);}
	if (camPause) manager.SetGameMode(restoreGameMode);
	paused=false;
	for (var p:PauseAction in pauses)
	{
		p.UnPauseMe();
	}

}
function IsPaused() {return paused;}

//iphone specific functions
var tiltBar:boolean=false;
function tiltBarActive(){return tiltBar;}
function SetTiltBar(v:boolean){tiltBar=v;}
function IsTouching()  //test to see if the user if touching the screen at all
{ //var result:boolean =false;
//if (iPhoneInput.touchCount >0) result =true;
//return result;
return touching;
}

function NewTouch()
{
	if (Application.isEditor)
	{
	 	return Input.GetMouseButtonDown(0);
	 }
	var res:boolean =false;
	
	for (var touch : Touch in input)
		{
			if ((touch.phase == TouchPhase.Began) && (touch.fingerId ==0))
			res =true;
		}
		return res;
}
function GetTouchCount()
{
	return tCount;
}
function GetTouchInfo(touchId:int)
{
	var touchInfo:Touch;
	for (var touch : Touch in input)
		{
			if ( (touch.fingerId ==touchId))
			touchInfo =touch;
		}
	return touchInfo;
}

function FingerLifted()
{
	var res:boolean =false;
	for (var touch : Touch in input)
		{
			if ((touch.phase == TouchPhase.Ended) && (touch.fingerId ==0))
			res =true;
		}
		return res;
}

private var touchpos:Vector3;

function GetTouch() : Vector3   //replaces GetWiimoteCursor()
{
	if (Application.isEditor)
	{
		var screenP : Vector3 = Input.mousePosition;
		screenP.y = Screen.height - screenP.y;
		return screenP;
	}
	touchpos =Vector3.zero;
		for (var touch : Touch in input)
		{if (touch.fingerId ==0) touchpos=touch.position;
		}
	//touchpos.y = Screen.height - touchpos.y;
	return touchpos;
}

function TouchUpdate(zone:Rect) : boolean {
	//print ("TouchUpdate called");
	//var flippedZone:Rect = Rect(zone.x, (Screen.height-zone.y),zone.width,zone.height);
	if (Application.isEditor)
	{
		var screenP : Vector3 = Input.mousePosition;
		screenP.y = Screen.height - screenP.y;
		return (Input.GetMouseButtonDown(0) && zone.Contains(screenP));
	}
	var result:boolean =false;
	var pt:Vector2;
	for (var touch : Touch in input)
			if ((touch.phase == TouchPhase.Began) && (touch.fingerId ==0))
		{
			pt=Vector2(touch.position.x, Screen.height-touch.position.y);
			result  = zone.Contains(pt);
		}
		//if(result) print(pt);
			return result;
}

//tilt stuff

private var horiz:float;
private var acc:Vector3;
private var accFiltered:Vector3;
	
private var shakeMag:float;
private var shaking:boolean =false;
var shakeThres:float =1.2;
	
var AccelerometerUpdateInterval : float = 1.0 /30.0;
private var LowPassFilterFactor : float = AccelerometerUpdateInterval * 24; // tweakable
private var lowPassValue : Vector3 = Vector3.zero;
	
function ReadAccel()
{
	if (Application.isEditor)
	{
		if (Input.GetKey(",")) acc =Vector3(0,0,-0.3);
		if (Input.GetKey(".")) acc = Vector3(0,0,0.3);
	}
	else {
		//acc=Input.acceleration;
		acc = Input.gyro.gravity;
	}
		
	
	
	accFiltered=LowPassFilterAccelerometer();
	shakeMag = Mathf.Abs(acc.sqrMagnitude-accFiltered.sqrMagnitude);
	
	if(shakeMag>shakeThres) shaking =true;else shaking=false;
	//if (shaking) print(shakeMag);
	if (acc.sqrMagnitude>1) acc.Normalize();
}

var debugHTilt : float;
function GetTilt()
{

	return Input.gyro.gravity.x;

	var threshold:float=0.002;
	
	horiz = acc.x*Time.fixedDeltaTime*tiltSensitivity*GameplayParameters.Instance().TiltSensitivityMultiplier;
	
	if (Mathf.Abs(horiz)<threshold) horiz=0;
	else horiz -= threshold*Mathf.Sign(horiz);
	
	//else horiz=sim.GetTiltBarValue();
	
	//if(horiz>0) horiz=Mathf.Pow(horiz,tiltCurve);
	//else horiz=-Mathf.Pow(-horiz,tiltCurve);
	
	 
	horiz=Mathf.Clamp(horiz,-1 * (GameplayParameters.Instance().TiltClampValue),GameplayParameters.Instance().TiltClampValue);
	
	if (Application.isEditor)
	{
		if (Input.GetKey(KeyCode.LeftArrow))
			return -0.04;
		
		if (Input.GetKey(KeyCode.RightArrow))
			return 0.04;
		
		return 0;
	}
	debugHTilt = horiz;
	//print ("horiz="+horiz );
	return horiz;
	
}
/*
function OnGUI()
{
	GUI.Label (new  Rect (100, 200, 200,100), accFiltered.ToString());
	GUI.Label (new  Rect (100, 310, 200,100), debugHTilt.ToString());
}
*/

function GetVertTilt()
{
	var vert : float  =-accFiltered.z*Time.deltaTime*tiltSensitivity;
	
	vert=Mathf.Clamp(vert, 0.1, 0.17);
	
	return 15 * (vert - 0.1);
}
	
function GetShake()
{
	//print (acc);
	return shaking;
}
	
	
function LowPassFilterAccelerometer() : Vector3 
{
	lowPassValue = Vector3.Lerp(lowPassValue, acc, LowPassFilterFactor);
	return lowPassValue;
}






/* commenting out wii stuff
function KeyFromWK( wid : WiiButton ) : String
{
	var res = "return";
	switch( wid )
	{
	case WiiButton.ButtonA: res="a"; break;
	case WiiButton.ButtonB: res="b"; break;
	case WiiButton.Button1: res="1"; break;
	case WiiButton.Button2: res="2"; break;
	case WiiButton.ButtonMinus: res="-"; break;
	case WiiButton.ButtonPlus: res="="; break;
	case WiiButton.ButtonLeft: res="left"; break;
	case WiiButton.ButtonRight: res="right"; break;
	case WiiButton.ButtonUp: res="up"; break;
	case WiiButton.ButtonDown: res="down"; break;
	}
	return res;
}

// wii input functions
function GetWiiButton( buttonId : WiiButton )
{
	var remote : WiiRemote = WiiInput.GetControllerState(wiiMoteId-1);
	return mkMode?Input.GetKey(KeyFromWK(buttonId)):remote.GetButton( buttonId );
}
function GetWiiButtonUp( buttonId : WiiButton )
{
	var remote : WiiRemote = WiiInput.GetControllerState(wiiMoteId-1);

	return mkMode?Input.GetKeyUp(KeyFromWK(buttonId)):remote.GetButtonUp( buttonId );
}
function GetWiiButtonDown( buttonId : WiiButton )
{
	var remote : WiiRemote = WiiInput.GetControllerState(wiiMoteId-1);

	return mkMode?Input.GetKeyDown(KeyFromWK(buttonId)):remote.GetButtonDown( buttonId );
}

// read accelerometer
function GetWiimoteAcceleration()
{
	var remote : WiiRemote = WiiInput.GetControllerState(wiiMoteId-1);
	return remote.acceleration;
}

// get the wii cursor by averaging where it has been and seeing if it's moved by an acceptable amount
private var storePos : Vector3;
private var prevPos = new Array();
function GetWiimoteCursor()
{
	var remote : WiiRemote = WiiInput.GetControllerState(wiiMoteId-1);
	var curPos = mkMode?Vector3( Input.mousePosition.x, Screen.height-Input.mousePosition.y ):Vector3( (remote.position.x+1) * Screen.width/2, (remote.position.y+1) * Screen.height/2 );

	for( i=1; i<prevPos.length; i++ ) prevPos[i]=prevPos[i-1];
	prevPos[0] = curPos;
	
	var avgPos : Vector3;
	for( p in prevPos ) avgPos += p/prevPos.length;
	
	if((avgPos-storePos).magnitude > 7.5) storePos = avgPos;
	
	return storePos;
}

// draw the wii cursor
function DrawWiiCursor()
{
	var wiiCsr = GetWiimoteCursor();

	var ls : GUIStyle = "Label";
	ls.alignment = TextAnchor.MiddleCenter;
	if( cur.cursorTexture )
	{
		GUI.Label( Rect( wiiCsr.x-16, wiiCsr.y-16, 32, 32 ), cur.cursorTexture );	
	}
	else
	{
		GUI.Label( Rect( wiiCsr.x-16, wiiCsr.y-16, 32, 32 ), GUIContent("+") );	
	}

	if( GetMKMode() )
		GUI.Label( new Rect( 0, Screen.height - 180, 200, 40 ), "USING MOUSE&KEYBOARD" );
}

// these two functions replace GUI.Button - becaues I can't have the button-Press controlled from OnGUI
// or else it detects the WiiInput multiple times.
//
// It might be fine now, but when I started coding this, the wii-mouse emulation in unity was pretty janky
function WiiButtonUpdate( pos : Rect )
{
	var res = false;

	if( VectorInsideRect( GetWiimoteCursor(), pos ) && GetWiiButtonDown(WiiButton.ButtonA) )
		res = true;

	return res;
}
function WiiButtonGUI( pos : Rect, cnt : GUIContent, style : GUIStyle, col : Color )
{
	style.normal.textColor = col;
	style.alignment = TextAnchor.MiddleCenter;
	GUI.Label( pos, cnt, style );
}
function WiiButtonGUI( pos : Rect, cnt : String ) { WiiButtonGUI( pos, GUIContent(cnt), "Box", Color(1,1,1)); }

// per-fram update which checks if the wii needs to be powered down or reset
function UpdateWiiOS()
{
	// for testing purposes, "k" enables keyboard/mouse control.  There is no "k" on an actual Wii
	if( Input.GetKeyDown("k") ) SetMKMode( !GetMKMode() );
	
	// restart / shutdown the game
	if( WiiOS.resetButtonState ) WiiOS.Restart(0);
	if( WiiOS.powerButtonState ) WiiOS.ShutdownSystem();
}
*/

//end wii stuff





