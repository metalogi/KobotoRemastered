// prefs for the user interface
class UISimPreferences
{
	var JunctionSelectIdealButtonSize = 96;
	var RotateButtonSize = 64;
	var CameraRotateControlSpeed = 90.0;
} 

var numGates : int; //number of gates
var rescued: int;  //number of kotobos that have been rescued
var uiSimPrefs : UISimPreferences;

var tiltBox:Rect;
var tiltBarValue:float;
var readTiltBar:boolean;
private var mouseOver = false;

private var gen : GenericFunctions;
private var editor : UIEditor;
var junctionList = new Array ();
private var cam : CameraManager;
private var man : UIManager;
var selectionGlow : Texture2D;
// the junction list creates a set of all objects that can be used as editorTargets

function SetCameraManager( Cam ) { cam = Cam; }
function GetCameraManager() { return cam; }

var selectionHighlight : Texture2D;
var offScreenButton : GenericButton;
var bonusTokens : BonusToken[];

var oneTex:Texture2D;
var showOneIcon : boolean = false;
var allResets : Array;
var allSpawnPoints : Array;
function Awake ()
{
	return;
	var juncCount:int=0;
	//offScreenButton = c;
	//offScreenButton = ScriptableObject.CreateInstance(typeof(GenericButton));
	offScreenButton = new GenericButton();
	gen = GetComponent(GenericFunctions);
	editor =GetComponent(UIEditor);
	man =GetComponent(UIManager);
	tiltBarValue=0;
	tiltBox=Rect(Screen.width*0.1, Screen.height*0.8, Screen.width*0.8, Screen.height*0.12);
	var gates:Array = FindObjectsOfType(EndGate);
	numGates=gates.length;
	rescued =0;
	selectionGlow = Resources.Load("selectionGlow");
	selectionHighlight = Resources.Load("circle");
	
	
	for (var spawn:SpawnPoint in FindObjectsOfType(SpawnPoint))
	{
		spawn.Spawn();
	}
	if (junctionList.length>1)
	for (var i:int=0;i<junctionList.length;i++)
	{
		var thisGO:GameObject =junctionList[i];
		var otherGO:GameObject =junctionList[1-i];
		var junc : Juncore = thisGO.GetComponent(Juncore);
		junc.otherJunc =otherGO.GetComponent(Juncore);
	}
	
	bonusTokens = FindObjectsOfType(BonusToken);
	var levelPlayedKey : String = Application.loadedLevel + "_LevelPlayed";
	var bonusStarCountKey : String = Application.loadedLevel + "_BonusStarCount";
	//Debug.Log ("setting bonus start count: " +bonusStarCountKey + " to:  "  + bonusTokens.length.ToString());
	PlayerPrefs.SetInt(bonusStarCountKey, bonusTokens.length);
	PlayerPrefs.SetInt(levelPlayedKey, 1);
	
	allResets = FindObjectsOfType( GeneralReset );
	allSpawnPoints = FindObjectsOfType(SpawnPoint);
	
}

function Rescue()
{
	rescued++;
	cam.SetSimTarget(null);
	if (editor.SelectedKoboto && junctionList.length==2)
	{
		print ("Selecting Other Koboto");
		if (editor.SelectedKoboto==junctionList[1]) editor.SelectedKoboto=junctionList[0];
		else editor.SelectedKoboto=junctionList[1];
	}
}
function GetRescued(){return rescued;}
function GetNumGates(){return numGates;}

function AddJunction( obj )
{
	junctionList.push( obj ); 
}

function GetTiltBox(){return tiltBox;}
function GetTiltBarValue(){return tiltBarValue;}
function ReadingTiltBar(){return readTiltBar;}

var running=false;
function IsRunning() { return running; }
var complete=false;
function IsComplete() { return complete; }
function SetComplete() 
{ 
	PlayerPrefs.SetInt("LevelsCompleted", Mathf.Max(PlayerPrefs.GetInt("CurrentLevel")+1, PlayerPrefs.GetInt("LevelsCompleted")));
	//gen.WiiSaveGame();
	if( !complete ) { cam.KillMusic(); cam.WinSound(); }
	BonusTokenManager();
	complete = true; 
	Deactivate();
	//cam.SetEndCamera(endCamera);
	//man.SetGameMode(4);
}

function BonusTokenManager()
{
	var foundCount : int = 0;
	
	var bonusStarsFoundKey : String = Application.loadedLevel + "_BonusStarsFound";
	
	
	for (var bt:BonusToken in bonusTokens)
	{
		if (bt.found)
		{
			PlayerPrefs.SetInt(bt.saveName, 1);
			foundCount++;
			if (bt.freshlyFound && !bt.demo) PlayerPrefs.SetInt("TotalBonusTokens", PlayerPrefs.GetInt("TotalBonusTokens",0)+1);
			print ("Setting bonus token flag.. " + bt.saveName);
			//bt.Celebrate();
		}
	}
	PlayerPrefs.SetInt(bonusStarsFoundKey, foundCount);
}

// other components may want the Junction list
function RequestJunctionList()
{
	return junctionList;
}

// start the simulation
function Activate()
{
	running=true;
	for( var currGO:GameObject in junctionList )
	{	var Junk:Juncore =currGO.GetComponent(Juncore);
		Junk.ActionStart();
		//taking out stoplights
		//var lite:StopGoLight =Junk.GetStopHost().GetComponent(StopGoLight);
		//lite.SetGuiVis(false);
		//if (junctionList.length ==1) cam.SetSimTarget(currGO);
		//currGO.GetComponent(Juncore).GetStopHost().GetComponent(StopGoLight).SetGuiVis(false);
	}
	
	for( var curLO:GeneralReset in allResets )
	{
		curLO.TurnOn();
	}

	for(var curSP:SpawnPoint in allSpawnPoints )
		curSP.HideMe();
		
		if (showOneIcon) FadeUpOne();
		
}

// stop the simulation
function Deactivate()
{
	running=false;
	rescued =0;
	for( var currGO:GameObject in junctionList )
	{	var Junk:Juncore =currGO.GetComponent(Juncore);
		//Junk.ActionFreeze();
		/*taking out stoplights
		if( !complete )
		{	var stopgo:StopGoLight =Junk.GetStopHost().GetComponent(StopGoLight);
			stopgo.SetGuiVis(true);
		}
		*/
	}

	for( var curLO:GeneralReset in FindObjectsOfType( GeneralReset ) )
	{
		curLO.TurnOff();
	}

	if( !complete )
		for( var curSP: SpawnPoint in FindObjectsOfType( SpawnPoint ) )
			curSP.ShowMe();
}

// reset the simulation
function ResetSimulation()
{	
	for( var curLO:GeneralReset in FindObjectsOfType( GeneralReset ) )
	{
		curLO.ResetState();
	}
	
	for (var bt:BonusToken in bonusTokens)
	{
		bt.ResetMe();
	}

	for( var currGO:GameObject in junctionList )
	{	var JunkGO:Juncore=currGO.GetComponent(Juncore);
		JunkGO.ActionReset();
	}
	//yield WaitForSeconds(1); // pause to allow Destroyed objects to get destroyed 
	var cam:CameraManager = FindObjectOfType(CameraManager);
	cam.SetDragOffset(Vector3.zero);
	cam.ResetLocation();
	cam.SetSimTarget(null);
}

var selectionChanged : boolean = false;
var offScreenButtonCenter : Vector2;



function HandleUI()
{

	var index : int =0;
	
	var switched:boolean=false;
	if (junctionList.length>1)
	for( var currGO : GameObject in junctionList )
	if( currGO )
	{	var offJunc:Juncore = currGO.GetComponent(Juncore);
		if (offJunc == cam.offScreenJunc && !switched)
		{
			
			var offScreenPos : Vector3 = gen.FixedWorldToScreenPoint(offJunc.trans.position);
			var screenCentre : Vector2 =Vector2(Screen.width/2, Screen.height/2);
			var JVec2 : Vector2;
			JVec2.x =offScreenPos.x-screenCentre.x;
			JVec2.y =offScreenPos.y-screenCentre.y;
			var backOnScreenMultiplier : float;
			var side : boolean =false;
			if(Mathf.Abs(JVec2.x/JVec2.y) > screenCentre.x/screenCentre.y)
			{
				side =true;
				backOnScreenMultiplier =(parseFloat(Screen.width)*0.33)/Mathf.Abs(JVec2.x);
			}
			else backOnScreenMultiplier =(parseFloat(Screen.height)*0.45)/Mathf.Abs(JVec2.y);
			
			offScreenButtonCenter = screenCentre + JVec2* backOnScreenMultiplier;

			if (side) offScreenButtonCenter.x -= 0.1*Screen.width; //avoid overlapping tool buttons
			offScreenButton.SetRect(offScreenButtonCenter.x/Screen.width, offScreenButtonCenter.y/Screen.height, 0.06);
			
			offScreenButton.tex = offJunc.GetTexture();	
			/*
			if ( gen.TouchUpdate(offScreenButton.GetTouchRect())  )
			{
				cam.SetSimTarget(currGO);
				
				//print("Switching");
				switched =true;
				editor.SelectedKoboto =currGO;
				cam.offScreenJunc= offJunc.otherJunc;
				
				offJunc.offscreen=false;

				offJunc.otherJunc.offscreen=true;

			}
			*/
			index++;
		}
	

		
	}
	
		if (gen.NewTouch()){ 
	//var objUnderCursor = gen.GetHighlightedObject( junctionList, 35.0, 0.0, true );
	var objUnderCursor=gen.GetNearestOnScreen(junctionList,40,true);
	if( objUnderCursor && RequestJunctionList().length>1 )
	{
		var currentJ:Juncore =editor.SelectedKoboto.GetComponent(Juncore);
		editor.SelectedKoboto =currentJ.otherJunc.gameObject;
		if (showOneIcon) FadeUpOne();
		if (cam.offScreenJunc)
		{
		cam.SetSimTarget(editor.SelectedKoboto);
		var newJunc : Juncore = editor.SelectedKoboto.GetComponent(Juncore);
		newJunc.offscreen = false;
		cam.offScreenJunc= currentJ;
		currentJ.offscreen = true;
		}
	}
	}
	//click on & off
	/*
	if (gen.rightButtonPressed || gen.leftButtonPressed){ 
	//var objUnderCursor = gen.GetHighlightedObject( junctionList, 35.0, 0.0, true );
	//var objUnderCursor=gen.GetNearestOnScreen(junctionList,40,true);
	if(  RequestJunctionList().length>1 )
	{
		
		 var obj:Juncore = objUnderCursor.GetComponent(Juncore);
		 
		 editor.SelectedKoboto = objUnderCursor;

			if (!obj.on) { obj.TurnOn();  }

	}
	

	}
	*/


}

var flashSelectionButtons:boolean=false;



function HandleGUI()
{
		

	
	var index : int =0;
	if (junctionList.length>1)
	{
		
	if (cam.offScreenJunc)
	{
		if (offScreenButton.tex) 
		 offScreenButton.Show(0);
	}
	
	if (!rescued) for( var currGO : GameObject in junctionList )
		if( editor.SelectedKoboto == currGO)
		{
		
			var screenPos : Vector3  =gen.FixedWorldToScreenPoint(currGO.transform.position + 6*Vector3.up);
			
			var baseSize = 0.1 + 0.02*Mathf.Cos(8*Time.time);
			GUI.contentColor.a = 0.3 -0.25*Mathf.Cos(8*Time.time);
			var selectedRect = Rect (screenPos.x - 0.5*baseSize*Screen.width,screenPos.y - 0.5*baseSize*Screen.width, baseSize*Screen.width,baseSize*Screen.width);
			GUI.Label (selectedRect, GUIContent(selectionHighlight));
			GUI.contentColor.a =1;
		}
		else if (showOneIcon)
		{
			var onePos : Vector3  =gen.FixedWorldToScreenPoint(currGO.transform.position + 6*Vector3.up);
			var oneRect : Rect = Rect(onePos.x-16, onePos.y-32, 24,24);
			GUI.color = Color(1,1,1,oneOpacity);
			GUI.DrawTexture(oneRect, oneTex);
			GUI.color = Color.white;
		}
		
	}

}

function CleanUp()
{
	//print("cleaning up..");
	cam.SetEditorTarget( null );
	cam.SetSimTarget(null);
}

var oneOpacity: float =1;
function FadeUpOne()
{
	var fadeTimer : float =0;
	var fadeTime : float = 1.4;
	while (fadeTimer<fadeTime)
	{
		oneOpacity = fadeTimer/fadeTime;
		fadeTimer += Time.deltaTime;
		yield;
	}
}