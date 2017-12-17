// access to the camera/simulator/genericFunctions
#pragma implicit

function SetCameraManager( Cam ) { cam = Cam; }


private var cam : CameraManager;
private var sim : SimManager;
private var gen : GenericFunctions;
private var man : UIManager;
var placedComponentCount : int;
var oldCore : GameObject;
var kubrikSkin : GUISkin;

var stopSignRect:Rect;

var iconSize:float;
var ipad : boolean = false;
var iphone4 : boolean =false;

var toolText : GUIStyle;
var toolText2 : GUIStyle;


function Awake()
{

return;
	if (Screen.width == 960) iphone4 =true; else iphone4 =false;
	if (Screen.width == 1024) ipad =true; else ipad =false;
	
	if (ipad) print ("running on ipad");
	sim = GetComponent(SimManager);
	gen = GetComponent(GenericFunctions);
	man = GetComponent(UIManager);
	placedComponentCount =0;
	kubrikSkin = man.kubrikSkin;
	toolText = man.kubrikSkin.GetStyle("toolText");
	toolText2 = man.kubrikSkin.GetStyle("toolText2");
	//var sms = uiPrefs.WorkboxToolIconSize;
	if(components.length<3) iconSize = Screen.width/6;
	else iconSize = (1.0/(components.length+3)) *Screen.width;
	//print (iconSize);
	//sms = 0.2 *Screen.width;
	
	for( i=0; i<components.length; i++ )
	{	
		// find the location for this component's graphic
		//components[i].ScreenPosX = Screen.width - iconSize/2 - BoxMargin;
		//components[i].ScreenPosY  = iconSize/2 + (iconSize*i) + BoxMargin;
		components[i].initialCount= components[i].count;
		//if (ipad) components[i].ScreenPosX +=100;
		components[i].countString = components[i].count.ToString();
		
		components[i].butt = new GenericButton();
		var YSpacing :float=0.23;
		if (components.length>3) YSpacing= 0.19;
		var wbiAddon:Addon =components[i].childPrefab.GetComponent(Addon);
		components[i].butt.tex=wbiAddon.GetTexture();
		components[i].butt.SetRect(0.9, (i+0.5)*YSpacing, 0.12);
		
		components[i].ScreenPosX = components[i].butt.baseRect.x + 0.5*components[i].butt.baseRect.width;
		components[i].ScreenPosY = components[i].butt.baseRect.y + 0.5*components[i].butt.baseRect.width;
		
		components[i].countRect = Rect(components[i].butt.baseRect.x +(components[i].butt.baseRect.width-30), components[i].butt.baseRect.y +(components[i].butt.baseRect.height-30), 30,30); 
//var wbiRect = Rect( components[i].ScreenPosX - iconSize/2, components[i].ScreenPosY - iconSize/2 , iconSize, iconSize );
//var wbiCountRect = Rect(wbiRect.x+(wbiRect.width-cifs), wbiRect.y+(wbiRect.height-cifs)*.65,cifs*2,cifs);
		
	}
	
	
	
	
	//stopSignRect = Rect
}

// prefs for the user interface
class UIEditorPreferences
{
	//@HideInInspector 
	var JunctionSelectIdealButtonSize = 64; //changed from wii value of 96 

	var WindowTopMargin = 10; //changed from wii value of 20

	//@HideInInspector
	var WorkboxToolIconSize =  32; //changed from wii value of 96 

	var CornerBoxWidth = 128;
	var CornerBoxEntryHeight = 32;

	var RotateButtonMargin = 20;
	var CameraRotateControlSpeed = 90.0;
	var MaxSpin:float=40;

	private var mountPointSnapRadius = 8.5;

    // these are longhand for yellow, green, red at the moment
	var nexusSelectedMaterial : Material;
	var unplaceableComponentMaterial : Material;
	var placeableComponentMaterial : Material;

	var guiNumberStyle : GUIStyle;

	function GetMountPointSnapRadius() { return mountPointSnapRadius; }
} 
var uiPrefs : UIEditorPreferences;

// defines the margins around the component and junction lists on the left and right side of the editor
private var BoxMargin = 10; //changed from wii value of 20
function GetBoxHeight() { return BoxMargin; }

// class defining a UI workspace component
class UIComponent
{
	var count : int;
	var countString : String;
	var countRect : Rect;
	var childPrefab : GameObject;
	var showDescription : boolean =false;
	var ScreenPosX : float;
	var ScreenPosY : float;
	var initialCount :int;
	var butt : GenericButton;
	var highlighted : boolean=false;
	var scale:float =1.0;
}
var components : UIComponent[];

private var activeTool : GameObject = null;
private var activeToolMirror : GameObject = null;
private var mouseOver = false;
var bracketIcon : Texture;
var highlightTool = 0;
var highlightToolTracker = 0.0;
var highlightToolPop = 0.0;

var ToolDescription : String;

function GetActiveTool(){return activeTool;}




// selections and tool dropping
var snapSetTemp = new Array();



function Handle()
{
	var junctionList = sim.RequestJunctionList();
	
}




var SelectedKoboto : GameObject;






function HandleToolSwitching()
{	
	if (!SelectedKoboto) SelectedKoboto = sim.RequestJunctionList()[0];
	for( i=0; i<components.length; i++ )
	{
	
		if (gen.TouchUpdate(components[i].butt.touchRect))
		{
			
			
				UpdateTool(i);
				components[i].scale =1.1;
				yield WaitForSeconds(0.04);
				components[i].scale =1.0;
			
		}

	}


}







function UpdateTool(i:int)
{
	if (!SelectedKoboto) {print("ERROR: No Selected koboto"); return;}
	
	var targetJunc : Juncore = SelectedKoboto.GetComponent(Juncore);
	
	//get mountPoint info
	var newTool : GameObject =components[i].childPrefab;
	var newToolAddon : Addon =newTool.GetComponent(Addon);
	var mountType : String =newToolAddon.GetHostTypes();
	
	//find target mountPoint on selected koboto and see if theres anything there
	var targetMountPointArray : Array = SelectedKoboto.GetComponentsInChildren(MountPoint);
	var targetMountPoints : MountPoint[] =targetMountPointArray.ToBuiltin(MountPoint);
	
	var targetMP : MountPoint;
	
	var addTool : boolean = (components[i].count>0);
	var previousOccupant:GameObject;
	for (var mp:MountPoint in targetMountPoints)
	{
		if (mp.GetMountType() == mountType)
		{
			targetMP = mp;
			previousOccupant =mp.GetNode();
			
			if (previousOccupant) print ("previousOccupant=" + previousOccupant.name);
			else print("empty");
			
			
		}
	}
	
	//look to see if other guy has the tool
	var takenFromOtherGuy :boolean =false;
	if (targetJunc.otherJunc)
	if (!addTool && targetMP &&!previousOccupant)
	{	
		var otherJunc : Juncore =targetJunc.otherJunc;
		var otherGO : GameObject =otherJunc.gameObject;
		print ("look to see if other guy has the tool: "+ otherGO.name );
		var otherMountPointArray : Array = otherGO.GetComponentsInChildren(MountPoint);
		var otherMountPoints : MountPoint[] =otherMountPointArray.ToBuiltin(MountPoint);
		for (var omp:MountPoint in otherMountPoints)
			{
			if (omp.GetMountType() == mountType)
				{
					print ("foundMAtching MountType " + mountType+  " " +omp.name);
					
					var otherNode : GameObject=omp.GetNode();
					//print ("has node " +otherNode.name);
					if (otherNode)
					{
						print ("found anObject");
					var otherAddon : Addon = otherNode.GetComponent(Addon);
					if (otherAddon&&(otherAddon.GetProperName() == newToolAddon.GetProperName()))
					{
						takenFromOtherGuy = true;
						print ("removingTool from " + otherGO.name);
						omp.SetNode(null);
						otherAddon.disabled=true;
						var cat : CatapultMuscle = otherNode.GetComponent(CatapultMuscle);
						if (cat) cat.on =false; 
						otherJunc.SetAddonList(false);
						components[i].count++;
						components[i].countString=components[i].count.ToString();
						addTool =true;
						cam.TossSound();
						SwapAnim (otherNode, otherNode.transform.position, targetMP.transform.position, 0.2);
						yield WaitForSeconds(0.2);
						Destroy(otherNode);
					}
					}
			
			
				}
			}
		
	}
	
	if (previousOccupant)
			{
				var previousAddon : Addon = previousOccupant.GetComponent(Addon);
				if (previousAddon.GetProperName()==newToolAddon.GetProperName()) addTool =false;
				if (!previousAddon.disposable)
				{
				targetMP.SetNode(null);
				previousAddon.disabled=true;
				targetJunc.SetAddonList(false);
				var oldIndex :int =previousAddon.GetComponentIndex();
				components[oldIndex].count++; 
				components[oldIndex].countString=components[oldIndex].count.ToString();
				
				var iconPos:Vector3 = Vector3(components[i].ScreenPosX, Screen.height-components[i].ScreenPosY, 50);
				SwapAnimScreenSpace(previousOccupant,SelectedKoboto.transform,iconPos, 0.2,true);
				cam.KbOffSound();
				yield WaitForSeconds(0.2);
				 Destroy(previousOccupant);
				}
				
				
				
			}
	
	if (addTool&&targetMP)
	{
		print ("addingTool");
		//yield WaitForSeconds(0.2);
		//var tool : GameObject = targetJunc.AutoCreateAddon(newTool, false);
		var creationPoint:Vector3 = Vector3(components[i].ScreenPosX, Screen.height-components[i].ScreenPosY, 50);
		
		var atool : GameObject  = Instantiate(newTool, creationPoint, Quaternion.Euler(0,0,0) );
		if (!takenFromOtherGuy) SwapAnimScreenSpace (atool, SelectedKoboto.transform, creationPoint, 0.2,false);
		//var tool : GameObject = targetJunc.AutoCreateAddon(newTool, false);
		
		var tool : GameObject = Instantiate(newTool, targetMP.transform.position, targetMP.transform.rotation);
		
		targetMP.SetNode(tool);
		components[i].count--;
		components[i].countString=components[i].count.ToString();
		var toolAddon : Addon = tool.GetComponent(Addon);
		toolAddon.SetHostMountPoint(targetMP);
		toolAddon.SetComponentIndex(i);
		//place wheels
		if (toolAddon.wheels)
		{
			//toolAddon.transform.localPosition.y -= targetJunc.wheelShift;
			var wx : float;
			var wy : float;
			var wz : float;
			var wheelIndex : int =0;
			for ( wy = 0; wy<2; wy+=1)
			for ( wx =-1; wx<2; wx+=2)
			for ( wz = -1; wz<2; wz+=2)
			{
				if(wheelIndex < toolAddon.wheelObjects.length)
				{
					var wheel : GameObject = toolAddon.wheelObjects[wheelIndex];
					wheel.transform.localPosition.x = targetJunc.wheelPlacementVector.x * wx;
					//wheel.transform.localPosition.y = targetJunc.wheelPlacementVector.y * wy;
					wheel.transform.localPosition.z = targetJunc.wheelPlacementVector.z * wz;
				}
			wheelIndex+=1;
			}
		}
		
		targetJunc.SetAddonList(false);
		if (!targetJunc.on) targetJunc.TurnOn();
		cam.KbOnSound();
		yield WaitForSeconds(0.2);
		Destroy(atool);
		
		
	}
	
	
	


		
}



function SwapAnim (go:GameObject, startPos:Vector3, endPos:Vector3, animTime:float)
{
	var timer:float=0;
	var trans : Transform = go.transform;

	while (timer<animTime)
	{
	
		trans.position = Vector3.Lerp(startPos, endPos, timer/animTime);
		timer+=Time.deltaTime;
		yield;
	}
}
function SwapAnimScreenSpace(go:GameObject, targetTransform:Transform, startScreenPos:Vector3, animTime:float, invert:boolean)
{
	var timer:float=0;
	var trans : Transform = go.transform;
	var screenP :Vector3;
	var targetScreenP : Vector3;
	while (timer<animTime)
	{
		targetScreenP = Camera.main.WorldToScreenPoint(targetTransform.position);
		var t :float = timer/animTime;
		if (invert) t=1-t;
		screenP = Vector3.Lerp(startScreenPos,targetScreenP,t);
		
		trans.position=Camera.main.ScreenToWorldPoint(screenP);
		timer+=Time.deltaTime;
		yield;
	}
}



var ToolDescriptionStyle : GUIStyle;
function HandleGUI()
{

	
	if (SelectedKoboto !=null) WorkBoxWindowGUI();
}

var showDesc : boolean= false;
function ShowDesc()
{
	yield WaitForSeconds(0.3);
	showDesc = true;
}





function WorkBoxWindowGUI()
{
	for(var i:int=0; i<components.length; i++ )
	{
		if ((components[i].count != 0) ) GUI.contentColor =Color.white;
		else GUI.contentColor=Color(1,1,1,.5);
		
		// draw component icon
		if (components[i].highlighted) components[i].butt.ShowScaled(1+0.08*Mathf.Sin(Time.time*12),0);
		else components[i].butt.Show(0);
		//else components[i].butt.ShowScaled(components[i].scale,0);
		
		if (SelectedKoboto)
		{ GUI.Label(components[i].countRect, components[i].countString, toolText);
		GUI.Label(components[i].countRect, components[i].countString, toolText2);
		}
	}
}
/*
// change which component is in the user's hand
function ChangeActiveTool( index : int )
{
	if( activeTool )
	{	
		Destroy( activeTool );
		var tlAddon:Addon =activeTool.GetComponent(Addon);
		var oldComponentIndex = tlAddon.GetComponentIndex();
		if( oldComponentIndex == -1 ) print ("ERROR: attempt to destroy base component tool");
		else components[oldComponentIndex].count ++;
	}
	if( activeToolMirror )
	{	
		Destroy( activeToolMirror );
	}
	
	if( index == -1 ) 
	{
		activeTool = null;
		activeToolMirror = null;
	}
	else
	{
		components[index].count--;
		
		activeTool = Instantiate(components[index].childPrefab, gen.GetMouseSpacePoint(cam.GetTargetDistance()), Quaternion.Euler(0,0,0) );
		var atcb:Addon = activeTool.GetComponent(Addon);
		//atcb.ChangeMaterial( uiPrefs.unplaceableComponentMaterial );
		atcb.SetOpacity(1.0);
		atcb.SetComponentIndex( index );

		if( atcb.MirrorSide().x != 1 || atcb.MirrorSide().y != 1 || atcb.MirrorSide().z != 1 )
		{
			activeToolMirror = Instantiate(components[index].childPrefab, gen.GetMouseSpacePoint(cam.GetTargetDistance()), Quaternion.Euler(0,0,0) );
			activeToolMirror.transform.localScale = atcb.MirrorSide();
			var atmcb:Addon = activeToolMirror.GetComponent(Addon);
			//atmcb.ChangeMaterial( uiPrefs.unplaceableComponentMaterial );
			atmcb.SetOpacity(1.0);
			atmcb.SetComponentIndex( index );
		}
	}
}

function ChangeActiveCore( newTarget : GameObject )
{
	var tgt=cam.GetEditorTarget();

	if( tgt )
	{
		for( var ch:Transform in tgt.transform )
		{
			var mp:MountPoint = ch.GetComponent(MountPoint);
			var nd = mp ? mp.GetNode() : null;
			var ad:Addon = nd ? nd.GetComponent(Addon) : null;
			if( ad ) {ad.SetOpacity(1.0);
				//ad.ChangeMaterial(null);
			}
		}
	}

	if( tgt && tgt.GetComponent(Juncore) )
	{		
		cam.observationPoint.position.z = tgt.transform.position.z;
	}
	
	cam.SetEditorTarget( newTarget );
}
*/

function CleanUp()
{	
		for( i=0; i<components.length; i++ )
	{			
		components[i].count= components[i].initialCount;
		components[i].countString=components[i].count.ToString();
	}
	//oldCore=cam.GetEditorTarget();
	//ChangeActiveCore( null );
	//ChangeActiveTool( -1 );
}

