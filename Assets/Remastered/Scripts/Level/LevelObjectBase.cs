using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectBase : KobotoMono {

    public Collider trigger;
    public Collider mainCollider;

    public EGameState stateMask = EGameState.Play;
    public bool activeInEndgame;

    protected bool isActive;

    protected override void Init(EGameState gameState) {
        if (trigger == null) {
            trigger = FindCollider(true);
        }
        if (mainCollider == null) {
            mainCollider = FindCollider(false);
        }
    }

    Collider FindCollider(bool trigger) {
        foreach (Collider c in GetComponentsInChildren<Collider>()) {
            if (c.isTrigger == trigger) {
                return c;
            }
        }
        return null;
    }

    void SetActive(bool active) {
        Debug.Log("Setting level object active: " + active);
        isActive = active;
       
    }

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState) {
        if ((gameState & stateMask) == gameState) {
            SetActive(true);
        }
    }

    protected override void WillExitGameState(EGameState gameState, EGameState toState) {
        
        if ((gameState & stateMask) == gameState && (gameState & stateMask) != toState) {
  
            SetActive (false);

        }
    }

    void Update() {
        if (isActive) {
            UpdatePlay();
        }
    }

    void FixedUpdate() {
        if (isActive) {
            FixedUpdatePlay();
        }
    }

    protected virtual void UpdatePlay() {
    }

    protected virtual void FixedUpdatePlay() {
    }

    void OnTriggerEnter(Collider other) {
        Debug.Log("Trigger enter");
        if (!isActive) {
            return;
        }
        Koboto koboto = other.gameObject.GetComponent<Koboto>();
        if (koboto != null) {
            OnKobotoEnter(koboto);
        }
    }

    void OnTriggerExit(Collider other) {
        Debug.Log("Trigger exit");
        if (!isActive) {
            return;
        }
        Koboto koboto = other.gameObject.GetComponent<Koboto>();
        if (koboto != null) {
            OnKobotoExit(koboto);
        }
    }

    protected virtual void OnKobotoEnter(Koboto koboto) {
    }

    protected virtual void OnKobotoExit(Koboto koboto) {
    }
}
