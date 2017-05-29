
using UnityEditor;
using UnityEngine;
using System.Collections;
using System.IO;
using System.Text;

public class ObjExporter : ScriptableObject
{


    
        public static string MeshToStringWS(MeshFilter mf, Transform trans) {
        Mesh m = mf.mesh;
        Material[] mats = mf.GetComponent<Renderer>().sharedMaterials;
        
        StringBuilder sb = new StringBuilder();
        
        sb.Append("g ").Append(mf.name).Append("\n");
        
        foreach(Vector3 v in m.vertices) {
           //sb.Append(string.Format("v {0} {1} {2}\n",v.x*scale.x +offset.x,v.y*scale.y +offset.y,v.z*scale.z +offset.z));
             Vector3 v_ws = trans.TransformPoint(v);
           sb.Append(string.Format("v {0} {1} {2}\n",v_ws.x,v_ws.y,v_ws.z));
        }
        sb.Append("\n");
        foreach(Vector3 v in m.normals) {
            sb.Append(string.Format("vn {0} {1} {2}\n",v.x,v.y,v.z));
        }
        sb.Append("\n");
        foreach(Vector3 v in m.uv) {
            sb.Append(string.Format("vt {0} {1}\n",v.x,v.y));
        }
        for (int material=0; material < m.subMeshCount; material ++) {
            sb.Append("\n");
            sb.Append("usemtl ").Append(mats[material].name).Append("\n");
            sb.Append("usemap ").Append(mats[material].name).Append("\n");
                
            int[] triangles = m.GetTriangles(material);
            for (int i=0;i<triangles.Length;i+=3) {
                sb.Append(string.Format("f {0}/{0}/{0} {1}/{1}/{1} {2}/{2}/{2}\n", 
                    triangles[i]+1, triangles[i+1]+1, triangles[i+2]+1));
            }
        }
        return sb.ToString();
    }
	
	public static string MeshesToStringWS(MeshFilter[] mfs, Transform[] transforms) {
        
       
        
        StringBuilder sb = new StringBuilder();
        
        sb.Append("g ").Append("hhh").Append("\n");
        
		int im = 0;
		MeshFilter mf ;
		Transform trans ;
		Mesh m;
		for (; im<mfs.Length; im++)
		{
			mf = mfs[im];
			trans = transforms[im];
			m = mf.sharedMesh;
			
			
	        foreach(Vector3 v in m.vertices) {
	           //sb.Append(string.Format("v {0} {1} {2}\n",v.x*scale.x +offset.x,v.y*scale.y +offset.y,v.z*scale.z +offset.z));
	             Vector3 v_ws = trans.TransformPoint(v);
	           sb.Append(string.Format("v {0} {1} {2}\n",v_ws.x,v_ws.y,v_ws.z));
	        }
		}
		
		im = 0;
		for (; im<mfs.Length; im++)
		{
			mf = mfs[im];
			trans = transforms[im];
			m = mf.sharedMesh;
	        sb.Append("\n");
	        foreach(Vector3 v in m.normals) {
	            sb.Append(string.Format("vn {0} {1} {2}\n",v.x,v.y,v.z));
	        }
		}
		
		im = 0;
		for (; im<mfs.Length; im++)
		{
			mf = mfs[im];
			trans = transforms[im];
			m = mf.sharedMesh;
	        sb.Append("\n");
	        foreach(Vector3 v in m.uv) {
	            sb.Append(string.Format("vt {0} {1}\n",v.x,v.y));
	        }
		}
		
		im = 0;
		sb.Append("\n");
	    sb.Append("usemtl ").Append("mat").Append("\n");
	    sb.Append("usemap ").Append("mat").Append("\n");
		int t = 0;
		for (; im<mfs.Length; im++)
		{
			mf = mfs[im];
			trans = transforms[im];
			m = mf.sharedMesh;

			 int[] triangles = m.triangles;
			
			for (int i=0;i<triangles.Length;i+=3) {
					
	                sb.Append(string.Format("f {0}/{0}/{0} {1}/{1}/{1} {2}/{2}/{2}\n", 
	                    t+triangles[i]+1, t+triangles[i+1]+1, t+triangles[i+2]+1));
				
	            }
			t += m.vertices.Length;
		}
			
        return sb.ToString();
    }
    
    
    
    
    
     [MenuItem ("Custom/ExportOBJ")]
    public static void MeshToFile()
    { 
		GameObject root = Selection.activeGameObject;
	
		Debug.Log ("Selected Objject: " + root.name);
		MeshFilter[] filters = root.GetComponentsInChildren<MeshFilter>();
		Transform[] parents = new Transform[filters.Length];
		Transform[] transforms = new Transform[filters.Length];
        	
		if (filters == null)
		{
			Debug.LogError ("No Mesh Filters");
			return;
		}
		Debug.Log ("Found "+ filters.Length + " meshFilters" );
		
		for (int it=0 ; it<filters.Length; it++)
    	{
			transforms[it] = filters[it].transform;
			parents[it] = filters[it].transform.parent;
			 filters[it].transform.parent = null;
		}
		
		string[] scenePath = EditorApplication.currentScene.Split(char.Parse("/"));
		string sceneName = scenePath[scenePath.Length - 1];
		using (StreamWriter sw = new StreamWriter("OBJ/unityExport_"+ sceneName +".obj")) 
        	{
        		sw.Write(MeshesToStringWS(filters, transforms));
        	}
		
		for (int ip=0 ; ip<filters.Length; ip++)
    	{
			
			 filters[ip].transform.parent = parents[ip];
		}
		
		/*
    	//Transform[] selection = Selection.transforms;
    	for (int it=0 ; it<filters.Length; it++)
    	{
			MeshFilter mf  = filters[it];
			Transform trans = mf.transform;
			
		 	if (mf == null) continue;
    		
    		Transform parentTrans =trans.parent;
    		if (parentTrans) trans.parent = null;
    		
        	using (StreamWriter sw = new StreamWriter("OBJ/unityExport_"+Application.loadedLevelName+"_"+it+"_"+trans.gameObject.name +".obj")) 
        	{
        		sw.Write(MeshToStringWS(mf, trans));
        	}
        	if (parentTrans) trans.parent= parentTrans;

    	}
    	*/
       
    }
    
    
    
    
    [MenuItem ("Custom/ExportChildrenToOBJ")]
    public static void MeshesToFile()
    {
		GameObject root = Selection.activeGameObject;
		Debug.Log ("Selected Objject: " + root.name);
		MeshFilter[] filters = root.GetComponentsInChildren<MeshFilter>();
		
		Transform[] selection = new Transform[filters.Length];
		
		for (int i = 0; i< selection.Length; i++)
		{
			selection[i] = filters[i].transform;
		}
		
    	 StringBuilder sb = new StringBuilder();
    	  sb.Append("g ").Append("unityExport").Append("\n");
    	  
    	  //Transform[] selection = Selection.transforms;
        for (int i_verts=0 ; i_verts<selection.Length; i_verts++)
        	{
        		Transform trans = selection[i_verts];
        		MeshFilter mf = filters[i_verts];
        		Mesh m = mf.mesh;
        		 foreach(Vector3 v in m.vertices) { sb.Append(string.Format("v {0} {1} {2}\n",v.x,v.y,v.z)); }
      			  sb.Append("\n");
        	}
        	
       for (int i_norms=0 ; i_norms<selection.Length; i_norms++)
        	{
        		Transform trans = selection[i_norms];
        		MeshFilter  mf = filters[i_norms];
        		Mesh m = mf.mesh;
        		    foreach(Vector3 v in m.normals) { sb.Append(string.Format("vn {0} {1} {2}\n",v.x,v.y,v.z)); }
      				  sb.Append("\n");
        	}
        	
       for (int i_uv=0 ; i_uv <selection.Length; i_uv++)
        	{
        		Transform trans = selection[i_uv];
        		MeshFilter mf = filters[i_uv];
        		 Mesh m = mf.mesh;
        		     foreach(Vector3 v in m.uv) {
            sb.Append(string.Format("vt {0} {1}\n",v.x,v.y));
        	}
        	}
        	
        for (int i_mats=0 ; i_mats<selection.Length; i_mats++)
        	{
        		Transform trans = selection[i_mats];
        		 MeshFilter mf = filters[i_mats];
        		Mesh m = mf.mesh;
        		 Material[] mats = mf.GetComponent<Renderer>().sharedMaterials;
         for (int material=0; material < m.subMeshCount; material ++) {
            sb.Append("\n");
            sb.Append("usemtl ").Append(mats[material].name).Append("\n");
            sb.Append("usemap ").Append(mats[material].name).Append("\n");
             int[] triangles = m.GetTriangles(material);
            for (int i=0;i<triangles.Length;i+=3) {
                sb.Append(string.Format("f {0}/{0}/{0} {1}/{1}/{1} {2}/{2}/{2}\n", 
                    triangles[i]+1, triangles[i+1]+1, triangles[i+2]+1));
            
        	}
        	}
        	}
        	
   
        	
        	using (StreamWriter sw = new StreamWriter("unityExport_Combined.obj")) 
        	{
        		sw.Write(sb.ToString());
        	}
       
    }
    
    
}

