
class MReflection 
{
	var refPlane : GameObject;
	var refObj : GameObject;
	
	function MakeNew(real : Transform, realFilt : MeshFilter)
	{
		refPlane= GameObject.FindWithTag("reflectionPlane");
		refObj =new GameObject (real.name + "_reflection");
		if (realFilt)
		var filt : MeshFilter =refObj.AddComponent.<MeshFilter>();
		var rend : MeshRenderer =refObj.AddComponent.<MeshRenderer>();
		
		//var realObj: GameObject = real.gameObject;
		//var realFilt: MeshFilter;
		//realFilt= real.GetComponent(MeshFilter);
		//if (!realFilt) realFilt= real.GetComponentInChildren(MeshFilter);
		//if (!realFilt) Debug.Log("Error: CantFind MeshFilter");
		
		if (realFilt) filt.sharedMesh = realFilt.sharedMesh;
		
		var refTrans:Transform = refObj.transform;
		
		refTrans.localScale = real.lossyScale;
		refTrans.localScale.y *= -1;
		//refTrans.localScale.y=-real.localScale.y;
		
		var refMan:ReflectionManager = refObj.AddComponent(ReflectionManager);
		refMan.refPlane =refPlane;
		refMan.real = real;
		return refObj;
		
	}
	
	function MakeNewCable(real : Transform)
	{
		refPlane= GameObject.FindWithTag("reflectionPlane");
		refObj =new GameObject (real.name + "_reflection");
		var line:LineRenderer =refObj.AddComponent.<LineRenderer>();
		
		var realLine : LineRenderer = real.GetComponent(LineRenderer);
		line.SetWidth(5,5);
		
		var realCable : cable = real.GetComponent(cable);
		
		if (realCable)
		{
			var refCable : cable = refObj.AddComponent(cable);
			var refStart:GameObject= new GameObject(realCable.start.name +"_reflection");
			var refEnd:GameObject= new GameObject(realCable.end.name +"_reflection");
			var refManStart:ReflectionManager = refStart.AddComponent(ReflectionManager);
			var refManEnd:ReflectionManager = refEnd.AddComponent(ReflectionManager);
			refManStart.refPlane =refPlane;
			refManStart.real = realCable.start;
			refManEnd.refPlane =refPlane;
			refManEnd.real = realCable.end;
			
			refCable.start =refStart.transform;
			refCable.end = refEnd.transform;
			
			refStart.transform.parent = refObj.transform;
			refEnd.transform.parent = refObj.transform;
		}
	}

}