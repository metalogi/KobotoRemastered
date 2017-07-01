using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class KobotoMono : MonoBehaviour {

    void OnEnable() {
        GameEvents.AddGameStateEnteredListener(DidEnterGameState);
        GameEvents.AddGameStateExitListener(WillExitGameState);
    }

    void OnDisable() {
        GameEvents.RemoveGameStateEnteredListener(DidEnterGameState);
        GameEvents.RemoveGameStateExitListener(WillExitGameState);
    }

    public virtual void Awake() {
        Init(GameEvents.gameState);
    }

    protected void ListenToPointerEvents() {
        UIEvents.AddListener(EPointerEvent.PointerDown, OnPointerDown);
        UIEvents.AddListener(EPointerEvent.DragStart, OnDragStart);
        UIEvents.AddListener(EPointerEvent.Drag, OnDrag);
    }

    protected virtual void DidEnterGameState(EGameState gameState, EGameState fromState) {
    }

    protected virtual void WillExitGameState(EGameState gameState, EGameState toState) {
    }

    protected virtual void Init(EGameState gameState) {
    }

    protected virtual void OnPointerDown(PointerEventData eventData) {
    }

    protected virtual void OnDragStart(PointerEventData eventData) {

    }

    protected virtual void OnDrag(PointerEventData eventData) {

    }
        
    protected virtual void OnDragStop(PointerEventData eventData) {
    }
}
