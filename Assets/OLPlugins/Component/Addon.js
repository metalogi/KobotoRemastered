// this class handles code for the component addons you can attach to a koboto
var disabled =false;
class AddonConfig
{
	var ProperName : String;
	var tex : Texture2D;
	var desc : String;
	var desc2 : String;
	var desc3 : String;
	var fingerAvoidance:Vector3;
} var cfg : AddonConfig;
function GetProperName() { return cfg.ProperName; }


var disposable : boolean =false; //this tool is used once and discarded

var defaultMaterial : Material;

var muscleName : String;
private var muscle;
function GetMuscle() { return muscle; }
function GetTexture() { return cfg.tex; }
function GetFingerAvoidance(){return cfg.fingerAvoidance;}

var wheels : boolean;
var wheelObjects : GameObject[];

function GetDescription()
{
	return (cfg.desc + cfg.desc2 + cfg.desc3);
}

function Awake()
{
	// convert the string muscleName into a direct object reference
	muscle = GetComponent(muscleName);
	
	
}

// changes the visual material for when you highlight on a component
function ChangeMaterial( mat : Material )
{
	var mrs = GetComponentsInChildren( MeshRenderer );
	for( var mr:MeshRenderer in mrs )
	{
		mr.material.color.a=0.5;
		//if( mat == null ) mr.material = defaultMaterial;
		//else if( mat != mr.material ) mr.material = mat;
	}
}

function SetOpacity(opac:float)
{
	var mrs = GetComponentsInChildren( MeshRenderer );
	for( var mr:MeshRenderer in mrs )
	{
		mr.material.color.a=opac;
	}
}

function Hide(boo:boolean)
{
	var mrs = GetComponentsInChildren( MeshRenderer );
	for( var mr:MeshRenderer in mrs )
	{
		mr.enabled=!boo;
	}
}
// sometimes addons come in pairs, like the wheels.  This vector defines which axis they mirror across
var mirrorSideVec = Vector3( 1, 1, 1 );
function MirrorSide() { return mirrorSideVec; }

// the hostMountPoint manipulates this addon physically and visually
private var hostMountPoint : MountPoint = null;
function SetHostMountPoint( Host : MountPoint ) 
{ 
	hostMountPoint = Host; 
	if( hostMountPoint ) transform.parent = hostMountPoint.gameObject.transform;
	else
	{
		transform.parent = null;
	}
}
function GetHostMountPoint() { return hostMountPoint; }

var hostMountType : String;
function GetHostTypes() { return hostMountType; }

// in the game the components are listed on the right side of the screen
// the component index is a temporary variable which indicates which of these
// slots the current addon occupies on this level
// this way when you drop a component, it knows which counter in increment
private var componentIndex = -1;
function SetComponentIndex( index : int ) { componentIndex = index; }
function GetComponentIndex() { return componentIndex; }

// figure out which koboto core this addon is parented to
function GetJunction()
{
	return GetHostMountPoint().GetHostJuncore();
}
