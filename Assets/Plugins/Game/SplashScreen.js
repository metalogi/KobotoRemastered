@script RequireComponent (GenericFunctions)

private var gen : GenericFunctions;
var logo:Texture2D;
var mask:Texture2D;
var splash:Texture2D;

var spacingTime:float = 1;
var fadeTime:float=4;
var menuSwitchDelay:float=1500;

var initialMenuCameraPosition:Vector2;

var StartGameRect:Rect;
var FullScreenRect:Rect;
private var ticker:float=0;
private var opacity:float;
var state:int=0; // 0=loading, 1=new/continue, 2=levelSelect, 3=waiting for game to load before starting


function Start()
{
	gen=GetComponent(GenericFunctions);
	StartGameRect=Rect( Screen.width/2-64, Screen.height*2/3, 128, 32 );
	FullScreenRect=Rect(0,0,512,512);
}

function StartGame()
{
	Application.LoadLevel("menu");
}
function Update () 
{
	// update the ticker, and once it's long enough for the initial screen to show up, switch 	to state 1
	ticker += Time.deltaTime;
	if( ticker > spacingTime*2+fadeTime*2 && state == 0) state = 1;
		
	// state 1: (new/continue)
	if( state == 1 )
	{
		if(gen.TouchUpdate(StartGameRect))
		{	state=3;
			StartGame();
			
		}
	}
		
}

function OnGUI()
{
	if (state==1)
	{
		GUI.Label( FullScreenRect,  GUIContent(splash) );
		GUI.Label(StartGameRect, "Play","Box");
	}
	
	 // mask - covers up the 3d scene until enough time has passed
		if( ticker >= spacingTime*2+fadeTime*2 )
		{
			opacity = 1.0 - Mathf.Min((ticker - (fadeTime*2+spacingTime*2))/fadeTime, 1.0);
			GUI.contentColor = Color(1,1,1,opacity);
			GUI.Label( FullScreenRect,  GUIContent(mask) );
			GUI.contentColor = Color.white;
		}
		else
		{
			GUI.Label( FullScreenRect,  GUIContent(mask) );
		}

		// company logo fade in
		if( ticker >= spacingTime && ticker < spacingTime+fadeTime )
		{
			opacity = (ticker - spacingTime)/fadeTime;
			GUI.contentColor = Color(1,1,1,opacity);
			GUI.Label( FullScreenRect,  GUIContent(logo) );
			GUI.contentColor = Color.white;
		}
		// company logo fade out
		if( ticker >= spacingTime+fadeTime && ticker < spacingTime+fadeTime*2 )
		{
			opacity = 1.0 - (ticker-(fadeTime+spacingTime))/fadeTime;
			GUI.contentColor = Color(1,1,1,opacity);
			GUI.Label( FullScreenRect,  GUIContent(logo) );
			GUI.contentColor = Color.white;
		}
		
		
}