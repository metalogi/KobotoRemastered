using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectRotator : LevelObjectBase {
    public float speed = 20f;


    protected override void FixedUpdatePlay(){
        transform.Rotate (Vector3.right * speed * Time.fixedDeltaTime, Space.World);
    }
}
