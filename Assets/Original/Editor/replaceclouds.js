
 class ReplaceWith2dClouds extends ScriptableObject
{
	@MenuItem ("Custom/2dClouds")
	static function Replace()
	{
		
		var Selection: Transform[] =Selection.transforms;
		for (var sel:Transform in Selection)
		{
		//find corresponding prefab
		//var name:String =sel.name;
		var path:String=("Prefabs/World/Cloud2D.prefab");
		
		
		
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
		
		//Destroy original
		//DestroyImmediate(sel);
		}
		
		
		}
		
	}
	
}