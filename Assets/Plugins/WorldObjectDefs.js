#pragma implicit

 class WorldObjectDefs 
{
	
static var testString : String;
static var mainFloorObj : String;
static var mainFloorObj2 : String;
static var mainFloorObj3 : String;
static var tree1 : String;
static var tree2 : String;
static var tree3 : String;
static var objectList : String[];
static var platformList : String[];
static var platformOffsets : Vector3[];

static var listSize:int = 9;

static var ForestMusic : String = "Prefabs/Audio/W1Music";
static var SnowMusic : String = "AUDIO/ingame2_demo_01.wav";
static var MachineMusic : String = "AUDIO/ingame2_demo_01.wav";

static var numberOfLevels : int[];
static var numberOfWorlds : int =3;

var woodMaterial : String ="Local Assets/Models/World/Materials/wood.mat";
var metalMaterial : String ="Local Assets/Models/World/Materials/Metal.mat";
var iceMaterial : String ="Local Assets/Materials/Base/Ice.mat";
var glassMaterial : String ="Local Assets/Materials/Base/GlassLight.mat";

var W1BottomMat : String="Local Assets/Models/World/Materials/W1Dark.mat";
var W2BottomMat : String="Local Assets/Models/World/Materials/W2Dark.mat";
var W3BottomMat : String="Local Assets/Models/World/Materials/W3Dark.mat";

static function GetNumberOfLevels()
{
	numberOfLevels = new int[numberOfWorlds+1];
	numberOfLevels[0]=6;
	numberOfLevels[1]=20;
	numberOfLevels[2]=20;
	numberOfLevels[3]=20;
	
	return numberOfLevels;
	
}

static function GetLevelNames(w:int)
{
	GetNumberOfLevels();
	var levelNames : String [];
	//var levelNames : String [] = new String[numberOfLevels[w]];
	if (w==1)
	{
		levelNames = new String[20];
		levelNames[0] = "Assets/Scenes/Levels/World1/World01_Level01.unity";
		levelNames[1] = "Assets/Scenes/Levels/World1/World01_Level02.unity";
		levelNames[2] = "Assets/Scenes/Levels/World1/World01_Level03.unity";
		levelNames[3] = "Assets/Scenes/Levels/World1/World01_Level04.unity";
		levelNames[4] = "Assets/Scenes/Levels/World1/World01_Level05.unity";
		levelNames[5] = "Assets/Scenes/Levels/World1/World01_Level06.unity";
		levelNames[6] = "Assets/Scenes/Levels/World1/World01_Level07.unity";
		levelNames[7] = "Assets/Scenes/Levels/World1/World01_Level08.unity";
		levelNames[8] = "Assets/Scenes/Levels/World1/World01_Level09.unity";
		levelNames[9] = "Assets/Scenes/Levels/World1/World01_Level10.unity"; 
		levelNames[10] ="Assets/Scenes/3-Ed/easyJet.unity";
		levelNames[11] = "Assets/Scenes/3-Ed/springEasy.unity";
		levelNames[12] = "Assets/Scenes/3-Ed/JetPackTut.unity";
		levelNames[13] = "Assets/Scenes/3-Ed/badCloud1.unity";
		levelNames[14] = "Assets/Scenes/3-Ed/propPlat.unity";		
		levelNames[15] = "Assets/Scenes/3-Ed/springMag.unity";
		levelNames[16] = "Assets/Scenes/3-Ed/2_Tutorial0.unity";
		levelNames[17] = "Assets/Scenes/3-Ed/2_Tutorial.unity";
		levelNames[18] = "Assets/Scenes/3-Ed/easyCatapult.unity";
		levelNames[19] = "Assets/Scenes/3-Ed/easySpringMag.unity";
		
	}
		if (w==2)
	{
		levelNames = new String[20];
		
		levelNames[0] = "Assets/Scenes/3-Ed/easy_SpringWheels.unity";
		levelNames[1] = "Assets/Scenes/3-Ed/easy_snow.unity";
		levelNames[2] = "Assets/Scenes/3-Ed/SnowScaleSimple.unity";
		levelNames[3] = "Assets/Scenes/3-Ed/mah.unity";
		levelNames[4] = "Assets/Scenes/3-Ed/cave.unity";
		levelNames[5] = "Assets/Scenes/3-Ed/movables.unity";
		levelNames[6] = "Assets/Scenes/3-Ed/jetPack_IceMonsta2.unity";
		levelNames[7] = "Assets/Scenes/3-Ed/easy_wheelsProp2.unity";
		levelNames[8] = "Assets/Scenes/3-Ed/ed_013.unity";
		levelNames[9] = "Assets/Scenes/3-Ed/coulpling.unity";
		levelNames[10] ="Assets/Scenes/3-Ed/probMagfixed.unity";
		levelNames[11] ="Assets/Scenes/3-Ed/floatingScales.unity";
		levelNames[12] = "Assets/Scenes/3-Ed/mediumSpringMag.unity";
		levelNames[13] = "Assets/Scenes/3-Ed/badCloudFree.unity";
		levelNames[14] = "Assets/Scenes/3-Ed/introducingQuadWheels0.unity";
		levelNames[15] = "Assets/Scenes/3-Ed/snowScales.unity";
		
		levelNames[16] = "Assets/Scenes/3-Ed/snow1.unity";
		levelNames[17] = "Assets/Scenes/3-Ed/movables2.unity";
		levelNames[18] = "Assets/Scenes/3-Ed/chase_slope.unity";
		levelNames[19] = "Assets/Scenes/3-Ed/snowScalePoyo.unity";
	}
	
			if (w==3)
	{
		levelNames = new String[20];
		
		levelNames[0] = "Assets/Scenes/3-Ed/W3_00A.unity";
		levelNames[1] = "Assets/Scenes/3-Ed/W3_000.unity";
		levelNames[2] = "Assets/Scenes/3-Ed/W3_01.unity";
		
		
		levelNames[3] = "Assets/Scenes/3-Ed/barrier.unity";
		levelNames[4] = "Assets/Scenes/3-Ed/W3_shoeHelper.unity";
		levelNames[5] = "Assets/Scenes/3-Ed/W3_para.unity";
		levelNames[6] = "Assets/Scenes/3-Ed/spikyRollHammer.unity";
		levelNames[7] = "Assets/Scenes/3-Ed/catapiller.unity";
		levelNames[8] = "Assets/Scenes/3-Ed/catapiller2.unity";
		levelNames[9] = "Assets/Scenes/3-Ed/spikyRollJetPacks.unity";
		levelNames[10] = "Assets/Scenes/3-Ed/spikyRollSwitches.unity";
		levelNames[11] = "Assets/Scenes/3-Ed/W3_chase.unity";
		
		levelNames[12] = "Assets/Scenes/3-Ed/W3_chase2.unity";
		levelNames[13] = "Assets/Scenes/3-Ed/W3_prop.unity";
		levelNames[14] = "Assets/Scenes/3-Ed/dominos.unity";
		levelNames[15] = "Assets/Scenes/3-Ed/stompas.unity";
		levelNames[16] = "Assets/Scenes/3-Ed/cacterpiller3.unity";
		levelNames[17] = "Assets/Scenes/3-Ed/ed_003.unity";
		levelNames[18] = "Assets/Scenes/3-Ed/huntForJetPacks.unity";
		
		levelNames[19] ="Assets/Scenes/3-Ed/ed_010_W3_v2.unity";
		//levelNames[17] = "Assets/Scenes/3-Ed/movables2.unity";
		//levelNames[18] = "Assets/Scenes/3-Ed/chase_slope.unity";
		//levelNames[19] = "Assets/Scenes/3-Ed/snowScalePoyo.unity";
	}
	
	return levelNames;
}

static function SetBGColors( n : int)
{
	var music : AudioSource = Camera.main.GetComponent(AudioSource);
switch (n)
	{
		case (1):
		// Camera.main.backgroundColor=Color(178.0/256, 200.0/256, 184.0/256, 1);
		  Camera.main.backgroundColor = GameplayParameters.Instance().World1.BackgroundColor;
		 backgroundColorEnd=Camera.main.backgroundColor;
		 
		 Shader.SetGlobalColor("_GroundPlaneColor", Color(144.0/256, 157.0/256, 128.0/256, 1));
		 break;
		 
		 case (2):
		 //Camera.main.backgroundColor=Color(20.0/256, 128.0/256, 178.0/256, 1);
		 Camera.main.backgroundColor = GameplayParameters.Instance().World1.BackgroundColor;
		 backgroundColorEnd=Camera.main.backgroundColor;
		 Shader.SetGlobalColor("_GroundPlaneColor", Color(192.0/256, 210.0/256, 221.0/256, 1));
		 break;
		
		
	}

}

static function PlatformDef(n:int)
{
	platformList = new String[4];
	switch(n)
	{
		case 1:
		
		platformList[0] = "Sadcloud";
		platformList[1] = "OwlFace";
		platformList[2] = "CubeSimple1";
		break;
		
		case 2:
		
		platformList[0] = "Sadcloud";
		platformList[1] = "OwlFace";
		platformList[2] = "CubeSimple1";
		break;
		
		case 3:
		
		platformList[0] = "Sadcloud";
		platformList[1] = "OwlFace";
		platformList[2] = "CubeSimple1";
		break;
	
	}
	return platformList;
}

static function PlatformOffsets(n:int)
{
	platformOffsets = new Vector3[3];
	switch(n)
	{
		case 1:
		platformOffsets[0] = Vector3(15,-5,0);
		platformOffsets[1] = Vector3(0,0,0);
		break;
		
		case 2:
		platformOffsets[0] = Vector3(0,0,0);
		platformOffsets[1] = Vector3(0,0,0);
		break;
		
		case 3:
		platformOffsets[0] = Vector3(0,0,0);
		platformOffsets[1] = Vector3(0,0,0);
		break;
	}
	return platformOffsets;
}

static function WorldDef(n: int)
{
	
	switch(n)
	{
		case 1:
		testString = "thisIsATest";
		mainFloorObj = "w1p1-floor 1";
		mainFloorObj2 = "w1p1-floor 2";
		mainFloorObj3 = "w1p1-floor";
		secondaryFloorObj = "w1p1-floor";
		tree1 ="w1tree1";
		tree2 ="w1tree2";
		tree3 ="w1tree3";
		cloud ="cloud";
		base = "blockdark";
		
		break;
		
		case 2:
		
		mainFloorObj = "w2p1-floor 1";
		secondaryFloorObj = "w2p1-floor";
		mainFloorObj2 = "w1p1-floor 2";
		mainFloorObj3 = "w2p1-floor";
		tree1 ="w2tree1";
		tree2 ="w2tree2";
		tree3 ="w2tree3";
		cloud ="Cloud2D";
		base = "blockdarkW2";
		break;
		
		case 3:
		
		mainFloorObj = "butterflyFloor 1";
		secondaryFloorObj = "butterflyFloor 1";
		mainFloorObj2 = "w1p1-floor 2";
		tree1 ="grassA";
		tree2 ="grassB";
		tree3 ="w2tree3";
		cloud ="ButterFly";
		base = "blockdarkW3";
		break;
	}
	
	objectList = new String[listSize];
	
	objectList[0] = mainFloorObj;
	objectList[1] = tree1;
	objectList[2] = tree2;
	objectList[3] = tree3;
	objectList[4] = cloud;
	objectList[5] = secondaryFloorObj;
	objectList[6] = base;
	objectList[7] = mainFloorObj2;
	objectList[8] = mainFloorObj3;
	return objectList;
}

}