var itemName = "Speed";

function Update () 
{
}

function ResetState()
{
	GetComponent.<Renderer>().enabled = true;
}

function OnTriggerEnter( other : Collider )
{
   if( GetComponent.<Renderer>().enabled )
   {
	   var go = other.gameObject;
	   if( go && go.GetComponent(Juncore) )
	   {
	   	  var jc:Juncore = go.GetComponent(Juncore);
   	  
  	 	  if( jc.itemName == "" )
   		  {
   	  		 GetComponent.<Renderer>().enabled = false;
   	  		 jc.itemName = itemName;
			 //jc.cam.PwUpCollectSound();
	   	  }
	   }
   }
}