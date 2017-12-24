using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

public enum MusicTrack {
    Theme,
    Map,
    Pause,
    World1,
    World2,
    World3,
    WinLevel,
}

public class MusicPlayer : MonoBehaviour {

    static Dictionary<MusicTrack, string> trackResoucePaths = new Dictionary<MusicTrack, string>() {
        {MusicTrack.Theme, "Music/kubrik_theme"},
        {MusicTrack.Map, "Music/kubrik_map"},
        {MusicTrack.Pause, "Music/kubrik_pause"},
        {MusicTrack.World1, "Music/kubrik_world1"},
        {MusicTrack.World2, "Music/kubrik_world2"},
        {MusicTrack.World3, "Music/kubrik_world3"},
        {MusicTrack.WinLevel, "Music/kubrik_levelWin"}
    };
	
    static MusicPlayer instance;

    public static MusicPlayer Instance {
        get {
            if (instance == null) {
                instance = MusicPlayer.Instantiate (Resources.Load<MusicPlayer> ("Music/MusicPlayer"));
            }
            return instance;
        }
    }

    public AudioMixerGroup mixerGroup;

    MusicTrack currentTrack;
    MusicTrack fadeToTrack;
    AudioSource currentSource;
    bool inFade;

    Dictionary<MusicTrack, AudioSource> loadedTracks;


    public void PlayTrack(MusicTrack track, bool unloadOtherTracks, float fadeTime = 0.05f) {
        Debug.Log ("Play track " + track);
      
        if (currentSource != null && currentTrack == track) {
            if (!currentSource.isPlaying) {
                currentSource.UnPause();
            }
            return;
        }

        if (!inFade) {
            StartCoroutine (FadeInTrack (track, unloadOtherTracks, fadeTime));
        } else {
            fadeToTrack = track;
        }
    }

    IEnumerator FadeInTrack(MusicTrack track,  bool unloadOtherTracks, float fadeTime) {
        inFade = true;
        fadeToTrack = track;
        AudioSource oldSource = currentSource;

        AudioSource fadeToSource = GetSource (track);

        fadeToSource.transform.parent = transform;
        fadeToSource.outputAudioMixerGroup = mixerGroup;

        fadeToSource.volume = 0f;
        if (fadeToSource.isPlaying) {
            fadeToSource.UnPause ();
        } else {
            fadeToSource.Play ();
        }

        float dT = Time.deltaTime / fadeTime;
        float t = 0;
        while (t < 1f) {
            fadeToSource.volume = t;
            if (oldSource != null) {
                oldSource.volume = 1f - t;
            }
            t += dT;
            yield return null;
        }
        fadeToSource.volume = 1f;

        if (oldSource != null) {
            oldSource.volume = 0f;
            oldSource.Pause ();
        }

        currentSource = fadeToSource;
        currentTrack = fadeToTrack;

        if (unloadOtherTracks) {
            
            foreach(MusicTrack unload in loadedTracks.Keys) {
                if (unload != currentTrack) {
                    GameObject.Destroy(loadedTracks [unload].gameObject);
                }
            }
            loadedTracks.Clear ();
            loadedTracks [currentTrack] = currentSource;

        }
            
        inFade = false;
    }

    AudioSource GetSource(MusicTrack track) {
        if (loadedTracks == null) {
            loadedTracks = new Dictionary<MusicTrack, AudioSource> ();
        }

        AudioSource source = null;

        if (!loadedTracks.TryGetValue (track, out source)) {
            source = AudioSource.Instantiate (Resources.Load<AudioSource> (trackResoucePaths [track]));;
            loadedTracks [track] = source;
        }

        return source;

      
    }
}
