 class SnowFloor extends ScriptableObject
{
	@MenuItem ("Custom/Snow_Floor")
	static function ReplaceWithSnowFloor()
	{
		var Selection: Transform[] =Selection.transforms;
		for (var sel:Transform in Selection)
		{
			path =("Prefabs/World/Snow_Floor.prefab");
			//instantiate it
		var prefab:Transform =EditorUtility.FindAsset(path, Transform);
		if (prefab)
		{
		//var instance:Transform=Instantiate(prefab);
		var instance:Transform=EditorUtility.InstantiatePrefab(prefab);
		 //instance.name =name;
		
		//set parent
		instance.parent =sel.parent;
		
		//copy transforms
		instance.position =sel.position;
		instance.localEulerAngles =sel.localEulerAngles;
		instance.localScale=sel.localScale;
		}
		}
		
	}
}