using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class KCam : KobotoMono {
    private Camera _camera;
    public Camera camera {
        get {
            if (_camera == null) {
                _camera = GetComponent<Camera>();
            }
            return _camera;
        }
    }

    protected bool isActive;

    public void OnEnable() {
       
        ListenToPointerEvents();
    }

    public virtual void SetActive(bool active) {
       
        Debug.Log(gameObject.name + " set active: " + active);
        enabled = active;
       // camera.enabled = active;    
        isActive = active;
    }

  
}
