using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectRotator : LevelObjectBase {
    public float speed = 20f;

    public Vector3 axis = Vector3.right;


    protected override void FixedUpdatePlay(){
        transform.Rotate (axis.normalized * speed * Time.fixedDeltaTime, Space.World);
    }
}
