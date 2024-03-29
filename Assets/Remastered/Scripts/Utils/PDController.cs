﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PDController  { 

    float lastError;

    float p;
    float d;

    public PDController(float p, float d) {
        this.p = p;
        this.d = d;
    }

    public float Update(float currentError, float deltaTime)
    {
        var delta = (currentError - lastError) / deltaTime;
        lastError = currentError;
        return currentError * p + delta * d;
    }

    public void Reset(float setError = 0) {
        lastError = setError;
    }

    public void AdjustPD(float p, float d) {
        this.p = p;
        this.d = d;
    }
}

public class PIDController  { 

    float lastError;
    float integral;

    float p;
    float d;
    float i;

    public PIDController(float p, float i, float d) {
        this.p = p;
        this.i = i;
        this.d = d;
    }

    public float Update(float currentError, float deltaTime)
    {
        var delta = (currentError - lastError) / deltaTime;
        lastError = currentError;
        integral += currentError * deltaTime;
        return currentError * p +  integral * i + delta * d;
    }

    public void Reset(float setError = 0) {
        lastError = setError;
        integral = 0f;

    }

    public void AdjustPD(float p, float i, float d) {
        this.p = p;
        this.i = i;
        this.d = d;
    }
}
