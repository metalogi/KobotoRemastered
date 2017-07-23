using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class KobotoSpawnInfo{
    public EKobotoType kobotoType;
    public Transform spawnPoint;
}


public class Level : KobotoMono {

    public KobotoSpawnInfo[] kobotoSpawnInfo;
    public MeshRenderer levelBoundsObject;

    public CameraController cameraController;
    public GameCam gameCam;
    public DragCam mapCam;

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
        GameManager.Instance.currentLevel = this;
        cameraController.RegisterCamera("Game", gameCam);
        cameraController.RegisterCamera("Map", mapCam);
        cameraController.SwitchToCamera("Game");
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

        case EGameState.Play:
            cameraController.LerpToCamera ("Game", 0.5f);
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
