using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KobotoMono : MonoBehaviour {

    void OnEnable() {
        GameEvents.AddGameStateEnteredListener(DidEnterGameState);
        GameEvents.AddGameStateExitListener(WillExitGameState);
    }

    void OnDisable() {
        GameEvents.RemoveGameStateEnteredListener(DidEnterGameState);
        GameEvents.RemoveGameStateExitListener(WillExitGameState);
    }

    void Awake() {
        Init(GameEvents.gameState);
    }

    protected virtual void DidEnterGameState(EGameState gameState, EGameState fromState) {
    }

    protected virtual void WillExitGameState(EGameState gameState, EGameState toState) {
    }

    protected virtual void Init(EGameState gameState) {
    }
}
