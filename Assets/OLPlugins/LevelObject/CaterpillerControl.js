var cam :CameraManager ;

function Awake()
{
	cam = GetComponent.<Camera>().main.GetComponent(CameraManager);
}
function OnTriggerEnter (col:Collider) {
	var catFood : CaterpillerFood = col.GetComponent(CaterpillerFood);
	if (catFood) 
	{
		catFood.TurnOn();
		catFood.cat.Walk(catFood);
		cam.SetInterest(col.transform,0.3);
		
	}
}


function OnTriggerStay (col:Collider) {
	var catFood : CaterpillerFood = col.GetComponent(CaterpillerFood);
	if (catFood && !catFood.seen) 
	{
		if (!catFood.cat.walking &&!catFood.cat.eating)
		{
		catFood.cat.Walk(catFood);
		cam.SetInterest(col.transform,0.3);
		//cam.interest = col.transform;
		//cam.interestWeight = 0.3;
		}
		
	}
}