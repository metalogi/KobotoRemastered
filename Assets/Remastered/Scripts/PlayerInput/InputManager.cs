using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum EInputType {
    Keys,
    Swipe,
    Tilt
}

public class InputData {
    public float move;
    public float brake;
}

public class InputManager : MonoBehaviour {

    static InputManager instance;
    EInputType inputType;

    Dictionary<EInputType, InputModule> inputModules;
    HashSet<InputModule> activeModules;

    float inputValue;
    InputData data;

    public static InputManager Instance {
        get {
            return instance;
        }
    }

	void Awake() {
        if (instance != null) {
            Destroy(gameObject);
            return;
        }
        instance = this;

        data = new InputData();
        activeModules = new HashSet<InputModule>();
        inputModules = new Dictionary<EInputType, InputModule>();
        inputModules.Add(EInputType.Swipe, GetComponent<InputModuleSwipe>());
        inputModules.Add(EInputType.Keys, GetComponent<InputModuleKeys>());
        inputModules.Add(EInputType.Tilt, GetComponent<InputModuleTilt>());

        foreach (var module in inputModules.Values) {
            module.Enable(false);
        }

        #if (UNITY_EDITOR)
        EnableInputType(EInputType.Keys, true);
        #endif
	}
	
    public void EnableInputType(EInputType type, bool e) {
        InputModule module = inputModules[type];

        module.Enable(e);
        if (e) {
            activeModules.Add(module);
        } else {
            activeModules.Remove(module);
        }
    }

    public InputData Read() {
        return data;
    }

    public void FixedUpdate() {
        data.move = 0f;

        foreach (InputModule module in activeModules) {
            data.move += module.Read();
        }

    }

}
