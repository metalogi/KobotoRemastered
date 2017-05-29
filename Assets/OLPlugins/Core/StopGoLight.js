var stopTexture : Texture2D;
var goTexture : Texture2D;

var onSound : AudioSource;
var offSound : AudioSource;

var on = true;

// turn the stoplight on or off
function GoMe()
{
	on = true;
	onSound.Play();
}
function StopMe()
{
	on = false;
	offSound.Play();
}
function SetOn( von ) { if( von ) GoMe(); else StopMe(); }
function GetOn() { return on; }

// turn the gui visibility on or off
var visOn = true;
function SetGuiVis( von )
{
   visOn = von;
}
// display the gui graphic for the traffic light
function OnGUI()
{
   if( visOn )
   {
      var camera : Camera = FindObjectOfType( Camera );
      var pos : Vector3 = camera.WorldToScreenPoint( transform.position );
      var posTop : Vector3 = camera.WorldToScreenPoint( transform.position + Vector3(0,.5*transform.localScale.y*3,0) );
      var size = posTop.y - pos.y;
      GUI.Label( Rect( pos.x-size, (Screen.height-pos.y)-size, size*2, size*2), on ? goTexture : stopTexture );
   }
}
