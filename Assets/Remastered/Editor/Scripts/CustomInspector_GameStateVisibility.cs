using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

[CustomEditor (typeof(GameStateVisibilty))]
public class CustomInspector_GameStateVisibility : Editor {

    SerializedProperty stateMaskProperty;

    void OnEnable() {
        stateMaskProperty = serializedObject.FindProperty("stateMask");
    }

    public override void OnInspectorGUI() {
        serializedObject.Update();  
        stateMaskProperty.intValue = (int)(EGameState)EditorGUILayout.EnumMaskPopup("Active states" , (EGameState)stateMaskProperty.intValue);
        serializedObject.ApplyModifiedProperties();
    }
}
