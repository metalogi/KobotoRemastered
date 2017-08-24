using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class IntroCam : KCam {

    public LevelObjectLineAttach splineAttach;

    public bool IntroFinished() {
        if (splineAttach != null) {
            return splineAttach.t >= 0.99f;
        }
        return false;
    }
}
