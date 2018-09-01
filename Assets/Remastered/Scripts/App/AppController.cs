using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
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
        ProgressManager.Init(forceNewGame);
	}

    public Animator splashScreenAnimator;
    public bool forceNewGame = false;
    const string sceneRoot = "Remastered/Scenes/";

    Scene currentLevelScene;
    string currentLevelScenePath;

    bool inTransition;

    Scene currentMapScene;

    void Start(){
        GameEvents.AddGameStateEnteredListener(GameStateEnteredListener);
        LoadWorldMap(1);
    }
        
    public void LoadWorldMap(int world) {
        if (ProgressManager.CurrentWorldNumber != world) {
            // set current world, and level to last unlocked in that world
            ProgressManager.instance.SetCurrentLevelToLastUnlockedInWorld(world);
        }
        string scenePath = sceneRoot + "World" + world.ToString("0") + "_Map";
        StartCoroutine(TransitionToScene(scenePath, EGameState.Unloaded));
      
    }

    public void LoadLevel(int world, int level) {

        string scenePath = ProgressManager.instance.GetScenePath(world, level);
        if (string.IsNullOrEmpty(scenePath))
        {
            Debug.LogError("couldn't load world " + world + " level " + level);
            return;
        }
        StartCoroutine(TransitionToScene(sceneRoot + scenePath, EGameState.Intro));
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
        case EGameState.LoadNextLevel:

            int currentWorld = ProgressManager.CurrentWorldNumber;
            ProgressManager.instance.AdvanceToNextLevel();

            if (ProgressManager.CurrentWorldNumber != currentWorld) {
                // Load world select
            } else {
            
                LoadLevel(ProgressManager.CurrentWorldNumber, ProgressManager.CurrentLevelNumber);
            }
            break;
        case EGameState.ReturnToMenu:
            LoadWorldMap(ProgressManager.CurrentWorldNumber);
            break;
        }
    }

    IEnumerator TransitionToScene(string scenePath, EGameState endState) {
        if (inTransition) {
            yield break;
        }

        inTransition = true;
        
        yield return StartCoroutine(ShowLoadingScreen());

        if (!string.IsNullOrEmpty(currentLevelScenePath)) {
            Debug.Log("unloading scene from path " + FullPath(currentLevelScenePath));
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

        GameManager.Instance.RequestState(endState);

        inTransition = false;


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
