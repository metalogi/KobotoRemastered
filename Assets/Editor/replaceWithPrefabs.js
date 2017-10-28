
 class ReplaceWithPrefabs extends ScriptableObject
{
	@MenuItem ("Custom/ReplaceWithPrefabs")
	static function Replace()
	{
		var cam : CameraManager = Camera.main.GetComponent(CameraManager);
		
		var Selection: Transform[] =Selection.transforms;
		for (var sel:Transform in Selection)
		{
		//find corresponding prefab
		var name:String =sel.name;
		//if (name[0] == "w" && name[1] =="1") name[1] = cam.world.ToString();
		var path:String=("Prefabs/World/" + name + ".prefab");
		
		if (
		(name=="beachBall")||
		(name=="Button")||
		(name=="Falltree")||
		(name=="Glass")||
		(name=="house")||
		(name=="JetStream")||
		(name=="rollingshell")||
		(name=="Sadcloud")||
		(name=="SideButton")||
		(name=="SpawnPoint")||
		(name=="StopGoLight")||
		(name=="tiltboard")||
		(name=="Windmill")
		)
		path =("Prefabs/LevelObject/" + name + ".prefab");
			
		
		//instantiate it
		var prefab:Transform =EditorUtility.FindAsset(path, Transform);
		if (prefab)
		{
		//var instance:Transform=Instantiate(prefab);
		var instance:Transform=EditorUtility.InstantiatePrefab(prefab);
		instance.name =name;
		
		//set parent
		instance.parent =sel.parent;
		
		//copy transforms
		instance.position =sel.position;
		instance.localEulerAngles =sel.localEulerAngles;
		instance.localScale=sel.localScale;
		
		//Destroy original
		//DestroyImmediate(sel);
		}
		
		
		}
		
	
	}
	@MenuItem ("Custom/ReplaceHouse")
	static function ReplaceHouse()
	{
		var cam : CameraManager = Camera.main.GetComponent(CameraManager);
		var Selection: Transform[] =Selection.transforms;
		var Houses : GameObject[] = GameObject.FindGameObjectsWithTag("house");
		for (var go:GameObject in Houses)
		{
			var sel =go.transform;
			var path:String;
			if (cam.world ==1) path = "Prefabs/LevelObject/house.prefab";
			if (cam.world ==2) path = "Prefabs/LevelObject/houseW2.prefab";
			if (cam.world ==3) path = "Prefabs/LevelObject/houseW3.prefab";
			
			var prefab:Transform =EditorUtility.FindAsset(path, Transform);
			var instance:Transform=EditorUtility.InstantiatePrefab(prefab);
			instance.parent =sel.parent;
			
			instance.position =sel.position;
		instance.localEulerAngles= sel.localEulerAngles;
		DestroyImmediate(go);
			
		}
	}
	
	
	
}