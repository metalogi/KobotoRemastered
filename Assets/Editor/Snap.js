
class SnapMe extends ScriptableObject
{

	
static function Snap()
{
		var Sel: Transform[] =Selection.transforms;
		for (var s:Transform in Sel) Undo.RegisterUndo(s,"snap");
		var meshFilter0:MeshFilter ;
		var meshFilter1:MeshFilter ;
		if (Sel[0].position.z>Sel[1].position.z)
		{
		meshFilter0=Sel[0].GetComponent(MeshFilter);
		meshFilter1=Sel[1].GetComponent(MeshFilter);
		}
		else
		{
		meshFilter0=Sel[1].GetComponent(MeshFilter);
		meshFilter1=Sel[0].GetComponent(MeshFilter);
		var tempT:Transform;
		tempT = Sel[0];
		Sel[0]=Sel[1];
		Sel[1]=tempT;
		}

		meshFilter0.sharedMesh.RecalculateBounds();
		meshFilter1.sharedMesh.RecalculateBounds();
		var bBox0:Bounds =meshFilter0.sharedMesh.bounds;
		var bBox1:Bounds =meshFilter1.sharedMesh.bounds;
		print (bBox1);
		//Sel[1].position=Sel[0].position;
		
		var zSep =bBox0.extents.x*Sel[0].localScale.x +bBox1.extents.x*Sel[1].localScale.x;
		
		
		print (bBox0.extents.z);
		Sel[0].position=Sel[1].position - Sel[1].TransformDirection(bBox1.center) + Vector3.forward*zSep; 
		//Sel[0].position=(Sel[1].position+Sel[1].TransformDirection(bBox1.center) - Sel[0].TransformDirection(bBox0.center));
		
		//Sel[0].position.z+=bBox0.extents.x*Sel[0].localScale.x + bBox1.extents.x*Sel[1].localScale.x;
		
		//Sel[0].position.z+=zSep;
		
		
}


	
static function SnapLeft()
{
		var Sel: Transform[] =Selection.transforms;
		for (var s:Transform in Sel) Undo.RegisterUndo(s,"snap");
		var meshFilter0:MeshFilter ;
		var meshFilter1:MeshFilter ;
		if (Sel[0].position.z<Sel[1].position.z)
		{
		meshFilter0=Sel[0].GetComponent(MeshFilter);
		meshFilter1=Sel[1].GetComponent(MeshFilter);
		}
		else
		{
		meshFilter0=Sel[1].GetComponent(MeshFilter);
		meshFilter1=Sel[0].GetComponent(MeshFilter);
		var tempT:Transform;
		tempT = Sel[0];
		Sel[0]=Sel[1];
		Sel[1]=tempT;
		}

		meshFilter0.sharedMesh.RecalculateBounds();
		meshFilter1.sharedMesh.RecalculateBounds();
		var bBox0:Bounds =meshFilter0.sharedMesh.bounds;
		var bBox1:Bounds =meshFilter1.sharedMesh.bounds;
		print (bBox1);
		//Sel[1].position=Sel[0].position;
		
		var zSep =bBox0.extents.x*Sel[0].localScale.x +bBox1.extents.x*Sel[1].localScale.x;
		
		
		print (bBox0.extents.z);
		Sel[0].position=Sel[1].position - Sel[1].TransformDirection(bBox1.center) - Vector3.forward*zSep; 
		//Sel[0].position=(Sel[1].position+Sel[1].TransformDirection(bBox1.center) - Sel[0].TransformDirection(bBox0.center));
		
		//Sel[0].position.z+=bBox0.extents.x*Sel[0].localScale.x + bBox1.extents.x*Sel[1].localScale.x;
		
		//Sel[0].position.z+=zSep;
		
		
}


 static function SnapY()
{
		var Sel: Transform[] =Selection.transforms;
		for (var s:Transform in Sel) Undo.RegisterUndo(s,"snap");
		var meshFilter0:MeshFilter ;
		var meshFilter1:MeshFilter ;
		if (Sel[0].position.y>Sel[1].position.y)
		{
		meshFilter0=Sel[0].GetComponent(MeshFilter);
		meshFilter1=Sel[1].GetComponent(MeshFilter);
		}
		else
		{
		meshFilter0=Sel[1].GetComponent(MeshFilter);
		meshFilter1=Sel[0].GetComponent(MeshFilter);
		var tempT:Transform;
		tempT = Sel[0];
		Sel[0]=Sel[1];
		Sel[1]=tempT;
		}

		meshFilter0.sharedMesh.RecalculateBounds();
		meshFilter1.sharedMesh.RecalculateBounds();
		var bBox0:Bounds =meshFilter0.sharedMesh.bounds;
		var bBox1:Bounds =meshFilter1.sharedMesh.bounds;
		print (bBox1);
		//Sel[1].position=Sel[0].position;
		
		var ySep =bBox0.extents.y*Sel[0].localScale.y +bBox1.extents.y*Sel[1].localScale.y;
		
		
		print (bBox0.extents.y);
		Sel[0].position=Sel[1].position - Sel[1].TransformDirection(bBox1.center) + Vector3.up*ySep; 
		//Sel[0].position=(Sel[1].position+Sel[1].TransformDirection(bBox1.center) - Sel[0].TransformDirection(bBox0.center));
		
		//Sel[0].position.z+=bBox0.extents.x*Sel[0].localScale.x + bBox1.extents.x*Sel[1].localScale.x;
		
		//Sel[0].position.z+=zSep;
		
		
}

static function AddBase()
{
	var d : float = 8;
	 var cam : CameraManager = Camera.main.GetComponent(CameraManager);
	 var worldNo : int = cam.world;
	var objectNames :WorldObjectDefs = new WorldObjectDefs();
	var baseName : String = objectNames.WorldDef(worldNo)[6];
	var Sel: Transform[] =Selection.transforms;
	for (var s:Transform in Sel)
	{
		var path : String=("Prefabs/World/" + baseName + ".prefab");
		var prefab : Transform =EditorUtility.FindAsset(path, Transform);
		var baseObject : Transform = EditorUtility.InstantiatePrefab(prefab);
		
		baseObject.localScale =s.localScale;
		
		baseObject.localScale.y *= d;
		
		var meshFilter0:MeshFilter ;
		var meshFilter1:MeshFilter ;
		
		meshFilter0=s.GetComponent(MeshFilter);
		meshFilter1=baseObject.GetComponent(MeshFilter);
		meshFilter0.sharedMesh.RecalculateBounds();
		meshFilter1.sharedMesh.RecalculateBounds();
		var bBox0:Bounds =meshFilter0.sharedMesh.bounds;
		var bBox1:Bounds =meshFilter1.sharedMesh.bounds;
		var ySep =bBox0.extents.y*s.localScale.y +bBox1.extents.y*baseObject.localScale.y;
		baseObject.position=s.position - s.TransformDirection(bBox1.center) - Vector3.up*ySep; 
		
	}
}
	
	
}