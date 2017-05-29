#pragma strict

class CreateSpeedRampJS {
	
	@MenuItem("Custom/MakeRamp")
	static function MakeRamp()
	{
		var selectedT :Transform= Selection.GetTransforms(SelectionMode.TopLevel)[0];
		
		if (selectedT == null)
		{
			Debug.LogError("ERROR: Nothing selected!");
			return;
		}
		
		if (selectedT.GetComponent(Connector) == null)
		{
			Debug.LogError("ERROR: selected object is not a connector");
			return;
		}
		
		var ramp : SpeedRamp = selectedT.gameObject.GetComponent(SpeedRamp);
		if (ramp) UnityEngine.GameObject.DestroyImmediate(ramp);
		
		ramp = selectedT.gameObject.AddComponent(SpeedRamp);
        
        ramp.grabDist  = 20;
        ramp.speed = 1;
		
	}
}