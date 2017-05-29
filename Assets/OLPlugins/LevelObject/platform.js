private var oldpos:Vector3;
private var deltaP:Vector3;
private var osc:Oscillator;

var guessVelocity:boolean =true;
var movePosition:boolean=false;
var friction:float=0; 
var lockY:boolean =false;

var autoSound : boolean =false;
var sound : AudioSource;
var autoSoundVol : float;
private var autoSoundBasePitch:float;
var autoSoundPitchMod : float =0;


function FixedUpdate () {
	if(guessVelocity)
	{
	deltaP= transform.position-oldpos;	
	oldpos=transform.position;
	velo= deltaP/Time.deltaTime;
	}
	if (movePosition)
	GetComponent.<Rigidbody>().MovePosition(transform.position);
	
	if (autoSound)
	{
		sound.volume = velo.magnitude * autoSoundVol;
		if (autoSoundPitchMod)
		sound.pitch =  autoSoundBasePitch +velo.magnitude *autoSoundPitchMod;
	}
	
}


var velo:Vector3;
function GetVelocity()
{
	
	if(guessVelocity) velo= deltaP/Time.deltaTime;
	//if(osc) velo=osc.GetVelocity();
	return velo;
}

function Awake()
{
	if (guessVelocity)
	{
		oldpos=transform.position;
		velo =Vector3.zero;
	}
	if (autoSound) 
	{
		
		sound = GetComponent(AudioSource);
		sound.volume=0;
		sound.Play();
		autoSoundBasePitch=sound.pitch;
	}
	osc =GetComponent(Oscillator);
	//if (osc) guessVelocity=false;
}

function GetFriction()
{
	return friction;
}

/*
function OnCollisionEnter(coll: Collision)
{
	var colJunc:Juncore =coll.gameObject.GetComponent(Juncore);
	if(colJunc)
	{
		colJunc.SetPVelocity(GetVelocity(),true);
	}
}

function OnCollisionExit(coll: Collision)
{
	var colJunc:Juncore =coll.gameObject.GetComponent(Juncore);
	if(colJunc)
	{
		colJunc.SetPVelocity(GetVelocity(),true);
	}
}

function OnCollisionStay(coll: Collision)
{
	var colJunc:Juncore =coll.gameObject.GetComponent(Juncore);
	if((colJunc))
	{
		colJunc.SetPVelocity(GetVelocity(),true);
	}
}
*/
