
class JuncSoundFix  extends ScriptableObject
{
	@MenuItem ("Custom/JuncSounds") 
	static function JuncSoundFixx()
	{
		var Selection : Transform[]=Selection.transforms;
		var junc:Juncore = Selection[0].GetComponent(Juncore);
		
		if (junc)
		{
			var sound : KobotoSounds = Selection[0].gameObject.GetComponent(KobotoSounds);
			if (!sound) sound=Selection[0].gameObject.AddComponent(KobotoSounds);
			sound.whoop = new AudioSource[3];
			for (var aud:AudioSource in Selection[0].gameObject.GetComponentsInChildren(AudioSource))
			{
				if (aud.name == "boing") sound.springBoing =aud;
				if (aud.name == "celebrate") sound.celebrate =aud;
				if (aud.name == "excited") sound.excited =aud;
				if (aud.name == "fall") {sound.fall =aud;sound.death=aud;}
				if (aud.name == "impact") sound.impact =aud;
				if (aud.name == "roll") sound.roll =aud;
				if (aud.name == "whoop1") sound.whoop[0] =aud;
				if (aud.name == "whoop2") sound.whoop[1] =aud;
				if (aud.name == "whoop3") sound.whoop[2] =aud;
				
				
			}
			
		}
	}
}