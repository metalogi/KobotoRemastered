var found : boolean;

var reset : boolean=false;
var demo : boolean=false;
var identifier : int;
var saveName : String;
var defaultMat : Material;
var foundMat : Material;
var fadeMat : Material;
var freshlyFound : boolean =false;
private var sound : AudioSource;
private var simManager: SimManager;
private var cam : CameraManager;

var triggerTut:boolean=false;
var tut : Tutorial2;
function Start()
{
	freshlyFound=false;
	simManager = FindObjectOfType(SimManager);
	cam = Camera.main.GetComponent(CameraManager);
	sound = GetComponent(AudioSource);
	saveName = Application.loadedLevel + "_bonus_" + identifier;
	if (PlayerPrefs.GetInt(saveName, 0) == 1) found =true;
	else found =false;
	
	if (reset) {found = false;PlayerPrefs.SetInt(saveName, 0);}
	if (demo) found=false;
	if (found) GetComponent.<Renderer>().material = foundMat;
	else
	{
	GetComponent.<Renderer>().enabled = true;
	GetComponent.<Renderer>().material = defaultMat;
	}
	if (triggerTut) tut=FindObjectOfType(Tutorial2);
	//simManager.BonusTokenManager();
	//BonusStarManager();
}

function OnTriggerEnter (col:Collider) {
	if (!found&&col.GetComponent(Juncore))
	{
		Fade();
	found=true;
	freshlyFound=true;
	//PlayerPrefs.SetInt(saveName, 1);
	if (triggerTut) tut.PlayTutorial(4);
	//BonusStarManager();
	GetComponent.<Animation>().Play();
	sound.Play();
	
	}
}

function ResetMe()
{
	Start();
}
/*
function BonusStarManager()
{
	var foundCount : int = 0;
	
	var bonusStarCountKey : String = Application.loadedLevel + "_BonusStarCount";
	var bonusStarsFoundKey : String = Application.loadedLevel + "_BonusStarsFound";
	var levelPlayedKey : String = Application.loadedLevel + "_LevelPlayed";
	 
	var bonusStars : Array = FindObjectsOfType(Bonus);
	var bonusStarCount =bonusStars.length;
	PlayerPrefs.SetInt(bonusStarCountKey, bonusStarCount);
	
	for (var bs:Bonus in bonusStars) if (bs.found) foundCount++;
	
	PlayerPrefs.SetInt(bonusStarsFoundKey, foundCount);
	PlayerPrefs.SetInt(levelPlayedKey, 1);
	
	//print ("foundCount =" + foundCount);
	  
}
*/

function Celebrate(trans : Transform, i : int)
{
	yield WaitForSeconds(i*1.3);
	transform.parent.parent = trans;
	transform.parent.localPosition = Vector3.zero;
	var cOff : Vector3 =Vector3(0,0,-60);
if (cam.world ==2) cOff =Vector3(0,0,-90);
if (cam.world ==3) cOff =Vector3(0,0,-90);
	transform.parent.position += Vector3(-20,0,16*i) + cOff;
	GetComponent.<Renderer>().material = defaultMat;
	GetComponent.<Animation>().wrapMode = WrapMode.Loop;
	GetComponent.<Animation>().Play();
}


var timer : float;
var fadeTime:float=1; 
function Fade()
{
	print ("switching material");
	GetComponent.<Renderer>().sharedMaterial = fadeMat;
	timer  =fadeTime;
	//var mat : Material = renderer.material;
	while (timer >0)
	{
		//print (timer);
		fadeMat.color.a =(timer+0.3)/(fadeTime+0.3);
		timer -=Time.deltaTime;
		yield;
	}
	GetComponent.<Renderer>().sharedMaterial = foundMat;
}