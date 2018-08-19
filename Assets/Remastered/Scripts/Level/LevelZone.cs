using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelZone : KobotoMono {

    public float extentHPos;
    public float extentHNeg;
    public float extentVPos;
    public float extentVNeg;

    bool didTestTrue;

    protected bool Test(Vector3 point, ref Vector2 relativePosition)
    {
        // Vector3 localPoint = transform.InverseTransformPoint(point);
        Vector3 offset = point - transform.position;
        Vector3 localPoint = transform.InverseTransformDirection(offset).normalized * offset.magnitude;
        float x, y;
        if (localPoint.z > 0)
        {
            x = extentHPos > 0? localPoint.z / extentHPos: 10000f;
        }
        else
        {
            x = extentHNeg > 0 ? localPoint.z / extentHNeg : -10000f;
        }
        if (localPoint.y > 0)
        {
            y = extentVPos > 0 ? localPoint.y / extentVPos : 10000f;
        }
        else
        {
            y = extentVNeg > 0 ? localPoint.y / extentVNeg : -10000f;
        }
        relativePosition.Set(x, y);
        bool inZone = Mathf.Abs(x) <= 1.0f && Mathf.Abs(y) <= 1.0f;
        didTestTrue = inZone;
        return inZone;

    }

    public bool AffectKobotoSenses(KobotoSensor kSense, Vector3 testPoint)
    {
        Vector2 pointInZone = Vector2.zero;
        bool inZone = Test(testPoint, ref pointInZone);
        if (inZone)
        {
            Debug.Log("In zone: " + pointInZone);
            UpdateSensor(kSense, pointInZone);
        }
        return inZone;
           
    }

    protected virtual void UpdateSensor(KobotoSensor kSense, Vector2 pointInZone)
    {

    }


    public void OnDrawGizmos()
    {
        float sizeH = extentHPos + extentHNeg;
        float sizeV = extentVPos + extentVNeg;
        Color c = didTestTrue ? Color.red : Color.white;
        Vector3 up = transform.up * sizeV;
        Vector3 across = transform.forward * sizeH;

        Vector2 start = new Vector2(extentVPos, extentHNeg);
        Vector3 v = transform.position + transform.up * extentVPos - transform.forward * extentHNeg;
        Vector3 v1 = v + across;
        Vector3 v2 = v1 - up;
        Vector3 v3 = v2 - across;

        Gizmos.color = c;
        Gizmos.DrawLine(v, v1);
        Gizmos.DrawLine(v1, v2);
        Gizmos.DrawLine(v2, v3);
        Gizmos.DrawLine(v3, v);
        didTestTrue = false;
    }
}
