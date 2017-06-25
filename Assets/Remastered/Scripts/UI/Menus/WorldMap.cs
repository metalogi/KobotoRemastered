using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WorldMap : MonoBehaviour {

    public void Update() {
        if (Input.GetMouseButtonUp(0)) {
            AppController.Instance.LoadLevel(1,1);
        }
    }
}
