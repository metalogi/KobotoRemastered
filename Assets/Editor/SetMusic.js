
class SetMusic  extends ScriptableObject

{
	
	@MenuItem("World/SetMusic/1")
	static function Track1()
	{
		 SetMusicTrack(1);
	}
	
	@MenuItem("World/SetMusic/2")
	static function Track2()
	{
		 SetMusicTrack(2);
	}
	
	@MenuItem("World/SetMusic/3")
	static function Track3()
	{
		 SetMusicTrack(3);
	}
	
		@MenuItem("World/SetMusic/Snow")
	static function Track4()
	{
		 SetMusicTrack(4);
	}
				@MenuItem("World/SetMusic/Dark")
	static function Track5()
	{
		 SetMusicTrack(5);
	}
	
			@MenuItem("World/SetMusic/Panic")
	static function Track6()
	{
		 SetMusicTrack(6);
	}
	
	static function SetMusicTrack(i : int )
	{
		var old : GameObject = GameObject.FindWithTag("musicPlayer");
		if (old) DestroyImmediate (old);
		
		var camAud :AudioSource = Camera.main.GetComponent(AudioSource);
		if (camAud) DestroyImmediate (camAud);
		var musicPath :String;
		//Debug.Log(Application.loadedLevel);
		//var level : int = Application.loadedLevel % 3;
		
		if (i==1) musicPath = "Prefabs/Audio/W1Music.prefab";
		if (i==2) musicPath = "Prefabs/Audio/W2Music.prefab";
		if (i==3) musicPath = "Prefabs/Audio/W3Music.prefab";
		if (i==4) musicPath = "Prefabs/Audio/SnowMusic.prefab";
		if (i==5) musicPath = "Prefabs/Audio/DarkMusic.prefab";
		if (i==6) musicPath = "Prefabs/Audio/PanicMusic.prefab";
		var musicPrefab : Transform =EditorUtility.FindAsset(musicPath, Transform);
		EditorUtility.InstantiatePrefab(musicPrefab);
	}
	
	
	@MenuItem("World/BatchSetMusicWorld1")
	static function BatchMusic1()
	{
		var wod : WorldObjectDefs = new WorldObjectDefs();
		var names : String[] = wod.GetLevelNames(1);
		
		var i : int =1;
		for (var lev:int =0; lev<names.length; lev++)
		{
		EditorApplication.OpenScene(names[lev]);
		SetMusicTrack(i);
		EditorApplication.SaveScene(names[lev]);
		i++;
		if (i==4) i=1;
		}
	}
	
	@MenuItem("World/BatchSetMusicWorld2")
	static function BatchMusic2()
	{
		var wod : WorldObjectDefs = new WorldObjectDefs();
		var names : String[] = wod.GetLevelNames(2);
		
		var i : int =4;
		for (var lev:int =0; lev<names.length; lev++)
		{
		EditorApplication.OpenScene(names[lev]);
		SetMusicTrack(i);
		EditorApplication.SaveScene(names[lev]);
		i++;
		if (i==5) i=1;
		}
	}
	
		@MenuItem("World/BatchSetMusicWorld3")
	static function BatchMusic3()
	{
		var wod : WorldObjectDefs = new WorldObjectDefs();
		var names : String[] = wod.GetLevelNames(3);
		
		var i : int =1;
		for (var lev:int =0; lev<names.length; lev++)
		{
		EditorApplication.OpenScene(names[lev]);
		SetMusicTrack(i);
		EditorApplication.SaveScene(names[lev]);
		i++;
		if (i==4) i=1;
		}
	}
}