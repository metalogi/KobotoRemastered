using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WorldMap : KobotoMono {

    public UIDrag dragControl;
    public DragCam dragCam;
    public SwipeCam swipeCam;

    CameraController camController;
    LevelSelector[] levelSelectors;


    void Start() {
        ListenToPointerEvents();
       // dragControl.dragDelegate = this;
        camController = GetComponent<CameraController>();
        levelSelectors = GetComponentsInChildren<LevelSelector>();

        int currentWorldNumber = ProgressManager.CurrentWorldNumber;

        LevelSelector selected = null;

        for (int i=0; i<levelSelectors.Length; i++) {
            int levelNumber = i + 1;
            bool isUnlocked = ProgressManager.instance.IsLevelUnlocked (currentWorldNumber, levelNumber);
            bool isSelected = levelNumber == ProgressManager.CurrentLevelNumber;
            levelSelectors[i].Setup(this, levelNumber, isUnlocked, isSelected);
            if (isUnlocked) {
                swipeCam.AddTarget (levelSelectors [i].transform.position);
            }
            if (isSelected && isUnlocked) {
                selected = levelSelectors [i];
            }
                
        }

        camController.RegisterCamera("Drag", dragCam);
        camController.RegisterCamera("Swipe", swipeCam);

        if (selected != null) {
            SelectLevel (selected);
        } else {
            camController.SwitchToCamera ("Drag");
        }
 
    }

    public void Update() {
        if (Input.GetMouseButtonUp(0)) {
           // AppController.Instance.LoadLevel(ProgressManager.CurrentWorldNumber, ProgressManager.CurrentLevelNumber);
        }
    }

    public void SelectLevel(LevelSelector selector) {
        
        for (int i=0; i<levelSelectors.Length; i++) {
            if (selector == levelSelectors[i]) {
                levelSelectors[i].Show(true);
                swipeCam.JumpToTarget(i);
                camController.LerpToCamera("Swipe", 0.25f);
            } else {
                levelSelectors[i].Show(false);
            }
        }
    }

    public void PlayLevel(int levelNumber) {
        ProgressManager.instance.SetCurrentLevel (ProgressManager.CurrentWorldNumber, levelNumber);
        AppController.Instance.LoadLevel(ProgressManager.CurrentWorldNumber, levelNumber);
    }

    protected override void OnPointerDown (UnityEngine.EventSystems.PointerEventData eventData)
    {
        if (camController.IsCamActive("Swipe")) {
            camController.LerpToCamera("Drag", 0.6f);
            for (int i=0; i<levelSelectors.Length; i++) {
                levelSelectors[i].Show(false);
            }
        }
    }

   
            

}
