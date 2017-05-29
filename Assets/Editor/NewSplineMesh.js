
class NewSplineMesh extends ScriptableObject
{
	@MenuItem("SplineMesh/New")
	
	static function NewMesh()
	{
		var SMeshObj : GameObject = new GameObject("SplineMesh");
		var baseSplineObj : Transform = Instantiate(EditorUtility.FindAsset("Prefabs/LevelObject/Spline.prefab", Transform));
		var baseSpline: Spline = baseSplineObj.GetComponent(Spline);
		
		var SMesh:SplineMesh = SMeshObj.AddComponent(SplineMesh);
		
		var floorMat : Material = EditorUtility.FindAsset("LocalAssets/Models/World/Materials/puzzle_001_floor-shader_grass.material",Material);
		var sideMat : Material = EditorUtility.FindAsset("LocalAssets/Models/World/Materials/puzzle_001_floor-shader_dirt.material",Material);
		print("floorMat " +floorMat);
		SMesh.SetMats(floorMat, sideMat);
		
		SMesh.SetSpline(baseSpline, 0);
		SMesh.Init();
		SMesh.Awake();
		
	}
	
	
	@MenuItem("SplineMesh/Refresh")
	static function Refresh()
	{
		for (var SMesh:SplineMesh in FindObjectsOfType(SplineMesh)) SMesh.Construct();
	}
}
