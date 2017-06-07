using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum EKobotoType {
	TreeGuy,
	Poyo
}

public class KobotoFactory  {
	static Dictionary<EKobotoType, GameObject> templates;


    public static Koboto SpawnKoboto(EKobotoType type, Vector3 position, Transform parent) {
		if (templates == null) {
            templates = new Dictionary<EKobotoType, GameObject>();
		}

		GameObject template = null;
		if (!templates.TryGetValue(type, out template)) {
			template = Resources.Load<GameObject>("Prefabs/Kobotos/" + type.ToString());
			templates[type] = template;
		}

        var kobotoObj = GameObject.Instantiate(template, position, Quaternion.identity, parent);
        return kobotoObj.GetComponent<Koboto>();

	}
}
