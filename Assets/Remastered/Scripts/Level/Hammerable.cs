using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Hammerable : LevelObjectBase {

    public bool stopHammer;

	public bool HitByHammer(AttachmentHammer hammer) {
        return stopHammer;
    }
}
