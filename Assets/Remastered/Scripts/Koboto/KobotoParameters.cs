﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KobotoParameters : MonoBehaviour {

    public float groundMoveStength = 100f;
    public float groundMoveSpeed = 5f;
    public AnimationCurve groundAccelerationCurve;
    public float airMoveStrength = 10f;
    public float defaultDynamicFriction = 0.7f;
    public float defaultStaticFriction = 0.9f;
    public float defaultAirDrag = 0.1f;
    public float maxAirTilt = 45f;


}
