var fuel : float =50;  //fuel lasts for this many seconds
var thrust : float = 5000;
var startThrust :float= 5000;
var endThrust : float =0;
var yComp : float =0.1;

private var timer:float;
private var ad :Addon;
private var hostJuncore : Juncore;

var spentJetpack : GameObject;

var thrustCount:float;
var burn : boolean;

function Awake()
{
	
	
	
}

function Activate()
{
	ad = GetComponent(Addon);
	hostJuncore = ad.GetJunction();
	timer =fuel;
	thrustCount =0;
	burn = true;
	//yield BurnFuel();
	//Die();
}


function BurnFuel()
{
	hostJuncore.airborneTime = 0;
	timer =fuel;
	thrustCount =0;
while (timer>0)
	{
		thrust = Mathf.Lerp(startThrust, endThrust, (1-timer/fuel));
		thrustCount += thrust;
		//print ("Jet Thrust!!! " + thrust);
		timer -= Time.deltaTime;
		yield;
		
	}
}

function Die () {
	PlayerPrefs.SetInt("JetPacksUsed", PlayerPrefs.GetInt("JetPacksUsed",0)+1);
	print ("used " + PlayerPrefs.GetInt("JetPacksUsed",0) + "jetpacks");
	print ("total Thrust = " + thrustCount);
	hostJuncore.RemoveJetpack();
	Destroy(gameObject);
	var spent : GameObject = Instantiate (spentJetpack, transform.position, transform.rotation);
	spent.GetComponent.<Rigidbody>().velocity =0.5*hostJuncore.ridge.velocity;
	spent.GetComponent.<Rigidbody>().angularVelocity =5*Random.insideUnitSphere;
	var spentMat : Material =spent.GetComponent.<Renderer>().material;
	//yield BurnFuel();
	yield WaitForSeconds(2);

	Destroy(spent);
	
		
}

function FixedUpdate()
{
	if (burn)
	{
		thrust = Mathf.Lerp(startThrust, endThrust, (1-timer/fuel));
		thrustCount += thrust;
		//print ("Jet Thrust!!! " + thrust);
		timer -= Time.deltaTime;
		if (timer<0)
		{
			burn =false;
			Die();
		}
	}
}


