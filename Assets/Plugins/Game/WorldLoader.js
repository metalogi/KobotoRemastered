var WorldNumber:int;
var anim: Animation;
var snowGlobe : SnowGlobe;
//var lock : WorldLock;

var worldLight : Light;
var snowLight : Light;

var maxLightIntensity : float =0.45;

var locked : boolean =true;
var wss : WorldSelectScreen;
var aud : AudioSource;

function LoadWorld () {
	if (!locked)
	{
	if (snowGlobe) snowGlobe.Shake(15,0.5);
	anim.Play();
	yield WaitForSeconds(1.1);
	print ("loading");
	PlayerPrefs.SetInt("WorldNumber", WorldNumber);
		var musicFadeTime: float =0.5;
	var timer : float = musicFadeTime;
	var startVol : float = aud.volume; 
		while (timer>0)
		{
			timer-= Time.deltaTime;
			aud.volume = Mathf.Lerp(0,startVol,timer/musicFadeTime);
			
			yield;
		}
	Application.LoadLevel(WorldNumber+2);
	}
}

function Awake()
{
	aud = GetComponent.<Camera>().main.GetComponent(AudioSource);
	
	
	
}

function Unlock()
{
	print ("unlocking world"+ WorldNumber);
	var lightTime:float=4;
	var timer:float=0;
	while(timer<lightTime)
	{
		worldLight.intensity =Mathf.Lerp(0,maxLightIntensity, timer/lightTime);
		if (snowLight) snowLight.intensity = worldLight.intensity*4;
		timer += Time.deltaTime;
		yield;
	}
	locked= false;
}

#if (UNITY_EDITOR)
function OnMouseDown()
{
    LoadWorld();
}
#endif