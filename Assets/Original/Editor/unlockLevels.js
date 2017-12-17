
class UnlockLev extends ScriptableObject
 {
 	@MenuItem("Cheat/Unlock levels")
 	static function UnLock()
 	{
 		PlayerPrefs.SetInt("LevelsCompleted", 100);
 		PlayerPrefs.SetInt("WorldsUnlocked",3);
 	}
 	
 	@MenuItem("Cheat/Lock levels")
 	static function Lock()
 	{
 		PlayerPrefs.SetInt("LevelsCompleted", 6);
 	}
}