var norms : Vector3[];
var tris : int[];
var cmesh:Mesh;
var meshCol:MeshCollider;

function Start()
{
	yield WaitForSeconds(0.7);
	meshCol=GetComponent(MeshCollider);
	
	if (meshCol)
	{
		cmesh = meshCol.sharedMesh;
		
		norms = cmesh.normals;
		tris = cmesh.triangles;
	
	}
	else Destroy(this);
}

//this is used in Juncore when aligning critters to curved surfaces
function GetSmoothNormal(barry:Vector3, i:int) 
{
	
 // Extract local space normals of the triangle we hit 
var n0:Vector3 = norms[tris[i * 3 + 0]]; 
var n1:Vector3 = norms[tris[i * 3 + 1]];    
var n2:Vector3 = norms[tris[i * 3 + 2]]; 
 
// Use barycentric coordinate to interpolate normal 
 var interpolatedNormal:Vector3 = n0 * barry.x + n1 * barry.y + n2 * barry.z; 
 // normalize the interpolated normal 
 interpolatedNormal =  interpolatedNormal.normalized;
  // Transform local space normals to world space 

  interpolatedNormal = transform.TransformDirection(interpolatedNormal); 
 
 return interpolatedNormal;
   
}