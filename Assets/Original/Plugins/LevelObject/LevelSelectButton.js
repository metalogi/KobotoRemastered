var arrow : MeshRenderer;
var house : MeshRenderer[];
var house2 : MeshRenderer[];
var state:int = 0;

var worldNumber: int;
var levelNumber: int;
var levelName: String;

private var arrowMaterial : Material;
private var houseMaterial : Material;
var selectMaterial : Material;

function Awake()
{
	SetState(0);
	if (levelName =="") levelName ="level name";
	//arrowMaterial = arrow.material;
	//houseMaterial = house.material;
}

function GetState() : int
{
	return state;
}

function SetState( value:int )
{
	state = value;
	arrow.enabled = (state == 1);
	for (var i:int =0; i<3; i++)
	{
		if ((i+1)==worldNumber)
		{
			//print ("switching on house: " + (i+1));
		house[i].enabled = (state == 2);
		if (house2[i]) house2[i].enabled = (state == 2);
		}
		else
		{
			house[i].enabled = false;
			if (house2[i]) house2[i].enabled = false;
		}
	}
	
}

/*
function SetHighlight( value:boolean )
{
	if( value )
	{
		arrow.material = selectMaterial;
		house.material = selectMaterial;
	}
	else
	{
		arrow.material = arrowMaterial;
		house.material = houseMaterial;
	}	
}

*/


/*

var Prereq : String;
var AltPrereq : String;
var LevelName : String;
var Description : String;

function GetDescription() { return Description; }
function GetLevelName() { return LevelName; }
function GetPrereq() { return Prereq; }
function GetAltPrereq() { return AltPrereq; }

function Reload()
{
	var mr = GetComponent(MeshRenderer);
	mr.enabled = IsVisible();
}

function SetVisible( mat : Material )
{
	GetComponent(MeshRenderer).material = mat;
}
function IsComplete() { return PlayerPrefs.GetInt(LevelName)==1; }
function IsVisible() 
{ 
	return (Prereq == "" && AltPrereq == "") || 
		   (PlayerPrefs.GetInt(Prereq) == 1) || 
		   (PlayerPrefs.GetInt(AltPrereq) == 1); 
}

function OnDrawGizmos()
{
	for( ml in FindObjectsOfType( LevelSelectButton ) )
	{
		if( ml.Prereq != "" && ml.Prereq == LevelName )
		{
			Gizmos.DrawLine( ml.transform.position, transform.position );

			Gizmos.DrawLine( transform.position + Vector3(0,1,0), transform.position + Vector3(1,0,0) );
			Gizmos.DrawLine( transform.position + Vector3(0,1,0), transform.position + Vector3(-1,0,0) );
			Gizmos.DrawLine( transform.position + Vector3(0,-1,0), transform.position + Vector3(1,0,0) );
			Gizmos.DrawLine( transform.position + Vector3(0,-1,0), transform.position + Vector3(-1,0,0) );
		}
		if( ml.AltPrereq != "" && ml.AltPrereq == LevelName )
		{
			Gizmos.DrawLine( ml.transform.position, transform.position );

			Gizmos.DrawLine( transform.position + Vector3(0,.8,0), transform.position + Vector3(.8,0,0) );
			Gizmos.DrawLine( transform.position + Vector3(0,.8,0), transform.position + Vector3(-.8,0,0) );
			Gizmos.DrawLine( transform.position + Vector3(0,-.8,0), transform.position + Vector3(.8,0,0) );
			Gizmos.DrawLine( transform.position + Vector3(0,-.8,0), transform.position + Vector3(-.8,0,0) );
		}
	}
}*/