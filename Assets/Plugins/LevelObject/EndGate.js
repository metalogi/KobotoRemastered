private var gen : GenericFunctions;
private var sim : SimManager;
private var man :UIManager;
private var editor : UIEditor;
private var boxC:BoxCollider;
var endCamera:Transform;
var fireworks:fireworks;
var occupied:boolean;

var bonusTokens : BonusToken[];

function Awake()
{
	gen = FindObjectOfType(GenericFunctions);
	sim = FindObjectOfType(SimManager);
	man =FindObjectOfType(UIManager);
	editor = FindObjectOfType(UIEditor);
	occupied=false;
	boxC=GetComponent(BoxCollider);
	bonusTokens = FindObjectsOfType(BonusToken);
//	sim = coreObject.GetComponent(SimManager);
}

// if a creature enters the endpoint
function OnTriggerEnter( other : Collider )
{
	var GO = other.gameObject;
	// only junction core objects on the critterCore layer
	if( GO.layer == 9 && GO.GetComponent(Juncore) &&!occupied)
	{
		occupied = true;
		
		var junc:Juncore=GO.GetComponent(Juncore);
		junc.Celebrate(transform);
		GetComponent.<Animation>().Play();
		
		junc.ridge.isKinematic=true;
		if (sim.RequestJunctionList().length >1 && sim.rescued ==0) yield WaitForSeconds(1.5);
		junc.saved=true;
		//boxC.size *=1.3;
		var cam = sim.GetCameraManager();
		cam.offScreenJunc =null;
		sim.Rescue();
		print("there are: " + sim.RequestJunctionList().length + " kobotos");
		print ("you have saved " + sim.GetRescued() + " of them");
		
		if (sim.RequestJunctionList().length >1)
		{
			boxC.isTrigger=false;
			
			editor.SelectedKoboto = junc.otherJunc.gameObject;
			cam.SetSimTarget( junc.otherJunc.gameObject);
			junc.otherJunc.TurnOn();
			//if ( sim.RequestJunctionList()[0] == GO)
			//editor.SelectedKoboto = sim.RequestJunctionList()[1];
			//else editor.SelectedKoboto = sim.RequestJunctionList()[0];
		}
		
		
		
		
		//cam.CutAway(this.gameObject, 1.5);
		
		
		if ((sim.GetRescued() == sim.GetNumGates()))
		{
			boxC.isTrigger=true;
			//cam.CutAway(this.gameObject, 1.5);
		//PlayerPrefs.SetInt("LevelsCompleted", Mathf.Max(PlayerPrefs.GetInt("CurrentLevel")+1, PlayerPrefs.GetInt("LevelsCompleted")));
		sim.SetComplete();
		man.SimComplete();
		//sim.Deactivate();
		var bti : int =0;
		for (var bt : BonusToken in bonusTokens)
		{
			if (bt.freshlyFound) bt.Celebrate(transform,bti);
			bti++;
		}
		if (fireworks) fireworks.TurnOn();
		
		
		
		//cam.SetEditorTarget(GO);
//		print( transform.rotation.y );
		//cam.SetEditorSpin(transform.rotation.y*180);
		
		cam.SetEndCamera(endCamera);
		//man.SetGameMode(4);
		
		}
		//occupied=true;
	}
}

function Update()
{
	//if (animation.isPlaying) print("houseAnim");
}

function Reset(v:boolean)
{
	occupied=false;
	boxC.isTrigger=true;
}