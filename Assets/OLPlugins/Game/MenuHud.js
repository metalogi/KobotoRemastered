

@script RequireComponent (GenericFunctions)


var levelSelectButtons:LevelSelectButton[];
private var gen : GenericFunctions;
private var cam : MenuCamera;
private var fingerMoving:boolean =false;
private var touchInfo:Touch;
var overlays:LoadingOverlay[];
var unlockAll:boolean =false;
var newGame =false;
var debug:boolean=true;
var loading:int =-1;
var worldNumber:int;
private var level:LevelSelectButton;
private var realLevelNumber:int=-1;
private var cardNumber:int=-1;
private var homeObject:GameObject;
var homePosition:Vector3;
private var cardWidth : float;
private var cardHeight : float;
var cardStyle : GUIStyle;
var textBox : GUIStyle;
private var playTex: Texture2D;
var bonusStarTex : Texture2D;
var bonusStarTexEmpty : Texture2D;
var homeTex : Texture2D;
var homeTexEmpty : Texture2D;

var loadingScreen : Texture2D;

//var backRect : Rect;
var backButton : GenericButton;
private var numberOfLevels : int[];
private var numberOfWorlds : int=3;
var kubrikSkin : GUISkin;
/*
function ResetPlayerPrefs()
{
	print("newGame");
	print ("wiping saveData");
	PlayerPrefs.SetInt("LevelsCompleted", 5);
	PlayerPrefs.SetFloat("MenuCamZ", -32 );
	PlayerPrefs.SetFloat("MenuCamY", -4 );
	PlayerPrefs.SetInt("WorldNumber", 1);
	cam.positionTarget.y =-4;
	cam.positionTarget.z=-32;
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
private var smg : SoundManagerScript;
function Start () 
	{	
		if (Screen.width == 1024) kubrikSkin = Resources.Load("kubrikGUISkin_ipad");
	else kubrikSkin = Resources.Load("kubrikGUISkin");
		smg = GetComponentInChildren(SoundManagerScript);
		loadingScreen = Resources.Load("loading");
		playTex = Resources.Load("playButton");
		
		//numberOfLevels = new int[4];
		//numberOfLevels[0] =5;   //number of menu levels 
		//numberOfLevels[1] =18;   //number of levels in world 1
		//numberOfLevels[2] =15;   //number of levels in world 2
		//numberOfLevels[3] =13;	//number of levels in world 3
		
		var worldDefs : WorldObjectDefs = new WorldObjectDefs();
		numberOfLevels = new int[worldDefs.numberOfWorlds];
		numberOfLevels =worldDefs.GetNumberOfLevels();
		
		var cheat : int =PlayerPrefs.GetInt("CheatMode", 0);
		loading=-1;
		// links to other classes
		gen = GetComponent(GenericFunctions);
		cam= GetComponent(MenuCamera);
		//overlays =GetComponentsInChildren(LoadingOverlay);
		//if (newGame) ResetPlayerPrefs();
		
		// tag the levelButtons to either state 0=invisible, state 1=available/unfinished, state 2=finished
		var levelsFinished:int = PlayerPrefs.GetInt("LevelsCompleted", numberOfLevels[0]);
		if(cheat==100) levelsFinished = 100;
		print ("levelsFinished = " + levelsFinished);
		Debug.Log ("levelsFinished = " + levelsFinished);
		
		var levelId:int = 0;
		var startNo:int;
		for (var world : int =0; world<worldNumber; world++)
		{
			levelId += numberOfLevels[world];
			
		}
		startNo = levelId;
		
		print ("current Level Number is: " +PlayerPrefs.GetInt("CurrentLevel"));
		for( var currLS:LevelSelectButton in levelSelectButtons )
		{
			if (levelId==PlayerPrefs.GetInt("CurrentLevel",6)) cam.SetFocus(currLS.transform.position);
			currLS.worldNumber =worldNumber;
			var state:int = 0;
			if( levelId <= levelsFinished ) state = 1;
			if( levelId < levelsFinished ) state = 2;
			if( levelId >= startNo+numberOfLevels[worldNumber] ) state =0;
			currLS.SetState(state);
			
			levelId++;
			
			
		}
		
		
		// keep music volume away from 0
		//if( PlayerPrefs.GetFloat("MusicVolume") == 0 )
		//	PlayerPrefs.SetFloat("MusicVolume", 1.0);

		// properly position the camera from PlayerPrefs data
		//cam.SetFocus(Vector3(0, PlayerPrefs.GetFloat("MenuFocusY"), PlayerPrefs.GetFloat("MenuFocusZ")));
		
		cardWidth=Screen.width/4;
		cardHeight=Screen.height/2.5;
		backButton = new GenericButton();
		backButton.SetRect(0.05,0.92,0.1);
		backButton.SetTex("back_icon");
		//backRect = Rect(Screen.width/10, 9*Screen.height/10, Screen.width/10, 0.9*Screen.height/10);

	}
	
	// Update is called once per frame
	function Update ()
	{
		
		
		// grab a pair of vectors to indicate where the mouseCursor is pointing
		var camPosition:Vector3 = gen.GetCameraObject().transform.position;
		var mouseLookVector:Vector3 = gen.GetMouseFaceVector();
		
		
		
		touchInfo=gen.GetTouchInfo(0);
		if (touchInfo.phase== TouchPhase.Moved) fingerMoving =true;
		
		
		if (!fingerMoving&&(Input.touchCount==1))
		{

		// cycle through each levelSelectButton to see if it has been pressed
		var levelId:int=0;
		for( var currLS:LevelSelectButton  in levelSelectButtons )
		{
			var currGO:GameObject = currLS.gameObject;
			if( currLS.GetState() > 0 )
			{
				var objectPosition:Vector3 = currGO.transform.position;
				var distFromCamera:float = ( objectPosition - camPosition ).magnitude;
				var projectPoint:Vector3 = camPosition + mouseLookVector*distFromCamera;

				var hlt:boolean = Mathf.Abs(projectPoint.z - objectPosition.z) < 1.5 &&
				    projectPoint.y > objectPosition.y &&
				    projectPoint.y < objectPosition.y + 3;

				// if we click on this levelButton, update local prefs data and load the level
				if( hlt && gen.NewTouch() )
				{smg.KobotoSound();
					//if (worldNumber==1) realLevelNumber=levelId+6;
					//if (worldNumber==2) realLevelNumber=levelId+24;
					//if (worldNumber==3) realLevelNumber=levelId+35;
					cardNumber =levelId+1;
					realLevelNumber =levelId;
					for (var world : int =0; world<worldNumber; world++)
					{
						realLevelNumber +=numberOfLevels[world];
					}
					
					
					level = currLS;
					homeObject=currGO;
					cam.SetFocus(homeObject.transform.position);
					PlayerPrefs.SetFloat("MenuFocusY", homeObject.transform.position.y);
					PlayerPrefs.SetFloat("MenuFocusZ", homeObject.transform.position.z);
					/*
					
					//Application.LoadLevel( levelId + 3 );
					LevelLoad(levelId+3);
					*/
				}
				
				// color the levelIcon depending whether it's highlighted over or not
				//currLS.SetHighlight( hlt );
			}
			levelId++;
		}
		}
		if (touchInfo.phase== TouchPhase.Ended) fingerMoving=false;
	}
	
	function LevelLoad(i:int)
	{	smg.StartSound();
		var aud:AudioSource =GetComponent(AudioSource);
		var musicFadeTime:float=0.8;
		var timer:float=musicFadeTime;
		var startVol:float= aud.volume;
		loading =i;
		PlayerPrefs.SetFloat("MenuCamY", cam.transform.position.y);
		PlayerPrefs.SetFloat("MenuCamZ", cam.transform.position.z);
		PlayerPrefs.SetInt("CurrentLevel", i );
		//for (var ov:LoadingOverlay in overlays) ov.SetOn(true);
		while (timer>0)
		{
			timer-= Time.deltaTime;
			aud.volume = Mathf.Lerp(0,startVol,timer/musicFadeTime);
			
			yield;
		}
		Application.LoadLevel( i );
		
	}
	
	function OnGUI ()
	{ GUI.skin = kubrikSkin;
		if (debug)
		{
			var infoBox:Rect =  Rect( Screen.width/2-120, Screen.height/2-50, 240, 100 );
			//if (loading>0) GUI.Label(infoBox, ("loading level#"+loading), "Box");
		}
		if (loading>=0)
		{
			GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), loadingScreen);
		}
		
		if ((realLevelNumber>=0)&&(loading==-1))
		{
			homePosition= Camera.main.WorldToScreenPoint(homeObject.transform.position);
			homePosition.x -=cardWidth/2;
			homePosition.y = Screen.height*0.9 - homePosition.y - cardHeight;
			var cardRect : Rect =  Rect(homePosition.x, homePosition.y, cardWidth,cardHeight);
			var numberRect : Rect = Rect(homePosition.x, homePosition.y, cardWidth,cardHeight/5);
			var nameRect : Rect = Rect(homePosition.x, homePosition.y+cardHeight/5, cardWidth,cardHeight/5);
			var playRect : Rect = Rect(homePosition.x, homePosition.y+cardHeight/5, cardWidth,cardHeight/2);
			
			var homeIconRect : Rect = Rect(homePosition.x+0.25*cardWidth/5, homePosition.y+4*cardHeight/5, cardWidth/4,cardHeight/5);
			
			//var levelNumberString : String = worldNumber.ToString() + "." + (realLevelNumber-1).ToString();
			var levelNumberString : String = worldNumber.ToString()+ " . ";
			levelNumberString += cardNumber.ToString();
			//if (worldNumber == 1) levelNumberString += (realLevelNumber-numberOfLevels[0]).ToString();
			//if (worldNumber == 2) levelNumberString += (realLevelNumber-24).ToString();
			//if (worldNumber == 3) levelNumberString += (realLevelNumber-35).ToString();
			//var cardContent :GUIContent = GUIContent(levelNumberString
			
			var startLevel : boolean  = GUI.Button(cardRect,"", cardStyle);
			GUI.Label(numberRect,GUIContent("Level: " + levelNumberString), "textarea");
			//GUI.Label(nameRect,GUIContent(level.levelName), textBox);
			//GUI.Label(playRect,GUIContent(playTex), textBox);
			GUI.DrawTexture(playRect,playTex);
			//GUI.Label(homeIconRect,GUIContent(homeTex));
			
			//draw star icons
			var bonusStarCountKey : String = (realLevelNumber).ToString() + "_BonusStarCount";
			var bonusStarsFoundKey : String = (realLevelNumber).ToString() + "_BonusStarsFound";
			
			print ("count key: " + bonusStarCountKey + " has " + PlayerPrefs.GetInt(bonusStarCountKey,0));
			var starCount : int = PlayerPrefs.GetInt(bonusStarCountKey,0);
			
			if (starCount)
			{
			var starIconRect : Rect[] = new Rect[starCount];
			for (var i : int = 0; i<starCount; i++)
			{
			var tokenString : String = realLevelNumber.ToString() + "_bonus_" + i.ToString();
			starIconRect[i] = Rect(homePosition.x + (i+1) *cardWidth/(starCount+1) - (cardWidth/(2*(starCount+1))), homePosition.y+4*cardHeight/5- cardWidth/(2*(starCount+1)), cardWidth/(starCount+1),cardWidth/(starCount+1));
			var starTex:Texture2D;
			
			if (PlayerPrefs.GetInt(tokenString,0) ==1) starTex = bonusStarTex;
			else starTex = bonusStarTexEmpty;
			//if (i <= PlayerPrefs.GetInt( bonusStarsFoundKey,0)) starTex = bonusStarTex;
			//else starTex = bonusStarTexEmpty;
			
			GUI.DrawTexture(starIconRect[i], starTex);
					
				
			}
			}
			
			if (startLevel) LevelLoad(realLevelNumber);
		}
		
		if (loading==-1)
		{
		var goback : boolean = GUI.Button (backButton.baseRect, backButton.tex);
		if (goback) Application.LoadLevel(2);
		}
		
		
		
		
	
	}

