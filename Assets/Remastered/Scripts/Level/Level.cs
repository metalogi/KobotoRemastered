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
    }
    protected override void Init(EGameState gameState) {

        levelBounds = levelBoundsObject.bounds;
       
        Destroy(levelBoundsObject.gameObject);
        levelObjects = new List<LevelObjectBase>(GetComponentsInChildren<LevelObjectBase>());
        //levelObjects.ForEach((LevelObjectBase l)=>l.Init());
    }



    protected override void DidEnterGameState (EGameState gameState, EGameState fromState) {
        base.DidEnterGameState (gameState, fromState);
        if (gameState == EGameState.Play) {
            ResetKobotos();
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
    }

    public void ToggleAttachmentOnSelectedKoboto(EAttachmentType attachmentType) {
        if (selectedKoboto != null) {
            selectedKoboto.ToggleAttachment(attachmentType);
        }
    }
        

    public bool AllKobotosRescued() {
        return KobotosReady && kobotos.TrueForAll((Koboto k) => k.currentState == KobotoState.Rescued);
    }

    public bool AnyKobotoDeadOrLost() {
        return KobotosReady &&
            !kobotos.TrueForAll((Koboto k) => k.currentState != KobotoState.Dead && k.currentState != KobotoState.Lost);
    }

    bool KobotosReady {
        get { return kobotos != null && kobotos.Count > 0;}
    }

   



}
