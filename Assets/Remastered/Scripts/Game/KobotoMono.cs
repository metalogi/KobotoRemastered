using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class KobotoMono : MonoBehaviour {

    protected EGameState currentGameState;

    public virtual void OnEnable() {
        GameEvents.AddGameStateEnteredListener(SetGameState);
        GameEvents.AddGameStateEnteredListener(DidEnterGameState);
        GameEvents.AddGameStateExitListener(WillExitGameState);

    }

    public virtual void OnDisable() {
        GameEvents.RemoveGameStateEnteredListener(DidEnterGameState);
        GameEvents.RemoveGameStateExitListener(WillExitGameState);

        UIEvents.RemoveListener(EPointerEvent.PointerDown, OnPointerDown);
        UIEvents.RemoveListener(EPointerEvent.DragStart, OnDragStart);
        UIEvents.RemoveListener(EPointerEvent.Drag, OnDrag);
        UIEvents.RemoveListener(EPointerEvent.DragEnd, OnDragStop);
    }



    public virtual void Awake() {
        Init(GameEvents.gameState);
        currentGameState = GameEvents.gameState;
    }


    protected void ListenToPointerEvents() {
        UIEvents.AddListener(EPointerEvent.PointerDown, OnPointerDown);
        UIEvents.AddListener(EPointerEvent.DragStart, OnDragStart);
        UIEvents.AddListener(EPointerEvent.Drag, OnDrag);
        UIEvents.AddListener(EPointerEvent.DragEnd, OnDragStop);
    }

    private void SetGameState(EGameState gameState, EGameState fromState) {
        currentGameState = gameState;
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
