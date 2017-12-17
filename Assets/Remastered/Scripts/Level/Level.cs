﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class KobotoSpawnInfo{
    public EKobotoType kobotoType;
    public Transform spawnPoint;
}


public class Level : KobotoMono {

    public KobotoSpawnInfo[] kobotoSpawnInfo;
    public List<EAttachmentType> availableAttachments;
    public MeshRenderer levelBoundsObject;

    public CameraController cameraController;
    public GameCam gameCam;
    public DragCam mapCam;
    public IntroCam introCam;
    public KCam winCam;

    public MusicTrack musicTrack = MusicTrack.World1;

    [HideInInspector]
    public List<Koboto> kobotos;
    [HideInInspector]
    public List<LevelObjectBase> levelObjects;

    Koboto selectedKoboto;

    Transform kobotoParent;

    Bounds levelBounds;

    IEnumerator Start() {
        if (GameManager.Instance == null) {
            Instantiate(Resources.Load<GameObject>("Game"));
        }
        while (GameManager.Instance == null) {
            yield return null;
        }
        if (introCam == null) {
            introCam = FindTaggedInScene<IntroCam>("K_INTRO_CAM");
        }
        if (gameCam == null) {
            gameCam = FindTaggedInScene<GameCam>("K_GAMECAM");
        }
        if (winCam == null) {
            winCam = FindTaggedInScene<KCam>("K_WIN_CAM");
        }
        if (mapCam ==null) {
            mapCam = FindTaggedInScene<DragCam>("K_MAP_CAM");
        }
        GameManager.Instance.currentLevel = this;
        cameraController.RegisterCamera("Game", gameCam);
        cameraController.RegisterCamera("Map", mapCam);
        cameraController.RegisterCamera ("Intro", introCam);
        cameraController.RegisterCamera ("Win", winCam);
        cameraController.SwitchToCamera("Game");
    }

    T FindTaggedInScene<T>(string tag) {
        GameObject obj = GameObject.FindWithTag(tag);
        return obj.GetComponent<T>();
    }
    protected override void Init(EGameState gameState) {

        levelBounds = levelBoundsObject.bounds;
       
        Destroy(levelBoundsObject.gameObject);
        levelObjects = new List<LevelObjectBase>(GetComponentsInChildren<LevelObjectBase>());
        //levelObjects.ForEach((LevelObjectBase l)=>l.Init());
    }



    protected override void DidEnterGameState (EGameState gameState, EGameState fromState) {
        base.DidEnterGameState (gameState, fromState);

        switch (gameState) {

        case EGameState.Intro:
            cameraController.SwitchToCamera ("Intro");
            break;

        case EGameState.Play:
            float camLerpTime = fromState == EGameState.Intro ? 2f : 0.5f;
            cameraController.LerpToCamera ("Game", camLerpTime);
            if (fromState != EGameState.Paused && fromState != EGameState.Map) {
                ResetKobotos ();
            }
            MusicPlayer.Instance.PlayTrack (musicTrack, true);
            break;

        case EGameState.Map:
            mapCam.SetFocus (gameCam.target.position, 30f);
            cameraController.LerpToCamera ("Map", 0.5f);
            MusicPlayer.Instance.PlayTrack (MusicTrack.Pause, false);
            break;

        case EGameState.Won:
            cameraController.LerpToCamera("Win", 0.5f);
            MusicPlayer.Instance.PlayTrack (MusicTrack.WinLevel, true);
            break;
        }

        
    }

    public void SpawnKobotos() {
        kobotos = new List<Koboto>();
        kobotoParent = new GameObject("KobotoParent").transform;
        foreach (KobotoSpawnInfo spawnInfo in kobotoSpawnInfo) {
            Koboto koboto = KobotoFactory.SpawnKoboto(spawnInfo.kobotoType, spawnInfo.spawnPoint.position, kobotoParent);
            koboto.SetLevelBounds(levelBounds);
            kobotos.Add(koboto);
            koboto.SetState(KobotoState.Alive);

        }
        SelectKoboto(kobotos[0]);
    }

    public void ResetKobotos() {
        for (int i=kobotos.Count-1; i>=0; i--) {
            Destroy(kobotos[i].gameObject);
        }
        SpawnKobotos();

    }

    void SelectKoboto(Koboto koboto) {
        selectedKoboto = koboto;
        KobotoEvents.Trigger(KEventEnum.Selected, koboto);
    }

    public void ToggleAttachmentOnSelectedKoboto(EAttachmentType attachmentType) {
        if (selectedKoboto != null) {
            selectedKoboto.ToggleAttachment(attachmentType);
        }
    }
        

    public bool AllKobotosRescued() {
        return KobotosReady && kobotos.TrueForAll((Koboto k) => k.currentState == KobotoState.Rescued);
    }

    public bool AnyKobotoDead() {
        return KobotosReady &&
            !kobotos.TrueForAll((Koboto k) => k.currentState != KobotoState.Dead);
    }

    bool KobotosReady {
        get { return kobotos != null && kobotos.Count > 0;}
    }

   



}
