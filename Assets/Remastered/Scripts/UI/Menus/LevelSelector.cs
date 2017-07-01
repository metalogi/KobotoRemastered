using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LevelSelector : MonoBehaviour {

    public Animator cardAnimator;
    public Text levelTitle;
    public Button playButton;

    private int levelNumber ;

    private WorldMap worldMap;

    public void Setup(WorldMap worldMap, int levelNumber) {
        this.worldMap = worldMap;
        this.levelNumber = levelNumber;
        playButton.onClick.AddListener(PlayLevel);
        levelTitle.text = "Level " + levelNumber.ToString();

    }

    public void Show(bool show) {
        Debug.Log("Showing card " + levelNumber + " " + show);
        cardAnimator.SetBool("Visible", show);
    }

    public void PlayLevel() {
     //   cardAnimator.SetBool("Visible", show);
    }

    public void OnSelect() {
        Debug.Log("Level selector " + levelNumber);
        worldMap.SelectLevel(this);
    }
        


}
