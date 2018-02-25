using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectBreakableGroup : LevelObjectBase {

    LevelObjectBreakable[] breakables;
    public override void Awake()
    {
        base.Awake();
        breakables = GetComponentsInChildren<LevelObjectBreakable>();
    }

    void OnTriggerEnter(Collider collider)
    {
        IBreaker breaker = collider.GetComponentInParent<IBreaker>();
        if (breaker != null && breaker.IBreakerActive())
        {
            foreach (var breakable in breakables)
            {
                breakable.MakeBreakable(true);
            }
        }
    }
}
