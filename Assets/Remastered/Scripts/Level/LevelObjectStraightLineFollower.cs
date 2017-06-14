using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectStraightLineFollower : LevelObjectBase {

    public float t;
    public float moveTime = 1f;
    public float pauseTime = 1f;
    public bool pingPong;
    public bool smooth = true;
    public StraightLine line;

    float startT;
    Rigidbody rb;
    Animator animator;

    protected enum MovePhase {
        MoveUp,
        PauseTop,
        MoveDown,
        PauseBottom
    }

    MovePhase phase;
    float phaseTime;


    protected override void Init (EGameState gameState) {
        base.Init (gameState);
        animator = GetComponent<Animator>();
        animator.enabled = false;
        startT = t;
        rb = GetComponent<Rigidbody>();
        rb.isKinematic = true;

    }

    protected override void WillExitGameState(EGameState gameState, EGameState toState) {
        base.WillExitGameState (gameState, toState);
        if (gameState == EGameState.Play) {
            animator.enabled = false;
        }
    }

    protected override void DidEnterGameState (EGameState gameState, EGameState fromState) {
        base.DidEnterGameState (gameState, fromState);
        if (gameState == EGameState.Play) {
            t = startT;
            phase = MovePhase.MoveUp;

        }
    }

    protected override void FixedUpdatePlay() {
        base.FixedUpdatePlay();

        float dT = Time.fixedDeltaTime;

        switch(phase) {
        case MovePhase.MoveUp:
            dT /= moveTime;
            t += dT;
            Debug.Log("t= " + t);
            if (t >= 1f) {
                phase = MovePhase.PauseTop;
                phaseTime = 0f;
            }
            break;
        case MovePhase.PauseTop:
            phaseTime += dT;
            if (phaseTime >= pauseTime) {
                phase = MovePhase.MoveDown;
                phaseTime = 0f;
            }
            break;
        case MovePhase.MoveDown:
            dT /= moveTime;
            t -= dT;
            if (t <= 0f) {
                phase = MovePhase.PauseBottom;
                phaseTime = 0f;
            }
            break;
        case MovePhase.PauseBottom:
            phaseTime += dT;
            if (phaseTime >= pauseTime) {
                phase = MovePhase.MoveUp;
                phaseTime = 0f;
            }
            break;
        }

        float outT = t;
        if (smooth) {
            outT = KSpline.SmoothT(t);
        }
            
        rb.MovePosition(line.ReadPoint(outT));
    }
}
