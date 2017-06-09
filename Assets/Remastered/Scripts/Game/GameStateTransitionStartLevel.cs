using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameStateTransitionStartLevel : GameStateTransitionBase {

    public GameStateTransitionStartLevel(EGameState fromState, EGameState toState) : base (fromState, toState) {
    }

    public override bool Update(GameManager level) {
        level.kobotoParent = new GameObject ("KobotoParent").transform;
        foreach (KobotoSpawnInfo spawnInfo in level.kobotoSpawnInfo) {
            Koboto koboto = KobotoFactory.SpawnKoboto(spawnInfo.kobotoType, spawnInfo.spawnPoint.position, level.kobotoParent);
            level.AddKoboto (koboto);
        }
        return true;
    }

}
