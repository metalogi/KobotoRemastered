
class CSpline extends ScriptableObject
{
	@MenuItem("Custom/Level/AddCameraSpline")
	
	static function AddCameraSpline()
	{
		var levelObj: GameObject = GameObject.Find("Level");
		var mainCam: GameObject = GameObject.Find("MainCamera");
		var levCam: GameObject = GameObject.Find("LevelCam1");
		var csPrefab: Transform =EditorUtility.FindAsset("Prefabs/LevelObject/cameraSpline.prefab", Transform);
		var csObj: Transform = Instantiate(csPrefab, Vector3.zero,Quaternion.identity);
		
		csObj.parent = levelObj.transform;
		csObj.localPosition = Vector3.zero;
		
		var start:Transform = csObj.Find("splinePointStart");
		var end:Transform = csObj.Find("splinePointEnd");
		var mid:Transform = csObj.Find("splinePointMiddle0");
		
		start.position=  mainCam.transform.position;
		end.position=  levCam.transform.position;
		mid.position= Vector3.Lerp(start.position, end.position, 0.5);
		
	}
}