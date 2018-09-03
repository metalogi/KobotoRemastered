using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

[System.Serializable]
public class KobotoSpawnInfo{
    public EKobotoType kobotoType;
    public Transform spawnPoint;
}


public class Level : KobotoMono {

    public KobotoSpawnInfo[] kobotoSpawnInfo;
    public List<EAttachmentType> availableAttachments;

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
    public List<LevelZone> levelZones;

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

    public void Update()
    {
        if (currentGameState == EGameState.Play || currentGameState == EGameState.Map)
        {
            cameraController.CheckLevelZones();
        }
    }

    T FindTaggedInScene<T>(string tag) {
        GameObject obj = GameObject.FindWithTag(tag);
        if (obj == null)
        {
            Debug.LogError("No object with tag: " + tag);
        }
        return obj.GetComponent<T>();
    }

    protected override void Init(EGameState gameState) 
    {

        levelObjects = new List<LevelObjectBase>(GetComponentsInChildren<LevelObjectBase>());

        levelZones = new List<LevelZone>();
        var cameraZones = new List<LevelZoneCameraForbidden>();

        LevelZoneWorld worldZone = null;


        foreach (var zone in GetComponentsInChildren<LevelZone>())
        {
            if (zone is LevelZoneWorld)
            {
                worldZone = zone as LevelZoneWorld;
            }
            else if (zone is LevelZoneCameraForbidden)
            {
                cameraZones.Add(zone as LevelZoneCameraForbidden);
            }
            else
            {
                levelZones.Add(zone);
            }
        }
        levelBounds = worldZone.GetBounds();
        cameraController.SetCameraForbiddenZones(worldZone, cameraZones);
    }



    protected override void DidEnterGameState (EGameState gameState, EGameState fromState) {
        base.DidEnterGameState (gameState, fromState);

        switch (gameState) {

        case EGameState.Intro:
            cameraController.SwitchToCamera("Intro");
            break;

        case EGameState.Play:
            cameraController.CopyPositionFromActive(gameCam);
            float camLerpTime = fromState == EGameState.Intro ? 2f : 0.5f;
            cameraController.LerpToCamera("Game", camLerpTime);
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
            koboto.SetLevelZones(levelZones);
            kobotos.Add(koboto);
            koboto.SetState(KobotoState.Alive);

            if (availableAttachments.Contains(EAttachmentType.Jetpack))
            {
                koboto.AddAttachment(EAttachmentType.Jetpack);
            }
        }
        SelectKoboto(kobotos[0]);
    }

    public void ResetKobotos() {
        for (int i=kobotos.Count-1; i>=0; i--) {
            Destroy(kobotos[i].gameObject);
        }
        SpawnKobotos(); 
    }

    public void ResetCamera()
    {
        gameCam.Reset();
    }

    public Koboto GetSelectedKoboto()
    {
        return selectedKoboto;
    }

    void SelectKoboto(Koboto koboto) {
        selectedKoboto = koboto;
        Koboto.Events.Trigger(KEventEnum.Selected, koboto);
    }

    public void ToggleAttachmentOnSelectedKoboto(EAttachmentType attachmentType) {
        if (selectedKoboto != null) {
            selectedKoboto.ToggleAttachment(attachmentType);
        }
    }

    public void JetpackButtonPressed()
    {
        if (selectedKoboto != null)
        {
            selectedKoboto.JetpackButtonPressed();
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
