using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelStateTransitionStartLevel : LevelStateTransitionBase {

    public LevelStateTransitionStartLevel(ELevelState fromState, ELevelState toState) : base (fromState, toState) {
    }

    public override bool Update(LevelManager level) {
        level.kobotoParent = new GameObject ("KobotoParent").transform;
        foreach (KobotoSpawnInfo spawnInfo in level.kobotoSpawnInfo) {
            Koboto koboto = KobotoFactory.SpawnKoboto(spawnInfo.kobotoType, spawnInfo.spawnPoint.position, level.kobotoParent);
            level.AddKoboto (koboto);
        }
        return true;
    }

}
