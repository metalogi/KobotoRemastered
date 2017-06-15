using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class AppController : MonoBehaviour {

    static AppController instance;


    public static AppController Instance {
        get {
            return instance;
        }
    }
	
	void Awake() {
        instance = this;
        
	}
	
    const string sceneRoot = "Remastered/Scenes/";
    Scene currentLevelScene;
    string currentLevelScenePath;
    int currentLevelWorldNumber;
    int currentLevelNumber;

    void Start(){
        GameEvents.AddGameStateEnteredListener(GameStateEnteredListener);
        LoadLevel(1,1);
    }

    public void LoadLevel(int world, int level) {
        StartCoroutine(TransitionToLevel(world, level));
    }

    void GameStateEnteredListener(EGameState state, EGameState fromState) {
        Debug.Log("App controller detected game state change: " + state);
        if (currentLevelScene != null && state == EGameState.LoadNextLevel) {
            LoadLevel(currentLevelWorldNumber, currentLevelNumber + 1);
        }
    }

    IEnumerator TransitionToLevel(int world, int level) {

        yield return StartCoroutine(ShowLoadingScreen());

        if (!string.IsNullOrEmpty(currentLevelScenePath)) {
            AsyncOperation unloader = SceneManager.UnloadSceneAsync(FullPath(currentLevelScenePath));
            while (!unloader.isDone) {
                yield return null;
            }
        }
        string scenePath = sceneRoot + "World" + world.ToString("0") + "/Level" + level.ToString("00");
        Debug.Log("Loading scene from path " + scenePath);
       

        AsyncOperation loader = SceneManager.LoadSceneAsync(scenePath, LoadSceneMode.Additive);
        while (!loader.isDone) {
            yield return null;
        }

        string fullPath = FullPath(scenePath);

        currentLevelScene = SceneManager.GetSceneByPath(fullPath);
        currentLevelScenePath = scenePath;
        currentLevelWorldNumber = world;
        currentLevelNumber = level;

        SceneManager.SetActiveScene(currentLevelScene);



        yield return StartCoroutine(HideLoadingScreen());


    }

    string FullPath(string shortPath) {
        return "Assets/" + shortPath + ".unity";
    }

    IEnumerator ShowLoadingScreen() {
        yield break;
    }

    IEnumerator HideLoadingScreen() {
        yield break;
    }
	
}
