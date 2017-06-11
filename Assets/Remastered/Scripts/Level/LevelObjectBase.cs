using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectBase : KobotoMono {

    public Collider trigger;
    public Collider mainCollider;

    protected bool isActive;

//    public void Init() {
//        Debug.Log("Level Object Init");
//        GameEvents.AddGameStateListener(GameStateDidChange);
//    }

    void SetActive(bool active) {
        Debug.Log("Setting level object active: " + active);
        isActive = active;
    }

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState) {
        if (gameState == EGameState.Play) {
            SetActive(true);
        }
    }

    protected override void WillExitGameState(EGameState gameState, EGameState toState) {
        if (gameState == EGameState.Play) {
            SetActive(false);
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

    protected void UpdatePlay() {
    }

    protected void FixedUpdatePlay() {
    }

    void OnTriggerEnter(Collider other) {
        if (!isActive) {
            return;
        }
        Koboto koboto = other.gameObject.GetComponent<Koboto>();
        if (koboto != null) {
            OnKobotoEnter(koboto);
        }
    }

    protected virtual void OnKobotoEnter(Koboto koboto) {
    }
}
