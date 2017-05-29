
class UpdateSplines extends ScriptableObject
{
@MenuItem("Custom/ShowAssetPath")
static function showPath()
{
	//var path : String = EditorUtility.GetAssetPath(Selection.objects[0]);
	Debug.Log(EditorUtility.GetAssetPath(Selection.objects[0]));
}

@MenuItem ("Custom/UpdateSplines")
static function drawSplines() 
{
	var splines =GameObject.FindObjectsOfType(Spline);
	for (var spline:Spline in splines)
	{
		spline.Awake();
		if (spline.rebuildCurve) spline.Rebuild(spline.rebuildPoints);
		spline.WriteLUT();
	spline.DrawSpline();
	spline.ShowCPs(true);
	
	var lr : LineRenderer = spline.GetComponent(LineRenderer);
	if (lr)
	{
		var lineMat : Material = EditorUtility.FindAsset("Local Assets/Models/World/Materials/Line.mat", Material);
		lr.material =lineMat;
		lr.SetWidth(5.0,5.0);
	}
	
	
	
	
	}
}


@MenuItem ("Custom/UpdateCables")
static function drawCables()
{
var cables =GameObject.FindObjectsOfType(cable);
	for (var cab:cable in cables)
	{
		cab.Start();
		cab.SetEnds();
	}
}

@MenuItem ("Custom/AddSplineEndSpheres")
static function EndPoints()
{
	var splines =GameObject.FindObjectsOfType(Spline);
	for (var spline:Spline in splines)
	{
	var startPoint : Transform = EditorUtility.InstantiatePrefab(EditorUtility.FindAsset("Prefabs/LevelObject/SplineEnd.prefab",Transform));
	var endPoint : Transform = EditorUtility.InstantiatePrefab(EditorUtility.FindAsset("Prefabs/LevelObject/SplineEnd.prefab",Transform));
	
	var npoints : int = spline.splinePoints.length;
	startPoint.position = spline.splinePoints[0].position;
	endPoint.position = spline.splinePoints[npoints-1].position;
	}
}

}