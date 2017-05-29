// script for opening and closing the parachute component

var on = false;
var closeAudio : AudioSource; 
// sound effects are all scattered about.
// the loop is on this object, the open sound is on the parent, and the close sound is...wherever we say

function Awake()
{var aud:AudioSource=GetComponent(AudioSource);
	aud.Stop();
	on=false;
}

// open and close the parachute
function SetOn( von : boolean ) 
{
 var aud:AudioSource =transform.parent.GetComponent(AudioSource);
var meshR:MeshRenderer =GetComponent(MeshRenderer);
	if( !on && von ) 
	{
		aud.Play();
		meshR.enabled = true;
		on =true;
	}
	if( !von ) 
	{	
		//print("switch off parachute");
		if (on) closeAudio.Play();
		meshR.enabled=false;
		on =false;	
		
	}

	//on = von; 
	
	
	
	// start/stop the sounds loop
	//if( on ) { aud.loop = true; aud.Play(); }
	//else { aud.loop = false; aud.Stop(); }
}
function GetOn() : boolean { return on; }