private var line : LineRenderer;
private var sound : AudioSource;

var on : boolean;
var coupled : boolean;

function Awake () {
	line = GetComponent(LineRenderer);
	sound =GetComponent(AudioSource);
	on =false;
	coupled = false;	
}

function Activate()
{
	on = true;
	line.enabled =true;
	if (!sound.isPlaying) sound.Play();
	sound.volume=0.6;
	sound.pitch=1;
	line.SetWidth(3,3);
}

function Deactivate()
{
	
	on=false;
	coupled=false;
	line.enabled = false;
	//sound.Stop();
	sound.volume=0;
}

function SetBeamEnds(start:Vector3, end:Vector3)
{
	line.SetPosition(0,start);
	line.SetPosition(1,end);
	
}

function Couple()
{
	print("coupling");
	line.SetWidth(12,12);
	on=false;
	coupled = true;
	line.enabled =true;
	if (!sound.isPlaying) sound.Play();
	sound.volume=0.15;
	sound.pitch=1.25;
}

function Decouple()
{
	print("decoupling");
	on=true;
	coupled = false;
	line.SetWidth(3,3);
	//if (!sound.isPlaying) sound.Play();
	sound.volume=0.6;
	sound.pitch=1;
}

