var roll: AudioSource;
var impact : AudioSource;
var fall : AudioSource;


var excited : AudioSource;
var celebrate : AudioSource;
var death : AudioSource;

var whoop : AudioSource[];

var springBoing : AudioSource;

var springVolume : float =1;

var rollVolume : float=1;
var impactVolume : float =1;

//private var ridge : Rigidbody;

private var minColSpeed = 30;
private var maxColSpeed = 230;

function StartRoll () {roll.volume=0;roll.Play();}
function StopRoll () 
{	FadeOutRoll();
	roll.Stop();
	}

function FadeOutRoll()
{
	while (roll.volume > 0.01)
	{
		//print("rollVolume:" + roll.volume);
		roll.volume *= (1-2*Time.deltaTime);
		yield;
	}
	roll.volume=0;
}

function OnCollisionEnter(col:Collision)
{
	var colSpeed : float = col.relativeVelocity.magnitude;
	//print ("colSpeed=" + colSpeed);
	if (colSpeed >minColSpeed) 
	{
		var contact : ContactPoint = col.contacts[0];
		var colAngle : float = Vector3.Angle(contact.normal, col.relativeVelocity);
		colAngle = Mathf.Abs(colAngle);
		colAngle = (90-Mathf.Clamp(colAngle,0,90)) / 90;
		if (colAngle >0.25)
		{
		impact.volume = colAngle*Mathf.Lerp(0,1,(colSpeed-minColSpeed)/(maxColSpeed-minColSpeed));
		//print ("impactVolume: " + impact.volume);
		impact.Play();
		}
	}
	if (col.gameObject.layer==8)
	{
	for (var w:AudioSource in whoop) if (w.isPlaying) w.Stop();
	if (death.isPlaying) death.Stop();
	if (fall.isPlaying) fall.Stop();
	}
	
}


function Awake()
{
	
	//springBoing.maxVolume =Mathf.Clamp(springVolume,0,1);
	springBoing.volume =Mathf.Clamp(springVolume,0,1);
	//roll.maxVolume = Mathf.Clamp(rollVolume,0,1);
	//impact.maxVolume= Mathf.Clamp(impactVolume,0,1);
	impact.volume=Mathf.Clamp(impactVolume,0,1);
	roll.volume =1;
	for (var w:AudioSource in whoop) w.volume =0.3;
	fall.volume=0.3;
	
	//ridge = GetComponent(Rigidbody);
	
}

function PlayWhoop()
{
	var playing:boolean =false;
	for (var w:AudioSource in whoop) if (w.isPlaying) {playing =true;break;}
	var i:int = Mathf.Floor(Random.value *whoop.length);
	if (!playing) whoop[i].Play();
}

function Kill()
{
	for (var aud:AudioSource in GetComponentsInChildren(AudioSource))
	if (aud.name != "celebrate") aud.Stop();	
}


