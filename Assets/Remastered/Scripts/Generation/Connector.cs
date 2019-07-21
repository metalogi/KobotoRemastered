using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Connector : MonoBehaviour
{

    public enum Direction { Left, Right}

    public int numPoints = 6;
    public int continuity = 1;

    Mesh CMesh;
    MeshFilter CMeshFilter;
    MeshRenderer CMeshRenderer;
    MeshCollider CMeshCollider;

    GameObject side;
    Mesh sideMesh;
    MeshFilter sideMeshFilter;
    MeshRenderer sideRenderer;

    [HideInInspector]
    public Transform parentLeft, parentRight;
    Material leftMat, rightMat;

    Vector3[] verts;
    int[] tris;
    Vector3[] norms;
    Vector2[] uvs;

    Vector2[] sUvs;
    Vector3[] sNorms;
    int[] sTris;

    Vector3[] leftEdge;
    Vector3[] rightEdge;

    Vector2[] leftUVs;
    Vector2[] rightUVs;

    Vector2[] leftUVsSide;
    Vector2[] rightUVsSide;

    Vector2 uvScale = new Vector2(3,1);
    Vector2 uvScaleSide = new Vector2(3,1);


    public void Init(Material botMat)
    {
        CMesh = new Mesh();
        
        CMeshFilter = gameObject.GetOrAddComponent<MeshFilter>();
        CMeshRenderer = gameObject.GetOrAddComponent<MeshRenderer>();

        CMeshFilter.mesh = CMesh;
        CMeshCollider = gameObject.GetOrAddComponent<MeshCollider>();

        leftEdge = new Vector3[4];
        rightEdge = new Vector3[4];

        for (int i=0;i<4;i++)
        {
            leftEdge[i] = Vector3.zero;
            rightEdge[i] = Vector3.zero;
        }

        leftUVs = new Vector2[4];
        rightUVs = new Vector2[4];

        leftUVsSide = new Vector2[4];
        rightUVsSide = new Vector2[4];

        MeshRenderer parRend = parentLeft.GetComponent<MeshRenderer>();
        Collider parPhys = parentLeft.GetComponent<Collider>();
        if (parRend)
        {
            if (parRend.sharedMaterials.Length > 1) leftMat = parRend.sharedMaterials[1];
            else leftMat = parRend.sharedMaterials[0];
        }

        Material[] tmpMatArray = new Material[2];
        tmpMatArray[0] = leftMat;
        tmpMatArray[1] = botMat;

        CMeshRenderer.sharedMaterials = tmpMatArray;

        //CMeshRenderer.material = leftMat;

        CMeshCollider.sharedMesh = CMesh;
        CMeshCollider.material = parPhys.sharedMaterial;

        side = new GameObject("side");
        sideMesh = new Mesh();
        sideMeshFilter = side.AddComponent<MeshFilter>();
        sideRenderer = side.AddComponent<MeshRenderer>();
        sideMeshFilter.mesh = sideMesh;
        if (parRend) sideRenderer.material = parRend.sharedMaterials[0];
        side.transform.parent = transform;

        gameObject.layer = 8;
    }

    public void SetParentObjs(Transform left, Transform right)
    {
        parentLeft = left;
        parentRight = right;
    }

    public void UpdateMaterials()
    {
        if (parentLeft)
        {
            MeshRenderer parRend = parentLeft.GetComponent<MeshRenderer>();
            if (parRend)
            {
                if (parRend.sharedMaterials.Length > 1) leftMat = parRend.sharedMaterials[1];
                else leftMat = parRend.sharedMaterials[0];

                 Material[] tmpMatArray = new Material[2];
                tmpMatArray[0] = leftMat;
                tmpMatArray[1] = parRend.sharedMaterials[0];

                CMeshRenderer.sharedMaterials = tmpMatArray;

                //CMeshRenderer.material = leftMat;
                sideRenderer.material = parRend.sharedMaterials[0];
            }
        }
    }

    public void FindParent(Direction side)
    {
        Vector3  raystart= Vector3.zero;
        Vector3 rayDir = Vector3.zero;

        RaycastHit hit;

        for (int i = 0; i < 4; i++) 
        {
            if (side == Direction.Left)
            {
                if (leftEdge.Length > i) raystart += leftEdge[i];
                raystart += new Vector3(0, 0, 2);
            }
            if (side == Direction.Right)
            {
                if (rightEdge.Length > i) raystart += rightEdge[i];
                raystart -= new Vector3(0, 0, 2);
            }

        }
        raystart /= 4.0f;


        int testpoint = (side == Direction.Left) ? 0 : norms.Length - 1;

        rayDir.y = norms[testpoint].z;
        rayDir.z = -norms[testpoint].y;

        Physics.Raycast(raystart, rayDir, out hit, 100.0f );
        if (side == Direction.Left) parentLeft = hit.transform;
        if (side == Direction.Right) parentRight = hit.transform;
    }


    public void UpdateMesh(int n)
    {
        numPoints = n;

        if (!parentLeft) FindParent(Direction.Left);
        if (!parentRight) FindParent(Direction.Right);

        MeshFilter leftMeshFilter = parentLeft.GetComponent<MeshFilter>();
        MeshFilter rightMeshFilter = parentRight.GetComponent<MeshFilter>();
        if (leftMeshFilter && rightMeshFilter)
        {
            leftMeshFilter.sharedMesh.RecalculateBounds();
            rightMeshFilter.sharedMesh.RecalculateBounds();
            Bounds leftBB = leftMeshFilter.sharedMesh.bounds;

            Bounds rightBB = rightMeshFilter.sharedMesh.bounds;

      
            Vector3 LeftBBCenter = leftBB.center;

            Vector3 RightBBCenter = rightBB.center;

            Vector3 leftScale = parentLeft.lossyScale;
            Vector3 rightScale = parentRight.lossyScale;

            Debug.Log("leftparent position " + parentLeft.position);
            Debug.Log("leftparent scale " + leftScale);
            Debug.Log("boundingBoxCenter: " + leftBB.center);
            Debug.Log("boundingBoxExtents: " + leftBB.extents);


            //find parent edges
            for (int i = 0; i < 4; i++) 
            {
                leftEdge[i] = parentLeft.position + parentLeft.TransformDirection(Vector3.Scale(leftScale, LeftBBCenter));

                Vector3 iOff;
                iOff.z = leftBB.extents.x * leftScale.x;
                if (i < 2) iOff.x = leftBB.extents.z * leftScale.z;
                else iOff.x = -leftBB.extents.z * leftScale.z;
                if ((i == 0) || (i == 2)) iOff.y = leftBB.extents.y * leftScale.y;
                else iOff.y = -leftBB.extents.y * leftScale.y;

                leftEdge[i] += parentLeft.TransformDirection(new Vector3(-iOff.z, iOff.y, iOff.x));

                rightEdge[i] = parentRight.position + parentRight.TransformDirection(Vector3.Scale(rightScale, RightBBCenter));

                iOff.z = rightBB.extents.x * rightScale.x;
                if (i < 2) iOff.x = rightBB.extents.z * rightScale.z;
                else iOff.x = -rightBB.extents.z * rightScale.z;
                if ((i == 0) || (i == 2)) iOff.y = rightBB.extents.y * rightScale.y;
                else iOff.y = -rightBB.extents.y * rightScale.y;

                rightEdge[i] += parentRight.TransformDirection(new Vector3(iOff.z, iOff.y, iOff.x));

            }

            leftUVs[0] = new Vector2(-uvScale.x, 0);
            leftUVs[1] = new Vector2(-uvScale.x, 0);
            leftUVs[2] = new Vector2(-uvScale.x, uvScale.y);
            leftUVs[3] = new Vector2(-uvScale.x, uvScale.y);

            rightUVs[0] = new Vector2(uvScale.x, 0);
            rightUVs[1] = new Vector2(uvScale.x, 0);
            rightUVs[2] = new Vector2(uvScale.x, uvScale.y);
            rightUVs[3] = new Vector2(uvScale.x, uvScale.y);

            leftUVsSide[0] = new Vector2(-uvScaleSide.x, uvScaleSide.y);
            leftUVsSide[1] = new Vector2(-uvScaleSide.x, 0);
            leftUVsSide[2] = new Vector2(-uvScaleSide.x, uvScaleSide.y);
            leftUVsSide[3] = new Vector2(-uvScaleSide.x, 0);

            rightUVsSide[0] = new Vector2(uvScaleSide.x, uvScaleSide.y);
            rightUVsSide[1] = new Vector2(uvScaleSide.x, 0);
            rightUVsSide[2] = new Vector2(uvScaleSide.x, uvScaleSide.y);
            rightUVsSide[3] = new Vector2(uvScaleSide.x, 0);

            //Calculate vertex positions
            int vi = 0;
            verts = new Vector3[4 * n];
            norms = new Vector3[4 * n];
            tris = new int[12 * (n - 1)];
            uvs = new Vector2[4 * n];

            sNorms = new Vector3[4 * n];
            sTris = new int[12 * (n - 1)];
            sUvs = new Vector2[4 * n];

            Vector3 m0 = (leftEdge[0] - rightEdge[0]).magnitude * continuity * parentLeft.TransformDirection(new Vector3(-1, 0, 0));
            Vector3 m1 = (leftEdge[0] - rightEdge[0]).magnitude * continuity * parentRight.TransformDirection(new Vector3(-1, 0, 0));

            for (int spline = 0; spline < 4; spline++)
            {
                for (float t = 0; t <= 1.0f; t += 1.0f / (float)(n - 1))
                {
                    verts[vi] = Hermite(t, leftEdge[spline], rightEdge[spline], m0, m1);

                    if (spline < 2) sNorms[vi] = new Vector3(1, 0, 0);
                    else sNorms[vi] = new Vector3(-1, 0, 0);
                    uvs[vi] = Vector3.Lerp(leftUVs[spline], rightUVs[spline], t);
                    sUvs[vi] = Vector3.Lerp(leftUVsSide[spline], rightUVsSide[spline], t);
                    vi++;
                }
            }

            //construct triangles and normals
            for (int triangleStrip = 0; triangleStrip < (n - 1); triangleStrip++)
            {
                int ts = triangleStrip;
                int ti = triangleStrip * 12;

                tris[ti] = ts;
                tris[ti + 1] = 2 * n + ts;
                tris[ti + 2] = ts + 1;

                tris[ti + 3] = 2 * n + ts;
                tris[ti + 4] = 2 * n + ts + 1;
                tris[ti + 5] = ts + 1;

                tris[ti + 6] = n + ts + 1;
                tris[ti + 7] = 3 * n + ts;
                tris[ti + 8] = n + ts;

                tris[ti + 9] = n + ts + 1;
                tris[ti + 10] = 3 * n + ts + 1;
                tris[ti + 11] = 3 * n + ts;

                if (ts > 0)
                {
                    norms[ts] = -Vector3.Cross((verts[ts + 1] - verts[ts]), (verts[2 * n + ts] - verts[ts])).normalized;
                    norms[ts + 2 * n] = norms[ts];
                    norms[ts + n] = -norms[ts];
                    norms[ts + 3 * n] = -norms[ts];
                }

                //sideMesh
                sTris[ti] = ts;
                sTris[ti + 1] = n + ts + 1;
                sTris[ti + 2] = n + ts;

                sTris[ti + 3] = ts;
                sTris[ti + 4] = ts + 1;
                sTris[ti + 5] = n + ts + 1;

                sTris[ti + 6] = 2 * n + ts;
                sTris[ti + 7] = 3 * n + ts + 1;
                sTris[ti + 8] = 3 * n + ts;

                sTris[ti + 9] = 2 * n + ts;
                sTris[ti + 10] = 2 * n + ts + 1;
                sTris[ti + 11] = 3 * n + ts + 1;
            }

            //end normals use parent objects
            norms[0] = parentLeft.up;
            norms[2 * n] = norms[0];
            norms[n] = -norms[0];
            norms[3 * n] = -norms[0];

            norms[n - 1] = parentRight.up;
            norms[3 * n - 1] = norms[n - 1];
            norms[2 * n - 1] = -norms[n - 1];
            norms[4 * n - 1] = -norms[n - 1];

            //copy values to Mesh
            CMesh.vertices = verts;
            CMesh.triangles = tris;
            CMesh.normals = norms;
            CMesh.uv = uvs;

            //set SubMeshes
            CMesh.subMeshCount = 2;
            int[] subMesh0 = new int[6 * (n - 1)];
            int[] subMesh1 = new int[6 * (n - 1)];
            int ind = 0;
            int ind0 = 0;
            int ind1 = 0;
            for (int mi = 0; mi < (n - 1); mi++)
            {
                for (int sub0 = 0; sub0 < 6; sub0++)
                {
                    subMesh0[ind0] = tris[ind];
                    ind++;
                    ind0++;
                }
                for (int sub1 = 0; sub1 < 6; sub1++)
                {
                    subMesh1[ind1] = tris[ind];
                    ind++;
                    ind1++;
                }
            }
            CMesh.SetTriangles(subMesh0, 0);
            CMesh.SetTriangles(subMesh1, 1);

            sideMesh.vertices = verts;
            sideMesh.triangles = sTris;
            sideMesh.normals = sNorms;
            sideMesh.uv = sUvs;

            CMesh.RecalculateBounds();
            sideMesh.RecalculateBounds();
        }
    }

    public Vector3 GetSurfacePoint(float u)
    {
        Vector3 tang0=(leftEdge[0] - rightEdge[0]).magnitude* continuity*parentLeft.TransformDirection(new Vector3(-1,0,0));

        Vector3 tang1 = (leftEdge[0] - rightEdge[0]).magnitude* continuity*parentRight.TransformDirection(new Vector3(-1,0,0));
        Vector3 splinePoint = Hermite(Mathf.Clamp01(u), leftEdge[0], rightEdge[0], tang0, tang1);

        return (new Vector3(0, splinePoint.y, splinePoint.z));
    }

    public Vector3 GetSurfaceTangent(float u) 
    {

        Debug.Log("SurfaceTangent u=  " + u);
        if (u > 0.95f) return parentRight.TransformDirection(new Vector3(1,0,0));
        if (u< 0.05f) return parentLeft.TransformDirection(new Vector3(1,0,0));

        Debug.DrawLine(GetSurfacePoint(u+0.05f), GetSurfacePoint(u), Color.blue);
        Debug.Log((GetSurfacePoint(u+0.05f) - GetSurfacePoint(u)).normalized);
        return (GetSurfacePoint(u+0.05f) - GetSurfacePoint(u)).normalized;
    }

    Vector3 Hermite(float t, Vector3 p0, Vector3 p1, Vector3 m0, Vector3 m1) 
    {
        Vector3 p;

        float t2 = t * t;
        float t3 = t2 * t;

        p= (2* t3 - 3* t2 + 1)* p0 + (t3 - 2* t2 + t)* m0 + (-2* t3 + 3* t2)* p1 + (t3-t2)* m1;

        return p;
    }

}
