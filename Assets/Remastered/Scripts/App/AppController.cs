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
        LoadLevel(1,1);
    }

    public void LoadLevel(int world, int level) {
        StartCoroutine(TransitionToLevel(world, level));
    }

    IEnumerator TransitionToLevel(int world, int level) {

        yield return StartCoroutine(ShowLoadingScreen());
        string scenePath = sceneRoot + "World" + world.ToString("0") + "/Level" + level.ToString("00");
        Debug.Log("Loading scene from path " + scenePath);
       

        AsyncOperation loader = SceneManager.LoadSceneAsync(scenePath, LoadSceneMode.Additive);
        while (!loader.isDone) {
            yield return null;
        }

        currentLevelScene = SceneManager.GetSceneByPath(scenePath);
        currentLevelScenePath = scenePath;
        currentLevelWorldNumber = world;
        currentLevelNumber = level;

        yield return StartCoroutine(HideLoadingScreen());


    }

    IEnumerator ShowLoadingScreen() {
        yield break;
    }

    IEnumerator HideLoadingScreen() {
        yield break;
    }
	
}
