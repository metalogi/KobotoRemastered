 class LevelOpener extends ScriptableObject
{
	static var levelNames : String [];
	static function LevelNames(w:int)
	{
		
		var wod :WorldObjectDefs = new WorldObjectDefs();
		levelNames=wod.GetLevelNames(w);
		
	}
	
	static function OpenLevel(w:int, l:int)
	{
		LevelNames(w);
		Debug.Log("opening..." + WorldObjectDefs.GetLevelNames(w)[l-1]);
		EditorApplication.OpenScene(WorldObjectDefs.GetLevelNames(w)[l-1]);
	}
	
	
	@MenuItem("Open/Next")
	static function openNext()
	{
		var cam : CameraManager = Camera.main.GetComponent(CameraManager);
		LevelNames(cam.world);
		for (var i:int =0 ; i< levelNames.length-1; i++)
		{
			//var currentName:String = EditorApplication.currentScene;
			if (EditorApplication.currentScene == levelNames[i]) {EditorApplication.OpenScene(levelNames[i+1]);break;}
		}
	}
	
		@MenuItem("Open/Previous")
	static function openPrev()
	{
		var cam : CameraManager = Camera.main.GetComponent(CameraManager);
		LevelNames(cam.world);
		for (var i:int =1 ; i< levelNames.length; i++)
		{
			//var currentName:String = EditorApplication.currentScene;
			if (EditorApplication.currentScene == levelNames[i]) {EditorApplication.OpenScene(levelNames[i-1]);break;}
		}
	}
	
	
	@MenuItem("Open/w1/1")
	static function o11() {OpenLevel(1,1);}
	
	@MenuItem("Open/w1/2")
	static function o12() {OpenLevel(1,2);}
	
	@MenuItem("Open/w1/3")
	static function o13() {OpenLevel(1,3);}
	
	@MenuItem("Open/w1/4")
	static function o14() {OpenLevel(1,4);}
	
	@MenuItem("Open/w1/5")
	static function o15() {OpenLevel(1,5);}
	
	@MenuItem("Open/w1/6")
	static function o16() {OpenLevel(1,6);}
	
	@MenuItem("Open/w1/7")
	static function o17() {OpenLevel(1,7);}
	
	@MenuItem("Open/w1/8")
	static function o18() {OpenLevel(1,8);}
	
	@MenuItem("Open/w1/9")
	static function o19() {OpenLevel(1,9);}
	
	@MenuItem("Open/w1/10")
	static function o110() {OpenLevel(1,10);}
	
	@MenuItem("Open/w1/11")
	static function o111() {OpenLevel(1,11);}
	
	@MenuItem("Open/w1/12")
	static function o112() {OpenLevel(1,12);}
	
	@MenuItem("Open/w1/13")
	static function o113() {OpenLevel(1,13);}
	
	@MenuItem("Open/w1/14")
	static function o114() {OpenLevel(1,14);}
	
	@MenuItem("Open/w1/15")
	static function o115() {OpenLevel(1,15);}
	
	@MenuItem("Open/w1/16")
	static function o116() {OpenLevel(1,16);}
	
	@MenuItem("Open/w1/17")
	static function o117() {OpenLevel(1,17);}
	
	@MenuItem("Open/w1/18")
	static function o118() {OpenLevel(1,18);}
	
	@MenuItem("Open/w1/19")
	static function o119() {OpenLevel(1,19);}
	
	@MenuItem("Open/w1/20")
	static function o120() {OpenLevel(1,20);}
	
	
	
	
		@MenuItem("Open/w2/1")
	static function o21() {OpenLevel(2,1);}
	
	@MenuItem("Open/w2/2")
	static function o22() {OpenLevel(2,2);}
	
	@MenuItem("Open/w2/3")
	static function o23() {OpenLevel(2,3);}
	
	@MenuItem("Open/w2/4")
	static function o24() {OpenLevel(2,4);}
	
	@MenuItem("Open/w2/5")
	static function o25() {OpenLevel(2,5);}
	
	@MenuItem("Open/w2/6")
	static function o26() {OpenLevel(2,6);}
	
	@MenuItem("Open/w2/7")
	static function o27() {OpenLevel(2,7);}
	
	@MenuItem("Open/w2/8")
	static function o28() {OpenLevel(2,8);}
	
	@MenuItem("Open/w2/9")
	static function o29() {OpenLevel(2,9);}
	
	@MenuItem("Open/w2/10")
	static function o210() {OpenLevel(2,10);}
	
	@MenuItem("Open/w2/11")
	static function o211() {OpenLevel(2,11);}
	
	@MenuItem("Open/w2/12")
	static function o212() {OpenLevel(2,12);}
	
	@MenuItem("Open/w2/13")
	static function o213() {OpenLevel(2,13);}
	
	@MenuItem("Open/w2/14")
	static function o214() {OpenLevel(2,14);}
	
	@MenuItem("Open/w2/15")
	static function o215() {OpenLevel(2,15);}
	
	@MenuItem("Open/w2/16")
	static function o216() {OpenLevel(2,16);}
	
	@MenuItem("Open/w2/17")
	static function o217() {OpenLevel(2,17);}
	
	@MenuItem("Open/w2/18")
	static function o218() {OpenLevel(2,18);}
	
	@MenuItem("Open/w2/19")
	static function o219() {OpenLevel(2,19);}
	
	@MenuItem("Open/w2/20")
	static function o220() {OpenLevel(2,20);}
	
	
	
	
	@MenuItem("Open/w3/1")
	static function o31() {OpenLevel(3,1);}
	
	@MenuItem("Open/w3/2")
	static function o32() {OpenLevel(3,2);}
	
	@MenuItem("Open/w3/3")
	static function o33() {OpenLevel(3,3);}
	
	@MenuItem("Open/w3/4")
	static function o34() {OpenLevel(3,4);}
	
	@MenuItem("Open/w3/5")
	static function o35() {OpenLevel(3,5);}
	
	@MenuItem("Open/w3/6")
	static function o36() {OpenLevel(3,6);}
	
	@MenuItem("Open/w3/7")
	static function o37() {OpenLevel(3,7);}
	
	@MenuItem("Open/w3/8")
	static function o38() {OpenLevel(3,8);}
	
	@MenuItem("Open/w3/9")
	static function o39() {OpenLevel(3,9);}
	
	@MenuItem("Open/w3/10")
	static function o310() {OpenLevel(3,10);}
	
	@MenuItem("Open/w3/11")
	static function o311() {OpenLevel(3,11);}
	
	@MenuItem("Open/w3/12")
	static function o312() {OpenLevel(3,12);}
	
	@MenuItem("Open/w3/13")
	static function o313() {OpenLevel(3,13);}
	
	@MenuItem("Open/w3/14")
	static function o314() {OpenLevel(3,14);}
	
	@MenuItem("Open/w3/15")
	static function o315() {OpenLevel(3,15);}
	
	@MenuItem("Open/w3/16")
	static function o316() {OpenLevel(3,16);}
	
	@MenuItem("Open/w3/17")
	static function o317() {OpenLevel(3,17);}
	
	@MenuItem("Open/w3/18")
	static function o318() {OpenLevel(3,18);}
	
	@MenuItem("Open/w3/19")
	static function o319() {OpenLevel(3,19);}
	
		@MenuItem("Open/w3/20")
	static function o320() {OpenLevel(3,20);}
	
	
}