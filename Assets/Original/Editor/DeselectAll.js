

// using UnityEngine; and using UnityEditor are ommited because
// in Unity Javascript (from now js) they are set by default. 

//public class DeselectAll : ScriptableObject
// public is set by default in js, the colon : in c# corresponds to extends keyword in js
 class DeselectAll extends ScriptableObject
{
// [MenuItem ("Custom/Deselect All _a")] instead of [] js uses the @
// "Custom/Deselect All defines the structure in the Menu, while _a defines the hotkey (a)
// we changed the hotkey in #d which means Shift+d
    @MenuItem ("Custom/Deselect All #d")
    
// static void DoDeselect() changes in static function DoDeselect 
// keyword void is not supported in js. To declare a method in a class 
// we must use the function keyword.
    static  function DoDeselect()
    {
        Selection.objects = new UnityEngine.Object[0];
    }
}