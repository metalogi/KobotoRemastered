#pragma strict

public var PauseButton 	: GameObject;
public var MapButton 	: GameObject;
public var BackButton	: GameObject;
public var ComponentButtons : GameObject[];

private static var _instance : GameHudManager;

private var 	_numComponentButtons 	: int = 0;
private var 	_mode 					: MODE;

private var		_gen	: GenericFunctions;
private var 	_cam 	: CameraManager;
private var 	_sim	: SimManager;
private var 	_man	: UIManager;
private var 	_editor : UIEditor;

private var  _gmode : int;

enum MODE
{
	OFF,
	GAME,
	MAP,
	PAUSEMENU
}


public static function Instance()
{
	if (_instance == null)
	{
		_instance = GameObject.FindObjectOfType(GameHudManager);
	}
	return _instance;
}

public function MapMode(toggle : boolean)
{
	MapButton.SetActiveRecursively(!toggle);
	BackButton.SetActiveRecursively(toggle);
}

function Update()
{
 	if (_man == null) return;
 	if (_gmode == _man.gameMode) return;
 	
 	SetModeFromGameMode(_man.gameMode);
}
 	
 	
 function SetModeFromGameMode(gameMode : int)
 {
	if (gameMode == 1) SetMode(MODE.GAME);
	if (gameMode == 2) SetMode(MODE.OFF); // introCam
	if (gameMode == 3) SetMode(MODE.PAUSEMENU);
	if (gameMode == 4) SetMode(MODE.OFF); //end menu
	if (gameMode == 5) SetMode(MODE.MAP);
}

public function SetMode (mode : MODE)
{
	_mode = mode;
	var i : int;
	switch (_mode)
	{
		case(MODE.OFF):
		HideAll();
		break;
		
		case(MODE.GAME):
		MapButton.SetActiveRecursively(true);
		BackButton.SetActiveRecursively(false);
		PauseButton.SetActiveRecursively(true);
		ShowComponentButtons(true);
	
		break;
		
		case(MODE.PAUSEMENU):
		MapButton.SetActiveRecursively(false);
		BackButton.SetActiveRecursively(false);
		PauseButton.SetActiveRecursively(false);
		ShowComponentButtons(false);
		break;
		
		
		case (MODE.MAP):
		MapButton.SetActiveRecursively(false);
		BackButton.SetActiveRecursively(true);
		PauseButton.SetActiveRecursively(true);
		ShowComponentButtons(false);
		break;
		
		
		
	}
}

function ShowComponentButtons(toggle : boolean)
{
	for (var i : int = 0; i < ComponentButtons.length; i++)
	{
		if (toggle && i<_numComponentButtons) ComponentButtons[i].SetActiveRecursively(true);
		else ComponentButtons[i].SetActiveRecursively(false);
	}
}


public function HideAll()
{
	
	MapButton.SetActiveRecursively(false);
	BackButton.SetActiveRecursively(false);
	PauseButton.SetActiveRecursively(false);
	for ( var i :int = 0; i < ComponentButtons.length; i++)
	{
		ComponentButtons[i].SetActiveRecursively(false);
	}
	
}

public function PauseButtonClicked()
{
	SetMode(MODE.PAUSEMENU);
	_cam.KobotoSound();
	_gen.GlobalPause(true);
	_gen.MuteSound();
}

public function MapButtonClicked()
{
	_man.MapButtonPressed();
}

public function BackButtonClicked()
{
	_cam.EndLookMode();
	_cam.ZoomInSound();
}

public function ContinueButtonClicked()
{
	SetMode(MODE.GAME);
}


function Start () {
	_cam = FindObjectOfType(CameraManager);
	_gen = FindObjectOfType(GenericFunctions);
	_sim = FindObjectOfType(SimManager);
	_man = FindObjectOfType(UIManager);
	_editor = FindObjectOfType(UIEditor);
	
	PauseButton.AddComponent(UIPauseButton);
	MapButton.AddComponent(UIMapButton);
	BackButton.AddComponent(UIMapBackButton);
	
	SetMode(MODE.OFF);
 	
}

