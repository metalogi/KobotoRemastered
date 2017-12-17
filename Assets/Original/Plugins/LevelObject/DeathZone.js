var drown:boolean= false;
var grab:boolean = true;
var stomp : boolean = false;
var spike :boolean =false;
var on  : boolean =true;
function OnTriggerEnter (col:Collider) {
	var Junc:Juncore = col.GetComponent(Juncore);
	if(Junc&&on&&!Junc.saved)
	{
		if (spike) {PlayerPrefs.SetInt("ImpaledKobotos", PlayerPrefs.GetInt("ImpaledKobotos",0)+1);}
		if (stomp) {PlayerPrefs.SetInt("SquashedKobotos", PlayerPrefs.GetInt("SquashedKobotos",0)+1);Junc.trans.localScale.y = 0.1;}
		print("Die!!!!!");
		if (grab) Junc.SetParent(gameObject, Vector3.zero);
		else if (!drown) Junc.Pause();
		
		if (drown) {PlayerPrefs.SetInt("DrownedKobotos", PlayerPrefs.GetInt("DrownedKobotos",0)+1);Junc.Drown();}
		else Junc.Kill();
		
		
		
	}
}