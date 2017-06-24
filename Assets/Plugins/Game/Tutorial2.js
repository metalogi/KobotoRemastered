
class TutorialPart
{
	var style : int =1;
var TutorialText:String;
var TutorialImage:Texture2D;
var TutorialImage2:Texture2D;
var TutRect:Rect;
var TutRect2:Rect;

var gameModeTrigger:int =-1;
var disablePlayButton:boolean=false;
var disableEdit:boolean=false;
var Highlight:GameObject;
var on:boolean=true;
var AlreadyPlayed:boolean=false;
var OnlyPlayOnce:boolean=true;
var startWait:float=0.4;
var endWait : float =0;
var pauseGame:boolean=false;
var waitForPlay:boolean=false;
var waitForContinue:boolean=false;
var waitForCustom:boolean=false;
var waitForDrag:boolean=false;
var waitForDragX:boolean=false;
var waitForComponent:boolean=false;
var waitForComponentRemoval:boolean=false;
var waitForGameMode:boolean=false;
var gameModeToWaitFor: int=0;
var componentToWaitFor:int;
var waitForEditorTarget:boolean=false;
var waitForSimTarget:boolean=false;
var waitForSelectionChange : boolean =false;
var screenTime:float=-1;
var tapStopsTime:boolean =false;


var requiresGameMode : int =-1;
var flashCameraButton : boolean= false;
var flashSelectionButtons : boolean =false;

var fadeInTime:float =0.5;
var fadeOutTime:float =0.35;

var attachToJunc:boolean=false;
var attachTo : int =-1;
var waitForOff:boolean=false;


var followUp: int =-1;

var customTapRect:Rect;


}

var disablePlayButtonAtStart:boolean=false;
var oldGameMode:int;
function Update()
{

return;
	
	var triggered:boolean=false;
	gameMode=manager.GetGameMode();
	EditorTgt = cam.GetEditorTarget();
	SimTgt = cam.GetSimTarget();
	
	/*
	gameModes:
	0-Editor, no target
	1-sim
	2-intro
	3-pause
	
	4 Editor-with target - not a real game mode 
	
	*/
	

	
	if (gameMode==0) 
	{
		if ((gameModeTriggers[0]>=0) && (!EditorTgt)) {triggered=true; PlayTutorial(gameModeTriggers[0]);}
		if ((gameModeTriggers[4]>=0) && (EditorTgt)) {triggered=true; PlayTutorial(gameModeTriggers[4]);}
	}
	for(var i:int=1;i<6;i++)
	{
	if ((gameMode==i)&&gameModeTriggers[i]>=0) {triggered=true;PlayTutorial(gameModeTriggers[i]);}
	}
	
	if (gameMode!=oldGameMode && !triggered) //gameMode changed
	{
		//activeT = -1;
	}
	
	if (activeT>-1)
	{
	if (Tuts[activeT].attachTo >-1) parentObject = sim.RequestJunctionList()[Tuts[activeT].attachTo];
	//if ( Tuts[activeT].requiresGameMode>0 && gameMode != Tuts[activeT].requiresGameMode)  activeT=-1;
	}
	else parentObject =editor.SelectedKoboto;
	
	
	//oldGameMode =gameMode;
	 
}

function Stop()
{
	activeT = -1;
}

function Reset()
{
	for (var i:int =0;i<Tuts.length;i++)
	{
		if (Tuts[i].AlreadyPlayed) {Tuts[i].AlreadyPlayed = false;}
	}
}

var gameMode:int;
var gameModeTriggers:int[];

var  Tuts:TutorialPart[];
var gen:GenericFunctions;
var cam:CameraManager;
var manager:UIManager;
var sim:SimManager;
var editor:UIEditor;

public var activeT:int = -1;
var ContinueRect:Rect;
var PlayRect:Rect;
var PauseImage:Texture2D;
var paused:boolean;
var EditorTgt:GameObject =null;
var SimTgt:GameObject =null;
private var timer:boolean;
var screenTimeTimer:float =-1;
var parentObject:GameObject;

var tut1 : GUIStyle;
var tut2 : GUIStyle;
var tut1large : GUIStyle;
var tut2large : GUIStyle;
var tut1largeFlipped : GUIStyle;

function Start ()
{
return;
	opacity=0;
	cam=Camera.main.GetComponent(CameraManager);
	if (!cam) print ("Can't Find Camera");
	gen=GetComponent(GenericFunctions);
	manager=GetComponent(UIManager);
	sim=GetComponent(SimManager);
	editor = GetComponent(UIEditor);
	timer=false;
	gameModeTriggers=new int[10];
	for (var j:int=0;j<10;j++) gameModeTriggers[j] =-1;
	for (var i:int =0;i<Tuts.length;i++)
	{
		if (Tuts[i].gameModeTrigger>=0) gameModeTriggers[Tuts[i].gameModeTrigger] =i;
		Tuts[i].TutRect = MakeRectResolutionIndependent(Tuts[i].TutRect );
		Tuts[i].TutRect2 = MakeRectResolutionIndependent(Tuts[i].TutRect2 );
		Tuts[i].customTapRect= MakeRectResolutionIndependent(Tuts[i].customTapRect );
	}
	
	if (disablePlayButtonAtStart) manager.EnablePlayButton(false);
	activeT=-1;
	
	tut1 = manager.kubrikSkin.GetStyle("tut1");
	tut2 = manager.kubrikSkin.GetStyle("tut2");
	tut1large = manager.kubrikSkin.GetStyle("tut1large");
	tut2large = manager.kubrikSkin.GetStyle("tut2large");
	tut1largeFlipped = manager.kubrikSkin.GetStyle("tut1largeFlipped");
	
	
}

function MakeRectResolutionIndependent(inR : Rect)
{
	var outRect : Rect;
	outRect.x = Screen.width * inR.x /480 ;
	outRect.y = Screen.height * inR.y /320 ;
	outRect.width = Screen.width * inR.width /480 ;
	outRect.height = Screen.height * inR.height /320 ;
	
	return outRect;
}

function PlayTutorial(n:int)
{	//print("playingTutorial# " + n);
if(n<Tuts.length)
{
	if ((Tuts[n].AlreadyPlayed==false)&&(Tuts[n].on)&&(activeT!=n))
	{
		
		//else manager.EnablePlayButton(true);
		if (Tuts[n].OnlyPlayOnce)
		{
			Tuts[n].AlreadyPlayed=true;
			//Tuts[n].on =false;
		}
	
	yield WaitFor(Tuts[n].startWait);
	timer=false;
	activeT=n;
	if (Tuts[n].fadeInTime)
	yield FadeIn(Tuts[n].fadeInTime);
	else opacity =1;
	if (Tuts[n].flashSelectionButtons) sim.flashSelectionButtons =true;
	if (Tuts[n].disablePlayButton) manager.EnablePlayButton(false);
	if (Tuts[n].disableEdit) manager.EnableEdit(false);
	if (Tuts[n].attachToJunc) {if(Tuts[n].waitForOff) yield WaitForOff();}
	
	if (Tuts[n].waitForEditorTarget) yield WaitForEditorTarget(Tuts[n].pauseGame);
	if (Tuts[n].waitForSimTarget) yield WaitForSimTarget(Tuts[n].pauseGame);
	if (Tuts[n].waitForPlay) {manager.highlightPlay=true;yield WaitForTap(PlayRect,Tuts[n].pauseGame);manager.highlightPlay=false;}
	if (Tuts[n].waitForContinue) yield WaitForTap(ContinueRect,Tuts[n].pauseGame);
	if (Tuts[n].waitForCustom) yield WaitForTap(Tuts[n].customTapRect,Tuts[n].pauseGame);
	if (Tuts[n].waitForGameMode) 
	{
		if (Tuts[n].flashCameraButton) manager.lookButtonFlash = true;
		yield WaitForGameMode(Tuts[n].gameModeToWaitFor);
		if (Tuts[n].flashCameraButton) manager.lookButtonFlash = false;
	}
	if (Tuts[n].waitForDrag) yield WaitForDrag();
	if (Tuts[n].waitForDragX) yield WaitForDragX();
	if (Tuts[n].waitForComponent) 
	{editor.components[Tuts[n].componentToWaitFor].highlighted=true;
	yield WaitForComponent(Tuts[n].componentToWaitFor,Tuts[n].pauseGame);
	editor.components[Tuts[n].componentToWaitFor].highlighted=false;}
	
	if (Tuts[n].waitForSelectionChange) yield WaitForSelectionChange();
	
		if (Tuts[n].waitForComponentRemoval) {editor.components[Tuts[n].componentToWaitFor].highlighted=true;
		yield WaitForComponentRemoval(Tuts[n].componentToWaitFor,Tuts[n].pauseGame);
		editor.components[Tuts[n].componentToWaitFor].highlighted=false;}
		
	if (Tuts[n].screenTime>0) {timer =true;screenTimeTimer =Tuts[n].screenTime; yield CountDown(Tuts[n].tapStopsTime);}
	
	if (Tuts[n].flashSelectionButtons) sim.flashSelectionButtons =false;
	manager.EnablePlayButton(true);
	manager.EnableEdit(true);
	//yield FadeOut(Tuts[n].fadeOutTime);
	if (Tuts[n].followUp>=0) TriggerFollowUp(Tuts[n].followUp);
	
	}
}
}

function TriggerFollowUp(n:int)
{
	Tuts[n].on=true;
	PlayTutorial(n);
}

function CountDown(tap:boolean)
{
	while (screenTimeTimer>0)
	{
		screenTimeTimer-=Time.deltaTime;
		if (tap && gen.TouchUpdate(Rect(0,0,Screen.width,Screen.height))) screenTimeTimer=0;
		yield;
	}
	activeT=-1;
}

function WaitForEditorTarget(pause:boolean)
{	
	var selection : boolean =false;
	while (!selection)
	{
		selection=sim.selectionChanged; 
		if (selection) activeT=-1;
		yield;
	}
	/*var TgtTemp:GameObject=null;
	if (pause)
		{
			 paused =true;
			Time.timeScale=0;
		}
	while (TgtTemp==null)
	{
		if (EditorTgt)
		{print("have Target");
			if (pause) 
			 	{	
			 		
			 		Time.timeScale=1;
			 		paused=false;
			 	}
			 activeT=-1;
			TgtTemp =EditorTgt;
		}
		yield;
		
	}
	*/
	
}
function WaitForSimTarget(pause:boolean)
{	var TgtTemp:GameObject=null;
	if (pause)
		{
			 paused =true;
			Time.timeScale=0;
		}
	while (TgtTemp==null)
	{
		if (SimTgt)
		{print("have Target");
			if (pause) 
			 	{	
			 		
			 		Time.timeScale=1;
			 		paused=false;
			 	}
			 activeT=-1;
			TgtTemp =SimTgt;
		}
		yield;
	}
	
	
}

function WaitForComponent(wanted:int, pause:boolean)
{
	//var Junc:Juncore= EditorTgt.GetComponent(Juncore);
	var GO: GameObject =sim.RequestJunctionList()[0];
	var junc :Juncore  =GO.GetComponent(Juncore);

	
	
		var added:boolean=false;
	if (pause)
		{
			 paused =true;
			Time.timeScale=0;
		}
	while(!added)
	{	
		for (var GO1: GameObject in sim.RequestJunctionList())
		{
			var junc1:Juncore =GO1.GetComponent(Juncore);
		for (var ad:Addon in junc1.GetComponentsInChildren(Addon))
			{
				//print("found Component:" +ad.GetProperName());
				if ((ad.GetComponentIndex() == wanted))
				{
					if (pause) 
			 		{	
			 			Time.timeScale=1;
			 			paused=false;
			 		}
			 		activeT=-1;
			 		added =true;
			 		
			 		
				}
		
			}
		}
		
			
		yield;
	}
	
}





function WaitForComponentRemoval(wanted:int, pause:boolean)
{
	//var Junc:Juncore= EditorTgt.GetComponent(Juncore);
	var GO: GameObject =sim.RequestJunctionList()[0];
	var junc :Juncore  =GO.GetComponent(Juncore);
		var added:boolean=true;
	if (pause)
		{
			 paused =true;
			Time.timeScale=0;
		}
	while(added)
	{	
		var test:boolean =false;
		for (var ad:Addon in junc.GetComponentsInChildren(Addon))
			{
				print("found Component:" +ad.GetProperName());
				if ((ad.GetComponentIndex() == wanted))
				{
			 		test =true;
			 		
				}
		
			}
			if (!test)
				{
						if (pause) 
			 		{	
			 			Time.timeScale=1;
			 			paused=false;
			 		}
			 		activeT=-1;
			 		added = false;
				}
		yield;
	}
	
}

function WaitForSelectionChange()
{
	var oldSelection : GameObject = editor.SelectedKoboto;
	while (activeT>=0)
	{
		if (editor.SelectedKoboto != oldSelection) activeT =-1;
		yield;
	}
}

function WaitForTap(tapRec:Rect, pause:boolean)
	{
		
		if (pause)
		{
			gen.GlobalPause(false);
			// paused =true;
			//Time.timeScale=0;
		}
		 while(activeT>=0)
		{	
			if (gen.TouchUpdate(tapRec)  || (timer&&(screenTimeTimer<=0))   )
			 {	
			 	print ("Tapped..");
			 	if (pause) 
			 	{	gen.GlobalUnPause(false);
			 		//Time.timeScale=1;
			 		//paused=false;
			 	}
			 	activeT=-1;
			 	
			 }
			yield;
		}
	}
	

	
function WaitForOff()
{
	var junc:Juncore = parentObject.GetComponent(Juncore);
	if (junc)
	while (activeT>=0)
	{
		if (!junc.IsOn()) activeT=-1;
		yield;
	}
}
var startDrag :Vector3;
function WaitForDrag()
{
	yield WaitForSeconds(0.5);
	startDrag =cam.dragOffset;
	
	while (activeT>=0)
	{
	//var touchInfo:iPhoneTouch = gen.GetTouchInfo(0);
	//if ((touchInfo.phase == iPhoneTouchPhase.Moved)&&(iPhoneInput.touchCount==1)) {activeT=-1;}
	//print (cam.dragOffset.magnitude);
	if ((cam.dragOffset - startDrag).magnitude >60) activeT=-1;
	yield;
	}
}

function WaitForDragX()
{
	yield WaitForSeconds(0.1);
	startDrag =cam.dragOffset;
	
	while (activeT>=0)
	{
	//var touchInfo:iPhoneTouch = gen.GetTouchInfo(0);
	//if ((touchInfo.phase == iPhoneTouchPhase.Moved)&&(iPhoneInput.touchCount==1)) {activeT=-1;}
	//print (cam.dragOffset.magnitude);
	if (Mathf.Abs(cam.dragOffset.x - startDrag.x) >40) activeT=-1;
	yield;
	}
}


function WaitFor(t:float)
	{	
		yield WaitForSeconds(t);
	}
	
function WaitForGameMode(m:int)
	{
		while (activeT>=0)
		{
			if (gameMode ==m) activeT=-1;
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
var followRect:Rect;
var followRect2:Rect;
var opacity:float;
function TutGUI()
{
	//GUI.skin = manager.kubrikSkin;
	if (activeT>=0) 
	{	
		var tRect : Rect =Tuts[activeT].TutRect;
		var tRect2 : Rect =Tuts[activeT].TutRect2;
		GUI.contentColor= Color(1,1,1,opacity);
		if (Tuts[activeT].attachToJunc && parentObject)
		{	
			var targetPoint:Vector3;
			targetPoint= Camera.main.WorldToScreenPoint(parentObject.transform.position);
			targetPoint.y = Screen.height - targetPoint.y;
			followRect =Rect(Tuts[activeT].TutRect.x+targetPoint.x,  Tuts[activeT].TutRect.y+targetPoint.y, Tuts[activeT].TutRect.width, Tuts[activeT].TutRect.height);
			followRect2 =Rect(Tuts[activeT].TutRect2.x+targetPoint.x,  Tuts[activeT].TutRect2.y+targetPoint.y, Tuts[activeT].TutRect2.width, Tuts[activeT].TutRect2.height);
			tRect =followRect;
			tRect2 =followRect2;
			//if (Tuts[activeT].TutorialImage) GUI.Label(followRect,GUIContent(Tuts[activeT].TutorialImage));
		}
		
		if ( Tuts[activeT].requiresGameMode<0 || gameMode == Tuts[activeT].requiresGameMode)
		{
		if (Tuts[activeT].TutorialImage) GUI.DrawTexture(tRect,Tuts[activeT].TutorialImage);
		if (Tuts[activeT].TutorialImage2) GUI.DrawTexture(tRect2,Tuts[activeT].TutorialImage2);
		if (Tuts[activeT].TutorialText != "")
		{
			if (Tuts[activeT].style ==1) GUI.Label(tRect,Tuts[activeT].TutorialText,tut1);
			if (Tuts[activeT].style ==2) GUI.Label(tRect,Tuts[activeT].TutorialText,tut2);
			if (Tuts[activeT].style ==3) GUI.Label(tRect,Tuts[activeT].TutorialText,tut1large);
			if (Tuts[activeT].style ==4) GUI.Label(tRect,Tuts[activeT].TutorialText,tut2large);
			if (Tuts[activeT].style ==5) GUI.Label(tRect,Tuts[activeT].TutorialText,tut1largeFlipped);
		}
		}
		
				
	}
	
	//if (paused) GUI.Label(ContinueRect, PauseImage);
	
}

