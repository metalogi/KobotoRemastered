using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputModule : MonoBehaviour  {



    public virtual float Read() {
        return 0f;
    }

    public virtual void Enable(bool e) {
        enabled = e;

    }
}
