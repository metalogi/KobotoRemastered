#pragma strict

private static var 	_instance 	: SwipeManager;
private static var 	 _hostGO	: GameObject;

private var			_holdDetectDist : float = 7;
private var 		_holdDetectTime  : float = 0.2;

private var 		_swipe : Vector2;
private var 		_swipeDecay : float = 1f;
private var 		_responseCurve : float = 2;

var 				finger : TouchInfo;

class TouchInfo
{
	var state : int; //0 -not touching, 1- touch start, 2- touch down, 3- touch ended
	var touching : boolean; //states 1+2
	var pos : Vector2;
	var delta : Vector2;
	var time : float;
	
	var swipeStart : Vector2;
	var swipeVector : Vector2;
	
	function Swipe() : Vector2
	{
		if (time == 0) return Vector2.zero;
		return swipeVector/time;
	}
	
	

}
	

public static function Instance() : SwipeManager
{
	if (_instance == null)
	{
		_hostGO = new GameObject("SwipeManager");
		_instance = _hostGO.AddComponent(SwipeManager);
	}
	return _instance;
}

function GetHoldDetectTime() : float
{
	return _holdDetectTime;
}

function GetHoldDetectDist() : float
{
	return _holdDetectDist;
}

//function Touching() : boolean
//{
//	return finger.state > 0;
//}

function TouchStarted() : boolean
{
	#if UNITY_EDITOR
	return Input.GetMouseButtonDown(0);
	#elif UNITY_IPHONE
	if (Input.touchCount == 0) return false;
	return (Input.touches[0].phase == TouchPhase.Began);
	#endif
	return false;
}

function Touching() : boolean
{
	#if UNITY_EDITOR
	return Input.GetMouseButton(0);
	#elif UNITY_IPHONE
	if (Input.touchCount == 0) return false;
	return  (Input.touches[0].phase != TouchPhase.Ended && Input.touches[0].phase != TouchPhase.Canceled);
	#endif
	return false;
}

function TouchEnded() : boolean
{
	#if UNITY_EDITOR
	return Input.GetMouseButtonUp(0);
	#elif (UNITY_IPHONE)
	if (Input.touchCount == 0) return false;
	return  (Input.touches[0].phase == TouchPhase.Ended || Input.touches[0].phase == TouchPhase.Canceled);
	#endif
	return false;
}

public function GetSwipe() : Vector2
{
	return (4*_swipe)/Screen.width;
	//return Mathf.Pow(_swipe/Screen.width, _responseCurve);
}

function Start () {
	finger = new TouchInfo(); 
	_swipe = Vector2.zero;

}

function Update () {
	
	finger.delta = Input.mousePosition - finger.pos;
	finger.pos = Input.mousePosition;
	
	if (TouchStarted())
	{
		finger.state = 1;
		finger.time = 0;
		finger.swipeStart = finger.pos;
	}
	else if (Touching())
	{
		finger.state = 2;
		finger.time += Time.deltaTime;
		finger.swipeVector = (finger.pos - finger.swipeStart) / finger.time;
	}
	else if (TouchEnded())
	{
		finger.state = 3;
		finger.time += Time.deltaTime;
		finger.swipeVector = (finger.pos - finger.swipeStart) / finger.time;
	}
	else 
	{
		finger.time = 0;
		finger.state = 0;
		finger.swipeVector = Vector2.Lerp (finger.swipeVector, Vector2.zero, _swipeDecay*Time.deltaTime);
		_swipe = finger.swipeVector;
	}
	/*
	if (finger.time > GetHoldDetectTime())
	{
		if (finger.swipeVector.sqrMagnitude < GetHoldDetectDist())
		{
			_swipe = Vector2.zero;
			return;
		}
	}
	*/
	
	//var oldSwipe : Vector2 = _swipe;
	
	//_swipe = finger.Swipe();
	
	var swipeStength : float = Mathf.Abs(finger.swipeVector.x);
	
	if (	Mathf.Sign(_swipe.x) != Mathf.Sign(finger.swipeVector.x)	||
		 	(Mathf.Abs(_swipe.x) < swipeStength)		||
		 	(swipeStength < 10 && finger.time > 0.3)
		 	)
		 		
	{
		_swipe = finger.swipeVector;
	}
	
	
	/*
	if (finger.state == 0)
	{
		finger.swipeVector = Vector2.Lerp (finger.swipeVector, Vector2.zero, _swipeDecay*Time.deltaTime);
		//if (_swipe.sqrMagnitude < oldSwipe.sqrMagnitude)
		//{
		//	_swipe = Vector2.Lerp (oldSwipe, _swipe, _swipeDecay*Time.deltaTime);
		//}
	}
	*/
	
	
		
		
	

}