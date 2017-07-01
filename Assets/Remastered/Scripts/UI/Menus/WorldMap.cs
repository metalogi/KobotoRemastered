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

        for (int i=0; i<levelSelectors.Length; i++) {
            levelSelectors[i].Setup(this, i+1);
            swipeCam.AddTarget(levelSelectors[i].transform.position);
        }

        camController.RegisterCamera("Drag", dragCam);
        camController.RegisterCamera("Swipe", swipeCam);

        camController.SwitchToCamera("Drag");
        
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
                camController.SwitchToCamera("Swipe");
            } else {
                levelSelectors[i].Show(false);
            }
        }
    }

    protected override void OnPointerDown (UnityEngine.EventSystems.PointerEventData eventData)
    {
        if (camController.IsCamActive("Swipe")) {
            camController.SwitchToCamera("Drag");
        }
    }

   
            

}
