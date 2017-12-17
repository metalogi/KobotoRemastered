var nPoints : int;
var worldMaterial : Material;
var parentLeft:Transform;
var parentRight:Transform;

var LeftBBCenter:Vector3;
var RightBBCenter:Vector3;
var LeftBBExtents:Vector3;
var RightBBExtents:Vector3;

var debugObj:GameObject;
var useSpline:boolean = true;

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

var leftMat:Material;

var splines:Spline[];

class splinePreferencesR
{
	var numPoints:int=6;
	var continuity:float =1;
	
}
var splinePrefs=new splinePreferencesR();

function Awake()
{
	Init(worldMaterial);
	UpdateMesh(nPoints);
}



function Init(botMat:Material)
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
	
	var parRend:MeshRenderer=parentLeft.GetComponent(MeshRenderer);
	var parPhys:Collider=parentLeft.GetComponent(Collider);
	if (parRend)
	{
	if ( parRend.sharedMaterials.length>1) leftMat= parRend.sharedMaterials[1];
	else leftMat= parRend.sharedMaterials[0];
	}
	
	var tmpMatArray : Material[] = new Material[2];
	tmpMatArray[0] = leftMat;
	tmpMatArray[1] =  botMat;
	
	CMeshRenderer.sharedMaterials =tmpMatArray;
	
	//CMeshRenderer.material = leftMat;
	
	CMeshCollider.sharedMesh=CMesh;
	CMeshCollider.material= parPhys.sharedMaterial;
	CMeshCollider.smoothSphereCollisions=true;
	
	side = new GameObject("side");
	side.isStatic=true;
	sideMesh=new Mesh();
	sideMeshFilter=side.AddComponent.<MeshFilter>();
	sideRenderer= side.AddComponent.<MeshRenderer>();
	sideMeshFilter.mesh =sideMesh;
	if (parRend) sideRenderer.material=parRend.sharedMaterials[0];
	side.transform.parent =transform;

	
	gameObject.layer = 8;
	

	
}
function UpdateMesh(n:int)
{
	//transform.eulerAngles.y=0;
	//side.transform.position = transform.position;
	//side.transform.eulerAngles.y = 0;
	//side.transform.parent =transform;
	
	//if (!parentLeft) FindParent("left");
	//if (!parentRight) FindParent("right");
	
var leftMeshFilter:MeshFilter=parentLeft.GetComponent(MeshFilter);
var rightMeshFilter:MeshFilter=parentRight.GetComponent(MeshFilter);
	if ( leftMeshFilter && rightMeshFilter)
	{
		//leftMeshFilter.sharedMesh.RecalculateBounds();
	//rightMeshFilter.sharedMesh.RecalculateBounds();
	// var leftBB:Bounds = leftMeshFilter.sharedMesh.bounds;
	
	//var rightBB:Bounds = rightMeshFilter.sharedMesh.bounds;
	
	

	
	
	//print ("leftparent position " + parentLeft.position);
	//print ("leftparent scale " + parentLeft.localScale);
	//print ("boundingBoxCenter: "+leftBB.center);
	//print ("boundingBoxExtents: "+leftBB.extents);
	//var LeftBBCenter:Vector3 = leftBB.center;
	//if (generateOnLoad ) LeftBBCenter=Vector3.zero;
	
	//var RightBBCenter:Vector3 = rightBB.center;
	//if (generateOnLoad ) RightBBCenter=Vector3.zero;
	
	
	//find parent edges
	for(var i:int=0; i<4;i++) 
	{
		
		//print ("leftedgeOffset " +i +": "+parentLeft.TransformDirection(Vector3.Scale(parentLeft.localScale,leftBB.center)));
		//leftEdge[i] =parentLeft.position + parentLeft.TransformDirection(Vector3.Scale(parentLeft.localScale,leftBB.center));
		//leftEdge[i] =parentLeft.position + parentLeft.TransformDirection(Vector3.Scale(parentLeft.localScale,LeftBBCenter));
		leftEdge[i] =parentLeft.position ;
		var iOff:Vector3;
		iOff.z =LeftBBExtents.x*parentLeft.localScale.x;
		if (i<2) iOff.x =LeftBBExtents.z*parentLeft.localScale.z;
		else iOff.x = -LeftBBExtents.z*parentLeft.localScale.z;
		if ((i==0) || (i==2)) iOff.y=LeftBBExtents.y*parentLeft.localScale.y;
		else iOff.y= -LeftBBExtents.y*parentLeft.localScale.y;
		
		leftEdge[i] += parentLeft.TransformDirection(Vector3(-iOff.z,iOff.y,iOff.x));
	
		
		//rightEdge[i] =parentRight.position + parentRight.TransformDirection(Vector3.Scale(parentRight.localScale,RightBBCenter));
		rightEdge[i] =parentRight.position;
		iOff.z =RightBBExtents.x*parentRight.localScale.x;
		if (i<2) iOff.x =RightBBExtents.z*parentRight.localScale.z;
		else iOff.x = -RightBBExtents.z*parentRight.localScale.z;
		if ((i==0) || (i==2)) iOff.y=RightBBExtents.y*parentRight.localScale.y;
		else iOff.y= -RightBBExtents.y*parentRight.localScale.y;
		
		rightEdge[i] +=parentRight.TransformDirection(Vector3(iOff.z,iOff.y,iOff.x));
		
	}
	//leftUVs[0]=Vector2(-uvScale.x, -uvScale.y);
	//leftUVs[1]=Vector2(-uvScale.x, -uvScale.y);
	leftUVs[0]=Vector2(-uvScale.x, 0);
	leftUVs[1]=Vector2(-uvScale.x, 0);
	leftUVs[2]=Vector2(-uvScale.x, uvScale.y);
	leftUVs[3]=Vector2(-uvScale.x, uvScale.y);
	
	//rightUVs[0]=Vector2(uvScale.x, -uvScale.y);
	//rightUVs[1]=Vector2(uvScale.x, -uvScale.y);
	rightUVs[0]=Vector2(uvScale.x, 0);
	rightUVs[1]=Vector2(uvScale.x, 0);
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
		//var n:int = splinePrefs.numPoints;
		var vi:int=0;
		verts=new Vector3[4*n];
		norms=new Vector3[4*n];
		tris=new int[12*(n-1)];
		uvs=new Vector2[4*n];
		
		sNorms=new Vector3[4*n];
		sTris=new int[12*(n-1)];
		sUvs=new Vector2[4*n];
		
		var m0:Vector3 =(leftEdge[0] - rightEdge[0]).magnitude* splinePrefs.continuity*parentLeft.TransformDirection(Vector3(-1,0,0));
		var m1:Vector3 =(leftEdge[0] - rightEdge[0]).magnitude* splinePrefs.continuity*parentRight.TransformDirection(Vector3(-1,0,0));
		
		for (var spline:int=0; spline<4;spline++)
		{
			for (var t:float=0; t<=1; t+=1.0/(n-1))
				{
					//print (vi+" " +t);
					verts[vi] = Hermite(t, leftEdge[spline], rightEdge[spline], m0,m1);
					//verts[vi] = transform.InverseTransformPoint(verts[vi]);
					if (spline<2) sNorms[vi] =Vector3(1,0,0);
					else sNorms[vi] =Vector3(-1,0,0);
					uvs[vi]=Vector3.Lerp(leftUVs[spline], rightUVs[spline],t);
					sUvs[vi]=Vector3.Lerp(leftUVsSide[spline], rightUVsSide[spline],t);
					vi++;
				}
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
			norms[ts] = -Vector3.Cross((verts[ts+1]-verts[ts]), (verts[2*n+ts] -verts[ts])).normalized;
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
		

		
		
		//end normals use parent objects
		norms[0]= parentLeft.up;
		norms[2*n]= norms[0];
		norms[n]=-norms[0];
		norms[3*n]= -norms[0];
		
		norms[n-1]=parentRight.up;
		norms[3*n-1] =norms[n-1];
		norms[2*n-1] =-norms[n-1];
		norms[4*n-1] =-norms[n-1];
		
	
	
//transform normals to localSpcae
//for (var ni : int = 0; ni<norms.length; ni++)
//norms[ni] = transform.InverseTransformDirection(norms[ni]);
//for (var vv :int =0;vv<verts.length;vv++)
//verts[vv] = transform.InverseTransformPoint(verts[vv]);
	
	//copy values to Mesh
	CMesh.vertices = verts;
	CMesh.triangles=tris;
	CMesh.normals=norms;
	CMesh.uv=uvs;
	
				//set SubMeshes
		CMesh.subMeshCount=2;
		var subMesh0 : int[] = new int[6*(n-1)];
		var subMesh1 : int[] = new int[6*(n-1)];
		var ind : int=0;
		var ind0 : int=0;
		var ind1 : int=0;
		for (var mi:int =0; mi<(n-1); mi++)
		{
			for (var sub0:int =0; sub0<6; sub0++)
			{
				subMesh0[ind0] = tris[ind];
				ind++;
				ind0++;
			}
			for (var sub1:int =0; sub1<6; sub1++)
			{
				subMesh1[ind1] = tris[ind];
				ind++;
				ind1++;
			}
		}
		CMesh.SetTriangles(subMesh0,0);
		CMesh.SetTriangles(subMesh1,1);
		
		sideMesh.vertices= verts;
	sideMesh.triangles=sTris;
	sideMesh.normals=sNorms;
	sideMesh.uv=sUvs;
	

	
	CMesh.RecalculateBounds();
	sideMesh.RecalculateBounds();
	
	CMeshCollider.sharedMesh=CMesh;
	
	OptimizeMesh();
	}
	
}

function Hermite(t:float, p0:Vector3, p1:Vector3, m0:Vector3, m1:Vector3)
{
	
	var p:Vector3;
	
	var t2:float=Mathf.Pow(t,2);
	var t3:float=Mathf.Pow(t,3);
	
	p= (2*t3 - 3*t2 + 1)*p0 + (t3 - 2*t2 + t)*m0 + (-2*t3 + 3*t2)*p1 + (t3-t2)*m1;
	
	return p;
	
}

function OptimizeMesh()
{
	var o_380_15_636265844777384911 = CMesh;
	var o_381_18_636265844777384911 = sideMesh;
	
}

