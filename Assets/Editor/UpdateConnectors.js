class UpdateConnectors extends ScriptableObject
{
@MenuItem("Connectors/UpdateSelectedConnectors")
static function UpdateSelected() {
	var Sel: Transform[] =Selection.transforms;
	for (var sel:Transform in Sel)
	{
		var con:Connector= sel.GetComponent(Connector);
		//con.Init();
		if (!con.parentLeft) con.FindParent("left");
		if (!con.parentRight) con.FindParent("right");
		if (con.parentLeft && con.parentRight)
		{
		NewConnecter(con.parentLeft,con.parentRight,con.splinePrefs.numPoints);
		
		DestroyImmediate(sel.gameObject);
		}
		//con.UpdateMesh();
		//con.UpdateMats();
		
	}
}	
	
@MenuItem("Connectors/UpdateAllConnectors &c")
static function UpdateAll() 
{
	
	var connectors:Connector[] = FindObjectsOfType(Connector);
	for (var con:Connector in connectors) 
	{
		//con.Init();
			if (!con.parentLeft) {Debug.Log("can't find Left object for connector" +con.gameObject.name);con.FindParent("left");}
		if (!con.parentRight) {Debug.Log("can't find Right object for connector" +con.gameObject.name);con.FindParent("right");}
		if (con.parentLeft && con.parentRight)
		{
		NewConnecter(con.parentLeft,con.parentRight,con.splinePrefs.numPoints);
		
		DestroyImmediate(con.gameObject);
		}
		
		
				
	}
}	





	@MenuItem("Connectors/AddConnector #c")
	
static function AddConnector()
{
	var Sel: Transform[] =Selection.transforms;
	
	//sort left/right
	var lefty:Transform;
	var righty:Transform;
	if (Sel[0].position.z>Sel[1].position.z)
	{
		lefty=Sel[1];
		righty=Sel[0];
	}
	else
	{
		lefty=Sel[0];
		righty=Sel[1];
	}
	NewConnecter(lefty, righty,6);
}

static function NewConnecter(lt : Transform, rt:Transform, n:int)
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
	
	var connector:GameObject = new GameObject("Connector");
	//connector.transform.eulerAngles.y=90;
	//connector.transform.position = 0.5*(lefty.position + righty.position);
	var conScript:Connector= connector.AddComponent(Connector);
	conScript.SetParentObjs(lt,rt);
	conScript.Init(botMat);
	conScript.UpdateMesh(n);
	 connector.AddComponent(CurvedSurface);
	
}

@MenuItem("Connectors/UnZip Connectors")
static function UnZip()
{
	var connectors:RuntimeConnector[] = FindObjectsOfType(RuntimeConnector);
	for (var RTcon:RuntimeConnector in connectors) 
	{
		NewConnecter(RTcon.parentLeft, RTcon.parentRight, RTcon.nPoints);
		DestroyImmediate(RTcon.gameObject);
	}
}

}