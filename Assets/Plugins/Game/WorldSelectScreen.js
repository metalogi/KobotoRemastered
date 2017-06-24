var gen : GenericFunctions;
var scrollSpeed : float =0.8;
var snapSpeed : float =0.5;
var moving : boolean;
var buttonChanged : boolean;
var targetZ : float;
var targetButton : int;
var buttonsEnabled : boolean =false;

var worldLoaders : WorldLoader[];

var arrowLeft : GenericButton;
var arrowRight : GenericButton;

var worldNo : int;

 var separation : float =300;
 
 var aud:AudioSource;
 var unlockingWorld : boolean =false;
 var arrowSound : AudioSource;
 var wSound : AudioSource;
 
function Awake () {
	
	
	//print ("WorldsUnlocked=" + PlayerPrefs.GetInt("WorldsUnlocked",1));
	//PlayerPrefs.SetInt("GameComplete",0);
	//PlayerPrefs.SetInt("GameComplete",1);
	//PlayerPrefs.SetInt("WorldNumber", 3);
	//PlayerPrefs.SetInt("WorldsUnlocked",4);
	//PlayerPrefs.SetInt("LevelsCompleted", 63);
	//PlayerPrefs.GetInt("WorldNumber", 2);
	aud=GetComponent(AudioSource);
	aud.volume=PlayerPrefs.GetFloat("MusicVolume",0.5);
	
	arrowLeft = new GenericButton();
	arrowRight = new GenericButton();
	arrowLeft.SetTex("arrowLeft");
	arrowRight.SetTex("arrowRight");
	arrowLeft.SetRect2(0.1,0.5,0.1,0.2);
	arrowRight.SetRect2(0.9,0.5,0.1,0.2);
	
	gen = GetComponent(GenericFunctions);
	//targetZ =0;
	moving =false;
	worldNo = PlayerPrefs.GetInt("WorldNumber", 1);
	
	unlockingWorld= false;
	
	var worldNumber : int = PlayerPrefs.GetInt("WorldsUnlocked",1);
	
	//unlock previously unlockedWorlds
	for (var i:int =0; i<worldLoaders.length;i++)
	{
		if ((i+1)<worldNumber) 
		{
			print ("setting light intensity "+ i);
			worldLoaders[i].locked=false;
			worldLoaders[i].worldLight.intensity=0.45;
			if (worldLoaders[i].snowLight) 
			{
				print ("setting snow light intensity");
				worldLoaders[i].snowLight.intensity =worldLoaders[i].worldLight.intensity*4;
			}
		}
	}
	
	//see if we need to unlock a new world
	var lastLevelOfPreviousWorld : int = GetFinalLevelNumber(worldNumber);
	print (" lastLevl:" +lastLevelOfPreviousWorld);
	if((PlayerPrefs.GetInt("LevelsCompleted") ==lastLevelOfPreviousWorld)&& worldNumber>1 && PlayerPrefs.GetInt("GameComplete",0)!=1)
	{
		unlockingWorld=true;
		print("unlocking worldNumber " + worldNumber);
		UnlockWorld(worldNumber-1);
		
	}
	
	//unlock the world we are currently on
	if(PlayerPrefs.GetInt("LevelsCompleted") > lastLevelOfPreviousWorld )
	{
		worldLoaders[worldNumber-1].locked =false;
		worldLoaders[worldNumber-1].worldLight.intensity=0.45;
		if (worldLoaders[worldNumber-1].snowLight) worldLoaders[worldNumber-1].snowLight.intensity= 4*worldLoaders[worldNumber-1].worldLight.intensity;
	}
	
	if(!unlockingWorld)
	{
		
	targetButton = worldNo-1;
	targetZ =targetButton *separation;
	print ("z= " + targetZ);
	transform.position.z =targetZ;
	}
	
	
	ButtonCooldown(0.5);
}

function UnlockWorld(w :int)
{	
	print ("w= " +w);
	targetZ =(w-1) *separation;
	transform.position.z =targetZ;
	yield WaitForSeconds(1);
	targetButton = w;
	targetZ=separation*(w);
		worldLoaders[w].Unlock();
		unlockingWorld=false;
}
function GetFinalLevelNumber(wn:int)
{
	
	var worldDefs : WorldObjectDefs = new WorldObjectDefs();
	//numberOfLevels = new int[worldDefs.numberOfWorlds];
	var numberOfLevels : int[] =worldDefs.GetNumberOfLevels();
	var finalLevelNo : int =0;
	for (var i :int =0; i<wn;i++)
	{
		finalLevelNo += numberOfLevels[i];
	}
	print ("worldNumber: " + wn + "final Level: " + finalLevelNo);
	return finalLevelNo;
	
}

function ButtonCooldown(t:float)
{
	buttonsEnabled =false;
	yield WaitForSeconds(t);
	buttonsEnabled=true;
}

function Update () 
{	
		var touchInfo:Touch = gen.GetTouchInfo(0);
		
		/*
		//see if user is dragging finger on screenand move target accordingly
		if (gen.IsTouching())
		{
		moving=true;
		if ((touchInfo.phase == iPhoneTouchPhase.Moved)&&(iPhoneInput.touchCount==1))
			{	
				targetZ -= touchInfo.deltaPosition.x*Time.deltaTime*scrollSpeed;
				buttonsEnabled=false;
			}
			
		}
		else {moving = false;}
		
		
		if (touchInfo.phase == iPhoneTouchPhase.Ended)
		{
			buttonChanged=false;
			if (targetButton<2 && touchInfo.deltaPosition.x<-5) {targetButton++;buttonChanged=true;}
			if (targetButton>0 && touchInfo.deltaPosition.x>5) {targetButton--;buttonChanged=true;}
			if (buttonChanged) targetZ = targetButton*separation;
			else if (buttonsEnabled)
			{
				var buttonPressRay : RaycastHit;
				var tapRay : Ray =Camera.main.ScreenPointToRay (touchInfo.position);
				if (Physics.Raycast(tapRay, buttonPressRay, 400))
				{
					print("Hit " + tapRay);
					var worldLoader: WorldLoader = buttonPressRay.transform.GetComponent(WorldLoader);
					if (worldLoader) LoadW(worldLoader);
				}
			}
			buttonsEnabled=true;
		}
		
		
		if (!moving) //otherwise set target to nearest button
		{
			if (!buttonChanged) 
			{
			targetZ=separation*Mathf.Floor((targetZ+separation)/separation);
			targetZ = Mathf.Clamp(targetZ, 0, separation*2);
			}
		}
		
		*/
		
		if (touchInfo.phase == TouchPhase.Ended)
		{
		if (buttonsEnabled)
			{
				var buttonPressRay : RaycastHit;
				var tapRay : Ray =Camera.main.ScreenPointToRay (touchInfo.position);
				if (Physics.Raycast(tapRay, buttonPressRay, 400))
				{
					print("Hit " + tapRay);
					var worldLoader: WorldLoader = buttonPressRay.transform.GetComponent(WorldLoader);
					if (worldLoader&&!worldLoader.locked) LoadW(worldLoader);
				
					var trophy : TrophyLoader = buttonPressRay.transform.GetComponent(TrophyLoader);
					if (trophy) {trophy.Load(); LoadTrophyRoom();}
		
				}
			}
			buttonsEnabled=true;
		}
			
	if (gen.TouchUpdate(arrowLeft.baseRect) && targetButton>0) GoLeft();
	if (gen.TouchUpdate(arrowRight.baseRect) && targetButton<3) GoRight();
	
	if (!unlockingWorld) targetZ = targetButton*separation;
		
		//move camera towards target
		//if (Mathf.Abs(transform.position.z - targetZ) <30) moving = false;
		transform.position = Vector3.Lerp(transform.position, Vector3(400,0,targetZ), snapSpeed*Time.deltaTime);
		
		
}

function GoLeft()
{
	arrowSound.Play();
	buttonsEnabled=false;
	arrowLeft.Press(); 
	yield WaitForSeconds(0.04);
	arrowLeft.Unpress();
	yield WaitForSeconds(0.08);
	targetButton--;
	
}

function GoRight()
{
	arrowSound.Play();
	buttonsEnabled=false;
	arrowRight.Press(); 
	yield WaitForSeconds(0.04);
	arrowRight.Unpress();
	yield WaitForSeconds(0.08);
	targetButton++;
}

function LoadTrophyRoom()
{
	yield WaitForSeconds(0.6);
	loading=true;
	Application.LoadLevel("trophyRoom");
}
function LoadW(worl : WorldLoader)
{
	//yield WaitForSeconds(2);
	wSound.Play();
	worl.LoadWorld();
	yield WaitForSeconds(0.6);
	loading=true;
	PlayerPrefs.SetInt("WorldNumber", targetButton+1);

	yield WaitForSeconds(0.1);
	
	
}

var loading : boolean =false;

function OnGUI()
{
	if (targetButton>0) arrowLeft.Show(0);
	if (targetButton<3) arrowRight.Show(0);
	if (loading) GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), Resources.Load("loading"));
}