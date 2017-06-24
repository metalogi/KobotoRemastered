var found : boolean;

var reset : boolean=false;
var identifier : int;
var saveName : String;

var defaultMat : Material;
var foundMat : Material;

function Start()
{
	saveName = Application.loadedLevel + "_bonus_" + identifier;
	if (PlayerPrefs.GetInt(saveName, 0) == 1) found =true;
	else found =false;
	
	if (reset) {found = false;PlayerPrefs.SetInt(saveName, 0);}
	if (found) GetComponent.<Renderer>().material = foundMat;
	else GetComponent.<Renderer>().material = defaultMat;
	
	BonusStarManager();
}

function OnTriggerEnter (col:Collider) {
	if (col.GetComponent(Juncore))
	{
	found=true;
	GetComponent.<Renderer>().material = foundMat;
	PlayerPrefs.SetInt(saveName, 1);
	
	BonusStarManager();
	}
}


function BonusStarManager()
{
	var foundCount : int = 0;
	
	var bonusStarCountKey : String = Application.loadedLevel + "_BonusStarCount";
	var bonusStarsFoundKey : String = Application.loadedLevel + "_BonusStarsFound";
	var levelPlayedKey : String = Application.loadedLevel + "_LevelPlayed";
	 
	var bonusStars : Array = FindObjectsOfType(Bonus);
	var bonusStarCount =bonusStars.length;
	PlayerPrefs.SetInt(bonusStarCountKey, bonusStarCount);
	
	for (var bs:Bonus in bonusStars) if (bs.found) foundCount++;
	
	PlayerPrefs.SetInt(bonusStarsFoundKey, foundCount);
	PlayerPrefs.SetInt(levelPlayedKey, 1);
	
	//print ("foundCount =" + foundCount);
	  
}