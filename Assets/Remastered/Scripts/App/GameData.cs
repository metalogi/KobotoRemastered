using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu]
public class GameData : ScriptableObject {

    public List<WorldData> worldData;
}

[System.Serializable]
public class WorldData
{
    public string worldUID;
    public string displayName;
    public bool live;

    public List<LevelData> levelData;
}

[System.Serializable]
public class LevelData
{
    public string levelUID;
    public string displayName;
    public string scenePath;
    public bool live;
}


