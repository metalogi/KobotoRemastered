﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class KobotoSpawnInfo{
    public EKobotoType kobotoType;
    public Transform spawnPoint;
}


public class Level : MonoBehaviour {

    public KobotoSpawnInfo[] kobotoSpawnInfo;
    public MeshRenderer levelBoundsObject;

    [HideInInspector]
    public List<Koboto> kobotos;
    [HideInInspector]
    public List<LevelObjectBase> levelObjects;

    Koboto selectedKoboto;

    Transform kobotoParent;
    GameManager game;
    Bounds levelBounds;

    public void Init(GameManager game) {
        this.game = game;
        levelBounds = levelBoundsObject.bounds;
       
        Destroy(levelBoundsObject.gameObject);
        levelObjects = new List<LevelObjectBase>(GetComponentsInChildren<LevelObjectBase>());
        //levelObjects.ForEach((LevelObjectBase l)=>l.Init());
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
