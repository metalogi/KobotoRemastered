using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelObjectBase : KobotoMono {

    public Collider trigger;
    public Collider mainCollider;

    public EGameState stateMask = EGameState.Play;
    public bool activeInEndgame;

    protected bool isActive;

    protected int worldNumber;
    protected int levelNumber;

    MaterialAlphaFade materialFader;

    protected override void Init(EGameState gameState) {
        if (trigger == null) {
            trigger = FindCollider(true);
        }
        if (mainCollider == null) {
            mainCollider = FindCollider(false);
        }
        worldNumber = ProgressManager.CurrentWorldNumber;
        levelNumber = ProgressManager.CurrentLevelNumber;
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
       // Debug.Log("Setting level object active: " + active);
        isActive = active;
       
    }

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState) {

        if (gameState == EGameState.Play && !IsPauseState(fromState))
        {
            StopAllCoroutines();
            DidRestartLevel();
        }
        if ((gameState & stateMask) == gameState) {
            SetActive(true);
        }
    }

    protected override void WillExitGameState(EGameState gameState, EGameState toState) {
        
        if ((gameState & stateMask) == gameState && (gameState & stateMask) != toState) {
  
            SetActive (false);

        }
    }

    protected virtual void DidRestartLevel()
    { }

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

    protected bool IsPaused()
    {
        return IsPauseState(currentGameState);
    }

    bool IsPauseState(EGameState state)
    {
        return state == EGameState.Paused
            || state == EGameState.Map;
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
        else
        {
            OnObjectEnter(other);
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
        else
        {
            OnObjectExit(other);
        }
    }

    protected virtual void OnKobotoEnter(Koboto koboto) {
    }

    protected virtual void OnKobotoExit(Koboto koboto) {
    }

    protected virtual void OnObjectEnter(Collider collider)
    {
    }

    protected virtual void OnObjectExit(Collider collider)
    {
    }

    protected void FadeAlpha(float targetAlpha, float speed = 1f, float delay = 0f)
    {
        if (materialFader == null)
        {
            materialFader = gameObject.AddComponent<MaterialAlphaFade>();
        }
        materialFader.FadeTo(targetAlpha, speed, delay);
    }

    protected void SetAlpha(float targetAlpha)
    {
        if (materialFader == null)
        {
            materialFader = gameObject.AddComponent<MaterialAlphaFade>();
        }
        materialFader.Set(targetAlpha);
    }

    protected void DoActionAfterUnpausedTime(Action action, float time)
    {
        StartCoroutine(DoActionAfterUnpausedTimeCoroutine(action, time));
    }

    IEnumerator DoActionAfterUnpausedTimeCoroutine(Action action, float time)
    {
        while (time > 0)
        {
            if (!IsPaused())
            {
                time -= Time.deltaTime;
            }
            yield return null;
        }
        action();
        yield break;
    }
}
