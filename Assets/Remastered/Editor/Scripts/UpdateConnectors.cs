using UnityEngine;
using UnityEditor;

public class UpdateConnectors : ScriptableObject
{
    static string W1BottomMat = "Local Assets/Models/World/Materials/W1Dark.mat";

    [MenuItem("Connectors/UpdateSelectedConnectors")]
    static void UpdateSelected()
    {
        Transform[] Sel = Selection.transforms;
        foreach (Transform sel in Sel)
        {
            Connector con = sel.GetComponent<Connector>();
            if (con.parentLeft == null) con.FindParent(Connector.Direction.Left);
            if (con.parentRight == null) con.FindParent(Connector.Direction.Left);
            if (con.parentLeft != null && con.parentRight != null)
            {
                NewConnecter(con.parentLeft, con.parentRight, con.numPoints);

                DestroyImmediate(sel.gameObject);
            }

        }
    }

    [MenuItem("Connectors/UpdateAllConnectors")]
    static void UpdateAll()
    {

        Connector[] connectors = FindObjectsOfType<Connector>();
        foreach (Connector con in connectors)
        {
            //con.Init();
            if (!con.parentLeft) { Debug.Log("can't find Left object for connector" + con.gameObject.name); con.FindParent(Connector.Direction.Left); }
            if (!con.parentRight) { Debug.Log("can't find Right object for connector" + con.gameObject.name); con.FindParent(Connector.Direction.Right); }
            if (con.parentLeft && con.parentRight)
            {
                NewConnecter(con.parentLeft, con.parentRight, con.numPoints);

                DestroyImmediate(con.gameObject);
            }
        }
    }


    [MenuItem("Connectors/AddConnector")]
    static void AddConnector()
    {
        Transform[] Sel = Selection.transforms;

        if (Sel.Length < 2)
        {
            Debug.LogError("Need 2 transforms selected");
            return;
        }
        //sort left/right
        Transform lefty;
        Transform righty;
        if (Sel[0].position.z > Sel[1].position.z)
        {
            lefty = Sel[1];
            righty = Sel[0];
        }
        else
        {
            lefty = Sel[0];
            righty = Sel[1];
        }
        NewConnecter(lefty, righty, 6);
    }

    static void NewConnecter(Transform lt, Transform rt, int n)
    {
       // WorldObjectDefs objectNames = new WorldObjectDefs();
        //var cam:CameraManager = Camera.main.GetComponent(CameraManager);
        string matPath = W1BottomMat;

        Material botMat = AssetDatabase.LoadAssetAtPath<Material>(matPath);

        GameObject connector = new GameObject("Connector");
        //connector.transform.eulerAngles.y=90;
        //connector.transform.position = 0.5*(lefty.position + righty.position);
        Connector conScript = connector.AddComponent<Connector>();
        conScript.SetParentObjs(lt, rt);
        conScript.Init(botMat);
        conScript.UpdateMesh(n);

    }

}