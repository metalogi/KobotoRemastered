var wheelShift = 1f;
var CJ : ConfigurableJoint;
var maxTilt : float =45;
var iconImage : Texture2D;
var iconImageOff : Texture2D;
var swipe : Vector2;

var selectionImage : Texture2D;
var itemName : String="";
var iconSize : int =14;

var Ramp : boolean =false;
var pointerColor: Color;
var otherJunc : Juncore;

var airborneTime : float =0;
var bonucedThisFrame : boolean =false;
private var onSpeedRamp : boolean = false;
private var speedRampBackwards : boolean = true;

private var m_vis : Transform;
private var terminalVelocity : float = 250;
private var TILTVISVECTOR : Vector3 = Vector3(30, -10, 0);
//tilt
//private var tilt:float =0;
function ResizeTexture(res:int)
{	
	iconImage.Resize(res,res);
	iconImage.Apply();
}

var offscreen : boolean;
var MoveForce:Vector3;
var jParent:GameObject;
var jpOffset:Vector3;
var saved:boolean;
var selected:boolean;
var bounceSpeed:float;

var excited : boolean =false;
var excitedTime : float;
var excitedSpeed : float;

var defaultPhys : PhysicMaterial;
var stickyPhys : PhysicMaterial;

function SetParent(jp:GameObject,off:Vector3)
{
	
	//var oldParent : GameObject = jParent;
	//var allBColl:BoxCollider[] = FindObjectsOfType(BoxCollider);
	var parentJunc:Juncore  = null;
	jpOffset=off;
	if (jp==null) 
	{
	//Debug.Log("clearing parent" +gameObject.name);
	//Debug.Break();
		//var parentJunc:Juncore = null;
		if(jParent) parentJunc= jParent.GetComponent(Juncore);
		if(!parentJunc) ridge.MovePosition(trans.position + Vector3(0,4,0));
		 boxColl.isTrigger=false;
		 ridge.isKinematic=false;
		  lock=false;
		  passenger=false;
	 trans.rotation =Quaternion.identity;
	CJ.anchor =  Vector3.zero;
	CJ.yDrive.mode = JointDriveMode.None;
	CJ.zDrive.mode = JointDriveMode.None;
	//CJ.secondaryAxis = trans.up;
	CJ.connectedBody = null;  
		 
	//trans.parent =null;
	}
	else 
	{
	trans.position = jp.transform.TransformPoint(off);
	//Debug.Break();
	parentJunc= jp.GetComponent(Juncore);
	if (parentJunc){
	
	
	//CJ.anchor = jp.transform.TransformPoint(off) - trans.position;
	if (off.y<0) CJ.anchor = Vector3(0,15,0);
	else CJ.anchor = Vector3.zero;
	CJ.connectedBody = jp.GetComponent.<Rigidbody>(); 
	CJ.yDrive.mode = JointDriveMode.PositionAndVelocity;
	CJ.zDrive.mode = JointDriveMode.PositionAndVelocity;
	}
	if (plat) lock=plat.lockY;
	//if (!ridge.isKinematic) ridge.velocity.z=0;
		//ridge.isKinematic=true;
	//for (var coll:BoxCollider in allBColl) if ((coll.gameObject.layer ==8)&&(coll!=boxColl)) Physics.IgnoreCollision(coll, boxColl);
		//boxColl.isTrigger=true;
		//trans.parent = jp.transform;
	}
	
	jParent =jp;
	
}


function GetTexture() 
{
	var retTex:Texture2D = iconImage;
	
	//if (!ridge.isKinematic && selected) retTex= selectionImage;
	//if (!ridge.isKinematic && !on) retTex=iconImageOff;
	return retTex;
	}
function GetSelectionTexture(){ return selectionImage; }

// stoplight host - in edit mode you use the stoplight to specify whether a creature is active by default
private var stopHost : StopGoLight;
function GetStopHost() { return stopHost; }
function SetStopHost( stl ) { stopHost = stl; }

function Select(bool:boolean){selected=bool;}
function IsSelected(){return selected;}
// definitions for where on these creature junction you are allowed to stick things
class MountDefinition
{
	var position : Vector3;
	var rotation : Vector3 = Vector3(0,0,0);
	var scale : Vector3 = Vector3(1,1,1);
	var type : String = "fts";
	var mirror : int = -1;
}
var mountDefs : MountDefinition[];

// "mounts" are the actual instantiated mount points for components
private var mounts = new Array();
function GetMountPoints () { return mounts; }

// the position, rotation, and collider properties at instantiation
// position and rotation are useful for when you reset the simulations
private var homePosition : Vector3;
private var homeRotation : Quaternion;
// the homeCollider properties exist because certain components (wheels) actually change the collider size
// during gameplay.
private var homeColliderSize : Vector3;
private var homeColliderCenter : Vector3;

// when you zoom in to edit this creature, how high (in y) is the camera offset
var cameraRaiseOffset : double = 0.0;

// used for cursor highlight
var selectionSize = 8.0;

// whether the creature is currently active or not (for use in the simulation)
var on = false;
var autoWheels:boolean=true;
function SetOnByDefault( on ) { stopHost.SetOn( on ); }
function GetOnByDefault() { return stopHost.GetOn(); }

// autowalk class defines how the creature moves and stops, both on its own and with wheels
class AutoWalkDefinition
{
	var grabDistance = 0.1; // how far it can be from the ground and still maintain traction
	var walkSpeed = 0.0;
	var wheelSpeed = 5.0;
    var polarity = 1; // which direction it's walking
    var accel = 0.0;
    var brakes = 0.0;
    var wheelheight:float=1;
    
}

var autoWalk : AutoWalkDefinition;
var wheelPlacementVector : Vector3 = Vector3(5.0,10.0,5.0);
class TiltDef
{
	var walkSpeedMod:float =4000;
	var wheelSpeedMod:float =4000;
	var airSpeedMod:float=1000;
}
var Tilt:TiltDef;

// stores information on temporary bonuses from powerups
class BonusClass
{
	var boostTime = 0.0; // how much longer this creature will have the speedboost active
}
@HideInInspector
var bonus : BonusClass;

// definition for how this creature acts with a magnet on its head
class MagnetDefinition
{
	var range = 60.0;
	var pull = 1000.0;
	var couplingDistance:float =25.0;
	var coupleUp:float =12;
	var coupleDown:float =15;
}
var magnet : MagnetDefinition;

class SpringDefinition
{
	var conserveZ : float =0.5;
	var bounceRange:float=10.0;
	var preferredHeight:float=30;
	var airTilt:float = 30.0;
	var airSpeed:float =40.0;
	var damp:float =0.6;
	var followOff:Vector3=Vector3(0,-12,0);
	var maxSpeed:float=50;
	var yShift : float =0;
	private var previousVelocity:Vector3;
}
var springy:SpringDefinition;
// definition for how this creature acts with a propellor on its head
class PropellorDef
{
	var balance = 200.0;
	var force = 1600.0;
	var height = 50.0;
	var fwdSpeed = 28.0;
	var followOff:Vector3= Vector3(0,12,0);
}
var prop : PropellorDef;

// definition for how this creature acts with a parachute on its head
class ParaDef
{
	var maxAirSpeed =150;
	var airSpeedMod=10;
	var unfurlSpeed = 35.0;
	var fallSlow = 100.0;
	var fallSpeed = 12.0;
	var open = false;
	var transf:Transform;
	var chute:ParaSwapper;
	function TurnOff()
	{
	open = false;
	//print ("pppap");
	chute.SetOn(false);
	//transf.localRotation=baseRotation;
	}
}
var para : ParaDef;

// camera manager and animated box references are auto-assigned
var aniboxChild : Anibox;
@HideInInspector 
var cam : CameraManager;
var gen:GenericFunctions;
var man:UIManager;
var editor : UIEditor;
var sound : KobotoSounds;
var boxColl:BoxCollider;
var meshColl:MeshCollider;
var ridge:Rigidbody;
var hit : RaycastHit; // for use in later raycasts

var FollowOffset:Vector3;
function GetFollowOffset(){return FollowOffset;}
//function SetFollowOffset(s:String){FollowOffset=Vector3.zero;if (s=="Propellor") FollowOffset=prop.followOff;if (s=="Spring") FollowOffset=springy.followOff;}

var windmills:Array;
var jetStreams:Array;
var trans:Transform;

private var iceCollision:boolean=false;
private var homeScale: Vector3;

var hasReflection : boolean;
var reflection : MReflection;
var meshFilter :MeshFilter;

function Awake()
{
		//ResizeTexture(iconSize);
	// store home-positions

	//AddWheels(true);
	m_vis = GetComponentInChildren(MeshRenderer).transform;
	CJ=GetComponent(ConfigurableJoint);
	if (CJ == null) CJ = gameObject.AddComponent(ConfigurableJoint);
	CJ.configuredInWorldSpace =false;
	CJ.axis = Vector3(-1,0,0);
	CJ.rotationDriveMode = RotationDriveMode.Slerp;

	CJ.zDrive.maximumForce = 0;
	CJ.yDrive.positionSpring =0;
	CJ.zDrive.positionSpring =0;
	CJ.yDrive.maximumForce = 0;
		
	CJ.connectedBody = ridge;
	trans=transform;
	
	if (GameObject.FindWithTag("reflectionPlane")) hasReflection =true;
	if (hasReflection)
	{
		reflection=new MReflection();
		//reflection = ScriptableObject.CreateInstance(typeof(mReflection));
		reflection.MakeNew(trans,meshFilter);
		
	}
	
	FollowOffset=Vector3.zero;
	homePosition = trans.position;
	homeRotation = trans.rotation;
	homeScale = trans.localScale;
	boxColl =GetComponent(BoxCollider);
	meshColl= GetComponent(MeshCollider);
	ridge=GetComponent(Rigidbody);
	//ridge.interpolation =RigidbodyInterpolation.None;
	if (boxColl)
	{
	homeColliderSize= boxColl.size;
	homeColliderCenter = boxColl.center;
	}
	defaultPhys = boxColl.sharedMaterial;	
	// assign camera
	// anibox is assigned in update because it crashes otherwise
	//aniboxChild = GetComponentInChildren(Anibox);
	//if (aniboxChild) print ("found aniBox");
	var FoundCam:GameObject= GameObject.FindWithTag("MainCamera");
	cam = FoundCam.GetComponent(CameraManager);
	sound = GetComponent(KobotoSounds);
	var LevelObject:GameObject =GameObject.Find("Level");
	gen=LevelObject.GetComponent(GenericFunctions);
	man= LevelObject.GetComponent(UIManager);
	editor =LevelObject.GetComponent(UIEditor);
	
	// create mountpoints from mountPointDefinitions
	for( var i:int=0; i<mountDefs.length; i++ )
	{	//var newMount:GameObject =Instantiate( Resources.Load("MountPoint"));
		mounts.Add( Instantiate( Resources.Load("MountPoint"), Vector3(0,0,0), Quaternion.Euler(0,0,0)) );
		var mounti:GameObject = mounts[i];
		mounti.transform.parent = m_vis;
		mounti.transform.localPosition = mountDefs[i].position;
		mounti.transform.localEulerAngles = mountDefs[i].rotation;
		mounti.transform.localScale = mountDefs[i].scale;
		var mountiPoint:MountPoint =mounti.GetComponent(MountPoint);
		var thisJuncore:Juncore =this;
		mountiPoint.SetHostJuncore(this);
		mountiPoint.SetMountType(mountDefs[i].type);
		
		if( mountDefs[i].mirror != -1 ){
			var mnt:MountPoint=mounti.GetComponent(MountPoint);
		var mrr:GameObject =mounts[mountDefs[i].mirror];
			//mnt.SetMirror( mrr.GetComponent(MountPoint) );
		}
		
		
	}
	
	//find Windmills and Jetstreams
	windmills =FindObjectsOfType( Windmill );
	jetStreams=FindObjectsOfType(Jetstream);
	
	animState=0;
	saved =false;
	selected=false;
	
	addonArray =  new Array();
	addonList=addonArray.ToBuiltin(Addon);
	
	//TipChecker();
	 
}

function isAlive()
{
	return !dead;
}
// when the simulation is reset, i.e. going from send-them-off mode back to edit mode
@HideInInspector
var dead : boolean = false;
function ActionReset()
{
	if (jParent) SetParent(null, Vector3.zero);
	trans.position = homePosition;
	trans.rotation = homeRotation;
	trans.localScale = homeScale;
	autoWalk.polarity = 1;
	if (hasParachute) 
	{
	//print ("TTURNING OFF PARA");
	para.chute.SetOn(false);
	}
	if (hasHammer &&ham) ham.ResetHammer();
	
	offscreen =false;

	dead = false;
	saved =false;
	drowning =false;
	itemName = "";
	jParent=null;
	passenger=false;
	boxColl.isTrigger=false;
	
	for (var ad:Addon in addonList) 
	{
		if (ad) 
		{
			//print ("Destroying.. " + ad.GetProperName());
			//var adGO : GameObject = ad.GetComponent(GameObject);
			DestroyImmediate(ad.gameObject);
		}
		//if (ad) ad.Hide(false);
	}
	
			if (aniboxChild)
	{
		animState=0;
		 aniboxChild.StopMe();
	}
	//print ("resetting addonList");
	//SetAddonList();
}

// shut down all autonamous operations - simulations stop
function ActionFreeze()
{	//var ridge:Rigidbody =GetComponent(Rigidbody);
	ridge.isKinematic = true; // turn off physics
	ridge.interpolation =RigidbodyInterpolation.None;
	
	jParent=null;
	if (sound) sound.Kill();
	if (propellorSound) propellorSound.StopSound();
	if (magBeam) magBeam.Deactivate();
	magnoProp =false;
	TurnOff();
	
	
	
	//if (para.chute) {print ("TTURNING OFF PARA");para.TurnOff();}
	if( aniboxChild )	{
		var matChange:MaterialSwitcher = aniboxChild.GetComponent(MaterialSwitcher);
		if (matChange) matChange.RestoreMats();
		animState=0;
		aniboxChild.StopMe();
	}
	autoWalk.polarity = 1;
}

// start up all autonamous operations - simulation start
// even while started, objects will only move if they are on
function ActionStart()
{
	//var ridge:Rigidbody =GetComponent(Rigidbody);
	ridge.isKinematic = false; // turn on physics
	ridge.velocity =Vector3.zero;
	ridge.angularVelocity =Vector3.zero;
	ridge.interpolation =RigidbodyInterpolation.Interpolate;
	if( aniboxChild && animState!=0 ) aniboxChild.GoMe();
	
	if (Ramp)
	{
	var noW : NoWorldCollision = trans.GetComponentInChildren(NoWorldCollision);
	if (noW) noW.TurnOffWorldCollisions();
	}
	//..taking out stoplights
	//if(stopHost.GetOn()) TurnOn();
	//else TurnOff();
	
	//if (sound) sound.StartRoll();
	 SetAddonList(true);
	 TurnOn();
	
}





// activate and deactivate movement
function IsOn() { return on; }
function TurnOn() 
{ 
    Debug.Log("Turn on ");
	on = true;
	offscreen=false;
	if( aniboxChild )
	{
		var matChange:MaterialSwitcher = aniboxChild.GetComponent(MaterialSwitcher);
		if (matChange) matChange.RestoreMats();
	}
		


		if (jParent)
	{
		var parentRB : Rigidbody = jParent.GetComponent(Rigidbody);
		if (parentRB) ridge.velocity= parentRB.velocity;
		var tiltC:TiltController =jParent.GetComponent(TiltController);
		//if (tiltC) tiltC.TurnOn();
		if (tiltC) {tiltC.Eject(); lock = false;}
		else  SetParent(null,Vector3.zero);
	}
	
	if (sound) sound.StartRoll();
	if (propellorSound) propellorSound.StartSound();
	
	if (cat) cat.on=true;
	if (ham) ham.on=true;
	
	
}



function TurnOff() 
{ 
	on = false;
	if( aniboxChild )
		{
		//aniboxChild.StopMe();
		print ("switchingMaterials");
		var matChange:MaterialSwitcher = aniboxChild.GetComponent(MaterialSwitcher);
		if (matChange) matChange.ReplaceMats();
		}



	if (jParent)
	{
		var tiltC:TiltController =jParent.GetComponent(TiltController);
		if (tiltC) tiltC.TurnOff();
		//if (tiltC) {tiltC.Eject();TurnOn();}
		if (passenger) SetParent(null, Vector3.zero);
	}
	else	if (onPlatform&&plat)
	{
		var platObj:GameObject = plat.gameObject;
		
		//platformLockPosition= trans.position -plat.transform.position;
		platformLockPosition = plat.transform.InverseTransformPoint(trans.position);
		SetParent(platObj,platformLockPosition);
	}
	
	//detach passenger if there is one
	if (probe[0])
		{
			var topJunc:Juncore = probeHit[0].transform.GetComponent(Juncore);
			if(topJunc)
			{
				if (topJunc.passenger) {topJunc.passenger=false; topJunc.SetParent(null, Vector3.zero);}
			}
		}
	
	if (sound) sound.StopRoll();
	if (magBeam) magBeam.Deactivate();
	
	//if (cat) cat.on=false;
	//if (ham) ham.on=false;
	//if (propellorSound) propellorSound.StopSound();
}



// figure out which powerup we have
function GetItem() { return itemName; }

// use our current powerup.  Right now: supports Speed and Jackhammer
function UseItem()
{
	if( itemName == "Speed" ) bonus.boostTime = 3.0;
	if( itemName == "Jackhammer" )
	{
		//cam.PwUpJackhammerSound();
		var hit : RaycastHit;
		if( Physics.Raycast( Ray(transform.position, Vector3(0,-1,0)), hit, 10, 1 << 8 ) )
		{
			var hammerTarget:ShatterBlast = hit.collider.gameObject.GetComponent( ShatterBlast );
			if( hammerTarget ) hammerTarget.Blast();
		}
	}

	itemName = "";
}



//Tool variables

private var FalloutRange = 150.0;
private var tilt:float;
private var shake:boolean;
var airborne:boolean =false;
var tSpeed:float;
var realWalkSpeed:float;
var realAirSpeed:float;
private var hasPropellor:boolean=false;
private var hasParachute:boolean=false;
private var hasDoubleWheels:boolean=false;
private var hasQuadWheels:boolean=false;
var hasMagnet:boolean=false;
private var hasSpring:boolean=false;

private var hasWallButton:boolean=false;
private var hasIceBlock:boolean=false;
private var hasHammer : boolean=false;
private var hasCatapult : boolean = false;
private var hasJetPack : boolean =false;
var magnetTrans:Transform;
private var springTrans:Transform;
private var springAnim : Animation;
private var wallButtonTrans:Transform;
private var propellorTrans:Transform;
private var propellorSound : propellerSoundControl;
private var propellorDust : Dust;
private var propRotateSpeed : float;
private var ham : HammerMuscle;
private var cat : CatapultMuscle;
private var jet : JetPack;
private var passenger :boolean;
 var magBeam : MagnetBeam;
var magnoProp :boolean =false;
private var firstBounce : boolean;

function HasSpring() {return hasSpring;}

private var platformLockPosition:Vector3;

var ScreenPosition:Vector3;


var tipped :boolean =false;
var passive : boolean;
//set up tool properties
function SetAddonList(clear : boolean)
{
	passive =true;
	if(clear) addonArray = new Array();
	else addonArray =GetComponentsInChildren(Addon);
	
	addonList=addonArray.ToBuiltin(Addon);
	
	animState=0;
	FollowOffset =Vector3.zero;
	hasPropellor=false;
	hasParachute =false;
	hasDoubleWheels =false;
	hasQuadWheels =false;
	hasMagnet =false;
	hasSpring =false;
	hasWallButton =false;
	hasIceBlock = false;
	hasHammer=false;
	hasCatapult=false;
	hasJetPack=false;
	
	if (jParent) SetParent(null, Vector3.zero);
	if(boxColl)
	{
	boxColl.center = homeColliderCenter;
	boxColl.size = homeColliderSize;
	}
	m_vis.localPosition.y = 0;
	
	if (sound) sound.StopRoll();
	for(var ad:Addon in addonList)
	{	
		ad.Hide(false);
		var adName:String=ad.GetProperName();
		
		if (!ad.disabled)
		{ 
		//print ("foundAddon: " +adName);
		if (adName=="Propellor") 
		{
			passive=false;
			hasPropellor =true;
			FollowOffset=prop.followOff;
			propellorTrans=ad.transform;
			propellorSound = ad.GetComponent(propellerSoundControl);
			propellorDust = ad.GetComponent(Dust);
			if (on) propellorSound.StartSound();
			
		}
		
			if (adName=="Parachute") 
		{
			passive=false;
			hasParachute =true;
			para.chute= GetComponentInChildren(ParaSwapper);
			para.transf=ad.transform;
			
		}
		
			if (adName=="DoubleWheels") 
		{
			passive=false;
			if(boxColl)
			{
			boxColl.center.y -= autoWalk.wheelheight/2;
			boxColl.size.y += autoWalk.wheelheight;
			}
			if (m_vis)
			{
				m_vis.localPosition.y = wheelShift;
			}
			
			hasDoubleWheels =true;
			if (sound) sound.StartRoll();
		}
			if (adName=="QuadWheels") 
		{
			passive=false;
			if(boxColl) boxColl.size.y += 2;
			hasQuadWheels =true;
			if (sound) sound.StartRoll();
		}
			if (adName=="Magnet") 
		{
			passive=false;
			hasMagnet =true;
			magnetTrans=ad.transform;
			magBeam = ad.GetComponent(MagnetBeam);
		}
			if (adName=="Spring") 
		{
			passive=false;
			hasSpring =true;
			firstBounce = true;
			FollowOffset=springy.followOff;
			springTrans=ad.transform;
			springAnim=ad.GetComponentInChildren(Animation);
			trans.position.y += springy.yShift;
		}
			if (adName=="WallButton") 
		{
			hasWallButton =true;
			wallButtonTrans=ad.transform;
		}
			if(adName =="IceBlock")
			{
				hasIceBlock=true;
				boxColl.center.y -= autoWalk.wheelheight/2;
			boxColl.size.y += autoWalk.wheelheight;
			}
		if (adName == "Hammer") {hasHammer=true; ham=ad.GetComponent(HammerMuscle);ham.on =true;}
		if (adName == "Catapult") {hasCatapult=true; cat=ad.GetComponent(CatapultMuscle); cat.on=true;}
		
		if (adName == "JetPack") 
		{
			hasJetPack=true;
			jet=ad.GetComponent(JetPack);
			passive=false;
			jet.Activate();
			
		}
		}
	}
	if (!hasMagnet)
	{ 
		magnoProp = false;
		if (passenger) SetParent(null,Vector3.zero);
		if (otherJunc && otherJunc.passenger) otherJunc.SetParent(null,Vector3.zero);
	}
	ridge.centerOfMass = boxColl.center;
	
	if (passive&&stickyPhys) boxColl.sharedMaterial = stickyPhys;
	else boxColl.sharedMaterial = defaultPhys;
}

function RemoveJetpack()
{
	hasJetPack=false;
	jet=null;
}

//Update variables
var addonList:Addon[];
var addonArray: Array;
var blockAnimation:boolean;
var animState:int;
var floorNormal:Vector3;
var floorTangent:Vector3;
var targetRot:float ;
var platformVelocity:Vector3;
var onPlatform:boolean;
var plat:platform; //the platform we are on
var magnetized:boolean;
var  stickToCeiling:boolean;
private var probeDists:float[]= [100f,85f,25f,25f];

var probe:boolean[] =new boolean[4];
var probeHit:RaycastHit[] = new RaycastHit[4];

var lock : boolean;
private var speedRampExitBoost : int = 0;
private var speedRampExitBoostMax : int = 10;
private var speedRampExitV : Vector3;





//Parent Object Attachment done every frame to ensure smooth movement
function LateUpdate()
{
	if (paused)  
	{
		transform.position=pausePos;
		transform.rotation=pauseRot;
	}
	else
	if (jParent)
	{
		
		//if (passenger) jpOffset.z=0;
		
		var localPos : Vector3 = jParent.transform.TransformPoint(jpOffset);
		//if (passenger) localPos.z=0;
		//if (lock||passenger||saved) trans.position =  localPos;
		//else trans.position.z =localPos.z;
		
		//if (lock) trans.position = jParent.transform.position + jpOffset;
		//else trans.position.z =jParent.transform.position.z+ jpOffset.z;
		//trans.position.z= jParent.transform.TransformPoint(jpOffset).z;
		if (!saved) {
		//CJ.targetRotation = jParent.transform.rotation;
		//trans.rotation = jParent.transform.rotation;
		}
		
		//ridge.velocity= Vector3.zero;
		

	}
	if (saved) trans.eulerAngles = Vector3(0,110,0);
}

var debugVelocity:Vector3;
var debugTopDistance:float;




function EnterSpeedRamp()
{
	Debug.Log("Enterinng speed ramp");
	/*
	CJ.yDrive.mode = JointDriveMode.Velocity;
	CJ.zDrive.mode = JointDriveMode.Velocity;
	CJ.yDrive.maximumForce = 10000000;
	CJ.zDrive.maximumForce = 10000000;
	CJ.yDrive.positionSpring = 10000000;
	CJ.zDrive.positionSpring = 10000000;
	*/
	//collider.enabled = false;
	
	ridge.isKinematic  = true;
	
	onSpeedRamp = true;
}

function ExitSpeedRamp( sRamp : SpeedRamp)
{
	Debug.Log("EXITING speed ramp");
	//CJ.yDrive.mode = JointDriveMode.None;
	//CJ.zDrive.mode = JointDriveMode.None;
	//collider.enabled =true;
	ridge.isKinematic  = false;
	//ridge.velocity = ;
    speedRampExitV = sRamp.ExitV();
	ridge.position += speedRampExitV * 0.04; 
    Debug.Log("exitvelocty: " +  speedRampExitV);
    ridge.AddForce(speedRampExitV, ForceMode.VelocityChange);
    speedRampExitBoost =speedRampExitBoostMax;
    
	onSpeedRamp = false;
}

function SetPositionOnSpeedRamp(position : Vector3, normal : Vector3)
{
	Debug.DrawLine(Vector3.zero, position);
	//CJ.targetPosition = position;
	//CJ.targetVelocity = (position - ridge.position);
	ridge.position = position;
    //ridge.MovePosition(position);
    var newRot : Quaternion = Quaternion.FromToRotation(trans.up, normal);
    trans.rotation=newRot;
}







//Main creature loop executed every physics step

function FixedUpdate() 
{	
	if (onSpeedRamp) return;
	bonucedThisFrame = false;
	if (saved&&!ridge.isKinematic) ridge.velocity =Vector3.zero;
	if (paused||saved) return;
	
	if (drowning)
	{
		transform.position.y -= 5*Time.deltaTime;
		transform.eulerAngles.x += 3*Time.deltaTime;
		return;
	}
	MoveForce=Vector3.zero;
	
	
	//read tilt input
	tilt =gen.GetTilt();
	shake = gen.GetShake();

	swipe = SwipeManager.Instance().GetSwipe();
	//Debug.Log(swipe);
	
	if (GameplayParameters.Instance().UseSwipeControls)
	{
		tilt = swipe.x /32 + gen.GetTilt();
		tilt = Mathf.Clamp(tilt, -0.1, 0.1);
	}
	//Debug.Log("Tilt: " + tilt);
	

	// send out rays to probe immiediate enviornment
	for (var pi:int=0; pi<4;pi++)
	{
		var aim:Vector3;
		var prayStart:Vector3 = trans.position + trans.up *(boxColl.size.y/2 );
		if (pi==0) aim=trans.up;if (pi==1) aim=-trans.up;if (pi==2) aim=trans.forward;if (pi==3) aim=-trans.forward;
		//var pdist : float =  (pi == 0) ? probeDist *1.5 : probeDist;
		probe[pi] =Physics.Raycast(prayStart -2*aim, aim, probeHit[pi], probeDists[pi],1<<8 | 1<<9);
	}
	
	
	
	if (probe[1] )
	{
		var speedRamp : SpeedRamp = probeHit[1].transform.GetComponent(SpeedRamp);
		if (speedRamp && !speedRamp.Cooldown() && probeHit[1].distance < speedRamp.grabDist)
		{
			Debug.DrawLine (ridge.position, probeHit[1].point, Color.red);
			Debug.Log("On Speed /ramp");
			var tangent = Vector3(0, -probeHit[1].normal.z, probeHit[1].normal.y);
			var t : float = probeHit[1].textureCoord.x;
			
			if (!onSpeedRamp)
			{
				EnterSpeedRamp();
				speedRamp.Add(this, t, ridge.velocity.z < 0);
				return;
				//speedRampBackwards = (ridge.velocity.z < 0);
				
				//ridge.velocity = Vector3.zero;
				
				//return;
			}
			/*
			if (speedRampBackwards) tangent *= -1;
			
			var direction : Vector3 =Vector3.Slerp( tangent.normalized, probeHit[1].normal, speedRamp.groundHug);
			
			Debug.DrawRay(transform.position, direction *4, Color.yellow);
			
			
			CJ.targetVelocity =  direction * speedRamp.GetSpeed(t);
			
			
			return;
			*/
			
		}
		
	}
	
	//if (onSpeedRamp)
	//{
	//	ExitSpeedRamp();
	//}
		
	

	// match velocity to parent object
	if (jParent)
	{
	
		var parentRB:Rigidbody;
		var tiltC: TiltController=jParent.GetComponent(TiltController);
		if(tiltC) parentRB =tiltC.target.GetComponent(Rigidbody);
		else
		parentRB = jParent.GetComponent(Rigidbody);
		if (parentRB) {
			var localPos : Vector3 = jParent.transform.TransformPoint(jpOffset);

			CJ.targetVelocity = parentRB.velocity - ridge.velocity;
		}
		else if (!ridge.isKinematic) CJ.targetVelocity = Vector3.zero;
		
	}
	
	
	//kill if we fall out of world
	

	
	if (trans.position.y < cam.scrollArea.y-FalloutRange) dead = true;
	
	if(dead) {
		Pause();
		//TurnOff();
		Kill();
		return;}
		



	// reset variables
	//blockAnimation = false;
	realWalkSpeed = autoWalk.walkSpeed;
	realAirSpeed=0;
	//realAirSpeed = ridge.velocity.z + 100*tilt *Tilt.airSpeedMod;
	var roofGrab:boolean = false;
	var roofHold:boolean = true;
	stickToCeiling=false;
	magnetized=false;
	onPlatform=false;
	
	platformVelocity=Vector3.zero;


	
	// cycle through all addons and and update temporary properties according to what's available

if (hasParachute && para.chute)
		{
			
			// parachutes open and close according to the y-velocity, and augment
			// said velocity while open
			
			if( para.open )
			{
				if(ridge.isKinematic || ( ridge.velocity.y >= 0 ) || (!on) ||(!airborne) || (!Ramp && probe[1] && probeHit[1].distance < 20))
				{
					//print("AAA");
					para.TurnOff();
					
				}
				//else
				//{
					//if( ridge.velocity.y < -para.fallSpeed )
					//{   
					//	ridge.velocity.y += para.fallSlow*Time.deltaTime;
					//}
				//
				
				var upRot: Quaternion = Quaternion.Euler(0,trans.eulerAngles.x -ridge.angularVelocity.x, 0);
				//para.transf.localRotation= upRot;
				para.transf.localRotation=Quaternion.Slerp(para.transf.localRotation, upRot, 4*Time.deltaTime);
				if (!offscreen)
				{
					realAirSpeed =ridge.velocity.z +250*tilt *para.airSpeedMod;
					realAirSpeed =Mathf.Clamp(realAirSpeed,-para.maxAirSpeed,para.maxAirSpeed);
				}
				
			}
			else
			{
				if(( ridge.velocity.y < -para.unfurlSpeed ) && (on) &&(!probe[1] || probeHit[1].distance > 20) &&airborne)
				{
					para.open = true;
					for( var chute:ParaSwapper in GetComponentsInChildren(ParaSwapper) ) chute.SetOn(true);
				}
				else para.TurnOff();
			}
			
		}
		
		
		
if(( hasDoubleWheels)||(autoWheels))
		{
			// doublewheels make critters faster when on the ground
		
			
			if (!offscreen)
			{
			if (!airborne) realWalkSpeed += Tilt.wheelSpeedMod*tilt;
           
			realWalkSpeed = Mathf.Clamp	(realWalkSpeed, -autoWalk.wheelSpeed,autoWalk.wheelSpeed);	
			}
				
			//blockAnimation = true;
			
			if (sound && on)
			{
				if (!sound.roll.isPlaying) sound.roll.Play();
				//print ("dist:" +probeHit[1].distance);
			if (!airborne && probe[1] && probeHit[1].distance<boxColl.size.y)
			{
				//print ("setting roll volume");
			 sound.roll.volume=Mathf.Lerp(0, 1, Mathf.Pow(Mathf.Abs(ridge.velocity.magnitude)/autoWalk.wheelSpeed,2));
			}
			else sound.FadeOutRoll();
			}
			//}
		}
		
		
		
if( hasQuadWheels )
		{
			// doublewheels make critters faster when on the ground
			//realWalkSpeed += (autoWalk.wheelSpeed*((bonus.boostTime>0)?4:1));
			
				if (sound && on)
			{
			if ((!airborne && probe[1] && probeHit[1].distance<boxColl.size.y)||( probe[0] && probeHit[0].distance<10))
			 sound.roll.volume=Mathf.Lerp(0, 1, Mathf.Abs(ridge.velocity.magnitude)/autoWalk.wheelSpeed);
			else sound.roll.volume=0;
			}
			if (!offscreen)
			{
			if (!airborne)  realWalkSpeed += Tilt.wheelSpeedMod*tilt;
			realWalkSpeed = Mathf.Clamp	(realWalkSpeed, -autoWalk.wheelSpeed,autoWalk.wheelSpeed);
			if (magnoProp) realWalkSpeed *=0.3;
			}
			roofGrab = true;
			//roofHold = true;
			//blockAnimation = true;
		}
		//var ridge:Rigidbody=GetComponent(Rigidbody);
		
		
		
if( hasMagnet && !ridge.isKinematic &&(on) )
		{	
			// magnets pull an critter up toward the cieling
			
			var magfwd =magnetTrans.right;	
			
			//see if theres anything in range
			if (probe[0])
			{
			var hitLayer:int = probeHit[0].transform.gameObject.layer;
			if (((hitLayer == 9) || ((hitLayer==8)&&probeHit[0].transform.gameObject.tag=="magnetic") )
			&&( probeHit[0].distance < magnet.range))
			{
				//print("magnetize!");
				magnetized=true;
				roofGrab=true;
				
		// is it another critter?
				var juncMag:Juncore = probeHit[0].transform.GetComponent(Juncore);
				if (juncMag&&probeHit[0].distance<magnet.couplingDistance) 
				{
					var couple :boolean= true;
					//if (juncMag.hasQuadWheels && !juncMag.stickToCeiling) couple =false;
					roofGrab=false;
					
					
					
		// if the other critter is turned off, parent it to us
					if (couple)
					{
					magBeam.Couple();
					var parentToMe : boolean =false;
					
					if ((!juncMag.on)
					||
					juncMag.passive
					||
					(juncMag.hasQuadWheels && !juncMag.stickToCeiling &&!magBeam.on)
					)  parentToMe=true;
	
					
					if (parentToMe)
					{
						//print("p1");
					
					stickToCeiling =false;
					magnetized =false;
					if (jParent) 
					{
						//ridge.velocity =Vector3.zero;
						SetParent(null, Vector3.zero);
					}
					 lock=false;
					 if (!juncMag.jParent){
					 		print("p2");
							var offset : Vector3 = trans.InverseTransformPoint(juncMag.trans.position);
							if (offset.y<15) offset.y=15;
							//offset.z=0;
							//offset+=3*trans.up;
							
							juncMag.SetParent(this.gameObject, offset);
							juncMag.passenger=true;
							 //juncMag.SetParent(this.gameObject, magnet.coupleUp*Vector3.up);
							 juncMag.lock=true;
							
							 //juncMag.ridge.velocity =ridge.velocity ;
						}
					 //MoveForce += Vector3(0,1000,0);
					 }
					 
					 
		 //otherwise parent ourselves to the other creature 
					 else 
					 {	
					 	if (juncMag.jParent) juncMag.SetParent(null,Vector3.zero);

					 	//ridge.velocity =juncMag.ridge.velocity;;
					 	if (!jParent) 
					 
							{
							passenger=true;
					 		SetParent(juncMag.trans.gameObject, -juncMag.magnet.coupleDown*Vector3.up);
					 		//var poffset : Vector3 = juncMag.trans.InverseTransformPoint(trans.position);
							//if (poffset.y>-5) offset.y=-5;
							//poffset.z=0;
					 		//SetParent(juncMag.trans.gameObject, poffset);
					 		lock=true;
					 		}
					 }
					 
					}
					else magBeam.Decouple();
				}
				
				//print("distance=" + probeHit[0].distance );
				if(magnetized&&( probeHit[0].distance >-1 )&&(Mathf.Abs(Vector3.Angle(probeHit[0].normal,magfwd))>135)&&!jParent)
				{
					
					MoveForce+=magnet.pull*magfwd*probeHit[0].distance/magnet.range;	
					//if (!magBeam.on && (probeHit[0].distance>magnet.couplingDistance)) magBeam.Activate();
					if (!magBeam.on && !magBeam.coupled) magBeam.Activate();
					if (probeHit[0].distance<magnet.couplingDistance && !magBeam.coupled) magBeam.Couple();
					magBeam.SetBeamEnds(magnetTrans.position, probeHit[0].point);
					//if (probeHit[0].distance<magnet.couplingDistance) magBeam.Couple();
				}
				else magBeam.SetBeamEnds(magnetTrans.position, magnetTrans.position);
				
			}
			else if (!magnoProp) magBeam.Deactivate();
			}
			if (!magnetized && (magBeam.on || magBeam.coupled) && !magnoProp) {magBeam.Deactivate();}
			if (passenger && !airborne)
			{
				
				passenger =false;
				SetParent(null,Vector3.zero);
			}
		}
		
		
		
if(hasSpring && !ridge.isKinematic)
		{
			//if( Physics.Raycast( springTrans.position, trans.TransformDirection(Vector3.down), hit, springy.bounceRange  ) )
			if (probe[1] &&probeHit[1].distance < springy.bounceRange)
			{	hit=probeHit[1];
				if (ridge.velocity.y<0)
				{	
					if (springAnim) springAnim.Play();
						//Twang(springTrans);
						if (hit.rigidbody)
						{
							hit.rigidbody.AddForceAtPosition (0.5*ridge.velocity.y*hit.normal*ridge.mass, hit.point,ForceMode.Impulse);
						}
						
						if(on){
						var newVelocity:Vector3;
						
						if (firstBounce) //extra high first bounce from ground
						{
							//print ("firstBounce");
							newVelocity.y=0.8*springy.preferredHeight;
							newVelocity.z =0.8*ridge.velocity.z;
							firstBounce=false;
						}
						else
						{
						newVelocity.y =Mathf.Lerp(Mathf.Abs(ridge.velocity.y) , springy.preferredHeight, springy.damp);
						var tiltVec:Vector3;
						
						 tiltVec=trans.TransformDirection(Vector3.up);
						 if (!offscreen&&Mathf.Abs(hit.normal.z) <0.1) newVelocity =Vector3.Slerp(newVelocity, tiltVec*newVelocity.magnitude,springy.airTilt) ;
						 else {newVelocity =newVelocity.magnitude * hit.normal;}
						 
						newVelocity.z += springy.conserveZ*ridge.velocity.z;
						}
						var springplat : platform = hit.transform.GetComponent(platform);
						if (springplat) 
						{
							newVelocity.z += 0.6*springplat.GetVelocity().z;
							newVelocity.y += springplat.GetVelocity().y;
						}
						//newVelocity.z = trans.eulerAngles.x *springy.airTilt;
						//Debug.Log("setting velocity : " + newVelocity);
						ridge.velocity=newVelocity;
						//ridge.AddForce(newVelocity, ForceMode.VelocityChange);
						bonucedThisFrame = true;
						var previousVelocity : Vector3= ridge.velocity;
						
						if (sound) sound.springBoing.Play(); 
						
						//bounce passenger too
						if (probe[0])
							{
							var topJunc:Juncore = probeHit[0].transform.GetComponent(Juncore);
							if(topJunc && topJunc.passenger)
								{
								topJunc.ridge.velocity=newVelocity;
								}
							}
						
						}
						
						//else {ridge.velocity*=0.3;ridge.velocity.z=0;}
						
				}
			}
			if(!hasPropellor&&!offscreen)
			{
			//print (ridge.velocity.z);
			
			if (Mathf.Abs(ridge.velocity.z)<springy.maxSpeed) realAirSpeed=springy.conserveZ*ridge.velocity.z + springy.airSpeed*tilt;
			else realAirSpeed=ridge.velocity.z;
			}
		}
		


if( hasPropellor && prop.height > 0 && !ridge.isKinematic && propellorTrans)
		{
			// propellors pull a critter up as well as moving them forward
			

			//var targetHeight = Mathf.Lerp(0,prop.height, gen.GetVertTilt());
			//print ("targetHeight=" + gen.GetVertTilt());
			
			var overGround:boolean =false;
			var targetHeight: float=prop.height;
			
			if (propRotateSpeed) propellorTrans.RotateAround(trans.up,Time.deltaTime*propRotateSpeed*10);
	
			if (on)
			{
				//var hitSomthing : boolean =false;
				var thrust = prop.force ;
				var prhit : RaycastHit;
				if( Physics.Raycast( Ray(trans.position + Vector3(0,1,0), Vector3(0,-1,0)), prhit, targetHeight*1.2, 1<<8  ) )
				//{
				//	hitSomething =true;
				//	var hitMagnet : boolean =false;
				//	var propJunc : Juncore = prhit.gameObject.GetComponent(Juncore);
				//	if (propJunc && propJunc.hasMagnet) Physics.Raycast( Ray(trans.position + Vector3(0,1,0), Vector3(0,-1,0)), prhit, targetHeight*1.2, 1<<8 ) ;
				//}
					//if (probe[1] && probeHit[1].distance<prop.height)
				//if (hitSomething)
				{
					
				
					propRotateSpeed = Mathf.Lerp(3, 1, prhit.distance / targetHeight);
					if (prhit.distance<targetHeight)
					{
						overGround = true;
						//prHit=probeHit[1];
						var percent :float = ((targetHeight-prhit.distance)/targetHeight);
				
						thrust *= percent ;
						thrust += 1400;
						thrust -=  ridge.velocity.y * 120;
						//var scale = (percent > 0.5) ? (percent/4+0.5) : 0.5;
						//thrust *= scale;
					}
				
				if (!propellorSound.rampingUp)
				{ propellorSound.engine.volume = Mathf.Lerp(0.5,1,propRotateSpeed/3);
				propellorSound.engine.pitch = Mathf.Lerp(1.5,2,propRotateSpeed/3);
				}
				propellorDust.TurnOn(true);
				propellorDust.emitter.transform.position = prhit.point;
				}
				else
				{
					if(propRotateSpeed>0.04)	
					propRotateSpeed *=(1 - Time.deltaTime *0.8);
					else propRotateSpeed=0;
				}
			
			if (!overGround) 
			{
				thrust =propRotateSpeed*prop.force/5;
				propellorSound.engine.volume*=(1 - Time.deltaTime *0.5);
				propellorSound.engine.pitch*=(1 - Time.deltaTime *0.3);
				propellorDust.TurnOn(false);
				
			}
			/*
				if( ridge.velocity.y < 0 )
					thrust *= 0.03;
				else
					thrust *= 0.1;
					*/
			 
			
			//if( ridge.velocity.y > 20 ) thrust /= (((ridge.velocity.y-20)/5+1)*((ridge.velocity.y-20)/5+1));
			MoveForce+=Vector3( 0, thrust, 0 );
			//ridge.AddForce( 0, thrust, 0 );
			var windSpeed = Vector3.zero;
			for( var curWindmill:Windmill in windmills )
			{
				windSpeed += curWindmill.TestZone(trans.position);
			}
			
			//set prop forward speed to tilt value
			if (!offscreen)
			{
			prop.fwdSpeed =600*Tilt.airSpeedMod*tilt;
			realAirSpeed=prop.fwdSpeed+windSpeed.z;
			}
			//ZSpeedMatchByForce( autoWalk.polarity * prop.fwdSpeed + windSpeed.z );
			
			//blockAnimation = true;
		}
		else 
		{
			if(propRotateSpeed>0.04)	
			{propRotateSpeed *=(1 - Time.deltaTime *3.5);
			propellorSound.engine.volume*=(1 - Time.deltaTime *3);
			propellorSound.engine.pitch*=(1 - Time.deltaTime *1);}
			else {propRotateSpeed=0;propellorSound.StopSound();}
			propellorDust.TurnOn(false);
				
		}
		
	}
	
	if (hasJetPack)
	{
		
		//var t : float = Mathf.Clamp ((Mathf.Abs(ridge.velocity.z) - 200)/300.0, 0, 1) ;
		//var zSpeedMod: float = Mathf.Lerp(1,0,t);
		
		var thrustVector : Vector3= trans.up * jet.thrust;
		if ( (ridge.velocity.z>150 && thrustVector.z>0) || (ridge.velocity.z<-150 && thrustVector.z<0) )thrustVector.z = 0;
		if (ridge.velocity.y<0) thrustVector.y -= ridge.velocity.y *jet.yComp;
		else  thrustVector.y -= 0.5*ridge.velocity.y *jet.yComp;
		MoveForce += thrustVector;
	}
	
if (hasIceBlock&&!ridge.isKinematic&&!jParent)
	{
			var bounceRight: boolean =false;
			var bounceLeft: boolean =false;
			var bounceAngle:float;
			
			var colR : Rigidbody =null;
			
			//test LeftBounce
			if
			(
			//bounceTimer<=0 &&
			probe[2] 
			&& (probeHit[2].distance<10) 
			&& (ridge.velocity.z>=0)
			&& Mathf.Abs(Vector3.Angle(probeHit[2].normal, ridge.velocity)) >90
			)
			{
				bounceAngle= Mathf.Abs(Vector3.Angle(probeHit[2].normal, ridge.velocity));
				if (probeHit[2].transform.tag == "wall")  bounceRight =true;
				if (probeHit[2].rigidbody&&(probeHit[2].rigidbody.velocity.z-ridge.velocity.z)<20) {colR=probeHit[2].rigidbody;bounceRight =true; }
			}
			
			//test right bounce
			if
			(
			//bounceTimer<=0 &&
			probe[3] 
			&& (probeHit[3].distance<10) 
			&& (ridge.velocity.z<=0)
			)
			{
				bounceAngle= Mathf.Abs(Vector3.Angle(probeHit[3].normal, ridge.velocity));

				if (probeHit[3].transform.tag == "wall")  bounceLeft =true;
				if (probeHit[3].rigidbody && (probeHit[3].rigidbody.velocity.z-ridge.velocity.z)<20) {colR=probeHit[3].rigidbody;bounceLeft =true;}
			
			}
			
			if ((bounceLeft || bounceRight) && bounceAngle>145) //bounce on one side only
			//if (iceCollision)
			{
			
			print ("iceBounce, angle" + bounceAngle);
			if(bounceLeft) transform.position.z= probeHit[3].point.z +10;
			if(bounceRight) transform.position.z= probeHit[2].point.z -10;
			
			/*
			 ridge.velocity.z *=-1;
			if (colR) ridge.velocity.z += colR.velocity.z;}
			
			ridge.velocity.z = Mathf.Clamp(ridge.velocity.z,-260,260);
			realWalkSpeed=ridge.velocity.z;
			
			*/
			bounceSpeed = -ridge.velocity.z;
			if (colR) bounceSpeed+=colR.velocity.z;
			
			bounceSpeed = Mathf.Clamp(bounceSpeed, -260,260);
			realWalkSpeed = bounceSpeed;
			bounceTimer =0.5;
			BounceCooldown();
			//print ("bounceSpeed: "+ bounceSpeed);
			//ridge.velocity.z = bounceSpeed;
			 //ridge.velocity.z *=-.3;
			}
			
			//realWalkSpeed = bounceSpeed;
			
			if (bounceTimer>0) {realWalkSpeed = bounceSpeed;}
			else {realWalkSpeed=ridge.velocity.z;}
			
				
		}

		



//movement
var onCurve:boolean =false;
if( !ridge.isKinematic )
{
		var xcoff:float;
		var ycoff:float;
		var zcoff:float;
		tSpeed = ridge.velocity.z;
		
		airborne =false;
		var gotGrab = false;
		
		
		
//send out corner rays to see if we're on the ground and get normal info
		for( var yy:int=1; yy>-2; yy-=2 )
		for( var zz:int=1; zz>-2; zz-=2 )
		{
			if( yy == -1 || roofGrab ) //send out floor rays- if roof grab is set send ceiling rays too
			{
				var fwd = Vector3(0,yy,0);
				var zz_forward=zz*Mathf.Sign(tSpeed);
				if(boxColl)
			{
				//xcoff = boxColl.size.x*xx*.5;
				ycoff = boxColl.size.y*yy*.5;
				 zcoff = boxColl.size.z*zz_forward*.5;
			}
				//var rayStart = ridge.worldCenterOfMass + Vector3(0,ycoff,0) + trans.forward*zz + trans.right*xx;
				var grabDist : float = (yy == -1)? 14 : 6;
				var rayStart = ridge.worldCenterOfMass + Vector3(0,ycoff,0) + trans.forward*zcoff;
				if( Physics.Raycast( Ray(rayStart - fwd, fwd), hit, grabDist, 1<<8 | 1<<9 ) )
				{	
					

					var ga = hit.collider.gameObject;
					if( !gotGrab && ga )
					{	//if(yy!=-1) print(ga.name);
						
						gotGrab = true;
						
						if ((yy==1)&&on) //ceiling ray hit
						{
							if (hasQuadWheels && !magnetized)
							{
								if (!ga.GetComponent(PhysicsBlock)) {stickToCeiling =true;airborne=false;}
							}
							if (magnetized) {stickToCeiling =true;realWalkSpeed=0;}
						}
						/*
						var curv : CurvedSurface = ga.GetComponent(CurvedSurface);
						
						if (curv)
						{
							floorNormal = curv.GetSmoothNormal(hit.barycentricCoordinate,hit.triangleIndex);
						}
						else
						{

							floorNormal=hit.normal.normalized;
						}                                                                                                                 
						*/
						floorNormal=hit.normal.normalized;
						floorNormal.x=0;
						
						if (!stickToCeiling) floorTangent=Vector3.Cross(Vector3.right, floorNormal);
						else 
						{
							//QuadWheels are stuck to ceiling - detach if they are on an edge
							if (Mathf.Abs(Vector3.Angle(-trans.up, floorNormal)) < 50)
							{
							floorTangent=Vector3.Cross( floorNormal,Vector3.right);
							if (Mathf.Abs(Vector3.Dot(ridge.velocity,floorNormal)) >10) ridge.velocity = floorTangent* (Vector3.Dot(ridge.velocity, floorTangent));
							}
							else 
							{
								floorTangent=Vector3.Cross(Vector3.right, floorNormal);
								stickToCeiling = false;
							}
						}
						
					
						if( ga.GetComponent(platform) )
						{
							onPlatform=true;
							plat = ga.GetComponent(platform);
							
							platformVelocity=plat.GetVelocity();
							//print ("havePlatform" +platformVelocity);
							
						}
						
						//onSpeedRamp = (ga.GetComponent(SpeedRamp));

						
						
			// set desired z speed
						if( realWalkSpeed && on && roofHold &&(!magnetized) ) tSpeed = realWalkSpeed * autoWalk.polarity;
						else if( Mathf.Abs(tSpeed) > 1 && (yy==-1 || roofHold) ) tSpeed = Mathf.Sign(tSpeed);
						
						if (onPlatform) {
							
							//ridge.velocity.y =platformVelocity.y;
						tSpeed+=platformVelocity.z;
						}
					}
			
				}
				else
				{	plat =null;
					 if ((yy==-1)&&!stickToCeiling) airborne =true;
				}
		
			}
			
		}
		
		
		
// change Rotation based on tilt
		var newRot:float;
		var newRotation:Quaternion;
		//if(onRamp) print ("yes I'm on a ramp");
		
//detect if we're lying on our side

if (probe[2])
		if (( probeHit[2].distance<20 &&(probeHit[2].normal.y>0.3)&&(probeHit[2].transform.tag!="wall") && probeHit[2].transform.gameObject.layer!=9)
		 && (!probe[1] || (probe[1] && probeHit[1].distance>10))) {airborne =false;floorNormal = probeHit[2].normal;}
if (probe[3])
		if (( probeHit[3].distance<20  &&(probeHit[3].normal.y>0.3)&& (probeHit[3].transform.tag!="wall") && probeHit[3].transform.gameObject.layer!=9) 
		&& (!probe[1] || (probe[1] && probeHit[1].distance>10))) {airborne =false;floorNormal = probeHit[3].normal;}
		
		
		
 
 //in air		
		if(airborne)
			{
				 if ((hasParachute && para.chute && para.open) || hasPropellor)
				 {
				 	airborneTime =0;
				 }
				 else
				 {
				 	airborneTime += Time.deltaTime;
				 }
					if(ridge.collisionDetectionMode == CollisionDetectionMode.Discrete)
					{
					 	ridge.collisionDetectionMode = CollisionDetectionMode.ContinuousDynamic;
					 	CJ.slerpDrive.positionSpring =50000;
					 }
					//print ("in air");
					firstBounce=false;
					if (realAirSpeed != 0) tSpeed=realAirSpeed;
					else 
					{
						tSpeed = Mathf.Clamp(5000*tilt, -autoWalk.wheelSpeed, autoWalk.wheelSpeed);
						
						/*
						if (ridge.velocity.z < autoWalk.wheelSpeed && ridge.velocity.z > - autoWalk.wheelSpeed)
						 tSpeed=0.9f*ridge.velocity.z + 1600*tilt;
						else tSpeed=ridge.velocity.z ;
						*/
						
					}
					if(on)
					{	//align to normal if we are near some terrain in any direction
					/*
						var probeHitGround:int=-1;
						var groundDist:float =probeDists[1];
						for (var prID:int=1; prID<4;prID++)
						{
						if (probe[prID] && probeHit[prID].distance<groundDist && probeHit[prID].transform.tag != "wall") 
						{
							if (probeHitGround != 1)
								probeHitGround=prID; groundDist =probeHit[prID].distance;
						}
						}
						*/
						
						//var nearGround : bool = false;
						//var normQ:Quaternion;
						//if ((probeHitGround>0)&& probeHit[probeHitGround].distance<10 &&probeHit[probeHitGround].transform.gameObject.layer ==8)
						//{
						//	normQ =Quaternion.FromToRotation(Vector3.up, probeHit[probeHitGround].normal);
							//newRotation =Quaternion.FromToRotation(Vector3.up, probeHit[probeHitGround].normal);
						//}									
						
						//else	
						targetRot =Mathf.Clamp(20*tilt*maxTilt, -maxTilt,maxTilt);
						newRotation= Quaternion.Euler(Vector3(targetRot,0,0));
	
						
						if (probe[1])
						{
						//Debug.Log(probeHit[1].distance/probeDists[1]);
							var normQ : Quaternion =Quaternion.FromToRotation(Vector3.up, -floorNormal);
							//newRotation = Quaternion.Lerp(normQ, newRotation, probeHit[1].distance/probeDists[1]);
						}
						//newRotation= Quaternion.Euler(Vector3(targetRot,0,0));
						
						/*
						if ((probeHitGround>0)&& probeHit[probeHitGround].distance<groundDist &&probeHit[probeHitGround].transform.gameObject.layer ==8)
						{
							var normQ : Quaternion =Quaternion.FromToRotation(Vector3.up, probeHit[probeHitGround].normal);
							//newRotation =Quaternion.FromToRotation(Vector3.up, probeHit[probeHitGround].normal);
							newRotation = Quaternion.Lerp(normQ, newRotation, probeHit[probeHitGround].distance/groundDist);
						}
						*/
						
						//scream!
						if (sound)
						{
						if (ridge.velocity.y<-190 && !sound.fall.isPlaying) sound.fall.Play();
						if (ridge.velocity.y>80 && ridge.velocity.magnitude>180 && !hasSpring) sound.PlayWhoop();
						}
					}
					
			}
//on ground
			else  
			{	
			airborneTime =0;
				if(ridge.collisionDetectionMode != CollisionDetectionMode.Discrete) 
				{
					ridge.collisionDetectionMode = CollisionDetectionMode.Discrete;
					CJ.slerpDrive.positionSpring =18000000;
				}
				//excited =false;
				//align to normal
			
					var normalQ:Quaternion;
					if (magnetized&&(!probe[1] || probeHit[1].distance >10)) normalQ= Quaternion.FromToRotation(magnetTrans.right, -floorNormal); //magnetized
					
					else if ((!stickToCeiling)&&(!hasSpring)) normalQ = Quaternion.FromToRotation(Vector3.up, floorNormal); //not magnetized
				
					else  normalQ= Quaternion.FromToRotation(Vector3.up, -floorNormal); //not magnetized, and stuck to ceiling
					targetRot= normalQ.eulerAngles.x;
					
					
					//print (floorTangent);
					//newRot= Mathf.Lerp(trans.eulerAngles.x, targetRot, 400*Time.deltaTime);
					newRot=targetRot;
					newRotation= Quaternion.Euler(Vector3(targetRot,0,0));
						
				
			}
			
		
//set rotation66

if(!passenger){
		if (airborne) 
			{
			//if (hasSpring || hasParachute) /*trans.rotation =newRotation;*/trans.rotation = Quaternion.Slerp(trans.rotation, newRotation,12*Time.deltaTime);
			//else 
			//ridge.AddTorque(80*( trans.eulerAngles.x- newRotation.eulerAngles.x) * Vector3.right, ForceMode.VelocityChange);
			//ridge.MoveRotation(Quaternion.Slerp(trans.rotation, newRotation,4*Time.deltaTime));
			CJ.targetRotation = newRotation;
			}
		
		else
			{
			//if (onCurve) trans.rotation = Quaternion.Slerp(trans.rotation, newRotation,12*Time.deltaTime);
			//ridge.MoveRotation(Quaternion.Slerp(trans.rotation, newRotation,6*Time.deltaTime));
			//mTargetRotation = Quaternion.Slerp(trans.rotation, newRotation,6*Time.deltaTime);
			//ridge.AddTorque(80*(trans.eulerAngles.x - newRotation.eulerAngles.x) * Vector3.right, ForceMode.VelocityChange);
			CJ.targetRotation = newRotation;
			}
			}
			
		



// What to do if we are on a platform 
		if (onPlatform&&plat)
		{	//if (platformVelocity.y<0) ridge.velocity.y=platformVelocity.y;
			//ridge.velocity.y=platformVelocity.y;
			var seeSaw:Seesaw = plat.GetComponent(Seesaw);
			if (seeSaw) seeSaw.SetIncomingForce(Vector3.zero, Vector3.zero,false);
			
			var friction:float =plat.GetFriction();
			if (friction&&!jParent) 
				{
					if (friction>1) friction=1;
					//if (Mathf.Abs(tSpeed)>platformVelocity.z)
					tSpeed=Mathf.Lerp(tSpeed, platformVelocity.z, friction);
								
				} 
		}
		


// Work out force needed to get desired Z speed
		if (onPlatform && magnetized) ridge.velocity= platformVelocity;
		else
		 if(!jParent) ZSpeedMatchByForce( tSpeed );
		

		
//Add on Forces from Jetsteams and Windmills
	for (var js:Jetstream in jetStreams) {MoveForce+=js.GetForce(trans.position);}
		for( var curWindmill:Windmill in windmills )
			{
				MoveForce += curWindmill.TestZone(trans.position);
			}
	
	
//Add Gravity,or if stuck to ceiling with quad wheels or magnet, add ceiling force
	if (!stickToCeiling )
	{ 
		var gravForce : float;
		
		if (!airborne || hasPropellor || magnetized)
		{
			gravForce = 65;
			
		}
		else if (hasParachute && para.chute && para.open )
		{
			gravForce =  0.04*para.fallSlow*(para.fallSpeed - (-1*ridge.velocity.y));
			//Debug.Log("DownSpeed: " + (-1*ridge.velocity.y) + " grav Force: " + gravForce);
		}
		else
		{
			if (ridge.velocity.y < - terminalVelocity)
			{
				gravForce =0;
			}
			else
			{
				gravForce = 65;
				/*
				if (airborneTime > 3)
				{
					 gravForce += (Mathf.Pow((airborneTime-3), 1.8) * 80);
				}
				*/
				//if (a
				//gravForce = 52+(Mathf.Pow(airborneTime, 1.3) * 50);
			}
			
		}
		MoveForce -= Vector3(0,gravForce*ridge.mass,0); 
	}
	
	else if (on && probe[0]) //stuck to ceiling
	{

		MoveForce -= 200*floorNormal*ridge.mass;
	}
	
	if (hasDoubleWheels || hasQuadWheels && !airborne)
	{
		MoveForce +=  floorTangent * floorNormal.z *3000;
	}
		
	
	
	



//what to do if we are turned off	
/*
if ((!on ) && !airborne && !ridge.isKinematic) 
	{
		// if turned off and on a platform, parent ourselves to that platform to eliminate slippage
		if (onPlatform&&plat)
		{	         
			var seesaw:Seesaw = plat.GetComponent(Seesaw);
			if (seesaw) seesaw.SetIncomingForce(Vector3(0,65*ridge.mass,0), probeHit[1].point,true);
			
			if (!jParent)
				{
				var platObj:GameObject = plat.gameObject;
		
				//platformLockPosition= trans.position -plat.transform.position;
				platformLockPosition = plat.transform.InverseTransformPoint(trans.position);
				SetParent(platObj,platformLockPosition);
				}
			 ridge.velocity.z=platformVelocity.z;
			 //if (lock) ridge.velocity.y=platformVelocity.y;
		}
		else if (ridge.velocity.magnitude<20) {MoveForce=Vector3.zero;ridge.velocity =Vector3.zero;}
	}
	*/
	/*
if (passive && !airborne && !ridge.isKinematic)
{
	if (!onPlatform && ridge.velocity.magnitude<20) { MoveForce=Vector3.zero; ridge.velocity =Vector3.zero; }
}	
*/
	
	
// add shake force
	if ((shake)&&(shakeable))
		{
			print("Shake");
			MoveForce+=(Vector3(0,0.8,30*tilt) * ridge.mass *300);
			if (shakeTimer <= 0)
				{
					shakeTimer = shakeCooldownTime;
					ShakeCooldown();
				}
		}
	
	
	
//Apply Force
	//if(passenger) MoveForce.z=0;
	if(!passenger && !bonucedThisFrame){
	    Debug.Log("Adding force " + MoveForce);
	 ridge.AddForce(Vector3(0,MoveForce.y,MoveForce.z));
	
	 }
     
     if (speedRampExitBoost > 0)
     {
        Debug.Log("Speed Ramp Exit Boost " + speedRampExitBoost);
        ridge.AddForce(speedRampExitV*(speedRampExitBoost/speedRampExitBoostMax), ForceMode.VelocityChange);
        speedRampExitBoost --;
    }
	 
	 m_vis.localEulerAngles =  tilt * TILTVISVECTOR;
	  
	

	
}
	
}


function TipChecker()
{
	while(true)
	{
		yield WaitForSeconds(0.3);
		
		TipCheck();
		
	}	
}

function TipCheck()
{
	var fn : Vector3;
	if ((probe[2] && probeHit[2].distance<20 &&(probeHit[2].normal.y>0.3)&&(probeHit[2].transform.tag!="wall") && probeHit[2].transform.gameObject.layer!=9)
		 && (!probe[1] || (probe[1] && probeHit[1].distance>10))) {tipped=true;airborne =false;fn = probeHit[2].normal;}
		if ((probe[3] && probeHit[3].distance<20  &&(probeHit[3].normal.y>0.3)&& (probeHit[3].transform.tag!="wall") && probeHit[3].transform.gameObject.layer!=9) 
		&& (!probe[1] || (probe[1] && probeHit[1].distance>10))) {tipped=true;airborne =false;fn = probeHit[3].normal;}
		
		if(tipped)
		{
		var normalQ : Quaternion = Quaternion.FromToRotation(Vector3.up, floorNormal);
		var targetRot:float= normalQ.eulerAngles.x;
		trans.rotation = Quaternion.Euler(Vector3(targetRot,0,0));
		tipped =false;
		}
		
}

function Twang(t:Transform)
{
	
	var twangs : int = 8;
	var twangScaleMax : float = 0.7;
	var twangScale : float = twangScaleMax;
	var sign : int =-1;
	
	var baseScale = t.localScale.y;
	var basePos = t.localPosition.y;
	//print ("baseScale: " +baseScale);
	var i : int =0;
	while (i<twangs)
	
	{
		/*
		var tt : float =1- 0.2*parseFloat(i)/parseFloat(twangs); 
		twangScale =baseScale*(1 + sign*twangScaleMax*tt);
		t.localScale.y = twangScale;
		
		print (twangScale);
		sign*=-1;
		*/
		
		if (i<twangs-2) 
		{
			t.localScale.y =0.2;
			t.localPosition.y =4;
		}
		i++;
		
		yield;
	}
	t.localScale.y = baseScale;
	t.localPosition.y = basePos;
}







//Misc info returning functions
var onRamp:boolean=false;
function SetRamp(t:boolean)
{
	if(t) print("on ramp");
	else print("off ramp");
	onRamp=t;
}
function IsStuckToCeiling()
{
	return stickToCeiling;
}
function IsOnPlatform()
{
	return plat;
}
function SetVelocity(vel:Vector3)
{
	ridge.velocity=vel;
}
function SetPVelocity(vel:Vector3,on:boolean)
{
	platformVelocity=vel;
	onPlatform=on;
}





// Shake and bounce Cooldown functions
private var shakeTimer:float;
private var shakeCooldownTime:float=4;
private var shakeWindow:float=0.2;
private var shakeable:boolean=true;


function ShakeCooldown()
{ 
	while (shakeTimer>0)
	{
		if (shakeTimer<shakeCooldownTime-shakeWindow) shakeable=false;
		shakeTimer-=Time.deltaTime;
		yield;
	}
	shakeable=true;
}


var bounceTimer:float=0;
function BounceCooldown()
{
	while (bounceTimer>0)
	{
		//print ("bonceTime:" +bounceTimer +" bounceSpeed: "+ bounceSpeed);
	bounceTimer-=Time.deltaTime;
	yield;
	}
	
}





// function interpolates current object toward a desired Z speed -OBSOLUTE
function ZSpeedMatch( desired :float)
{
	var maxstep = (on ? (autoWalk.accel*((bonus.boostTime>0)?5:1)) : autoWalk.brakes) * Time.deltaTime;
	if( maxstep <= 0.0 )
	{
		ridge.velocity.z = desired;
	}
	else
	{
		var deltaSpeed:float = desired - ridge.velocity.z;
		if( Mathf.Abs( deltaSpeed ) < maxstep )
		{
			ridge.velocity.z = desired;
		}
		else
		{
			ridge.velocity.z += Mathf.Sign( deltaSpeed ) * maxstep;
		}
	}
	
}



//function to work out force needed to match desired z speed
var ZmatchForce:float;
var deltaSpeed:float;
var deltaV:Vector3;
var speedMatchForce:Vector3;
function ZSpeedMatchByForce(desired:float)
{
	var  lastFrame : float = ZmatchForce;
	//desired = Mathf.Clamp(desired,-autoWalk.wheelSpeed,autoWalk.wheelSpeed);
	deltaSpeed = desired - ridge.velocity.z;
	
	//deltaSpeed =Mathf.Clamp(deltaSpeed, -autoWalk.wheelSpeed/3,autoWalk.wheelSpeed/3);
	//if (on) ZmatchForce= (1+0.25*Mathf.Abs(tilt))*deltaSpeed*autoWalk.accel;
	if (on &&!passive) {
		
		//if(!hasDoubleWheels&&!hasQuadWheels&&(desired==0)) ZmatchForce= deltaSpeed*autoWalk.brakes;
		 ZmatchForce= deltaSpeed*autoWalk.accel;
		 if (Mathf.Sign (desired) == Mathf.Sign (ridge.velocity.z)) ZmatchForce*=0.55;
		 
		 if (!SwipeManager.Instance().Touching ) ZmatchForce  *= 0*Mathf.Abs(desired) / terminalVelocity;
	}
	else ZmatchForce= deltaSpeed*autoWalk.brakes;
	
	if(onPlatform) ZmatchForce*=2;
	if (hasIceBlock&&on) ZmatchForce*=7;
	
	ZmatchForce = Mathf.Lerp(lastFrame, ZmatchForce, 0.5);
	
	 if (airborne) 
	 {
	 	ZmatchForce *= 0.3;
	 	//MoveForce+= ridge.velocity.normalized * ZmatchForce;
	 	MoveForce += Vector3(0,0,ZmatchForce);
	 }
	 else MoveForce +=ZmatchForce * floorTangent.normalized;
	 
	// Debug.Log(ZmatchForce);
	
}

/*
function YSpeedMatchByForce(desired:float)
{
	
	deltaSpeed = desired - ridge.velocity.y;
	
	ZmatchForce= deltaSpeed*500*Time.deltaTime;
	
	
	//if(onPlatform) ZmatchForce*=2;
	
	 MoveForce += Vector3(0,ZmatchForce,0);
	 
	
}

function SpeedMatch(desired:Vector3)
{
	deltaV=desired - ridge.velocity;
	if (on) speedMatchForce= 5000*deltaV;
	
	
	MoveForce+=speedMatchForce;
	
}
*/



// counts the number of mount points that are currently occupied
function GetSaturatedMountPoints()
{
	var result : int = 0;
	
	for( var currGO:MountPoint in mounts )
	{var GoJunc:MountPoint =currGO.GetComponent(MountPoint);
		if( GoJunc.GetNode() != null ) result++;
	}
	
	return result;
}

var pausePos : Vector3;
var pauseRot : Quaternion;
var pauseVelo : Vector3;
var pauseAng : Vector3;
var paused : boolean =false;

function Pause()
{
	if (!ridge.isKinematic)
	{
	pausePos = transform.position;
	pauseRot = transform.rotation;
	pauseVelo = ridge.velocity;
	pauseAng = ridge.angularVelocity;
	ridge.velocity = Vector3.zero;
	ridge.angularVelocity= Vector3.zero;
	}
	paused = true;
}

function unPause()
{
	paused=false;
	if (!ridge.isKinematic)
	{
	ridge.velocity = pauseVelo;
	ridge.angularVelocity = pauseAng;
	}
	
}


//Functions for specific actions

function Celebrate(gatePos:Transform)
{
//saved =true;
PlayerPrefs.SetInt("SavedKobotos", PlayerPrefs.GetInt("SavedKobotos",0)+1);
var cOff : Vector3 =Vector3(0,0,-16);
if (cam.world ==2) cOff =Vector3(0,0,-60);
if (cam.world ==3) cOff =Vector3(0,0,-28);
	SetParent(gatePos.gameObject,cOff);
	trans.eulerAngles = Vector3(0,110,0);

	//ridge.isKinematic=true;
	
	if (sound) {sound.Kill();sound.celebrate.Play();}
	

	aniboxChild = GetComponentInChildren(Anibox);
	for (var ad:Addon in addonList) 

	if (ad)
	{
		 Destroy(ad.gameObject);
		 editor.components[ad.GetComponentIndex()].count ++ ;
	}
	

	


	
	if (aniboxChild)
	{
		animState=1;
		 aniboxChild.Celebrate();
	}
	
	
}
function IsSaved() {return saved;}

var drowning:boolean;

function Drown()
{
	PlayerPrefs.SetInt("DeadKobotos", PlayerPrefs.GetInt("DeadKobotos",0)+1);
	if (!ridge.isKinematic)
	
	{
	ridge.velocity = Vector3.zero;
	ridge.angularVelocity = Vector3.zero;
	}
	trans.eulerAngles = Vector3.zero;
	//sound.fall.Play();
	cam.SplashSound();
	drowning =true;
	yield WaitForSeconds(0.3);
	//sound.fall.Stop();
	man.Fail(trans);
	//dead=true;
}




function Kill()
{
	PlayerPrefs.SetInt("DeadKobotos", PlayerPrefs.GetInt("DeadKobotos",0)+1);
	//Pause();
	//sound.death.Play();
	cam.SplatSound();
	yield WaitForSeconds(0.5);
	//sound.death.Stop();
	man.Fail(trans);
	//dead=true;
}

function Excite()
{
	excited = true;
	var disable:boolean=false;
	var ExciteTimer : float =excitedTime;
	while (ExciteTimer >0)
	{
		 ExciteTimer -= Time.deltaTime;
		if (!airborne) {disable = true;}
		yield;
	}
	if (!disable) sound.PlayWhoop();
	yield WaitForSeconds(6);
	excited =false;
	
}


/*
function OnGUI()
{
	//GUI.Label( Rect( 100, 300, 50, 20 ), ("speed "+ridge.velocity.z), "Box" );
}
*/






function AutoCreateAddon(GO:GameObject, lock:boolean)
{
	var mirror:boolean=false;
	var obj:GameObject = Instantiate(GO);
	var ad:Addon=obj.GetComponent(Addon);
	
	if( ad.MirrorSide().x != 1 || ad.MirrorSide().y != 1 || ad.MirrorSide().z != 1 ) {mirror=true;
	var objMirror:GameObject =Instantiate(GO);
	var adMirror:Addon=objMirror.GetComponent(Addon);}
	
	var adType:String =ad.GetHostTypes();
	var i:int=0;
	for (var mpObj:GameObject in mounts)
	{var mp:MountPoint= mpObj.GetComponent(MountPoint);
		if((mp.GetMountType() == adType))
		{
			if(mountDefs[i].mirror == -1){
			obj.transform.position = transform.position+mountDefs[i].position;
			obj.transform.rotation=Quaternion.Euler( mountDefs[i].rotation);
			ad.SetHostMountPoint(mp);
			}
			
			if((mirror) &&(mountDefs[i].mirror == 0))
			{
			objMirror.transform.position = transform.position+mountDefs[i].position;
			objMirror.transform.rotation= transform.rotation;
			objMirror.transform.localScale=ad.MirrorSide();
			adMirror.SetHostMountPoint(mp);
			
			}
		}
		i++;
	}
	var admp:MountPoint =ad.GetHostMountPoint();
	/*if (mirror)
	{
		var adMirrmp:MountPoint =adMirror.GetHostMountPoint();
		admp.SetMirrorChild(adMirrmp);
		adMirrmp.SetMirror(admp);
		
		admp.SetNode(obj);
		adMirrmp.SetNode(objMirror);
	}
	*/
	
	if (lock)
	{
		admp.Lock();
		//if (mirror) adMirrmp.Lock();
	}
	
	return obj;
	
}

function OnCollisionEnter(col:Collision)
{
	
	if (jParent&&!saved)
	{
		if (col.gameObject.layer == 8 && col.gameObject != jParent)  //collided with terrain
		{
			

			//print("thwack!! hit: "+col.gameObject.name);
			 
			SetParent(null, Vector3.zero);
			ridge.velocity=Vector3.zero;
			if (hasMagnet) DisableMagnet(0.8);
			
		}
		
	}
	
}

function DisableMagnet(t:float)  //turnsoffmagnet for t seconds
{
	print("disabling magnet");
	hasMagnet=false;
	yield WaitForSeconds(t);
	hasMagnet=true;
}

@script RequireComponent(RigLocker)
@script RequireComponent(Rigidbody)
//@script RequireComponent(BoxCollider)