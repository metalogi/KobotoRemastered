using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEditor;

public class ConvertMayaToFBX  {

    public static void ConvertAssetAtPath(string path)
    {
        GameObject g = AssetDatabase.LoadAssetAtPath<GameObject>(path);
        if (g == null)
        {
            Debug.Log("No asset at path " + path);
            return;
        }
        Debug.Log("Converting asset at path " + path);
        ConvertGameObject(g);
        
    }

    public static void ConvertGameObject(GameObject g)
    {
        foreach (Transform t in g.transform)
        {
            ConvertGameObject(t.gameObject);
        }
        MeshFilter mf = g.GetComponent<MeshFilter>();
        if (mf == null || mf.sharedMesh == null)
        {
            return;
        }
        Mesh mesh = mf.sharedMesh;
        string meshAssetPath = AssetDatabase.GetAssetPath(mesh);
        Debug.Log("mesh asset path " + meshAssetPath);

        if (meshAssetPath.EndsWith(".mb") || meshAssetPath.EndsWith(".ma"))
        {
            
            string fbxAssetPath = meshAssetPath.Remove(meshAssetPath.Length - 3, 3) + "_fbx.fbx";
            Debug.Log("FBX asset path " + fbxAssetPath);

            Mesh fbxMesh = AssetDatabase.LoadAssetAtPath<Mesh>(fbxAssetPath);
            // Debug.Log("Asset type " + fbxObj.GetType());

            mf.sharedMesh = fbxMesh;

        }
    }

    [MenuItem ("FBX/ConvertSelected")]
    public static void ConvertSelected()
    {
        string path = AssetDatabase.GetAssetPath(Selection.activeGameObject);
        Debug.Log("path " + path);
        ConvertAssetAtPath(AssetDatabase.GetAssetPath(Selection.activeGameObject));
    }

    [MenuItem ("FBX/ConvertAllPrefabs")]
    public static void ConvertAllPrefabs()
    {
        string assetRoot = Application.dataPath;

        string prefabRoot = assetRoot + "/Prefabs";

        Debug.Log("Root " + prefabRoot);
        ConvertDirectory(prefabRoot, true);
       
    }

    static void ConvertDirectory(string path, bool recursive)
    {
        string[] files = Directory.GetFiles(path);
        foreach (string filePath in files)
        {
            if (filePath.EndsWith(".prefab"))
            {
                string assetPath = "Assets" + filePath.Remove(0, Application.dataPath.Length);
                ConvertAssetAtPath(assetPath);
            }
        }
        if (!recursive)
        {
            return;
        }
        string[] subDirectories = Directory.GetDirectories(path);
        foreach (string subDir in subDirectories)
        {
            ConvertDirectory(subDir, true);
        }

    }

    [MenuItem ("FBX/ArchiveMayaFiles")]
    public static void ArchiveMayaFiles()
    {
        string assetRoot = Application.dataPath;

        string mayaRoot = assetRoot + "/Local Assets";

        string toRoot = "C:/Users/Ed Niblett/Documents/UnityProjects/KobotoU4/";

        Debug.Log("Root " + mayaRoot);
        MoveMayaFilesInDirectory(mayaRoot, mayaRoot, toRoot, true);
    }

    static void MoveMayaFilesInDirectory(string root, string dir, string toRoot, bool recursive)
    {
        string[] files = Directory.GetFiles(dir);
        foreach (string filePath in files)
        {
            if (filePath.EndsWith(".ma") || filePath.EndsWith(".mb"))
            {
                string rel = filePath.Remove(0, root.Length + 1);
                string to = Path.Combine(toRoot, rel);
                string toDir = Path.GetDirectoryName(to);
                if (!Directory.Exists(toDir))
                {
                    Directory.CreateDirectory(toDir);
                    
                }
                
                Debug.Log(filePath + " -> " + to);
                File.Delete(filePath);
               // File.Move(filePath, to);
            }
        }
        if (!recursive)
        {
            return;
        }
        string[] subDirectories = Directory.GetDirectories(dir);
        foreach (string subDir in subDirectories)
        {
            MoveMayaFilesInDirectory(root, subDir, toRoot, true);
        }
    }

    }
