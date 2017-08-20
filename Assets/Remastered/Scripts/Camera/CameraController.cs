﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour {

    public Camera mainCamera;
    Dictionary<string, KCam> cameras = new Dictionary<string, KCam>();
    List<KCam> camList = new List<KCam>();
    KCam activeCam;

    bool inTransition;


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
        if (inTransition) {
            return;
        }
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

    public void LerpToCamera(string tag, float time) {
        if (inTransition) {
            return;
        }
        if (activeCam == null) {
            SwitchToCamera (tag);
            return;
        }

        KCam toCam;
        if (!cameras.TryGetValue(tag, out toCam)) {
            return;
        }

        mainCamera.enabled = true;
        StartCoroutine(CameraLerp(activeCam, toCam, time));
    }

    IEnumerator CameraLerp(KCam fromCam, KCam toCam, float time) {

        inTransition = true;
        toCam.SetActive(true);

        float lerpTime = 0;
        while (lerpTime < time) {
            float t = lerpTime / time;
            mainCamera.transform.position = Vector3.Lerp(fromCam.transform.position, toCam.transform.position, t);
            mainCamera.transform.rotation = Quaternion.Lerp(fromCam.transform.rotation, toCam.transform.rotation, t);
            mainCamera.fieldOfView = Mathf.Lerp(fromCam.camera.fieldOfView, toCam.camera.fieldOfView, t);
            mainCamera.aspect = Mathf.Lerp(fromCam.camera.aspect, toCam.camera.aspect, t);
            lerpTime += Time.deltaTime;
            yield return null;
        }

        mainCamera.transform.SetParent(toCam.transform, false);
        mainCamera.CopyFrom(toCam.camera);
       
        activeCam = toCam;
        if (fromCam != toCam) {
            fromCam.SetActive(false);
        }
        inTransition = false;
    }
        


}
