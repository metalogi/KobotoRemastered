
class AutoTexture extends ScriptableObject
{
@MenuItem("Custom/AutoUV")
static function Auto()
{
	AutoUV(0.2,2);
}

static function AutoUV (scale : float, direction:int) {
	
var m : Mesh;
var filt : MeshFilter;
var uvs : Vector2[];
var verts : Vector3[];


	for (var t : Transform in Selection.transforms)
	{
		
	filt = t.GetComponent(MeshFilter);
	var oldMesh : Mesh =filt.sharedMesh;
		
	

    // add new mesh: 
    m = new Mesh(); 
    
    // set the mesh contents: 
    m.vertices = oldMesh.vertices;
     m.triangles = oldMesh.triangles;
     m.normals = oldMesh.normals;
     m.uv = oldMesh.uv;
     
     filt.sharedMesh = m;
     	 
     	 ;
    
		verts = m.vertices;
		
		uvs = new Vector2[verts.length];
		
		for (var i:int =0; i<verts.length;i++)
		{
			if(direction==0)
			{
			uvs[i].x =0.01*t.localScale.x *scale*verts[i].x;
			uvs[i].y =0.01*t.localScale.z*scale*verts[i].z;
			}
			if(direction==1)
			{
			uvs[i].x =0.01*t.localScale.z *scale*verts[i].z;
			uvs[i].y =0.01*t.localScale.y*scale*verts[i].y;
			}
			if(direction==2)
			{
			uvs[i].x =0.01*t.localScale.x *scale*verts[i].x;
			uvs[i].y =0.01*t.localScale.y*scale*verts[i].y;
			}
		}
		
		m.uv = uvs;
	}
	
}


}