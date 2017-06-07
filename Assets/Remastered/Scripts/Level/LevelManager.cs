using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum ELevelState {
    Unloaded,
    Transition,
    Intro,
    Play
}

[System.Serializable]
public class KobotoSpawnInfo{
    public EKobotoType kobotoType;
    public Transform spawnPoint;
}


public class LevelManager : MonoBehaviour {


    public KobotoSpawnInfo[] kobotoSpawnInfo;

    public ELevelState currentState{ get; private set; }
    LevelStateBase currentStateFunctions;
    LevelStateTransitionBase currentStateTransition;

    Dictionary<ELevelState, LevelStateBase> stateFunctions;
    Dictionary<ELevelState, Dictionary<ELevelState, LevelStateTransitionBase>> stateTransitions;

    [HideInInspector]
    public Transform kobotoParent;
    public List<Koboto> kobotos;

    static LevelManager instance;

    public static LevelManager Instance {
        get { return instance; }
    }

    void Awake() {
        SetupStates ();
        instance = this;
    }
        

	// Use this for initialization
	void Start () {
        currentState = ELevelState.Unloaded;
        TransitionToState(ELevelState.Play);
	}
	

	void Update () {
        if (currentStateTransition != null) {
            bool done = currentStateTransition.Update(this);
            if (done) {
                SetState(currentStateTransition.toState);
            }
        } else if (currentStateFunctions != null) {
            ELevelState desiredState = currentStateFunctions.Update(this);
            if (desiredState != currentState) {
                TransitionToState(desiredState);
            }
        }
		
	}

    void SetupStates() {
        stateFunctions = new Dictionary<ELevelState, LevelStateBase>();
        stateTransitions = new Dictionary<ELevelState, Dictionary<ELevelState, LevelStateTransitionBase>> ();

        stateFunctions.Add(ELevelState.Play, new LevelStatePlay());

        stateTransitions.Add (ELevelState.Unloaded, new Dictionary<ELevelState, LevelStateTransitionBase>());
        stateTransitions[ELevelState.Unloaded].Add (ELevelState.Play, new LevelStateTransitionStartLevel(ELevelState.Unloaded, ELevelState.Play));
    }

    void TransitionToState(ELevelState state) {
        bool foundTransition = false;
        Dictionary<ELevelState, LevelStateTransitionBase> toTransitions;
        if (stateTransitions.TryGetValue(currentState, out toTransitions)) {
            LevelStateTransitionBase transition;
            if (toTransitions.TryGetValue(state, out transition)) {
                currentStateTransition = transition;
                foundTransition = true;
            }
        }

        if (!foundTransition) {
            SetState(state);
        }
    }

    void SetState(ELevelState state) {
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
