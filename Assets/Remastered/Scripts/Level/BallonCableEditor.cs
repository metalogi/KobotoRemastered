using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[ExecuteInEditMode]
public class BallonCableEditor : MonoBehaviour {

    public float verticalSize = 30f;
    public float topSpacingX = 5;
    public float bottomSpacingX = 15;

    public float topSpacingZ = 5;
    public float bottomSpacingZ = 15;

    public float cableThickness = 5f;


    void Update () {
#if (UNITY_EDITOR)
        

        float[] xSigns = new float[] { 1, -1, 1, -1 };
        float[] zSigns = new float[] { -1, -1, 1, 1 };

        Vector3[] cableStartPoints = new Vector3[4];
        Vector3[] cableEndPoints = new Vector3[4];

        for (int i=0; i<4; i++)
        {
            cableStartPoints[i] = new Vector3(xSigns[i] * topSpacingX / 2f, 0, zSigns[i] * topSpacingZ / 2f);
            cableEndPoints[i] = new Vector3(xSigns[i] * bottomSpacingX / 2f, -verticalSize , zSigns[i] * bottomSpacingZ / 2f);
        }
        int cableEndIndex = 0;
        foreach (Transform t in transform)
        {
            if (t.gameObject.name.StartsWith("CableEnd"))
            {
                t.localPosition = cableEndPoints[cableEndIndex];
            }
            cableEndIndex++;
            if (cableEndIndex > 3)
            {
                break;
            }
        }
        int cable = 0;
        foreach (Transform t in transform)
        {
            if (t.gameObject.name.StartsWith("BallonCable")) 
            {
                Vector3 cableStart = cableStartPoints[cable];
                Vector3 cableEnd = cableEndPoints[cable];


                t.localPosition = cableStart;
                //t.localRotation = Quaternion.LookRotation(Vector3.forward, cableStart - cableEnd);
                t.rotation = Quaternion.FromToRotation(Vector3.down, cableEnd-cableStart);
                t.localScale = new Vector3(cableThickness, (cableEnd - cableStart).magnitude/2f, cableThickness);

            
                cable++;
                if (cable > 3)
                {
                    break;
                }
            }


        }

#endif

    }
}
