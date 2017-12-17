
function Start () {
	Screen.orientation = ScreenOrientation.LandscapeLeft;
	yield WaitForSeconds(0.12);
	//if (Screen.width == 1024) Application.LoadLevel("splash_ipad");
	//else
	Application.LoadLevel(1);
}