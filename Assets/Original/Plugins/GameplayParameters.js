#pragma strict

class GameplayParameters  extends MonoBehaviour
{
	
	static var m_instance : GameplayParameters;
	
	public static function Instance() : GameplayParameters
	{
		
		if (m_instance == null)
		{
			var go : GameObject = Resources.Load ("GameplayParameters");
			m_instance = (Instantiate(go)).GetComponent(GameplayParameters);
		}
		return m_instance;
		
	}
	
//	[System.Serializable]
	public class CameraSettingsClass
	{
		public var Distance : float = 400;
		public var FOV : float = 45;
		public var Angle : float =5;
		public var Height : float = 50;

	}
	
	public var CameraSettings : CameraSettingsClass;
	
	//[System.Serializable]
	public class WorldSettingsClass
	{
		public var BackgroundColor : Color;
	}
	
	public var World1 : WorldSettingsClass;
	public var World2 : WorldSettingsClass;
	public var World3 : WorldSettingsClass;
	
	public var UseSwipeControls : boolean = false;
	public var TiltSensitivityMultiplier : float = 1f;
	public var TiltClampValue : float = 0.04f;
	
}
