class ReplacePlatforms extends ScriptableObject
{
	@MenuItem ("World/ReplaceWithPlatformA")
	static function ReplaceWithA()
	{
		Replace(0);
	}
	
	@MenuItem ("World/ReplaceWithPlatformB")
	static function ReplaceWithB()
	{
		Replace(1);
	}
		@MenuItem ("World/ReplaceWithPlatformSimple")
	static function ReplaceWithC()
	{
		Replace(2);
	}
	
	
	static function Replace(n:int)
	{
		var cam : CameraManager = Camera.main.GetComponent(CameraManager);
		var defs : WorldObjectDefs = new WorldObjectDefs();
		var names : String[] = defs.PlatformDef(cam.world);
		var offsets : Vector3[] = defs.PlatformOffsets(cam.world);
		Debug.Log(offsets[0]);
		var Selection: Transform[] =Selection.transforms;
		for (var sel : Transform in Selection)
		{
			var path : String=("Prefabs/LevelObject/" + names[n] + ".prefab");
			Debug.Log ("looking for: " + path);
			var prefab : Transform =EditorUtility.FindAsset(path, Transform);
			if (prefab)
					{
					Debug.Log("found");
					var instance:Transform=EditorUtility.InstantiatePrefab(prefab);
					
					instance.parent = sel.parent;
					instance.localPosition=offsets[n];
					var constraint : positionConstraint = instance.GetComponent(positionConstraint);
					if (constraint) 
						{
							constraint.target = sel; 
							constraint.keepOffset = false;
							constraint.offset = offsets[n];
						}
						
					var boxC : BoxCollider = sel.GetComponent(BoxCollider);
					if (boxC) DestroyImmediate(boxC);
					
					var plat : platform = sel.GetComponent(platform);
					if (plat) DestroyImmediate(plat);
					
					var rend : MeshRenderer = sel.GetComponent(MeshRenderer);
					if (rend) rend.enabled = false;
					
					}
		} 
	}
	
}