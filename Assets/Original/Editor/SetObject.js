
class SetObj extends ScriptableObject
{
	@MenuItem("World/FloorA")
	
	static function SetFloorA()
	{
		SetToObject(0);
	}
	
		@MenuItem("World/FloorB")
	
	static function SetFloorB()
	{
		SetToObject(7);
	}
	
	@MenuItem("World/FloorC")
	
	static function SetFloorC()
	{
		SetToObject(8);
	}




static function SetToObject( n:int)
{
	var cam : CameraManager = Camera.main.GetComponent(CameraManager);

	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var worldObjects : String[] = new String[objectNames.listSize];
	worldObjects  =objectNames.WorldDef(cam.world);
	
	var path : String=("Prefabs/World/" + worldObjects[n] + ".prefab");
	var prefab : Transform =EditorUtility.FindAsset(path, Transform);
	
	var Selection: Transform[] =Selection.transforms;
	for (var sel:Transform in Selection)
	{
			var instance:Transform=EditorUtility.InstantiatePrefab(prefab);
					//set parent
					instance.parent =sel.parent;
					
					//copy transforms
					instance.position =sel.position;
					instance.localEulerAngles =sel.localEulerAngles;
					instance.localScale=sel.localScale;
					
					DestroyImmediate(sel.gameObject);
	}
}


@MenuItem("World/Metal")
static function SetMetal()
{
	var cam : CameraManager = Camera.main.GetComponent(CameraManager);
	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var worldObjects : String[] = new String[objectNames.listSize];
	worldObjects  =objectNames.WorldDef(cam.world);
	SetMaterial(objectNames.metalMaterial);
}
@MenuItem("World/Wood")
static function SetWood()
{
	var cam : CameraManager = Camera.main.GetComponent(CameraManager);
	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var worldObjects : String[] = new String[objectNames.listSize];
	worldObjects  =objectNames.WorldDef(cam.world);
	SetMaterial(objectNames.woodMaterial);
}
@MenuItem("World/Ice")
static function SetIce()
{
	var cam : CameraManager = Camera.main.GetComponent(CameraManager);
	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var worldObjects : String[] = new String[objectNames.listSize];
	worldObjects  =objectNames.WorldDef(cam.world);
	SetMaterial(objectNames.iceMaterial);
}

@MenuItem("World/Glass")
static function SetGlass()
{
	var cam : CameraManager = Camera.main.GetComponent(CameraManager);
	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var worldObjects : String[] = new String[objectNames.listSize];
	worldObjects  =objectNames.WorldDef(cam.world);
	SetMaterial(objectNames.glassMaterial);
}
static function SetMaterial(path:String)
{
		
	
	var mat : Material = EditorUtility.FindAsset(path, Material);
	var Selection: Transform[] =Selection.transforms;
	for (var sel:Transform in Selection)
	{
		sel.GetComponent.<Renderer>().material = mat;
		
	}
}



@MenuItem("World/TreeRandomizer")
static function TreeRandomizer()
{
	var cam : CameraManager = Camera.main.GetComponent(CameraManager);

	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var worldObjects : String[] = new String[objectNames.listSize];
	worldObjects  =objectNames.WorldDef(cam.world);
	
	var Selection: Transform[] =Selection.transforms;
	for (var sel:Transform in Selection)
	{
		var path : String;
		var rand : float = Random.value;
		if (rand<0.33) path =("Prefabs/World/" + worldObjects[1] + ".prefab");
		else if (rand<0.66) path =("Prefabs/World/" + worldObjects[2] + ".prefab");
		else  path =("Prefabs/World/" + worldObjects[3] + ".prefab");
		
		var prefab : Transform =EditorUtility.FindAsset(path, Transform);
		
		var instance:Transform=EditorUtility.InstantiatePrefab(prefab);
					//set parent
					instance.parent =sel.parent;
					
					//copy transforms
					instance.position =sel.position;
					instance.localEulerAngles =sel.localEulerAngles;
					instance.localScale=sel.localScale;
					
					instance.eulerAngles.y =Random.value*180;
					instance.position.x += Random.value *10;
					instance.localScale += 0.2*Random.insideUnitSphere;
					
					
					DestroyImmediate(sel.gameObject);
	}
	
	
	
}

}

