using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour {

    public Camera mainCamera;
    Dictionary<string, KCam> cameras;
    List<KCam> camList;
    KCam activeCam;

    bool inTransition;



    Camera transitionCam;

    void Start() {
        GameObject transitionCamObj = new GameObject("TransitionCam");
        transitionCam = transitionCamObj.AddComponent<Camera>();

        transitionCam.enabled = false;
        cameras = new Dictionary<string, KCam>();
        camList = new List<KCam>();
    }

    public void RegisterCamera(string tag, KCam cam) {
      
        cameras.Add(tag, cam);
        camList.Add(cam);

        cam.camera.enabled = false;

        cam.SetActive(false);
    }

    public bool IsCamActive(string tag) {
        return activeCam == cameras[tag];
    }

    public void SwitchToCamera(string tag) {
        if (!cameras.TryGetValue(tag, out activeCam)) {
            return;
        }
        mainCamera.enabled = true;

        mainCamera.transform.SetParent(activeCam.transform, false);
        mainCamera.CopyFrom(activeCam.camera);
        foreach (KCam c in camList) {
            c.SetActive(c == activeCam);
          
        }
        
    }
        


}
