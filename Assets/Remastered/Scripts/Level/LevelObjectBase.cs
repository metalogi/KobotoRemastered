using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectBase : MonoBehaviour {

    public Collider trigger;
    public Collider mainCollider;

    protected bool isActive;

    public void Init() {
        Debug.Log("Level Object Init");
        GameEvents.AddGameStateListener(GameStateDidChange);
    }

    void SetActive(bool active) {
        Debug.Log("Setting level object active: " + active);
        isActive = active;
    }

    protected virtual void GameStateDidChange (EGameState fromState, EGameState toState) {
        SetActive(toState == EGameState.Play);
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
