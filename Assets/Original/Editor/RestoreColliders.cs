using UnityEngine;
using System.Collections;
using UnityEditor;

public class RestoreColliders  {

	[MenuItem("Custom/RestoreColliders")]
	public static void AddColliders()
	{
		GameObject topNode = Selection.activeGameObject;
		
		Transform[] childTransforms = topNode.GetComponentsInChildren<Transform>();
		
		for(int i = 0; i<childTransforms.Length; i++)
		{
			GameObject go =childTransforms[i].gameObject;
			if (go.layer == 8 && go.GetComponent<Collider>() == null)
			{
				if (go.GetComponent<Connector>() != null || go.name.Contains("balloon"))
				{
					go.AddComponent<MeshCollider>();
				}
				else
				{
					go.AddComponent<BoxCollider>();
				}
				
			}
		}
				
	}
}
