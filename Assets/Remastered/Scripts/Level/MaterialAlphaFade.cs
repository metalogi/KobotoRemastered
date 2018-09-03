using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MaterialAlphaFade : MonoBehaviour {

    Material[] _materials;

    float _alpha = 1f;
    Color _color;

	void OnEnable()
    {
        GatherMaterials();
    }

    void GatherMaterials()
    {
        List<Material> matList = new List<Material>();

        foreach (var renderer in GetComponentsInChildren<Renderer>())
        {
            matList.Add(renderer.material);
        }
        _materials = matList.ToArray();
    }

    public void Set(float toAlpha)
    {
        StopAllCoroutines();
        SetAlpha(toAlpha);
    }

    public void FadeTo(float toAlpha, float speed = 1f, float delay = 0f)
    {
        StopAllCoroutines();
        StartCoroutine(FadeAlpha(toAlpha, speed, delay));
    }

    void SetAlpha(float alpha)
    {
        this._alpha = alpha;
        _color = new Color(1f, 1f, 1f, _alpha);
        foreach (var m in _materials)
        {
            m.color = _color;
        }
    }

    IEnumerator FadeAlpha(float toAlpha, float speed, float delay)
    {
        yield return new WaitForSeconds(delay);
        if (speed <= 0) speed = 0.1f;
        float time = 0;
        float overTime = Mathf.Abs(toAlpha - _alpha) / speed;
        float fromAlpha = _alpha;
        while (time < overTime)
        {
            float newAlpha = Mathf.Lerp(fromAlpha, toAlpha, time / overTime);
            SetAlpha(newAlpha);
            time += Time.deltaTime;
            yield return null;
        }
        SetAlpha(toAlpha);
    }
}
