using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class KCam : KobotoMono {
    private Camera _camera;
    new public Camera camera {
        get {
            if (_camera == null) {
                _camera = GetComponent<Camera>();
            }
            return _camera;
        }
    }

    protected bool isActive;

    public override void OnEnable()
    {
        base.OnEnable();
        ListenToPointerEvents();
    }

    public virtual void SetActive(bool active) {
       
        enabled = active; 
        isActive = active;
    }

  
}
