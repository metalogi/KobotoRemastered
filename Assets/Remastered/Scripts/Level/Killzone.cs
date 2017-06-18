using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Killzone : LevelObjectBase {

    public KobotoDeath deathType;
    public Transform killer;
    public bool parentToKiller;

    protected override void OnKobotoEnter(Koboto koboto) {
        base.OnKobotoEnter(koboto);
        if (killer == null) {
            killer = transform;
        }
        koboto.Kill(deathType, killer);
        if (parentToKiller) {
            koboto.ParentToTransform(killer);
        }
    }
}
