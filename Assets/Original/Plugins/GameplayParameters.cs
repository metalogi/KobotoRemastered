using UnityEngine;
using System.Collections;

public class GameplayParameters : MonoBehaviour {
	
	static GameplayParameters m_instance;
	
	public static GameplayParameters Instance
	{
		get 
		{
			if (m_instance == null)
			{
				m_instance = Instantiate(Resources.Load ("GameplayParameters")) as GameplayParameters;
			}
			return m_instance;
		}
	}
	
	[System.Serializable]
	public class CameraSettingsClass
	{
		public float Distance = 400;
		public float FOV = 45;

	}
	
	public CameraSettingsClass CameraSettings;
	
	[System.Serializable]
	public class WorldSettingsClass
	{
		public Color backgroundColor;
	}
	
	public WorldSettingsClass World1;
	public WorldSettingsClass World2;
	public WorldSettingsClass World3;
	
}
