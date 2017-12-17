@script RequireComponent (GenericFunctions)

private var gen : GenericFunctions;
var aud : AudioSource;
var logo:Texture2D;
var logo_iPad:Texture2D;

var mask:Texture2D;

var splash:Texture2D;
var splash_iPad:Texture2D;

var newGame:Texture2D;
var continueT:Texture2D;

var buttonStyle:GUIStyle;
var screenStyle:GUIStyle;

var iPad : boolean =false;
var threeD : boolean =false;

//var continueRect:Rect;
//var continueRectTouch:Rect;

var startButton : GenericButton;
var FullScreenRect:Rect;
var newGameRect:Rect;
var unlockAllRect:Rect;

var logoFadeIn:float =1;
var logoHold:float=4;
var logoFadeOut:float =1;
var splashFadeIn:float=2;
var startButtonWait:float=1;
var startButtonEnabled:boolean =false;

var facebookLogo : Texture2D;
var twitterLogo : Texture2D;
var facebookRect : Rect;
var twitterRect : Rect;
var sound : Texture2D;
var soundOff : Texture2D;
var soundToggleRect : Rect;
var soundOn : boolean;

var splashBackground : GameObject;
private var splashBackgroundMat : Material;

var cloudMat : Material;

private var content:Texture2D;

private var opacity:float;
var state:int=0; //0-logo Fadein, 1-logo, 2-logo Fade out, 3-splash fade in, 4-splash, 5-loading menu

function Start()
{
	gen=GetComponent(GenericFunctions);
	//PlayerPrefs.DeleteKey("WorldsUnlocked");
	//PlayerPrefs.SetInt("LevelsCompleted", 28);
	if (!PlayerPrefs.HasKey("WorldsUnlocked")) gen.ResetPlayerPrefs();
	Screen.orientation = ScreenOrientation.LandscapeLeft;
	//  iPhoneKeyboard.autorotateToPortrait = false; 
  // iPhoneKeyboard.autorotateToPortraitUpsideDown = false; 
   //iPhoneKeyboard.autorotateToLandscapeLeft = false; 
  // iPhoneKeyboard.autorotateToLandscapeRight = false;
   
   
   aud.volume = PlayerPrefs.GetFloat("MusicVolume" , 0.5);
   
   
   
}

function Awake()
{
	soundOn=PlayerPrefs.GetFloat("GlobalVolume") == 1;
	if (!threeD) GetComponent.<Camera>().main.farClipPlane =5;
	splashBackgroundMat = splashBackground.GetComponent.<Renderer>().material;
	splashBackgroundMat.color.a=0;
	cloudMat.color.a=0;
	PlayerPrefs.SetInt("CheatMode", 0);
	//if (PlayerPrefs.GetInt("WorldsUnlocked")<1) PlayerPrefs.SetInt("WorldsUnlocked",1);
	//if (PlayerPrefs.GetInt("LevelsCompleted")<6) PlayerPrefs.SetInt("LevelsCompleted", 6);
	
	//ResetPlayerPrefs();

FullScreenRect = Rect(0,0,Screen.width,Screen.height);

if (Screen.width == 1024)
{
iPad = true;
splash = splash_iPad;
logo =logo_iPad;

}
	
	startButton = new GenericButton();
	startButton.tex= continueT;
	startButton.SetRect2(0.5,0.55,0.27,0.2);
	

	newGameRect=Rect( 0.8*Screen.width, 0, 0.2*Screen.width, 0.2*Screen.height );
	//continueRect=Rect( 0.36*Screen.width, 0.48*Screen.height, 0.3*Screen.width, 0.125*Screen.width  );
	//continueRectTouch=Rect( 0.25*Screen.width, 0.5*Screen.height, 0.5*Screen.width, 0.25*Screen.width  );
	unlockAllRect=Rect(0, 0,0.2*Screen.width, 0.2*Screen.height);
	
	facebookRect=Rect(0.8*Screen.width, 0.86*Screen.height, 0.07*Screen.width, 0.07*Screen.width);
	twitterRect=Rect(0.9*Screen.width, 0.86*Screen.height, 0.07*Screen.width, 0.07*Screen.width);
	soundToggleRect =Rect(0.65*Screen.width, 0.86*Screen.height, 0.07*Screen.width, 0.07*Screen.width);
	state=0;
}

function StartGame()
{
	
	//continueRect=Rect(continueRect.x-continueRect.width*0.05,continueRect.y-continueRect.width*0.05, continueRect.width*1.1, continueRect.height*1.1);
	startButton.Press();
	yield WaitForSeconds(0.04);
	startButton.Unpress();
	//continueRect=Rect(continueRect.x,continueRect.y, continueRect.width*0.909, continueRect.height*0.909);
	var musicFadeTime: float =0.5;
	var timer : float = musicFadeTime;
	var startVol : float = aud.volume; 
		while (timer>0)
		{
			timer-= Time.deltaTime;
			aud.volume = Mathf.Lerp(0,startVol,timer/musicFadeTime);
			
			yield;
		}
	Application.LoadLevel("worldSelectScreen");
}

/*
function ResetPlayerPrefs()
{
	
	Debug.Log ("wiping saveData");
	PlayerPrefs.SetInt("WorldNumber",1);
	PlayerPrefs.SetInt("WorldsUnlocked",1);
	PlayerPrefs.SetInt("LevelsCompleted", 6);
	PlayerPrefs.SetFloat("MenuCamZ", -32 );
	PlayerPrefs.SetFloat("MenuCamY", -4 );
	PlayerPrefs.SetFloat("MenuFocusZ", -32 );
	PlayerPrefs.SetFloat("MenuFocusY", -4 );
	//PlayerPrefs.SetFloat("TiltSensitivity", 4);
	gen.SetTiltSensitivity(0.5);
	PlayerPrefs.SetFloat("MusicVolume", 0.5);
	PlayerPrefs.SetFloat("GlobalVolume",1);
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
*/





function Update()
{
	if (state==0) SplashScreen();
	if ((state==4) &&(startButtonEnabled))
	{
		if(gen.TouchUpdate(startButton.baseRect))
			StartGame();
		
		if(gen.TouchUpdate(newGameRect))
			{gen.ResetPlayerPrefs();StartGame();}
			
		if(gen.TouchUpdate(unlockAllRect))
			{PlayerPrefs.SetInt("CheatMode", 100);
			PlayerPrefs.SetInt("LevelsCompleted", 100);
			PlayerPrefs.SetInt("WorldsUnlocked",3);
			StartGame();}
			
		if(gen.TouchUpdate(facebookRect))
			{
				print("facebook");
				Application.OpenURL("http://www.facebook.com/");
			}
		if(gen.TouchUpdate(twitterRect))
		{
			print("twitter");
			Application.OpenURL("https://twitter.com/Kubrikgame/");
		}
		if (gen.TouchUpdate(soundToggleRect)) 
		{
			soundOn=PlayerPrefs.GetFloat("GlobalVolume") == 0;
			gen.GlobalSoundToggle();
			
		}
	}

	
}
function SplashScreen()
{
	content=logo;
	yield FadeIn(logoFadeIn);
	state=1;
	yield ShowLogo();
	state=2;
	yield FadeOut(logoFadeOut);
	if (!threeD) GetComponent.<Camera>().main.farClipPlane =100;
	state=3;
	if (!threeD) content=splash;
	yield FadeInSplash(splashFadeIn);
	state=4;
	yield WaitForSeconds(startButtonWait);
	startButtonEnabled=true;
}



function ShowLogo()
{
	var timer:float=0;
	while (timer<logoHold)
	{
		timer+=Time.deltaTime;
		yield;
	}
	
	
}
function FadeIn(t:float)
{
	var timer:float=0;
	while (timer<t)
	{
		timer+=Time.deltaTime;
		opacity=(timer/t);
		//print("opacity=" +opacity);
		yield;
	}
	
	
}

function FadeInSplash(t:float)
{
	var timer:float=0;
	while (timer<t)
	{
		timer+=Time.deltaTime;
		opacity=(timer/t);
		splashBackgroundMat.color.a =opacity;
		cloudMat.color.a =opacity;
		//print("opacity=" +opacity);
		yield;
	}
	
	
}

function FadeOut(t:float)
{
	var timer:float=t;
	while (timer>0)
	{
		timer-=Time.deltaTime;
		opacity=(timer/t);
		//print("opacity=" +opacity);
		yield;
	}
	
	
}


function OnGUI()
{
	
	switch (state)
	{
		
		case 1:
		GUI.color = Color.white;
		//GUI.Box( FullScreenRect,  GUIContent(logo), screenStyle);
		//GUI.DrawTexture(FullScreenRect, logo,  ScaleMode.ScaleToFit,true, Screen.height/Screen.width);
		GUI.DrawTexture(FullScreenRect,logo);
		break;
		
		case 4:
		GUI.color = Color.white;
		//GUI.Box( FullScreenRect,  GUIContent(splash), screenStyle);
		if (!threeD) GUI.DrawTexture(FullScreenRect,splash);

		if (startButtonEnabled) 
		{
			//GUI.Box(newGameRect, newGame, buttonStyle);
			//GUI.Box(startButton.baseRect, continueT, buttonStyle);
			startButton.Show(0);
			GUI.Box( facebookRect, GUIContent(facebookLogo), buttonStyle);
			GUI.Box( twitterRect, GUIContent(twitterLogo), buttonStyle);
			GUI.Box( soundToggleRect, GUIContent(sound), buttonStyle);
			if (!soundOn) GUI.Box( soundToggleRect, GUIContent(soundOff), buttonStyle);
			
		}
		
		break;
		
		default:
		GUI.color = Color(1,1,1,opacity);
		//GUI.Box( FullScreenRect,  GUIContent(content), screenStyle);
		//GUI.DrawTexture(FullScreenRect, content,  ScaleMode.StretchToFill,true,  Screen.height/Screen.width);
		GUI.DrawTexture(FullScreenRect, content);
		break;
	}
	
	
		
		
}