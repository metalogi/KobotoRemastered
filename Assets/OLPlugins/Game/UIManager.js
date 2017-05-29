var testTex : Texture2D;

var LevelMessage : String;
var MessageSize = 0;
var gameMode:int=0;
var debug:boolean =false;
var messageDisplayTime= 0;
var tutorial:Tutorial2;
var tiltToggle:boolean;
var tiltBar:boolean =false;
var tiltBox:Rect;
var musicVol:float;
var tiltSens : float;
var sliderStyle:GUIStyle;
var thumbStyle:GUIStyle;
var screenTintStyle:GUIStyle;
var screenTint:Texture2D;
var tintOpacity:float;
var tintOpacityTarget:float;
var highlightPlay =false;
var numberOfGuys : int;
private var sim : SimManager;
private var cam : CameraManager;
private var gen : GenericFunctions;

private var editor : UIEditor;

private var completeSavor=0.0;
// rectangle ranges for the start/stop and quit buttons
/*class ButtonRect 
{
	var baseRect : Rect;
	var tempRect : Rect;
	function Press()
	{
	 tempRect  = baseRect;
	baseRect=Rect(baseRect.x,baseRect.y, baseRect.width*1.2, baseRect.height*1.2);
	}


	function Unpress()
	{
	baseRect=tempRect;
	}
	
	function TestF()
	{
		print ("qqqqqqqqqq");
	}
	
}
*/

 var PauseButton:GenericButton; 
var FullRect:GenericButton;
var EditRect:GenericButton;
var menuRect:GenericButton;
var nextRect:GenericButton;
 var centerRect:GenericButton;
 var tiltToggleRect:GenericButton;
var debugToggleRect:GenericButton;
 var winRect:GenericButton;
  var volumeSliderRect:GenericButton;
   var tiltSensRect:GenericButton;
 var toolDescriptionRect : GenericButton;
var leftMenuRect : GenericButton;
var middleMenuRect : GenericButton;
 var rightMenuRect :GenericButton;
 var cameraButton : GenericButton;
 var lookButtonFlash = false;

var playButtonEnabled:boolean=true;
var editEnabled:boolean=true;
var MountPointVis : Transform;
var winCheat : boolean;
private var paused:boolean;

var kubrikSkin : GUISkin;
var editIcon : Texture2D;

var nextTex : Texture2D;
var menuTex : Texture2D;
var quitTex : Texture2D;
var continueTex : Texture2D;


var retryTex : Texture2D;
var goalTex : Texture2D;
var failTex : Texture2D;

var buttonTest : GenericButton;

var sound : Texture2D;
var soundOff : Texture2D;
var soundToggleRect : Rect;
var soundOn : boolean;

var kBox : GUIStyle;
var kLabel : GUIStyle;
var kText : GUIStyle;
var kText2 : GUIStyle;
var whiteText : GUIStyle;
var whiteTextLarge : GUIStyle;

/*
function Awake()
{
	//ratingQuery=true;
	if (Screen.width > 480) 
	kubrikSkin = Resources.Load("kubrikGUISkin_ipad");
	else kubrikSkin = Resources.Load("kubrikGUISkin");
	
	kBox = kubrikSkin.GetStyle("Box");
	kText =kubrikSkin.GetStyle("textarea");
	kText2 =kubrikSkin.GetStyle("text");
	kLabel = kubrikSkin.GetStyle("label");
	whiteText =kubrikSkin.GetStyle("whiteText");
	whiteTextLarge =kubrikSkin.GetStyle("whiteTextLarge");
	soundOn=PlayerPrefs.GetFloat("GlobalVolume") == 1;
   sound =Resources.Load("sound");
   soundOff = Resources.Load("soundNO");
	winCheat  =true;
	
	//editIcon=Resources.Load("edit_icon");
	nextTex=Resources.Load("next");
	menuTex=Resources.Load("menubotton");
	quitTex=Resources.Load("quit");
	loadingScreen=Resources.Load("loading");
	continueTex=Resources.Load("continue");
	
	retryTex=Resources.Load("retry");
	goalTex=Resources.Load("goal");
	failTex=Resources.Load("fail");
	
	highlightPlay=false;
	tintOpacity=0;
	//screenTint = Resources.Load("screenTint");
	// establish ref links to other modules
	sim = GetComponent(SimManager);
	gen = GetComponent(GenericFunctions);
	cam = gen.GetCameraObject().GetComponent(CameraManager);
	tutorial =GetComponent(Tutorial2);
	editor = GetComponent(UIEditor);
	
	var hudObject : GameObject = Instantiate(Resources.Load("HUDprefab")) as GameObject;
	
	musicVol=PlayerPrefs.GetFloat("MusicVolume",0.5);
	tiltSens=PlayerPrefs.GetFloat("TiltSensitivity", 0.65);
	gen.SetTiltSensitivity(tiltSens);
	tiltBar=gen.tiltBarActive();
	tiltToggle=!tiltBar;
	//setup Rects
	
		PauseButton =new GenericButton();
	FullRect =new GenericButton();
	EditRect=new GenericButton();
	menuRect=new GenericButton();
	nextRect=new GenericButton();
	leftMenuRect =new GenericButton();
	middleMenuRect=new GenericButton();
	rightMenuRect=new GenericButton();	
	cameraButton = new GenericButton();
	
	PauseButton.SetRect2(0.035,0.93,0.05,0.08);
	PauseButton.SetTex("exit_icon");
	//QuitRect.baseRect = Rect( 0.01*Screen.width, 0.9*Screen.height, 64, 32 );
	FullRect.baseRect = Rect( 0.45*Screen.width, 0.03*Screen.height, 48, 48 );
	EditRect.baseRect = FullRect.baseRect;
	menuRect.baseRect= Rect(0.175*Screen.width, 0.75*Screen.height, 0.25*Screen.width,0.2*Screen.height);
	nextRect.baseRect= Rect( 0.575*Screen.width,0.75*Screen.height, 0.25*Screen.width,0.2*Screen.height);
	leftMenuRect.baseRect = Rect(0.1*Screen.width, 0.75*Screen.height, 0.2*Screen.width, 0.2*Screen.width);
	middleMenuRect.baseRect= Rect(0.4*Screen.width, 0.75*Screen.height, 0.2*Screen.width, 0.2*Screen.width);
	rightMenuRect.baseRect= Rect(0.7*Screen.width, 0.75*Screen.height, 0.2*Screen.width, 0.2*Screen.width);
	
	cameraButton.SetRect(0.92,0.9,0.12);
	//cameraButton.baseRect = Rect(0.1*Screen.width, 0.75*Screen.height, 0.2*Screen.width, 0.2*Screen.width);
	cameraButton.SetTex("binocular_icon");
	cameraButton.SetAltTex("back_icon");


centerRect =new GenericButton();
	tiltToggleRect =new GenericButton();
	winRect =new GenericButton();
	debugToggleRect =new GenericButton();
	volumeSliderRect =new GenericButton();
	tiltSensRect =new GenericButton();
	toolDescriptionRect =new GenericButton();
	

	centerRect.baseRect = Rect(0.1*Screen.width,0.2*Screen.height, 0.8*Screen.width,0.5*Screen.height );
	//centerRect.SetRect(0.5,0.7, 0.9);
	print("CenterRect: " +centerRect.baseRect.ToString());
	tiltToggleRect.baseRect= Rect( 0.2*Screen.width, 0.3*Screen.height, 32,32);
	winRect.baseRect= Rect( 0.01*Screen.width, 0.2*Screen.height,64,64);
	debugToggleRect.baseRect= Rect( 0.9*Screen.width, 0.2*Screen.height,64,64);
	volumeSliderRect.baseRect= Rect( 0.2*Screen.width, 0.1*Screen.height, 0.6*Screen.width,0.1*Screen.height);
	tiltSensRect.baseRect= Rect( 0.2*Screen.width, 0.4*Screen.height, 0.6*Screen.width,0.1*Screen.height);
	
	toolDescriptionRect.baseRect= Rect(0.8*Screen.width/5, 0.2*Screen.height/5, 3*Screen.width/5, 0.9*Screen.height/5);
	soundToggleRect =Rect(0.85*Screen.width, 0.1*Screen.height, 0.1*Screen.width, 0.1*Screen.width);
	// setup the camera
	editor.SetCameraManager( cam );
	
	if (!sim) sim = gameObject.AddComponent(SimManager);
	sim.SetCameraManager( cam );
	debug=false;
	gameMode =2;
	
	
	numberOfGuys = sim.RequestJunctionList().length;
	
	sim = FindObjectOfType(SimManager);
}
*/

function LoadNext()
{
	cam.KobotoSound();
	nextRect.Press();
	yield WaitForSeconds(0.04);
	nextRect.Unpress();
	
	var timesPlayed : int = PlayerPrefs.GetInt("TimesPlayed",0);
	var ratingQActive : boolean;
	if (PlayerPrefs.GetInt("RatingQ",0) < 4 )ratingQActive=true; else ratingQActive = false;
	print ("timesPlayed = " + timesPlayed);
	if (
	(timesPlayed >2 && (timesPlayed % 3 ==0)&& ratingQActive)
	||
	(timesPlayed ==1 && Application.loadedLevel ==21 && ratingQActive)
	
	)
	{
		PlayerPrefs.SetInt("TimesPlayed",timesPlayed+1);
		ratingQuery =true;
		PlayerPrefs.SetInt("RatingQ",PlayerPrefs.GetInt("RatingQ",0)+1);
		
	} 
	else
	{
	yield Loading();
	var currentLevel:int =Application.loadedLevel;
	if ((currentLevel+1)<Application.levelCount) {Application.LoadLevel(currentLevel+1);PlayerPrefs.SetInt("CurrentLevel", currentLevel+1 );}
	else Application.LoadLevel(0);
	}
	
}
var ratingQuery : boolean=false;
var loading : boolean=false;
var loadingScreen : Texture2D;
function Loading()  //shoe loading screen and fade out audio
{
	
	loading = true;
	var musicFadeTime: float =0.5;
	var timer : float = musicFadeTime;
	if (cam.aud)
	{
		var startVol : float = cam.aud.volume; 
		while (timer>0)
		{
			timer-= Time.deltaTime;
			cam.aud.volume = Mathf.Lerp(0,startVol,timer/musicFadeTime);
			
			yield;
		}
	}
	
}

function Quit()
{
	cam.KobotoSound();
	menuRect.Press();
	yield WaitForSeconds(0.04);
	menuRect.Unpress();
	yield Loading();
	var worldNo : int = PlayerPrefs.GetInt("WorldNumber",1);
	Application.LoadLevel(worldNo+2);
}
function BeginSimulation()
{
	
	if (tutorial)
	{tutorial.Stop();
	tutorial.Reset();
	}
	//cam.StartSound();
	cam.SetDragOffset(Vector3.zero);
	cam.interest =null;
	sim.Activate();
	editor.CleanUp();
	gameMode=1;
	
	
}

function EndSimulation()
{
	if (tutorial) tutorial.Stop();
	cam.offScreenJunc =null;
	//cam.StopSound();
	sim.Deactivate();
	sim.ResetSimulation();
	sim.CleanUp();
	cam.ResetLocation();
	gameMode=1;
	
	
	//editor.ChangeActiveCore(editor.oldCore);
	
}

var resetVol : float;

public function MapButtonPressed()
{
	cam.ZoomOutSound();
	cam.StartLookMode();
	gen.GlobalPause(false);
	gameMode=5;
	gen.MuteSound();
	resetVol=musicVol;
}

function Update () 
{	
return;
	paused=gen.IsPaused();
	if ((!cam.IsIntroPlaying())&&gameMode==2) {gameMode=1;BeginSimulation();}
	
	
	
	/*
	// see how many critters are dead
	var livingCritters=0;
	for( var currGO : GameObject in sim.RequestJunctionList() )
	if( currGO )
	{
		var currGoJunc:Juncore =currGO.GetComponent(Juncore);
		if( !currGoJunc.dead ) livingCritters++;
	}
	// reset the sim if all the kobotos fall TO THEIR DEATH	
	if( livingCritters == 0 )
	{
		EndSimulation();
	}
	*/

	// if you finish the level...
	//if( sim.IsComplete() ) SimComplete();
	
	if (showLevelComplete)
	{
		if (ratingQuery)
		{
			if(gen.TouchUpdate(menuRect.baseRect)) 
			{
				PlayerPrefs.SetInt("RatingQ",10);
				Application.OpenURL("http://itunes.com/apps/kubrik");
			}
			if(gen.TouchUpdate(nextRect.baseRect)) 
			{
				PlayerPrefs.SetInt("TimesPlayed",-6);
				ratingQuery=false;
			}
		}
		else
		{
		if(gen.TouchUpdate(menuRect.baseRect)) Quit();
		if(gen.TouchUpdate(nextRect.baseRect)) LoadNext();
		}
	}
	
	
	
	
		/*completeSavor+=Time.deltaTime;

		if( gen.TouchUpdate( FullRect ) )
			Finish();
			
		if( completeSavor > 3.5 )
			Finish();
			*/
	// if the game is still running, switch between states
	else switch(gameMode)
	{

	case 1: // simulation
		editor.HandleToolSwitching();
		sim.HandleUI();
		
		/*
		if( gen.TouchUpdate( PauseButton.baseRect ) )  //pause button
		{
			cam.KobotoSound();
			gen.GlobalPause(true);
			gen.MuteSound();
		}
		
		
		
		
		
		if (gen.TouchUpdate(cameraButton.baseRect)) //free look button
		{
			cam.ZoomOutSound();
			cam.StartLookMode();
			gen.GlobalPause(false);
			gameMode=5;
			gen.MuteSound();
			resetVol=musicVol;
			
			
		}
		*/
	/*
	for( var currGO : GameObject in sim.RequestJunctionList() )
	if( currGO )
	{
		var currGoJunc:Juncore =currGO.GetComponent(Juncore);
		if (currGoJunc)
		{
		var screenPos:Vector2 = Vector2(currGoJunc.ScreenPosition.x,Screen.height-currGoJunc.ScreenPosition.y);
		//if( FullRect.Contains(screenPos)) {EnablePlayButton(false);}
		//else  EnablePlayButton(true);
		}
	}
	
		// play/stop button
		/*
		if( playButtonEnabled && gen.TouchUpdate( EditRect ) )
		{
			EndSimulation();
			tintOpacity=1;
		}	
		*/	
		break;
	case 3: //pauseMenu
		//if( gen.TouchUpdate( PauseButton.baseRect ) )  //pause button
		//{gen.GlobalUnPause(true);gen.UnMuteSound();}
		
		
		if(!cam.IsIntroPlaying() && gen.TouchUpdate(leftMenuRect.baseRect)) RetryButton();
		if(gen.TouchUpdate(middleMenuRect.baseRect)) QuitButton();
		if(gen.TouchUpdate(rightMenuRect.baseRect)) ContinueButton();
		if (gen.TouchUpdate(soundToggleRect) )
		{soundOn =PlayerPrefs.GetFloat("GlobalVolume") == 0;
			gen.GlobalSoundToggle();
		}
		
		if(debug&&gen.TouchUpdate(winRect.baseRect)) sim.SetComplete();
		/*if(gen.TouchUpdate(tiltToggleRect))
		if (tiltBar)
		{tiltBar=false;
		gen.SetTiltBar(false);}
		else
		{tiltBar=true;
		gen.SetTiltBar(true);}
		*/
		break;
		/*
	case 5: //camera Look mode
	
		if (gen.TouchUpdate(cameraButton.baseRect)) 
		{
			
			
			cam.EndLookMode();
			cam.ZoomInSound();
			
			
		}
		break;
		*/
		
	}
}

function RetryButton() {
	cam.KobotoSound();
	leftMenuRect.Press();
	yield WaitForSeconds(0.04);
	leftMenuRect.Unpress();
	
	gen.GlobalUnPause(true);gen.UnMuteSound();EndSimulation();BeginSimulation();}

function QuitButton() {cam.KobotoSound();middleMenuRect.Press();yield WaitForSeconds(0.04);middleMenuRect.Unpress();Quit();}

function ContinueButton() {
	cam.KobotoSound();
rightMenuRect.Press();
yield WaitForSeconds(0.04);
rightMenuRect.Unpress();
gen.GlobalUnPause(true);gen.UnMuteSound();
}



var showFailScreen:boolean = false;
function Fail(t:Transform)
{
	if (gameMode !=4)
	{
	//cam.CutAway(t.gameObject,1.5);
	showFailScreen =true;
	gen.GlobalPause(true);
	
	yield WaitForSeconds(1.5);
	showFailScreen =false;
	gen.GlobalUnPause(true);
	EndSimulation();
	BeginSimulation();
	}
}

var worldComplete : boolean =false;
function SimComplete()
{
	gameMode =4;
		var worldDefs : WorldObjectDefs = new WorldObjectDefs();
	//numberOfLevels = new int[worldDefs.numberOfWorlds];
	var numberOfLevels : int[] =worldDefs.GetNumberOfLevels();
	var finalLevelNo : int =0;
	for (var i :int =0; i<=cam.world;i++)
	{
		finalLevelNo += numberOfLevels[i];
	}
	
	//print ("currentLevel: " + PlayerPrefs.GetInt("CurrentLevel")+1);
	//print ("levels Completed: " + PlayerPrefs.GetInt("LevelsCompleted"));
	//print ("final Level of this world: " + finalLevelNo);
	if(Application.loadedLevel +1 == finalLevelNo ) worldComplete=true;
	
	if (!showLevelComplete) {yield WaitForSeconds(2.6); showLevelComplete=true;PulsateGoal();}
	
		if(worldComplete) WorldComplete();
		
	
}

function WorldComplete()
{
	
	if (PlayerPrefs.GetInt("WorldsUnlocked",1) < PlayerPrefs.GetInt("WorldNumber")+1) PlayerPrefs.SetInt("WorldsUnlocked",(PlayerPrefs.GetInt("WorldNumber")+1));
	
	PlayerPrefs.SetInt("CurrentLevel",  PlayerPrefs.GetInt("CurrentLevel")+1);
	
	yield WaitForSeconds(3);
	if (cam.world ==3) {PlayerPrefs.SetInt("GameComplete",1);Application.LoadLevel("TrophyRoom");}
	else Application.LoadLevel(2);
}

function GetGameMode(){return gameMode;}

function SetGameMode(m:int)
{
	gameMode=m;
	GameHudManager.Instance().SetModeFromGameMode(gameMode);
}
var showLevelComplete:boolean=false;

function EnablePlayButton(bool:boolean) {playButtonEnabled = bool;}
function EnableEdit(bool:boolean) {editEnabled = bool;}
function FadeInTint()
{
	var timer:float=0;
	while (timer<1)
	{
		timer+=Time.deltaTime;
		tintOpacity=(timer/1);
		//print("opacity=" +opacity);
		yield;
	}
	
	
}

function PulsateGoal()
{
	var goalScale : float =1;
	var amp : float =0.15;
	var pulseFade : float =4;
	var freq : float =16.0;
	var tempRect : Rect = centerRect.baseRect;
	while (showLevelComplete)
	{
		goalScale= 1+ amp*Mathf.Sin(freq*Time.time);
		//centerRect.baseRect = Rect(tempRect.x -tempRect.width *0.5*goalScale, tempRect.y -tempRect.height*0.5*goalScale, tempRect.width * goalScale, tempRect.height*goalScale);
		centerRect.SetRect2(0.5,0.35, 0.8*goalScale,0.35*goalScale);
		amp *= 1-(pulseFade * Time.deltaTime);
		//freq -= 0.1*pulseFade * Time.deltaTime;
		yield;
		
	}
	centerRect.baseRect = tempRect;
}

//ar frameCount : boolean =true;
var settingSkin : boolean=false;
var setSkin : boolean;
var mouseOver : boolean;
function SkinSet()
{
	yield WaitForSeconds(0.5);
	setSkin = false;
}

function OnGUI()
{
return;
	//if (Time.frameCount<20) GUI.skin = kubrikSkin;

	if (debug)
	{
	
	GUI.Label( Rect( 100, 10, 120, 20 ), ("fps: "+ (1/Time.smoothDeltaTime)), "Box" );
	}
	
	//var btx : Texture2D = Resources.Load("exit_icon");
	//if( gen.MouseOverRect( QuitRect.baseRect ) ) mouseOver = true; 
	


	// GO / QUIT buttons
	//if( gen.MouseOverRect( FullRect.baseRect ) ) mouseOver = true; 

	// if you finish the level...
	if( sim.IsComplete() && showLevelComplete )
	{
     	//btx = Resources.Load("stop_icon");
		//GUI.Label( FullRect, GUIContent(btx) );
		if (worldComplete) GUI.Label(centerRect.baseRect, "World Complete!");
		
		else
		{
		if (ratingQuery)
		{
			GUI.DrawTexture(Rect(Screen.width*0.25,Screen.height*0.25,Screen.width*0.5,Screen.height*0.4), Resources.Load("textBackground"));
			GUI.Label(Rect(Screen.width*0.3,Screen.height*0.3,Screen.width*0.4,Screen.height*0.1), "Enjoying Kubrik?", whiteTextLarge);
			GUI.Label(Rect(Screen.width*0.3,Screen.height*0.4,Screen.width*0.4,Screen.height*0.1), "if so, please take a moment", whiteText);
			GUI.Label(Rect(Screen.width*0.3,Screen.height*0.5,Screen.width*0.4,Screen.height*0.1), "to rate it on the app store", whiteText);
			
			var appstoreYes:Rect = menuRect.baseRect;
			var appstoreNo:Rect = nextRect.baseRect;
			appstoreYes.height *=0.6;
			appstoreNo.height *=0.6;
			GUI.DrawTexture(appstoreYes, Resources.Load("boxEmpty"));
			GUI.DrawTexture(appstoreNo, Resources.Load("boxEmpty"));
			GUI.Label(appstoreYes, "Take me there!", whiteText);
			GUI.Label(appstoreNo, "No Thanks!", whiteText);
		}
		else
		{
		GUI.DrawTexture(centerRect.baseRect, goalTex);
		GUI.DrawTexture(menuRect.baseRect, menuTex);
		GUI.DrawTexture(nextRect.baseRect, nextTex);
		}
		
		}
		
	}
	
	//if (showFailScreen) GUI.Label(centerRect.baseRect, GUIContent(failTex));
	if (showFailScreen) GUI.DrawTexture(centerRect.baseRect, failTex);
	// if the level is still running...
	else switch(gameMode)
	{
	case 0: // editor. Defunct.
     	
		break;
	case 1: //Main game
		
		//btx = Resources.Load("play_icon");
		editor.WorkBoxWindowGUI();
		
		// GUI.Box(Rect(0,0,512,512), GUIContent(screenTint), screenTintStyle);
		//if (editor.ToolDescription!="") GUI.Label (toolDescriptionRect.baseRect, GUIContent(editor.ToolDescription),"text");
     	
		sim.HandleGUI();
		//PauseButton.Show(0);
		//GUI.Label( QuitRect.baseRect, btx );
		//if (lookButtonFlash) cameraButton.ShowScaled(1+0.12*Mathf.Sin(Time.time*12),0);
		//else cameraButton.Show(0);
		//GUI.Label(cameraButton.baseRect, GUIContent(testTex));
		//if (tiltBar) {tiltBox=sim.GetTiltBox();GUI.Label(tiltBox, ("tilt:" +sim.GetTiltBarValue()), kBox);}
		break;
	case 2: //intro Cam
		GUI.Label(Rect(0,0,Screen.width*0.3,Screen.height*0.2), "Level " + cam.world + " - " + cam.realLevelNo, kText);
		
		break;
	case 3: //pause Menu
		GUI.Label(Rect(0,0,Screen.width,Screen.height),  "Level " + cam.world + " - " + cam.realLevelNo + "  PAUSED", kBox);
		//GUI.Label(menuRect, "Quit", "Box");
		//GUI.Label(nextRect, "Continue", "Box");
		if (!cam.IsIntroPlaying()) 
		GUI.Label(leftMenuRect.baseRect, GUIContent(retryTex),kLabel);
		GUI.Label(middleMenuRect.baseRect, GUIContent(quitTex),kLabel);
		GUI.Label(rightMenuRect.baseRect, GUIContent(continueTex),kLabel);
		
		musicVol = LabelSlider(volumeSliderRect.baseRect, musicVol,1, "Music Volume");
		tiltSens = LabelSlider(tiltSensRect.baseRect, tiltSens, 1, "Tilt Sensitivity");
		GUI.DrawTexture(soundToggleRect, sound);
		if (!soundOn) GUI.DrawTexture(soundToggleRect, soundOff);

		//musicVol = GUI.HorizontalSlider(volumeSliderRect,musicVol,0,1);
		if (GUI.changed) 
		{
		cam.SetMusicVolume(musicVol);
		gen.SetTiltSensitivity(tiltSens);
		gen.SetTiltBar(!tiltToggle);
		}
		break;
	case 5: //camera Look Mode
		//if (lookButtonFlash) cameraButton.ShowScaled(1+0.12*Mathf.Sin(Time.time*12),1);
		//else cameraButton.Show(1);
		//cameraButton.Show(1);
		break;
	}
	if (tutorial) tutorial.TutGUI();
	if (loading) GUI.DrawTexture(Rect(0,0,Screen.width, Screen.height), loadingScreen);
	
	// cursor plus
	//gen.DrawWiiCursor();
}

function LabelSlider (screenRect : Rect, sliderValue : float, sliderMaxValue : float, labelText : String) : float {
	GUI.Label (screenRect, labelText, kText2);
	screenRect.y += screenRect.height; // <- Push the Slider to the end of the Label
	sliderValue = GUI.HorizontalSlider (screenRect, sliderValue, 0.0, sliderMaxValue);
	return sliderValue;
}