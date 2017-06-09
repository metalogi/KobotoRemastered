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

[System.Serializable]
public class KobotoSpawnInfo{
    public EKobotoType kobotoType;
    public Transform spawnPoint;
}


public class GameManager : MonoBehaviour {


    public KobotoSpawnInfo[] kobotoSpawnInfo;

    public EGameState currentState{ get; private set; }
    GameStateBase currentStateFunctions;
    GameStateTransitionBase currentStateTransition;

    Dictionary<EGameState, GameStateBase> stateFunctions;
    Dictionary<EGameState, Dictionary<EGameState, GameStateTransitionBase>> stateTransitions;

    [HideInInspector]
    public Transform kobotoParent;
    public List<Koboto> kobotos;

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
        TransitionToState(EGameState.Play);
	}
	

	void Update () {
        if (currentStateTransition != null) {
            bool done = currentStateTransition.Update(this);
            if (done) {
                SetState(currentStateTransition.toState);
            }
        } else if (currentStateFunctions != null) {
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

        stateTransitions.Add (EGameState.Unloaded, new Dictionary<EGameState, GameStateTransitionBase>());
        stateTransitions[EGameState.Unloaded].Add (EGameState.Play, new GameStateTransitionStartLevel(EGameState.Unloaded, EGameState.Play));
    }

    void TransitionToState(EGameState state) {
        bool foundTransition = false;
        Dictionary<EGameState, GameStateTransitionBase> toTransitions;
        if (stateTransitions.TryGetValue(currentState, out toTransitions)) {
            GameStateTransitionBase transition;
            if (toTransitions.TryGetValue(state, out transition)) {
                currentStateTransition = transition;
                foundTransition = true;
            }
        }

        if (!foundTransition) {
            SetState(state);
        }
    }

    void SetState(EGameState state) {
        currentState = state;
        if (stateFunctions.ContainsKey (currentState)) {
            currentStateFunctions = stateFunctions[currentState];
        } else {
            currentStateFunctions = null;
        }
        currentStateTransition = null;
    }

    public void AddKoboto(Koboto koboto) {
        if (kobotos == null) {
            kobotos = new List<Koboto> ();
        }
        kobotos.Add (koboto);
    }



}
