var backButton : GenericButton;
var infoButton : GenericButton;

var resetButton : GenericButton;
var resetQ :boolean=false;

var yesButton : GenericButton;
var noButton : GenericButton;

var kubrikSkin : GUISkin;
var trophy : Transform;
var cabinetWidth : float =200;
var rowHeight :float =20;
var trophySpacing: float =10;

var loading :boolean=false;
var infoScreen :boolean =false;
var infoTex : Texture2D;
var boxTex : Texture2D;

var textBox : GenericButton;
var textLine : Rect[];
var textLine2 : Rect[];
var numLines : int =8;

var gen : GenericFunctions;

var click :AudioSource;
var worldDefs : WorldObjectDefs;

function Awake()
{
	gen = GetComponent(GenericFunctions);
	if (Screen.width == 1024) kubrikSkin = Resources.Load("kubrikGUISkin_ipad");
	else kubrikSkin = Resources.Load("kubrikGUISkin");
	
	backButton =new GenericButton();
	
	backButton.SetRect(0.05,0.92,0.1);
	backButton.SetTex("back_icon");
	
	infoButton =new GenericButton();
	infoButton.SetRect(0.9,0.92,0.1);
	infoButton.tex=infoTex;
	
	resetButton =new GenericButton();
	resetButton.SetRect2(0.5,0.86,0.3,0.25);
	resetButton.tex=boxTex;
	yesButton =new GenericButton();
	yesButton.SetRect2(0.25,0.8,0.25,0.3);
	yesButton.tex=boxTex;
	noButton =new GenericButton();
	noButton.SetRect2(0.75,0.8,0.25,0.3);
	noButton.tex=boxTex;
	
	textBox = new GenericButton();
	textBox.SetRect2(0.5,0.4,0.8,0.66);
	print ("textBox: " + textBox.baseRect.ToString());
	textLine = new Rect[numLines];
	textLine2 = new Rect[numLines];
	for (var line:int=0; line<numLines; line++)
	{
		textLine[line] = textBox.baseRect;
		textLine[line].height = textBox.baseRect.height/numLines;
		textLine[line].y = textBox.baseRect.y + line*textBox.baseRect.height/numLines;
		
		textLine2[line]=textLine[line];
		textLine2[line].x +=Screen.width/2.3;
		textLine2[line].width *=0.5;
	}
	
	
	SetUpTrophies();
	//backButton.SetTex("back_icon");
		
		
	
	
}

var nTrophies : int;
function SetUpTrophies()
{
	worldDefs = new WorldObjectDefs();
	
	var levelNos : int[] = new int[4];
	levelNos=worldDefs.GetNumberOfLevels();
	
	var trophyPlacement : Vector3 = Vector3.zero; 

	var realLevelNo: int=0;
	for (var world : int =0; world <4; world++) //cycle throuh worlds
	{
		for (var i : int =0; i<levelNos[world]; i++) //cycle through levels in eachworld
		{
			
			if (world>0)
			{
				var countString : String = (realLevelNo).ToString() + "_BonusStarCount";
				var nTokens: int = PlayerPrefs.GetInt(countString,0);
				print ("checking: " +countString+ " found: " +nTokens);
				for (var tokenID : int = 0; tokenID< nTokens; tokenID++)
				{
					
					
					
					trophyPlacement.z = 2*cabinetWidth * (world-1);
					trophyPlacement.z += (tokenID+1)*(cabinetWidth / (nTokens+1));
					if (i>9)
					{
						trophyPlacement.z += cabinetWidth;
						trophyPlacement.y = -(i-10)*rowHeight;
					}
					else trophyPlacement.y = -i*rowHeight;
					
					trophyPlacement.y+=3.5;
					var tokenString : String = realLevelNo.ToString() + "_bonus_" + tokenID.ToString();
					
						var trophyInstance : Transform = Instantiate(trophy, trophyPlacement, Quaternion.identity);
						var tScript: Trophy = trophyInstance.GetComponent(Trophy);
						tScript.world = world;
						tScript.level = i;
						tScript.id = tokenID;
						if (PlayerPrefs.HasKey (tokenString) ) 
					{
						if (PlayerPrefs.GetInt(tokenString,0) ==1) 
						{
							tScript.rend.sharedMaterial = tScript.foundMat;
						}
						else tScript.rend.sharedMaterial = tScript.notFoundMat;
					}
					else print ("hmmmm... can't find token fo world " +world + " level " + i + " id " + tokenID); 
				} 
			}
			realLevelNo++;
		}
		
		
	} 
	nTrophies = PlayerPrefs.GetInt("TotalBonusTokens", 0);
	if (PlayerPrefs.GetInt("LevelsCompleted",6) >6) nTrophies+=1;

}

function DeleteTrophies()
{
	var Trophies: Trophy[] = FindObjectsOfType(Trophy);
	for (var tr:Trophy in Trophies) 
	{
		Destroy(tr.gameObject);
	}
}
function Update () {
}


function OnGUI()
{
	GUI.skin = kubrikSkin;
		if (loading) GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), Resources.Load("loading"));
		else
		{
		if (infoScreen)
			{
				GUI.Label(Rect(0,0,Screen.width,Screen.height), "", "Box");
				
			
				
				var gobacki : boolean = GUI.Button (infoButton.baseRect, backButton.tex);
				if (gobacki) {click.Play();infoScreen=false;}
				
				if(resetQ)
				{
					GUI.Label(textLine[3], "ARE YOU SURE?? " , "whiteTextLarge");
				
				GUI.Label(textLine[5], "This will erase " , "whiteTextLarge");
				GUI.Label(textLine[6], "all your progress" , "whiteTextLarge");
					var yes : boolean= GUI.Button (yesButton.baseRect, yesButton.tex);
					if (yes) YesButton();
					var no : boolean= GUI.Button (noButton.baseRect, noButton.tex);
					if (no) NoButton();
					GUI.Label(yesButton.baseRect, "Yes", "whiteTextLarge");
					GUI.Label(noButton.baseRect, "No", "whiteTextLarge");

				}
				else
				{
				GUI.Label(textLine[0], "    Kobotos saved: ", "whiteText");
				GUI.Label(textLine2[0], PlayerPrefs.GetInt("SavedKobotos", 0).ToString(), "whiteText");
				
				GUI.Label(textLine[1], "    Bonus Tokens recovered: " , "whiteText");
				GUI.Label(textLine2[1], nTrophies.ToString() , "whiteText");
				
				GUI.Label(textLine[2], "    Kobotos Killed: " , "whiteText");
				GUI.Label(textLine2[2], PlayerPrefs.GetInt("DeadKobotos", 0).ToString() , "whiteText");
				
				GUI.Label(textLine[3], "    Kobotos Squashed: " , "whiteText");
				GUI.Label(textLine2[3], PlayerPrefs.GetInt("SquashedKobotos", 0).ToString() , "whiteText");
				
				GUI.Label(textLine[4], "    Kobotos Drowned: " , "whiteText");
				GUI.Label(textLine2[4], PlayerPrefs.GetInt("DrownedKobotos", 0).ToString() , "whiteText");
				
				GUI.Label(textLine[5], "    Kobotos Impaled: " , "whiteText");
				GUI.Label(textLine2[5], PlayerPrefs.GetInt("ImpaledKobotos", 0).ToString() , "whiteText");
				
				GUI.Label(textLine[6], "    Kobotos Flipped: " , "whiteText");
				GUI.Label(textLine2[6], PlayerPrefs.GetInt("FlippedKobotos", 0).ToString() , "whiteText");
				
				GUI.Label(textLine[7], "    JetPacks Used: " , "whiteText");
				GUI.Label(textLine2[7], PlayerPrefs.GetInt("JetPacksUsed", 0).ToString() , "whiteText");
					var reset : boolean = GUI.Button (resetButton.baseRect, resetButton.tex);
					GUI.Label(resetButton.baseRect, "Reset game", "whiteTextLarge");
					if (reset) {click.Play();resetQ=true;}
				}
			}
		else
			{
				var info : boolean = GUI.Button (infoButton.baseRect, infoButton.tex);
				if (info) InfoButton();
				var goback : boolean = GUI.Button (backButton.baseRect, backButton.tex);
				if (goback) BackButton();
			}
		}

}

function InfoButton()
{
	click.Play();
	infoButton.Press(); 
	yield WaitForSeconds(0.04);
	infoButton.Unpress();
	infoScreen=true;
}

function BackButton()
{
	click.Play();
	backButton.Press(); 
	yield WaitForSeconds(0.04);
	backButton.Unpress();
	loading=true; Application.LoadLevel(2);
}

function ResetButton()
{
	click.Play();
	resetButton.Press(); 
	yield WaitForSeconds(0.04);
	resetButton.Unpress();
	resetQ=true;
}

function NoButton()
{
	click.Play();
	noButton.Press(); 
	yield WaitForSeconds(0.04);
	noButton.Unpress();
	resetQ=false;
}

function YesButton()
{
	click.Play();
	yesButton.Press(); 
	yield WaitForSeconds(0.04);
	yesButton.Unpress();
	resetQ=false;
	gen.ResetPlayerPrefs();
	DeleteTrophies();
	nTrophies=0;
}