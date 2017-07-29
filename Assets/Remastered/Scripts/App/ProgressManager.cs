using System;
using System.IO;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class ProgressManager : MonoBehaviour {

    public static ProgressManager instance;
    static string saveDirectory;
    static string savePath;

    // constants
    public static int worldCount = 3;
    public static int[] levelCounts = new int[3]{10,10,10};
    public static int bonusTokensPerLevel = 3;

    // current level
    int currentWorldIndex;
    int currentLevelIndex;

    #region saveFileContents
    [SerializeField]
    bool[] worldsUnlocked;
    [SerializeField]
    List<List<LevelProgress>> gameProgress;
    [SerializeField]
    List<LevelProgress> world1Progress;
    [SerializeField]
    List<LevelProgress> world2Progress;
    [SerializeField]
    List<LevelProgress> world3Progress;

    [SerializeField]
    SerializableDictionaryOfStringAndInt playerStats;

    [SerializeField]
    bool gameBeaten;

    #endregion

    public static void Init() {
        if (instance != null) {
            return;
        }
            
        GameObject host = new GameObject("ProgressManager");
        instance = host.AddComponent<ProgressManager>();

       
        saveDirectory = Path.Combine(Application.persistentDataPath, "Koboto");
        savePath = Path.Combine(saveDirectory, "kSave.json");
    

        if (!instance.InitFromSaveFile()) {
            instance.InitAsNewPlayer();
        }
        instance.SetCurrentLevelToLastUnlocked();
       

    }

    public static int CurrentWorldNumber {
        get { return instance == null? 1 : instance.currentWorldIndex + 1;}
       
    }

    public static int CurrentLevelNumber {
        get { return instance == null? 1 : instance.currentLevelIndex + 1;}
      
    }

    public bool IsLevelUnlocked(int worldNumber, int levelNumber) {
        int levelIndex = levelNumber - 1;

        if (worldNumber == 1 && levelIndex < world1Progress.Count) { 
            return world1Progress [levelIndex].unlocked;

        } else if (worldNumber == 2 && levelIndex < world2Progress.Count) { 
            return world2Progress [levelIndex].unlocked;

        } else if (worldNumber == 3 && levelIndex < world3Progress.Count) { 
            return world3Progress [levelIndex].unlocked;
        }

        return false;
    }

    public void MarkCurrentLevelComplete() {
        LevelProgress levelProgress = gameProgress[currentWorldIndex][currentLevelIndex];
        levelProgress.passed = true;

        // unlock next level
        if (currentLevelIndex == levelCounts[currentWorldIndex] -1) { // final level in world, unlock next world
            if (currentWorldIndex == worldCount - 1) {
                gameBeaten = true;
            } else {
                worldsUnlocked[currentWorldIndex + 1] = true;
                LevelProgress firstLevelNextWorldProgress = gameProgress[currentWorldIndex + 1][1];
                firstLevelNextWorldProgress.unlocked = true;
            }
            
        }

        LevelProgress nextLevelProgress = gameProgress[currentWorldIndex][currentLevelIndex + 1];
        nextLevelProgress.unlocked = true;
        SaveToFile();

    }

    public void AdvanceToNextLevel() {


        if (currentLevelIndex >= levelCounts[currentWorldIndex]-1) { 
            if (currentWorldIndex < worldCount - 1) {
           
                currentWorldIndex = currentWorldIndex + 1;
                currentLevelIndex = 0;
            }
           
        } else {
            currentLevelIndex++;
        }

    }

    public void SetCurrentLevel(int worldNumber, int levelNumber) {
        currentWorldIndex = worldNumber - 1;
        currentLevelIndex = levelNumber - 1;
    }

    public void SetCurrentLevelToLastUnlockedInWorld(int worldNumber) {
        currentWorldIndex = worldNumber - 1;
        currentLevelIndex = 0;

        for (int i=0; i<levelCounts[currentWorldIndex]; i++) {
            LevelProgress nextLevelProgress = gameProgress[currentWorldIndex][i];
            if (!nextLevelProgress.passed) {
                currentLevelIndex = i;
                break;
            }
        }

    }

    void SetCurrentLevelToLastUnlocked() {
        currentWorldIndex = 0;
        currentLevelIndex = 0;

        while (currentWorldIndex < (worldCount -1) && worldsUnlocked[currentLevelIndex + 1]) {
            currentWorldIndex++;
        }

        for (int i=0; i<levelCounts[currentWorldIndex]; i++) {
            LevelProgress nextLevelProgress = gameProgress[currentWorldIndex][i];
            if (!nextLevelProgress.passed) {
                currentLevelIndex = i;
                break;
            }
        }

    }

    void InitAsNewPlayer() {
       
        gameProgress = new List<List<LevelProgress>>();
        for (int i=0; i<worldCount; i++) {
            List<LevelProgress> progressForWorld = new List<LevelProgress>();

            for (int j=0; j<levelCounts[i]; j++) {
                LevelProgress levelProgress = new LevelProgress();
                levelProgress.bonusTokens = new bool[3];
                progressForWorld.Add(levelProgress);
            }
            if (i==0) {
                world1Progress = progressForWorld;
            }
            gameProgress.Add(progressForWorld);
        }

        worldsUnlocked = new bool[worldCount];

        playerStats = new SerializableDictionaryOfStringAndInt();
        playerStats.Add("TestStat", 1);

        currentWorldIndex = 0;
        currentLevelIndex = 0;

        worldsUnlocked [0] = true;
        world1Progress [0].unlocked = true;

        SaveToFile();
       

    }

    bool InitFromSaveFile() {
        if (File.Exists(savePath)) {
            Debug.Log ("Loading save from : " + savePath);
            string jsonStr = File.ReadAllText(savePath);
            JsonUtility.FromJsonOverwrite(jsonStr, this);
            gameProgress = new List<List<LevelProgress>>();
            gameProgress.Add(world1Progress);
            gameProgress.Add(world2Progress);
            gameProgress.Add(world3Progress);
            return true;
                
        }
        return false;
        
    }

    void SaveToFile() {
        string jsonStr = JsonUtility.ToJson(this);

        if (!Directory.Exists(saveDirectory)) {
            Directory.CreateDirectory(saveDirectory);
        }

        if (!File.Exists(savePath)) {
            File.Create(savePath).Dispose();
        }
        File.WriteAllText(savePath, jsonStr);
        Debug.Log("Wrote save file to " + savePath);
    }



}

[System.Serializable]
public class LevelProgress {
    public bool unlocked;
    public bool passed;
    public bool[] bonusTokens;
}
