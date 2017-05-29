private var lightDir:Vector3;
private var restPos:Vector3;

private var parentTrans:Transform;

private var RayStart:Vector3;

var shadowOffset:float =0.5;
var shadowScale:float=5;
private var meshR:MeshRenderer;

private var shadowMesh:Mesh;
private var shadowMeshFilter:MeshFilter;
var meshVerts:Vector3[];
var meshUVs:Vector2[];
var meshTris:int[];
var meshCols:Color[];
var meshNorms:Vector3[];


function Awake()
{
	var lite:Light =FindObjectOfType(Light);
	var liteTrans:Transform =lite.transform;

	lightDir=liteTrans.TransformDirection(Vector3.forward);

	restPos = transform.localPosition;
	parentTrans = transform.parent;
	meshR=GetComponent(MeshRenderer);
	
	//create Shadow mesh
	shadowMesh=new Mesh();
	shadowMeshFilter =GetComponent(MeshFilter);
	shadowMeshFilter.mesh =shadowMesh;
	
	meshVerts=new Vector3[4];
	meshUVs=new Vector2[4];
	meshTris=new int[6];
	meshCols=new Color[4];
	meshNorms=new Vector3[4];
	
	meshVerts[0]= shadowScale*Vector3(-1,0,1);
	meshVerts[1]= shadowScale*Vector3(1,0,1);
	meshVerts[2]= shadowScale*Vector3(-1,0,-1);
	meshVerts[3]= shadowScale*Vector3(1,0,-1);
	
	meshUVs[0]= Vector2(0,1);
	meshUVs[1]= Vector2(1,1);
	meshUVs[2]= Vector2(0,0);
	meshUVs[3]= Vector2(1,0);	
	
	meshTris[0]=0;
	meshTris[1]=1;
	meshTris[2]=3;
	meshTris[3]=0;
	meshTris[4]=3;
	meshTris[5]=2;
	
	for(var i:int=0;i<4;i++) 
	{
		meshCols[i] =Color(1,0,0,1);
		meshNorms[i] =Vector3.up;
	}
	
	
	meshCols[3] =Color(1,0,0,0);
	
	shadowMesh.vertices =meshVerts;
	shadowMesh.uv=meshUVs;
	shadowMesh.triangles=meshTris;
	shadowMesh.colors=meshCols;
	shadowMesh.normals=meshNorms;
	
	
}

function Update () 
{
	var hit:RaycastHit;

	RayStart= parentTrans.TransformPoint(restPos) -Vector3(0,1,0);
	//RayStart=parentTrans.position +restPos -Vector3(0,1,0);
	//print (RayStart.y);
	
	if (Physics.Raycast(RayStart, lightDir, hit))
	{
		transform.position =hit.point+Vector3(0,shadowOffset,0);
		transform.eulerAngles=Vector3.zero;
		//if (hit.normal.normalized.y >0.9) meshR.enabled=true;
		//else meshR.enabled=false;
  
	}
	//else meshR.enabled=false;
	var cornerRay:Vector3;
	for(var i:int;i<4;i++)
	{
		cornerRay= RayStart+shadowScale*parentTrans.TransformDirection(meshVerts[i]);
		if (Physics.Raycast(cornerRay, lightDir,hit))
		{
			meshCols[i].a=1;
		}
		else meshCols[i].a=0;
		
		
	}
	
	shadowMesh.colors=meshCols;
	
}

function OnDrawGizmos()
{
	Gizmos.color = Color.yellow;
	Gizmos.DrawLine(RayStart, RayStart+lightDir*15);
}