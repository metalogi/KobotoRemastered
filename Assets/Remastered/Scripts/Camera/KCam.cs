using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class KCam : KobotoMono {
    [HideInInspector]
    public Camera camera;

    protected bool isActive;

    public virtual void Start() {
        camera = GetComponent<Camera>();
        ListenToPointerEvents();
    }

    public virtual void SetActive(bool active) {
        gameObject.SetActive(active);
        enabled = active;
        camera.enabled = active;    
        isActive = active;
    }

  
}
