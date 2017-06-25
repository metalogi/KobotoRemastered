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
        ProgressManager.Init();
        
	}
	
    const string sceneRoot = "Remastered/Scenes/";

    Scene currentLevelScene;
    string currentLevelScenePath;
//    int currentLevelWorldNumber;
//    int currentLevelNumber;

    Scene currentMapScene;

    void Start(){
        GameEvents.AddGameStateEnteredListener(GameStateEnteredListener);
        LoadWorldMap(1);
    }

    public void LoadWorldMap(int world) {
        string scenePath = sceneRoot + "World" + world.ToString("0") + "_Map";
        StartCoroutine(TransitionToScene(scenePath));
      
    }

    public void LoadLevel(int world, int level) {
        string scenePath = sceneRoot + "World" + world.ToString("0") + "/Level" + level.ToString("00");
        StartCoroutine(TransitionToScene(scenePath));
    }

    void GameStateEnteredListener(EGameState state, EGameState fromState) {
        Debug.Log("App controller detected game state change: " + state);
        if (currentLevelScene == null) {
            return;
        }
        switch (state) {
        case EGameState.Won:
            ProgressManager.instance.MarkCurrentLevelComplete();
            break;
        }
        if (state == EGameState.LoadNextLevel) {

            int currentWorld = ProgressManager.CurrentWorldNumber;
            ProgressManager.instance.AdvanceToNextLevel();

            if (ProgressManager.CurrentWorldNumber != currentWorld) {
                // Load world select
            } else {
            
                LoadLevel(ProgressManager.CurrentWorldNumber, ProgressManager.CurrentLevelNumber);
            }
        }
    }

    IEnumerator TransitionToScene(string scenePath) {

        yield return StartCoroutine(ShowLoadingScreen());

        if (!string.IsNullOrEmpty(currentLevelScenePath)) {
            AsyncOperation unloader = SceneManager.UnloadSceneAsync(FullPath(currentLevelScenePath));
            while (!unloader.isDone) {
                yield return null;
            }
        }
       
        Debug.Log("Loading scene from path " + scenePath);
       

        AsyncOperation loader = SceneManager.LoadSceneAsync(scenePath, LoadSceneMode.Additive);
        while (!loader.isDone) {
            yield return null;
        }

        string fullPath = FullPath(scenePath);

        currentLevelScene = SceneManager.GetSceneByPath(fullPath);
        currentLevelScenePath = scenePath;



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
