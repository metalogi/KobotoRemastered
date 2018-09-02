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

    public static int worldCount {
        get { return instance.gameProgress.Count; }
    }
    public static int[] levelCounts;
    public static int bonusTokensPerLevel = 3;

    public static GameData gameData;



    // current level
    int currentWorldIndex;
    int currentLevelIndex;

    List<List<LevelProgress>> gameProgress;

    #region saveFileContents
    [SerializeField]
    bool[] worldsUnlocked;
    [SerializeField]
    SavedLevelDictionary savedLevelsData;

    [SerializeField]
    SerializableDictionaryOfStringAndInt playerStats;

    [SerializeField]
    bool gameBeaten;

    #endregion

    public static void Init(bool forceNewGame) {
        if (instance != null) {
            return;
        }
            
        GameObject host = new GameObject("ProgressManager");
        instance = host.AddComponent<ProgressManager>();

       
        saveDirectory = Path.Combine(Application.persistentDataPath, "Koboto");
        savePath = Path.Combine(saveDirectory, "kSave_v1_0.json");

        if (!instance.ProcessGameData())
        {
            Debug.LogAssertion("Failed to read static game data");
            return;
        }
       

        if (forceNewGame || !instance.InitFromSaveFile()) {
            instance.InitAsNewPlayer();
        }
        instance.SetCurrentLevelToLastUnlocked();
    }

    bool ProcessGameData()
    {
        string path = "GameData/GameData";
        gameData = Resources.Load<GameData>(path);

        if (gameData == null)
        {
            return false;
        }

        gameProgress = new List<List<LevelProgress>>();
        //savedLevelsProgress = new List<LevelProgress>();
        
        foreach(var world in gameData.worldData)
        {
            if (!world.live) continue;

            var worldProgress = new List<LevelProgress>();
            gameProgress.Add(worldProgress);

            foreach (var level in world.levelData)
            {
                if (!level.live) continue;

                var levelProgress = new LevelProgress();
                levelProgress.levelUID = level.levelUID;
                levelProgress.bonusTokens = new bool[3];

                worldProgress.Add(levelProgress);
               // savedLevelsProgress.Add(levelProgress);
            }

        }

        levelCounts = new int[gameProgress.Count];
        for (int i=0; i< gameProgress.Count; i++)
        {
            levelCounts[i] = gameProgress[i].Count;
        }

        return true;
    }


    public static int CurrentWorldNumber {
        get { return instance == null? 1 : instance.currentWorldIndex + 1;}
       
    }

    public static int CurrentLevelNumber {
        get { return instance == null? 1 : instance.currentLevelIndex + 1;}
      
    }

    public bool IsLevelUnlocked(int worldNumber, int levelNumber) {
        int levelIndex = levelNumber - 1;
        int worldIndex = worldNumber - 1;
        if (WorldExists(worldIndex, levelIndex))
        {
            return gameProgress[worldIndex][levelIndex].unlocked;
        }

        return false;
    }

    public void MarkCurrentLevelComplete() {

        LevelProgress levelProgress = gameProgress[currentWorldIndex][currentLevelIndex];
        levelProgress.passed = true;
        WriteToSaveData(levelProgress.levelUID, (s) => s.passed = true);
       


        // unlock next level
        if (currentLevelIndex == levelCounts[currentWorldIndex] -1) { // final level in world, unlock next world
            if (currentWorldIndex == worldCount - 1) {
                gameBeaten = true;
            } else {
                worldsUnlocked[currentWorldIndex + 1] = true;
                LevelProgress firstLevelNextWorldProgress = gameProgress[currentWorldIndex + 1][1];
                firstLevelNextWorldProgress.unlocked = true;

                WriteToSaveData(firstLevelNextWorldProgress.levelUID, (s) => s.unlocked = true);
            }
        }

        LevelProgress nextLevelProgress = gameProgress[currentWorldIndex][currentLevelIndex + 1];
        nextLevelProgress.unlocked = true;
        WriteToSaveData(nextLevelProgress.levelUID, (s) => s.unlocked = true);
        SaveToFile();

    }

    public bool GetBonusTokenCollected(int worldNumber, int levelNumber, int index)
    {
        int levelIndex = levelNumber - 1;
        int worldIndex = worldNumber - 1;
        if (WorldExists(worldIndex, levelIndex))
        {
            var levelProgress = gameProgress[worldIndex][levelIndex];
            return levelProgress.bonusTokens[index];
        }
        return false;
    }

    public void CollectBonusToken(int worldNumber, int levelNumber, int index)
    {
        int levelIndex = levelNumber - 1;
        int worldIndex = worldNumber - 1;
        if (WorldExists(worldIndex, levelIndex))
        {
            var levelProgress = gameProgress[worldIndex][levelIndex];
            levelProgress.bonusTokens[index] = true;

            WriteToSaveData(levelProgress.levelUID, (s) => s.bonusTokens[index] = true);
            SaveToFile();
        }
    }

    void WriteToSaveData(string uid, Action<LevelSaveData> saveAction)
    {
        LevelSaveData saveData = null;
        if (!savedLevelsData.TryGetValue(uid, out saveData))
        {
            saveData = new LevelSaveData();
            savedLevelsData.Add(uid, saveData);
        }
        saveAction(saveData);
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

    public string GetScenePath(int worldNumber, int levelNumber)
    {
        int worldIndex = worldNumber - 1;
        int levelIndex = levelNumber - 1;

        if (WorldExists(worldIndex, levelIndex))
        {
            return gameData.worldData[worldIndex].levelData[levelIndex].scenePath;
        }

        return null;
    }

    bool WorldExists(int worldIndex, int levelIndex)
    {

        if (worldIndex >= 0 && worldIndex < gameData.worldData.Count)
        {
            if (levelIndex >= 0 && levelIndex < gameData.worldData[worldIndex].levelData.Count)
            {
                return true;
            }
        }
        return false;
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

        savedLevelsData = new SavedLevelDictionary();
        worldsUnlocked = new bool[worldCount];

        playerStats = new SerializableDictionaryOfStringAndInt();
        playerStats.Add("TestStat", 1);

        currentWorldIndex = 0;
        currentLevelIndex = 0;

        worldsUnlocked[0] = true;
        gameProgress[0][0].unlocked = true;
        WriteToSaveData(gameProgress[0][0].levelUID, (s) => s.unlocked = true);

        SaveToFile();
    }

    bool InitFromSaveFile() {
        if (File.Exists(savePath)) {
            Debug.Log ("Loading save from : " + savePath);
            string jsonStr = File.ReadAllText(savePath);

            Debug.Log("Reading save file: " + jsonStr);
            JsonUtility.FromJsonOverwrite(jsonStr, this);

            foreach (var kvp in savedLevelsData)
            {
                string id = kvp.Key;
                LevelSaveData saveData = kvp.Value;
                
                var levelProgress = FindLevelProgress(id);
                if (levelProgress != null)
                {
                    levelProgress.LoadFromSave(saveData);
                }
            }

            return true;
                
        }
        return false;
        
    }

    LevelProgress FindLevelProgress(string levelUID)
    {
        foreach (var world in gameProgress)
        {
            foreach (var level in world)
            {
                if (level.levelUID == levelUID)
                {
                    return level;
                }
            }
        }
        
        return null;
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
        Debug.Log("Writing save file: " + jsonStr);
        Debug.Log("Wrote save file to " + savePath);
    }

}

public class LevelProgress {
    public string levelUID;
    public bool unlocked;
    public bool passed;
    public bool[] bonusTokens = new bool[3];

    public void LoadFromSave(LevelSaveData from)
    {
        unlocked = from.unlocked;
        passed = from.passed;

        for (int i=0; i<3; i++)
        {
            bonusTokens[i] = from.bonusTokens[i];
        }
        
    }
}

[System.Serializable]
public class LevelSaveData
{
    public bool unlocked;
    public bool passed;
    public bool[] bonusTokens = new bool[3];
}
