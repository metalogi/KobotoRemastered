using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputModuleTilt : InputModule {

    public override void Enable (bool e)
    {
        base.Enable (e);
        Input.gyro.enabled = e;
    }

    public override float Read() {
        return Input.gyro.gravity.x;
    }
}
