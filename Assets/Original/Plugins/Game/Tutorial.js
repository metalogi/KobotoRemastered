var TutorialText:String[];
var TutorialImage:Texture2D[];
var TutRect:Rect[];
var Highlights:GameObject[];
var gen:GenericFunctions;

var on:boolean[];

var activeT:int = -1;
var AlreadyPlayed:boolean[];

function Start () {
	gen=GetComponent(GenericFunctions);
	var total:int =TutorialImage.length;
	AlreadyPlayed=new boolean[total];
	for (var i:int=0;i<total;i++) AlreadyPlayed[i] =false;
}

function PlayTutorial(num:int)
{	
	yield WaitFor(0.8);
	if ((!AlreadyPlayed[num])&&(on[num]))
	{
	AlreadyPlayed[num]=true;
	activeT=num;
	if (activeT>=0) 
		{
			print ("Starting " + Time.time);
			//yield WaitForTap();
		}
	}
}

function Update()
{
	
}

function OnGUI()
{
	if (activeT>=0) 
	{
		GUI.Label(TutRect[activeT],TutorialText[activeT],"Box");
		
	}
	
}

function WaitForTap()
{
	var tap:boolean =false;
	Time.timeScale=0;
	 while(!tap)
	{	print("noTap");
		if (gen.NewTouch()) {Time.timeScale=1;activeT=-1;print("tap");tap=true;}
		yield;
	}
}
function WaitFor(t:float)
{	
	yield WaitForSeconds(t);
	print ("WaitAndPrint "+ Time.time);
	
}