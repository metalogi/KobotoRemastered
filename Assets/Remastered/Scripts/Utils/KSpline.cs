using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[ExecuteInEditMode]
public class KSpline : AbstractLine  {


    public int pointsPerSection = 2;
    public bool showLine = true;
    public bool autoUpdate = false;

    Transform[] splinePoints;
    int npoints;
    Vector3[] splineLUT;
    float tangentScale = 2;
   


    public bool rebuildCurve = true;
    public int rebuildPoints = 32;

    bool simple = false;

    LineRenderer line;

    void OnEnable() {
        int controlPointCount = transform.childCount;
        splinePoints = new Transform[controlPointCount];
        for (int i=0; i<controlPointCount; i++) {
            splinePoints[i] = transform.GetChild(i);
        }

        line = GetComponent<LineRenderer>();

        WriteLUT();
        if (rebuildCurve) {
            Rebuild(rebuildPoints);
        }
        ShowControlPoints(false);
        DrawSpline();
    }

    void Update()
    {
        if (autoUpdate)
        {
            int controlPointCount = transform.childCount;
            splinePoints = new Transform[controlPointCount];
            for (int i=0; i<controlPointCount; i++) {
                splinePoints[i] = transform.GetChild(i);
            }

            WriteLUT();
   
            Rebuild(rebuildPoints);

            DrawSpline();
        }
    }


    void WriteLUT() {
        npoints=((splinePoints.Length - 1) * pointsPerSection) + 1;
        splineLUT = new Vector3[npoints];

        Vector3 p0 = Vector3.zero;
        Vector3 p1 = Vector3.zero; 
        Vector3 m0 = Vector3.zero; 
        Vector3 m1 = Vector3.zero; 

        for (int seg = 0; seg<(splinePoints.Length-1); seg++)
        {
            p0 = splinePoints[seg].position;
            p1 = splinePoints[seg+1].position;
            m0 =  splinePoints[seg].forward * splinePoints[seg].localScale.z*tangentScale;
            m1 =  splinePoints[seg+1].forward * splinePoints[seg+1].localScale.z*tangentScale;

            for (int i = 0; i<pointsPerSection; i+=1){
                splineLUT[seg*pointsPerSection + i] = Hermite( ((float)i/pointsPerSection), p0, p1, m0,m1);
            }

        }
        splineLUT[npoints-1] = Hermite( 1f, p0, p1, m0, m1);

    }

    void ShowControlPoints(bool show) {
        foreach (var splinePoint in splinePoints){
            MeshRenderer rend = splinePoint.GetComponent<MeshRenderer>();
            if (rend != null) rend.enabled = show;

        }
    }

    void Rebuild(int n) {
        float lengthAlongCurve;
        Vector3[] newSplinePoints = new Vector3[n];

       

        for (int i =0; i<n; i++)
        {
            float iter = (float)i;
            lengthAlongCurve= iter*GetLength()/n;
            float testLength = 0f;
            float testLength0 =0f;

            int p0 = 0;
            int p1 = 0;
            for(int j = 0; j<(npoints-1); j++)
            {
                p0 = j;
                testLength0=testLength;
                testLength += (splineLUT[j+1]-splineLUT[j]).magnitude;
                if (testLength>lengthAlongCurve) {
                    p1=j+1;
                    j=npoints;
                }
            }

            newSplinePoints[i] = Vector3.Lerp(splineLUT[p0], splineLUT[p1], (lengthAlongCurve-testLength0)/(testLength-testLength0));

        }
        newSplinePoints[0] = splineLUT[0];
        newSplinePoints[n-1] = splineLUT[npoints-1];
        splineLUT = new Vector3[n];
        for(int k = 0; k<n; k++) {
            splineLUT[k] = newSplinePoints[k];
        }

        npoints=n;

    }

    void DrawSpline(){
        if (line == null || !showLine) { 
            return;
        }
        line.SetVertexCount(npoints);
        for (int i=0; i<npoints; i++) {
            line.SetPosition (i, splineLUT[i]);
        }
    }

    float GetLength()
    {
        float sLength = 0f;
        for (int i=0; i<(npoints-1); i++)  {
            sLength+= (splineLUT[i+1]-splineLUT[i]).magnitude;
        }   
        return sLength;
    }

    public override Vector3 ReadPoint(float t)
    {
        t = Mathf.Clamp(t,0,1);
        Vector3 p;
       
        int tfloor = Mathf.FloorToInt(t*(npoints-1));
        if (tfloor < (npoints-1)) {
            p=Vector3.Lerp(splineLUT[tfloor],splineLUT[tfloor+1], t*(npoints-1)-tfloor);
        }
        else p=splineLUT[npoints-1];

        return p;
    }

    public static float SmoothT(float t)
    {

        Vector3 t0Vec = new Vector3(1,0,0);
        Vector3 t1Vec = new Vector3(1,0,0);

//
//        if (start >= 0) {
//            t0Vec = new Vector3(start,0,0);
//        }
//        if (start<0) t0Vec = new Vector3(0,-start,0);
//        if (end >=0) t1Vec = new Vector3(end,0,0);
//        if (end<0) t1Vec = new Vector3(0,-end,0);

        Vector3 smVec = Hermite(t, Vector3.zero, new Vector3(1f, 1f, 0), t0Vec, t1Vec);
        return smVec.y;
    }

    public static Vector3 Hermite(float t, Vector3 p0, Vector3 p1, Vector3 m0, Vector3 m1) {

        Vector3 p;

        float t2 = Mathf.Pow(t,2);
        float t3 = Mathf.Pow(t,3);

        p= (2*t3 - 3*t2 + 1)*p0 + (t3 - 2*t2 + t)*m0 + (-2*t3 + 3*t2)*p1 + (t3-t2)*m1;

        return p;

    }
}
