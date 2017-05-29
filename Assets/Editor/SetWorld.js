class SetWorld extends ScriptableWizard
{
	
@MenuItem ("World/SetTo/Forest")
static function SetWorldToForest () {
	SetWorldNumber(1);
	}

@MenuItem ("World/SetTo/Snow")
static function SetWorldToSnow () {
	SetWorldNumber(2);
	
	}

@MenuItem ("World/SetTo/KarimsGayWonderland")
static function SetWorldToMachine () {SetWorldNumber(3);}


static function SetWorldNumber(n:int)
{
	print ("setting world to: " +n);
	//Get new and old object names from worldObjectDefs
	var cam : CameraManager = Camera.main.GetComponent(CameraManager);
	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var forestObjectNames : String[] = new String[objectNames.listSize];
	var snowObjectNames : String[] = new String[objectNames.listSize];
	var machineObjectNames:String[] = new String[objectNames.listSize];
	var newObjectNames:String[] = new String[objectNames.listSize];
	
	objectNames.SetBGColors(n);
	cam.backgroundColorEnd=Camera.main.backgroundColor;
	
	//setMusicTrack
	//var aud : AudioSource= Camera.main.GetComponent(AudioSource);
	//var musicClip : AudioClip;
	 
	//if (n==1) musicClip = EditorUtility.FindAsset(objectNames.ForestMusic, AudioClip);
	//if (n==2) musicClip = EditorUtility.FindAsset(objectNames.SnowMusic, AudioClip);
	//if (n==3) musicClip = EditorUtility.FindAsset(objectNames.MachineMusic, AudioClip);
	//aud.clip=musicClip;
	
	forestObjectNames = objectNames.WorldDef(1);
	snowObjectNames =objectNames.WorldDef(2);
	machineObjectNames = objectNames.WorldDef(3);
	
	//newObjectNames.WorldDef(n);
	
	//var Selection: Transform[] =Selection.transforms;
	var allTransforms : Transform[] = FindObjectsOfType (Transform);
	for (var sel:Transform in allTransforms)
		{
			if (sel) 
			{
				var name:String =sel.gameObject.name;
			Debug.Log(name);
			for (var i : int =0; i<objectNames.listSize; i++)
			{
			Debug.Log("forest " + i.ToString() + "  "+forestObjectNames[i]);
			Debug.Log("snpw " + i.ToString() + "  " + snowObjectNames[i]);
			if ((name==forestObjectNames[i]) || (name==snowObjectNames[i]) || (name==machineObjectNames[i])) 
			
				{Debug.Log("foundMatch");
					//sel.position=Vector3.zero;
					
				var newName : String;
				if (n==1) newName= forestObjectNames[i];
				if (n==2) newName= snowObjectNames[i];
				if (n==3) newName= machineObjectNames[i];
				var path : String=("Prefabs/World/" + newName + ".prefab");
				var prefab : Transform =EditorUtility.FindAsset(path, Transform);
				if (prefab)
					{
						
					var instance:Transform=EditorUtility.InstantiatePrefab(prefab);
					//set parent
					instance.parent =sel.parent;
					
					//copy transforms
					instance.position =sel.position;
					instance.localEulerAngles =sel.localEulerAngles;
					instance.localScale=sel.localScale;
					
					DestroyImmediate(sel.gameObject);
					i=1000;
					}
					
				}
			}
			}
		}
		
		cam.world = n;
		/*
			var connectors:Connector[] = FindObjectsOfType(Connector);
	for (var con:Connector in connectors) 
	{
		//con.Init();
		con.UpdateMesh();
		con.UpdateMats();
	}
	*/
		
		
}



}