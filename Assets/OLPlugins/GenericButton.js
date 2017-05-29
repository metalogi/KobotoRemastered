
class GenericButton 
{
	
var baseRect : Rect;
var touchRect : Rect;


var tex : Texture2D;
var altTex : Texture2D;

public var tempRect : Rect;

function SetTex(textureName : String)
{
	tex = Resources.Load(textureName);
	if (!tex) Debug.Log ("ERROR!!  Can't Find " + textureName);
}

function SetAltTex(textureName : String)
{
	altTex = Resources.Load(textureName);
	if (!altTex) Debug.Log ("ERROR!!  Can't Find " + textureName);
}

function SetRect(centerX:float, centerY:float, size:float)
{
	var width:float = size*Screen.width /2;
	baseRect=Rect( centerX*Screen.width -width, centerY*Screen.height-width, size*Screen.width, size*Screen.width);
	//Debug.Log(baseRect.ToString());
	SetTouchRect(1.5);
}

function SetRect2(centerX:float, centerY:float, sizex:float, sizey:float)
{
	var width:float = sizex*Screen.width /2;
	var hight:float = sizey*Screen.height /2;
	baseRect=Rect( centerX*Screen.width -width, centerY*Screen.height-hight, sizex*Screen.width, sizey*Screen.height);
	//Debug.Log(baseRect.ToString());
	SetTouchRect(1.5);
}

function SetTouchRect(scale : float)
{
	touchRect.x = baseRect.x -(scale-1) *0.5*baseRect.width;
	touchRect.y = baseRect.y - (scale-1) *0.5*baseRect.width;
	touchRect.width = baseRect.width*scale;
	touchRect.height = baseRect.width*scale;
}

function GetTouchRect () //make scaled up Rect for touching
{
	
	
	return touchRect;
}

function Show(n :int)
{
	//if (n==1) GUI.Label(baseRect, GUIContent(altTex));
	//else GUI.Label(baseRect, GUIContent(tex));
	if (n==1) GUI.DrawTexture(baseRect, altTex);
	else GUI.DrawTexture(baseRect, tex);
}

 public function Press()
{
	var returnValue: boolean = true;
	 tempRect  = baseRect;
	baseRect=Rect(baseRect.x-baseRect.width*0.06,baseRect.y-baseRect.width*0.06, baseRect.width*1.2, baseRect.height*1.2);
	Debug.Log("press");
	//Unpress();
	return returnValue;
	
}

function ShowScaled(s:float, n:int)
{
	if (s==1.0) Show(n);
	else
	{
	var scaledRect : Rect;
	
	scaledRect=Rect(baseRect.x-baseRect.width*(s-1.0)*0.5,baseRect.y-baseRect.width*(s-1.0)*0.5, baseRect.width*s, baseRect.height*s);
	// if (n==1) GUI.Label(scaledRect, GUIContent(altTex));
	 //else GUI.Label(scaledRect, GUIContent(tex));
	 if (n==1) GUI.DrawTexture(scaledRect, altTex);
	else GUI.DrawTexture(scaledRect, tex);
	}
	
	
}

function Unpress()
{
	var returnValue: boolean = true;
	//yield WaitForSeconds(0.04);
	baseRect=tempRect;
	//baseRect=Rect(baseRect.x,baseRect.y, baseRect.width/1.2, baseRect.height/1.2);
	Debug.Log("unpress");
	
	return returnValue;
}

public  function TestF()
{
	var returnValue: boolean = true;
	Debug.Log("test");
	return returnValue;
	
}


}