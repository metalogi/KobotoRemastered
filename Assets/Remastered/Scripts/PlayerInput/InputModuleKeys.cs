using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputModuleKeys : InputModule {

    public override float Read() {
        Debug.Log("Reading keys");
        float v = 0f;
        if (Input.GetKey(KeyCode.D)) {
            v += 0.5f;
        }
        if (Input.GetKey(KeyCode.A)) {
            v -= 0.5f;
        }

        if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift)) {
            v *= 2f;
        }
        return v;
            
    }
}
