using UnityEngine;
using System.Collections;
using UnityEditor;

public class MakeTerrainLayer  {
	
	[MenuItem ("Custom/MakeTerrain")]
	public static void MakeTerrainUnderSelected()
	{
		GameObject topNode = Selection.activeGameObject;
		GameObject terrainRoot = new GameObject("Terrain");
		
		
		Transform[] childTransforms = topNode.GetComponentsInChildren<Transform>();
		
		for(int i = 0; i<childTransforms.Length; i++)
		{
			Transform trans =childTransforms[i];
			GameObject go = trans.gameObject;
			
			if (go.GetComponent<Collider>() != null)
			{
				GameObject colGO = Object.Instantiate(go) as GameObject;
				
				if (colGO.GetComponent<Renderer>() != null)
				{
					
					Object.DestroyImmediate(colGO.GetComponent<Renderer>());
				}
				Object.DestroyImmediate(go.GetComponent<Collider>());
				
				colGO.transform.parent = terrainRoot.transform;
			}
					
			
			
		}
	}
}
