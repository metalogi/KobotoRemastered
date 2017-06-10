using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class KobotoSpawnInfo{
    public EKobotoType kobotoType;
    public Transform spawnPoint;
}


public class Level : MonoBehaviour {

    public KobotoSpawnInfo[] kobotoSpawnInfo;

    [HideInInspector]
    public List<Koboto> kobotos;
    [HideInInspector]
    public List<LevelObjectBase> levelObjects;

    Koboto selectedKoboto;

    Transform kobotoParent;
    GameManager game;

    public void Init(GameManager game) {
        this.game = game;
        levelObjects = new List<LevelObjectBase>(GetComponentsInChildren<LevelObjectBase>());
        levelObjects.ForEach((LevelObjectBase l)=>l.Init());
    }

    public void SpawnKobotos() {
        kobotos = new List<Koboto>();
        kobotoParent = new GameObject("KobotoParent").transform;
        foreach (KobotoSpawnInfo spawnInfo in kobotoSpawnInfo) {
            Koboto koboto = KobotoFactory.SpawnKoboto(spawnInfo.kobotoType, spawnInfo.spawnPoint.position, kobotoParent);
            kobotos.Add (koboto);
            koboto.SetState(KobotoState.Alive);
        }
        SelectKoboto(kobotos[0]);
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
        return kobotos != null && kobotos.Count > 0 && kobotos.TrueForAll((Koboto k) => k.currentState == KobotoState.Rescued);
    }




}
