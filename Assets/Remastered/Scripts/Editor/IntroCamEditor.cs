using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

[CustomEditor (typeof(IntroCam))]
public class IntroCamEditor : Editor {

    public override void OnInspectorGUI() {
        base.OnInspectorGUI();
        if (GUILayout.Button("Build Spline")) {
            var homes = FindObjectsOfType<LevelObjectHome>();
            var level = FindObjectOfType<Level>();

            Vector3 startPoint = Vector3.zero;
            foreach (var home in homes) {
                startPoint += home.transform.position / homes.Length;
            }
            Vector3 endPoint = Vector3.zero;
            foreach (var spawnInfo in level.kobotoSpawnInfo) {
                endPoint += spawnInfo.spawnPoint.position / level.kobotoSpawnInfo.Length;
            }

            var spline = (target as IntroCam).splineAttach;

            int c = spline.line.transform.childCount;
            for (int i=0; i<c ; i++) {
                spline.line.transform.GetChild(i).position = Vector3.Lerp(startPoint, endPoint, ((float)i) / ((float)(c -1)));
                spline.line.transform.GetChild(i).localScale = 10 * Vector3.one;
                spline.line.transform.GetChild(i).localEulerAngles = new Vector3(0, 180, 0);
            }


        }
    }
}
