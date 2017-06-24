
var anims :Animation[];
function Load () {
	var aud:AudioSource = GetComponent(AudioSource);
	if (aud) aud.Play();
	for (var anim: Animation in anims) anim.Play();
	
}