using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum EGameState {
    Unloaded,
    Transition,
    Intro,
    Play,
    Lost,
    Won
}






public class GameManager : MonoBehaviour {

    public Level currentLevel;
    public UIGame gameUI;

    public EGameState currentState{ get; private set; }
    GameStateBase currentStateFunctions;
    GameStateTransitionBase currentStateTransition;

    Dictionary<EGameState, GameStateBase> stateFunctions;
    Dictionary<EGameState, Dictionary<EGameState, GameStateTransitionBase>> stateTransitions;

    float stateTime;
  

    static GameManager instance;

    public static GameManager Instance {
        get { return instance; }
    }

    void Awake() {
        SetupStates ();
        instance = this;
    }
        

	// Use this for initialization
	void Start () {
        currentState = EGameState.Unloaded;
        gameUI.Init(this);
        currentLevel.Init(this);

        TransitionToState(EGameState.Play);
	}
	

	void Update () {
        GameStateUpdate();
    }

    #region StateMachine
    void GameStateUpdate() {
        if (currentStateTransition != null) {
           // bool done = currentStateTransition.Update(this);
            if (currentStateTransition.complete) {
                SetState(currentStateTransition.toState);
            }
        } else if (currentStateFunctions != null) {
            stateTime += Time.deltaTime;
            EGameState desiredState = currentStateFunctions.Update(this);
            if (desiredState != currentState) {
                TransitionToState(desiredState);
            }
        }
    }


    void SetupStates() {
        stateFunctions = new Dictionary<EGameState, GameStateBase>();
        stateTransitions = new Dictionary<EGameState, Dictionary<EGameState, GameStateTransitionBase>> ();

        stateFunctions.Add(EGameState.Play, new GameStatePlay());
        stateFunctions.Add(EGameState.Lost, new GameStateLost());
        stateFunctions.Add(EGameState.Won, new GameStateWon());

        AddTransition<GameStateTransitionStartLevel>(EGameState.Unloaded, EGameState.Play);
        AddTransition<GameStateTransitionRestart>(EGameState.Lost, EGameState.Play);
        AddTransition<GameStateTransitionRestart>(EGameState.Won, EGameState.Play);


//        stateTransitions.Add (EGameState.Unloaded, new Dictionary<EGameState, GameStateTransitionBase>());
//
//        stateTransitions[EGameState.Unloaded].Add(EGameState.Play, new GameStateTransitionStartLevel(EGameState.Unloaded, EGameState.Play));
//        stateTransitions[EGameState.Lost].Add EGameState.Play, new GameStateTransitionStartLevel(EGameState.Unloaded, EGameState.Play));
    }

    void AddTransition<T>(EGameState fromState, EGameState toState)  where T : GameStateTransitionBase, new() {
        T transition = new T();
        transition.SetFromToStates(fromState, toState);


        Dictionary<EGameState, GameStateTransitionBase> transitionsFrom = null;
        if (!stateTransitions.TryGetValue(fromState, out transitionsFrom)) {
            transitionsFrom = new Dictionary<EGameState, GameStateTransitionBase>();
            stateTransitions[fromState] = transitionsFrom;
        }
        transitionsFrom.Add(toState, transition);
    }





    void TransitionToState(EGameState state) {
        bool foundTransition = false;
        Dictionary<EGameState, GameStateTransitionBase> toTransitions;
        if (stateTransitions.TryGetValue(currentState, out toTransitions)) {
            GameStateTransitionBase transition;
            if (toTransitions.TryGetValue(state, out transition)) {
                currentStateTransition = transition;
                currentStateTransition.StartTransition(this);
                foundTransition = true;
            }
        }

        if (!foundTransition) {
            SetState(state);
        }
    }

    void SetState(EGameState state) {
        if (state == currentState) {
            return;
        }
        stateTime = 0f;
        EGameState fromState = currentState;
        currentState = state;
        if (stateFunctions.ContainsKey (currentState)) {
            currentStateFunctions = stateFunctions[currentState];
        } else {
            currentStateFunctions = null;
        }
        currentStateTransition = null;

        GameEvents.OnGameStateChange(fromState, currentState);
    }

    public float TimeInState() {
        return stateTime;
    }

    #endregion







}
