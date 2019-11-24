using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class WorldObjectDefs
{
public static string testString;
public static string mainFloorObj;
public static string mainFloorObj2;
public static string mainFloorObj3;
    public static string secondaryFloorObj;
    public static string cloud;
public static string tree1;
public static string tree2;
public static string tree3;
public static string basee;
public static string[] objectList;
public static string[] platformList;
public static Vector3[] platformOffsets;

static int listSize = 9;

static string ForestMusic = "Prefabs/Audio/W1Music";
static string SnowMusic  = "AUDIO/ingame2_demo_01.wav";
static string MachineMusic  = "AUDIO/ingame2_demo_01.wav";

static int[] numberOfLevels ;
static int numberOfWorlds  =3;

static string woodMaterial  ="Local Assets/Models/World/Materials/wood.mat";
static string metalMaterial  ="Local Assets/Models/World/Materials/Metal.mat";
static string iceMaterial  ="Local Assets/Materials/Base/Ice.mat";
static string glassMaterial  ="Local Assets/Materials/Base/GlassLight.mat";

static string W1BottomMat ="Local Assets/Models/World/Materials/W1Dark.mat";
static string W2BottomMat ="Local Assets/Models/World/Materials/W2Dark.mat";
static string W3BottomMat ="Local Assets/Models/World/Materials/W3Dark.mat";

public static int[] GetNumberOfLevels()
    {
        numberOfLevels = new int[numberOfWorlds + 1];
        numberOfLevels[0] = 6;
        numberOfLevels[1] = 20;
        numberOfLevels[2] = 20;
        numberOfLevels[3] = 20;

        return numberOfLevels;

    }

    public static string[] GetLevelNames(int w)
    {
        GetNumberOfLevels();
        string[] levelNames = null;
        //var levelNames : String [] = new String[numberOfLevels[w]];
        if (w == 1)
        {
            levelNames = new string[20];
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
            levelNames[10] = "Assets/Scenes/3-Ed/easyJet.unity";
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
        if (w == 2)
        {
            levelNames = new string[20];

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
            levelNames[10] = "Assets/Scenes/3-Ed/probMagfixed.unity";
            levelNames[11] = "Assets/Scenes/3-Ed/floatingScales.unity";
            levelNames[12] = "Assets/Scenes/3-Ed/mediumSpringMag.unity";
            levelNames[13] = "Assets/Scenes/3-Ed/badCloudFree.unity";
            levelNames[14] = "Assets/Scenes/3-Ed/introducingQuadWheels0.unity";
            levelNames[15] = "Assets/Scenes/3-Ed/snowScales.unity";

            levelNames[16] = "Assets/Scenes/3-Ed/snow1.unity";
            levelNames[17] = "Assets/Scenes/3-Ed/movables2.unity";
            levelNames[18] = "Assets/Scenes/3-Ed/chase_slope.unity";
            levelNames[19] = "Assets/Scenes/3-Ed/snowScalePoyo.unity";
        }

        if (w == 3)
        {
            levelNames = new string[20];

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

            levelNames[19] = "Assets/Scenes/3-Ed/ed_010_W3_v2.unity";
            //levelNames[17] = "Assets/Scenes/3-Ed/movables2.unity";
            //levelNames[18] = "Assets/Scenes/3-Ed/chase_slope.unity";
            //levelNames[19] = "Assets/Scenes/3-Ed/snowScalePoyo.unity";
        }

        return levelNames;
    }

    public static void SetBGColors(int n)
    {
        
        switch (n)
        {
            case (1):
               // Camera.main.backgroundColor= new Color(178.0f/256.0f, 200.0f/256.0f, 184.0f/256.0f, 1.0f);
                //Camera.main.backgroundColor = GameplayParameters.Instance().World1.BackgroundColor;
               // backgroundColorEnd = Camera.main.backgroundColor;

               // Shader.SetGlobalColor("_GroundPlaneColor", Color(144.0f / 256.0f, 157.0f / 256.0f, 128.0f / 256.0f, 1.0f));
                break;

            case (2):
               // Camera.main.backgroundColor=new Color(20.0f/ 256.0f, 128.0f/ 256.0f, 178.0f/ 256.0f, 1.0f);
                //Camera.main.backgroundColor = GameplayParameters.Instance().World1.BackgroundColor;
               // backgroundColorEnd = Camera.main.backgroundColor;
               // Shader.SetGlobalColor("_GroundPlaneColor", Color(192.0f / 256.0f, 210.0f / 256.0f, 221.0f / 256.0f, 1.0f));
                break;


        }

    }

    public static string[] PlatformDef(int n)
    {
        platformList = new string[4];
        switch (n)
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

    public static Vector3[] PlatformOffsets(int n)
    {
        platformOffsets = new Vector3[3];
        switch (n)
        {
            case 1:
                platformOffsets[0] = new Vector3(15, -5, 0);
                platformOffsets[1] = new Vector3(0, 0, 0);
                break;

            case 2:
                platformOffsets[0] = new Vector3(0, 0, 0);
                platformOffsets[1] = new Vector3(0, 0, 0);
                break;

            case 3:
                platformOffsets[0] = new Vector3(0, 0, 0);
                platformOffsets[1] = new Vector3(0, 0, 0);
                break;
        }
        return platformOffsets;
    }

    public static string[] WorldDef(int n)
    {

        switch (n)
        {
            case 1:
                testString = "thisIsATest";
                mainFloorObj = "w1p1-floor 1";
                mainFloorObj2 = "w1p1-floor 2";
                mainFloorObj3 = "w1p1-floor";
                secondaryFloorObj = "w1p1-floor";
                tree1 = "w1tree1";
                tree2 = "w1tree2";
                tree3 = "w1tree3";
                cloud = "cloud";
                basee = "blockdark";

                break;

            case 2:

                mainFloorObj = "w2p1-floor 1";
                secondaryFloorObj = "w2p1-floor";
                mainFloorObj2 = "w1p1-floor 2";
                mainFloorObj3 = "w2p1-floor";
                tree1 = "w2tree1";
                tree2 = "w2tree2";
                tree3 = "w2tree3";
                cloud = "Cloud2D";
                basee = "blockdarkW2";
                break;

            case 3:

                mainFloorObj = "butterflyFloor 1";
                secondaryFloorObj = "butterflyFloor 1";
                mainFloorObj2 = "w1p1-floor 2";
                tree1 = "grassA";
                tree2 = "grassB";
                tree3 = "w2tree3";
                cloud = "ButterFly";
                basee = "blockdarkW3";
                break;
        }

        objectList = new string[listSize];

        objectList[0] = mainFloorObj;
        objectList[1] = tree1;
        objectList[2] = tree2;
        objectList[3] = tree3;
        objectList[4] = cloud;
        objectList[5] = secondaryFloorObj;
        objectList[6] = basee;
        objectList[7] = mainFloorObj2;
        objectList[8] = mainFloorObj3;
        return objectList;
    }
}
