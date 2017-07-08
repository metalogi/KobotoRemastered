using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KobotoMonoRigidbody : KobotoMono {

    Vector3 pauseVelocity;
    Vector3 pauseAngularVelocity;

    bool paused;
    bool wasKinematic;

    private Rigidbody _rb;
    protected Rigidbody rb {
        get {
            if (_rb == null) {
                _rb = GetComponentInChildren<Rigidbody>();
            }
            return _rb;
        }
    }

    protected override void WillExitGameState (EGameState gameState, EGameState toState)
    {
        base.WillExitGameState (gameState, toState);
        if (!paused && (toState == EGameState.Paused || toState == EGameState.Map)) {
            Debug.Log("Pausing");
            wasKinematic = rb.isKinematic;
            pauseVelocity = rb.velocity;
            pauseAngularVelocity = rb.angularVelocity;
            paused = true;
            rb.isKinematic = true;
        }

    }

    protected override void DidEnterGameState (EGameState gameState, EGameState fromState)
    {
        base.DidEnterGameState (gameState, fromState);
        if (paused && gameState == EGameState.Play) {
            Debug.Log("Unpauseing");
            rb.isKinematic = wasKinematic;
            if (!wasKinematic) {
                rb.velocity = pauseVelocity;
                rb.angularVelocity = pauseAngularVelocity;
            }
            paused = false;
        }
    }
}
