// the junction this mountpoint is attached to
private var hostJuncore : Juncore;
function GetHostJuncore() { return hostJuncore; }
function SetHostJuncore( Host : Juncore ) { hostJuncore = Host; }

// the addod which is mounted on this mountPoint
private var node : GameObject;
function GetNode() { return node; }
function SetNode( Node : GameObject ) { node = Node; }

// what type of mountPoint is this?
private var mountType : String;
function GetMountType() { return mountType; }
function SetMountType( Value : String ) { mountType = Value; }

var visObj : Transform;
var show : boolean;

// in the case of wheels, mountpoints work in pairs, one on the left and one on the right
// this next bit of code is fore synchronizing those two sides.
//
// at this point I think wheels should just be a single object stuck to both sides
// because all this mirroring business is messy.
//
// It's legacy from when initially we required you to individually place each wheel, which
// was in itself legacy from when I started this project and thought creature construction
// would be a fair degree more interesting that what we currently have.
//
// I'd fix all this if I had time.
var locked:boolean=false;
 function Lock(){locked=true;}
 function Unlock(){locked=false;}
 function IsLocked(){return locked;}
/*
 var mirror : MountPoint = null;
 var mirrorChild : MountPoint = null;

function GetMirror() { return mirror; }
function GetMirrorChild() { return mirrorChild; }
function SetMirrorChild( Value : MountPoint ) { mirrorChild = Value; }
function SetMirror( Value : MountPoint ) 
{
	if( mirror ) mirror.SetMirrorChild( null );
	mirror = Value; 
	if( mirror ) mirror.SetMirrorChild( this );
}
*/

function Awake()
{
	ShowMe(false);
}

function Update()
{
	if(show)
	{
		visObj.transform.localScale =  Vector3.one * (4 +0.5*Mathf.Sin(4*Time.time));
	}
}

function ShowMe(flag : boolean)
{
	show =flag;
	visObj.GetComponent.<Renderer>().enabled=flag;
}


