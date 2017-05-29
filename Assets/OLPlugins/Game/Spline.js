var splinePoints:Transform[];
var pointsPerSection:int;
 var npoints:int;
var splineLUT:Vector3[];
var tangentScale:float=2;
private var line:LineRenderer;
var autoUpdate:boolean =false;

var rebuildCurve:boolean=true;
var rebuildPoints:int =32;

var simple : boolean =false;



function Awake()
{
	line= GetComponent(LineRenderer);

	WriteLUT();
	if (rebuildCurve) Rebuild(rebuildPoints);
	ShowCPs(false);
	DrawSpline();
}

function Update()
{
	if (autoUpdate)
	{
		WriteLUT();
		DrawSpline();
	}
}

function GetLength()
{
	var sLength:float =0;
	for (var i:int = 0; i<(npoints-1); i++)
	{
		sLength+= (splineLUT[i+1]-splineLUT[i]).magnitude;
	}	
	return sLength;
}

function WriteLUT () 
{
	npoints=((splinePoints.length-1) * pointsPerSection) +1;
	splineLUT = new Vector3[npoints];
	for (var seg:int =0;seg<(splinePoints.length-1);seg++)
	{
		var p0:Vector3 = splinePoints[seg].position;
		var p1:Vector3 = splinePoints[seg+1].position;
		var m0:Vector3 =  splinePoints[seg].forward * splinePoints[seg].localScale.z*tangentScale;
		var m1:Vector3 =  splinePoints[seg+1].forward * splinePoints[seg+1].localScale.z*tangentScale;
		
		for (var i:float =0;i<pointsPerSection;i+=1)
		{
			splineLUT[seg*pointsPerSection + i] = Hermite( (i/pointsPerSection), p0, p1, m0,m1);
		}
		
	}
	splineLUT[npoints-1] = Hermite( 1, p0, p1, m0,m1);
	
}

function ShowCPs(v:boolean)
{
	for (var splinePoint:Transform in splinePoints)
	{
		var rend:MeshRenderer = splinePoint.GetComponent(MeshRenderer);
		if (rend) rend.enabled=v;
	}
}

function Rebuild(n:int)
{
	var lengthAlongCurve:float;
	var newSplinePoints:Vector3[]= new Vector3[n];
	var iter:float=0;
	for (var i:int =0; i<n; i++)
	{
		iter+=1;
		lengthAlongCurve= iter*GetLength()/n;
		var testLength:float=0;
		var testLength0:float=0;
		
		var p0:int;
		var p1:int;
		for(var j:int=0; j<(npoints-1); j++)
		{
			p0=j;
			testLength0=testLength;
			testLength += (splineLUT[j+1]-splineLUT[j]).magnitude;
			if (testLength>lengthAlongCurve) {p1=j+1; j=npoints;}
		}
		
		newSplinePoints[i] = Vector3.Lerp(splineLUT[p0], splineLUT[p1], (lengthAlongCurve-testLength0)/(testLength-testLength0));
		
	}
	newSplinePoints[0] = splineLUT[0];
	newSplinePoints[n-1] = splineLUT[npoints-1];
	splineLUT=new Vector3[n];
	for(var k:int=0; k<n;k++) splineLUT[k] = newSplinePoints[k];

	npoints=n;
	
}

function DrawSpline()
{
	line.SetVertexCount (npoints);
	for (var i:int =0 ; i<npoints; i++) line.SetPosition (i, splineLUT[i]);
}

function ReadSpline(t:float)
{
	t=Mathf.Clamp(t,0,1);
	var p:Vector3;
	if (simple) p=Vector3.Lerp(splineLUT[0],splineLUT[1], t);
	else
	{	
	
	var tfloor:int =Mathf.Floor(t*(npoints-1));
	 if (tfloor < (npoints-1)) p=Vector3.Lerp(splineLUT[tfloor],splineLUT[tfloor+1], t*(npoints-1)-tfloor);
	 else p=splineLUT[npoints-1];
	}
	return p;
}


function SmoothT(t:float,start:float,end:float)
{
	
	var t0Vec:Vector3 = Vector3.zero;
	var t1Vec:Vector3 = Vector3.zero;
	var smVec:Vector3;
	
	if (start>0) t0Vec=Vector3(start,0,0);
	if (start<0) t0Vec=Vector3(0,-start,0);
	if (end>0) t1Vec=Vector3(end,0,0);
	if (end<0) t1Vec=Vector3(0,-end,0);
	
	smVec=Hermite(t,Vector3.zero, Vector3(1,1,0), t0Vec, t1Vec);
	return smVec.y;
}

function Hermite(t:float, p0:Vector3, p1:Vector3, m0:Vector3, m1:Vector3)
{
	
	var p:Vector3;
	
	var t2:float=Mathf.Pow(t,2);
	var t3:float=Mathf.Pow(t,3);
	
	p= (2*t3 - 3*t2 + 1)*p0 + (t3 - 2*t2 + t)*m0 + (-2*t3 + 3*t2)*p1 + (t3-t2)*m1;
	
	return p;
	
}



function OnEditorGUI()
{
	WriteLUT();
	DrawSpline();
}
