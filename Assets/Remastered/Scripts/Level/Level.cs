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

    Transform kobotoParent;
    GameManager game;

    public void Init(GameManager game) {
        this.game = game;
        levelObjects = new List<LevelObjectBase>(GetComponentsInChildren<LevelObjectBase>());
        levelObjects.ForEach((LevelObjectBase l)=>l.Init());
    }

    public void SpawnKobotos() {
        kobotoParent = new GameObject("KobotoParent").transform;
        foreach (KobotoSpawnInfo spawnInfo in kobotoSpawnInfo) {
            Koboto koboto = KobotoFactory.SpawnKoboto(spawnInfo.kobotoType, spawnInfo.spawnPoint.position, kobotoParent);
            AddKoboto(koboto);
            koboto.SetState(KobotoState.Alive);
        }
    }

    public void ListenToKobotos(bool listen) {
        if (listen) {
         //   KobotoEvents.AddListener(KEventEnum.Rescued, DidRescueKoboto);
        }
    }
        


    public void AddKoboto(Koboto koboto) {
        if (kobotos == null) {
            kobotos = new List<Koboto> ();
        }
        kobotos.Add (koboto);
    }

    public bool AllKobotosRescued() {
        return kobotos != null && kobotos.Count > 0 && kobotos.TrueForAll((Koboto k) => k.currentState == KobotoState.Rescued);
    }




}
