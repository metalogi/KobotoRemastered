using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectLineAttach : LevelObjectBase {

    public float t;
    public float moveTime = 1f;
    public float pauseTime = 1f;
    public bool pingPong;
    public bool smooth = true;
    public AbstractLine line;
    public MovePhase startState;
    public bool startFrozen;

    float startT;
    Rigidbody rb;
    float dT;

    public enum MovePhase {
        MoveUp,
        PauseTop,
        MoveDown,
        PauseBottom
    }

    MovePhase phase;
   
    float phaseTime;

    bool frozen;


    protected override void Init (EGameState gameState) {
        base.Init (gameState);
  
        startT = t;
        rb = GetComponent<Rigidbody>();
        rb.isKinematic = true;
        phase = startState;
        frozen = startFrozen;




    }

    public void Freeze(bool freeze) {
        frozen = freeze;

            
    }

    protected override void WillExitGameState(EGameState gameState, EGameState toState) {
        base.WillExitGameState (gameState, toState);
        if (gameState == EGameState.Play) {
            
        }
    }

    protected override void DidEnterGameState (EGameState gameState, EGameState fromState) {
        base.DidEnterGameState (gameState, fromState);
        if (gameState == EGameState.Play) {
            t = startT;
            phaseTime = 0f;
            if (fromState != EGameState.Paused && fromState != EGameState.Map) {
                phase = startState;
                frozen = startFrozen;
                dT = 0f;
            }

        }
    }

    protected override void FixedUpdatePlay() {
        base.FixedUpdatePlay();

         



        if (!frozen) {

          
            switch(phase) {
            case MovePhase.MoveUp:
                
                dT = Mathf.Lerp(dT, Time.fixedDeltaTime / moveTime, 0.25f);
              

                if (t >= 1f) {
                    phase = MovePhase.PauseTop;
                    phaseTime = 0f;
                }
                break;
            case MovePhase.PauseTop:
                phaseTime += Time.fixedDeltaTime;
                dT = 0f;
                if (phaseTime >= pauseTime) {
                    phase = MovePhase.MoveDown;
                    phaseTime = 0f;
                }
                break;
            case MovePhase.MoveDown:
                dT = Mathf.Lerp(dT, -Time.fixedDeltaTime / moveTime, 0.25f);
              
        
                if (t <= 0f) {
                    phase = MovePhase.PauseBottom;
                    phaseTime = 0f;
                }
                break;
            case MovePhase.PauseBottom:
                phaseTime += Time.fixedDeltaTime;
                dT = 0;
                if (phaseTime >= pauseTime) {
                    phase = MovePhase.MoveUp;
                    phaseTime = 0f;
                }
                break;
            }
          
        } else {

            dT *= 0.98f;
        }

        t += dT;

        float outT = t;
        if (smooth) {
            outT = KSpline.SmoothT(t);
        }

        Vector3 newPos = line.ReadPoint(outT);

        rb.MovePosition(newPos);
    }
}
