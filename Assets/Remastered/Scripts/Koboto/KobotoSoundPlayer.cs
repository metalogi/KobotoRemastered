using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KobotoSoundPlayer : MonoBehaviour {

    public AudioSource rollSound;


    public void PlayRoll(float volume) {
        volume = Mathf.Clamp01 (volume);
        if (!rollSound.isPlaying) {
            rollSound.Play ();
            rollSound.volume = volume;
        } else {
            rollSound.volume = Mathf.Lerp (rollSound.volume, volume, 4f * Time.deltaTime);
        }

    }


    public void StopRoll() {
        rollSound.Stop ();
    }
}
