using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;


public class UpgradeLevel : MonoBehaviour {

    [MenuItem ("Remastered/UpdateLevel")]
    public static void UpgradeSelected() {
        foreach (Transform t in Selection.GetTransforms(SelectionMode.Deep)) {
            t.gameObject.layer = LayerMask.NameToLayer("Default");
            Connector c = t.GetComponent<Connector> ();
            if (c != null) {
                if (c.splinePrefs.numPoints < 18) {
                    c.splinePrefs.numPoints = 18;
                    c.UpdateMesh (18);
                }
            }
        }
        GameObject root = new GameObject ("Root");
        foreach (Transform t in Selection.GetTransforms(SelectionMode.TopLevel)) {
            t.SetParent (root.transform);
        }
        root.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
        Level level = root.AddComponent<Level> ();

        //GameObject bounds = GameObject.CreatePrimitive (PrimitiveType.Cube);
        //bounds.name = "LevelBounds";
        //bounds.transform.parent = root.transform;
        //DestroyImmediate(bounds.GetComponent<Collider> ());

      //  GameObject levelBounds = new GameObject("WorldBounds");
      //  levelBounds.AddComponent<LevelZoneWorld>();

        //level.levelBoundsObject = bounds.GetComponent<MeshRenderer> ();

        var oldSpawnPoints = root.GetComponentsInChildren<SpawnPoint> ();
        level.kobotoSpawnInfo = new KobotoSpawnInfo[oldSpawnPoints.Length];

        for (int i = 0; i < oldSpawnPoints.Length; i++) {
            level.kobotoSpawnInfo [i] = new KobotoSpawnInfo ();
            level.kobotoSpawnInfo [i].kobotoType = EKobotoType.TreeGuy;
            level.kobotoSpawnInfo [i].spawnPoint = oldSpawnPoints [i].transform;
        }
    

    }
}
