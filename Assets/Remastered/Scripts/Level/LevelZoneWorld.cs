using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelZoneWorld : LevelZone {

    Vector2 relPos = Vector2.zero;
    Vector3 backToWorld = Vector3.zero;
    Bounds worldBounds;

    protected override void Init(EGameState gameState)
    {
        base.Init(gameState);
        worldBounds = GetBounds();
    }

    public Bounds GetBounds()
    {
        float sizeH = extentHNeg + extentHPos;
        float sizeV = extentVNeg + extentVPos;
        float localCenterH = extentHPos - 0.5f * sizeH;
        float localCenterV = extentVPos - 0.5f * sizeV;

        Vector3 center = transform.position + new Vector3(0, localCenterV, localCenterH);

        return new Bounds(center, new Vector3(100, sizeV, sizeH));
        
    }

    public bool IsOutsideWorld(Vector3 point, ref Vector3 backToWorldVector)
    {
        bool outside = !Test(point, ref relPos);
        if (!outside)
        {
            backToWorldVector = Vector3.zero;
            return false;

        }
            
        backToWorldVector = worldBounds.ClosestPoint(point) - point;
        return true;
    }

    public void UpdateCamera(KCam cam)
    {
        if (cam.inForbiddenZone)
            return;

        var pos = cam.camera.transform.position;
        if (IsOutsideWorld(pos, ref backToWorld))
        {
            cam.inForbiddenZone = true;
            cam.forbiddenStrength =  Mathf.Clamp(backToWorld.magnitude *0.1f, 0, 1f);

            cam.forbiddenDirection = -backToWorld.normalized;
            cam.forbiddenExit = pos + backToWorld;
        }
        
    }


}
