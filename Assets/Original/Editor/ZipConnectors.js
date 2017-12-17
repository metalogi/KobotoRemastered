class ZipConnectors extends ScriptableObject
{
@MenuItem("Connectors/ZipConnectors")
static function Zip()
{
	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var cam:CameraManager = Camera.main.GetComponent(CameraManager);
	var matPath : String;
	if (!cam) matPath =objectNames.W1BottomMat;
	else
	{
	if (cam.world==1) matPath =objectNames.W1BottomMat;
	if (cam.world==2) matPath =objectNames.W2BottomMat;
	if (cam.world==3) matPath =objectNames.W3BottomMat;
	}
	var botMat : Material = EditorUtility.FindAsset(matPath, Material);
	
	
	var connectors:Connector[] = FindObjectsOfType(Connector);
	for (var con:Connector in connectors) 
	{
		
		var RTGO: GameObject = new GameObject("RunTimeConnector");
		var RTCon : RuntimeConnector = RTGO.AddComponent.<RuntimeConnector>() ;
		
		RTCon.parentLeft =con.parentLeft;
		RTCon.parentRight =con.parentRight;
		
		var leftMeshFilter:MeshFilter=con.parentLeft.GetComponent(MeshFilter);
		var rightMeshFilter:MeshFilter=con.parentRight.GetComponent(MeshFilter);
		 var leftBB:Bounds = leftMeshFilter.sharedMesh.bounds;
	
		var rightBB:Bounds = rightMeshFilter.sharedMesh.bounds;
		RTCon.worldMaterial =botMat;
		 RTCon.LeftBBCenter=leftBB.center;
		RTCon.RightBBCenter=rightBB.center;
		 RTCon.LeftBBExtents=leftBB.extents;
		 RTCon.RightBBExtents=rightBB.extents;
		 
		 RTCon.nPoints =con.splinePrefs.numPoints;
		 
		//RTGO.AddComponent(CurvedSurface);
		//RTGO.isStatic= true;
		
		 DestroyImmediate(con.gameObject);
	}
}



}