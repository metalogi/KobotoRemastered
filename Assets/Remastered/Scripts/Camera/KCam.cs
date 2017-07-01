using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class KCam : KobotoMono {
    [HideInInspector]
    public Camera camera;

    protected bool isActive;

    public void Awake() {
        camera = GetComponent<Camera>();
        ListenToPointerEvents();
    }

    public virtual void SetActive(bool active) {
       
        enabled = active;
       // camera.enabled = active;    
        isActive = active;
    }

  
}
