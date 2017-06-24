
var autoUpdate:boolean=false;

var CMesh:Mesh;
var CMeshFilter:MeshFilter;
var CMeshRenderer:MeshRenderer;
var CMeshCollider:MeshCollider;

var side:GameObject;
var sideMesh:Mesh;
var sideMeshFilter:MeshFilter;
var sideRenderer:MeshRenderer;

var verts:Vector3[];
var tris:int[];
var norms:Vector3[];
var uvs:Vector2[];

var sUvs:Vector2[];
var sNorms:Vector3[];
var sTris:int[];

var rightEdge:Vector3[];
var leftEdge:Vector3[];

var uvScale:Vector2 = Vector2(3,1);
var rightUVs:Vector2[];
var leftUVs:Vector2[];

var uvScaleSide:Vector2 = Vector2(3,1);
var rightUVsSide:Vector2[];
var leftUVsSide:Vector2[];



var Splines:Spline[];

class splinePref
{
	var numPoints:int=6;
	var continuity:float =1;
	
}
var splinePrefs=new splinePref();


var floorMat : Material;
var sideMat : Material;

var thickness:float =10;
var widtf:float =50;

function SetSpline(sp:Spline, n:int)
{
	Splines= new Spline[4];
	Splines[n] = sp;
}
function SetMats(floor: Material, side: Material)
{
	floorMat = floor;
	sideMat=side;
}
function Init()
{
	
	CMesh=new Mesh();
	CMeshFilter= gameObject.AddComponent.<MeshFilter>();
	CMeshRenderer= gameObject.AddComponent.<MeshRenderer>();
	
	CMeshFilter.mesh =CMesh;
	CMeshCollider=gameObject.AddComponent.<MeshCollider>();
	
	leftEdge=new Vector3[4];
	rightEdge= new Vector3[4];
	
	leftUVs=new Vector2[4];
	rightUVs=new Vector2[4];
	
	leftUVsSide=new Vector2[4];
	rightUVsSide=new Vector2[4];
	
	
	CMeshRenderer.material = floorMat;
	//splines=new Spline[4];
	CMeshCollider.sharedMesh=CMesh;
	//CMeshCollider.material= parPhys.sharedMaterial;
	CMeshCollider.smoothSphereCollisions=true;
	
	side = new GameObject("side");
	sideMesh=new Mesh();
	sideMeshFilter=side.AddComponent.<MeshFilter>();
	sideRenderer= side.AddComponent.<MeshRenderer>();
	sideMeshFilter.mesh =sideMesh;
	sideRenderer.material=sideMat;
	
	gameObject.layer = 8;
	
	var sp0 : Transform= Splines[0].GetComponent(Transform);
	
	if (!Splines[1])
	{ var sp1 : Transform = Instantiate(sp0, sp0.position- thickness*Vector3.up, sp0.rotation);
	Splines[1] = sp1.GetComponent(Spline);
	}
	
	
	 var sp2 : Transform = Instantiate(sp0, sp0.position- Vector3(widtf,0,0), sp0.rotation);
	Splines[2] = sp2.GetComponent(Spline);
	
	
	
	var sp3 : Transform = Instantiate(sp1, sp1.position  -Vector3(widtf,0,0), sp1.rotation);
	Splines[3] = sp3.GetComponent(Spline);
	
	

	
	
		
}

function Awake()
{
	//Splines=new Spline[4];
	//Init();
	Construct();
}


function Construct()
{
	print("Contructing mesh..");
	leftUVs[0]=Vector2(-uvScale.x, -uvScale.y);
	leftUVs[1]=Vector2(-uvScale.x, -uvScale.y);
	leftUVs[2]=Vector2(-uvScale.x, uvScale.y);
	leftUVs[3]=Vector2(-uvScale.x, uvScale.y);
	
	rightUVs[0]=Vector2(uvScale.x, -uvScale.y);
	rightUVs[1]=Vector2(uvScale.x, -uvScale.y);
	rightUVs[2]=Vector2(uvScale.x, uvScale.y);
	rightUVs[3]=Vector2(uvScale.x, uvScale.y);
	
	leftUVsSide[0]=Vector2(-uvScaleSide.x, uvScaleSide.y);
	leftUVsSide[1]=Vector2(-uvScaleSide.x, 0);
	leftUVsSide[2]=Vector2(-uvScaleSide.x, uvScaleSide.y);
	leftUVsSide[3]=Vector2(-uvScaleSide.x, 0);
	
	rightUVsSide[0]=Vector2(uvScaleSide.x, uvScaleSide.y);
	rightUVsSide[1]=Vector2(uvScaleSide.x, 0);
	rightUVsSide[2]=Vector2(uvScaleSide.x, uvScaleSide.y);
	rightUVsSide[3]=Vector2(uvScaleSide.x, 0);
	
		//Calculate vertex positions
		var n:int = splinePrefs.numPoints;
		var vi:int=0;
		verts=new Vector3[4*n];
		norms=new Vector3[4*n];
		tris=new int[12*(n-1)];
		uvs=new Vector2[4*n];
		
		sNorms=new Vector3[4*n];
		sTris=new int[12*(n-1)];
		sUvs=new Vector2[4*n];
		
		
		
		for(var i : int=0;i<4*n;i++)
		{ 
			var splineNum:int =Mathf.Floor(parseFloat(i)/n);
			var t: float = (parseFloat(i) - splineNum*n) / parseFloat(n);
			 verts[i] = Splines[splineNum].ReadSpline(t);
		}
		
				//construct triangles and normals
		for (var triangleStrip:int=0; triangleStrip<(n-1);triangleStrip++)
		{
			var ts:int=triangleStrip;
			var ti:int=triangleStrip*12;
			
			//print (ti);
			tris[ti] = ts;
			tris[ti+1] = 2*n +ts;
			tris[ti+2] = ts+1;
			
			tris[ti+3] = 2*n +ts;
			tris[ti+4] = 2*n +ts+1;
			tris[ti+5] = ts+1;
			
			tris[ti+6] = n+ts+1;
			tris[ti+7] = 3*n +ts;
			tris[ti+8] = n+ts;
			
			tris[ti+9] = n+ts+1;
			tris[ti+10] = 3*n +ts+1;
			tris[ti+11] = 3*n +ts;
			
			if (ts>0)
			{
			norms[ts] = -(Vector3.Cross((verts[ts+1]-verts[ts]), (verts[2*n+ts] -verts[ts]))).normalized;
			norms[ts+2*n] =norms[ts];
			norms[ts+n] =-norms[ts];
			norms[ts+3*n] =-norms[ts];
			}
			
			//sideMesh
			sTris[ti]   = ts;
			sTris[ti+1] = n+ts+1;
			sTris[ti+2] = n+ts;
			
			sTris[ti+3] = ts;
			sTris[ti+4] = ts+1;
			sTris[ti+5] = n+ts+1;
			
			sTris[ti+6] = 2*n+ts;
			sTris[ti+7] = 3*n+ts+1;
			sTris[ti+8] = 3*n+ts;
			
			sTris[ti+9] = 2*n+ts;
			sTris[ti+10] = 2*n+ts+1;
			sTris[ti+11] = 3*n+ts+1;
			
			
		}
		
			//copy values to Mesh
	CMesh.vertices = verts;
	CMesh.triangles=tris;
	CMesh.normals=norms;
	CMesh.uv=uvs;
	
	sideMesh.vertices= verts;
	sideMesh.triangles=sTris;
	sideMesh.normals=sNorms;
	sideMesh.uv=sUvs;
	
	CMesh.RecalculateBounds();
	sideMesh.RecalculateBounds();
		
}

function MeshFromSplines(p:Vector3[], m0, m1)  //builds a mesh from 4 parallel splines
{
}