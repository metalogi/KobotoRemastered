using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LevelSelector : MonoBehaviour {

    public Animator cardAnimator;
    public Animator houseAnimator;
    public GameObject arrow;
    public Text levelTitle;
    public Button playButton;
    public CanvasGroup selectorButtonGroup;

    private int levelNumber ;

    private WorldMap worldMap;

    bool showingCard;

    public void Setup(WorldMap worldMap, int levelNumber, bool unlocked, bool selected) {
        if (!unlocked) {
            gameObject.SetActive (false);
            return;
        }
        this.worldMap = worldMap;
        this.levelNumber = levelNumber;
        playButton.onClick.AddListener(PlayLevel);
        levelTitle.text = "Level " + levelNumber.ToString();

    }

    public void Show(bool show) {
        showingCard = show;
        Debug.Log("Showing card " + levelNumber + " " + show);
        cardAnimator.SetBool("Visible", show);

        if (!show) {
            houseAnimator.SetTrigger("Normal");
        }

        //selectorButtonGroup.interactable = selectorButtonGroup.blocksRaycasts = !show;

    }

    public void PlayLevel() {

        worldMap.PlayLevel(levelNumber);
    }

    public void OnSelect() {

        if (showingCard) {
            PlayLevel();
            
        } else {
            Debug.Log("Level selector " + levelNumber);
            worldMap.SelectLevel(this);
        }

    }

    public void Highlight(bool highlighted) {
        arrow.SetActive (highlighted);
    }
        


}
