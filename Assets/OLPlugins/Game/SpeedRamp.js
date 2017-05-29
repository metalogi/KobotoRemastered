#pragma strict

public var  grabDist : float;
public var speed : float;
public var groundHug : float = 0.6;
public var speedCurve : AnimationCurve;

private var m_junc : Juncore;
private var b_haveJunc : boolean;
private var m_t : float;
private var m_connector : Connector;
private var b_cooling : boolean;
private var b_backwards : boolean;
private var m_pos : Vector3;
private var m_deltaP : Vector3;

function Cooldown() : boolean
{
	return b_cooling;
}

function GetTargetVelocity ( t : float) : Vector3
{
	return speed * m_connector.GetSurfaceTangent(t);
}

function GetSpeed (t : float ) :float
{
	return speed;
}

function ExitV() :Vector3
{
   // if (m_t <= 0) return -Vector3.forward * speed;
    //else return Vector3.forward * speed;
	return m_deltaP.normalized / Time.deltaTime;
}

function Add( junc : Juncore, t : float, backwards : boolean)
{
	m_junc = junc;
	m_t = (t / (m_connector.uvScale.x * 2)) + 0.5;
	b_haveJunc = true;
	b_backwards = backwards;
	m_pos = m_connector.GetSurfacePoint(m_t);
	
}

function LateUpdate()
{
	if (!b_haveJunc) return;
	
	m_t += speed * Time.deltaTime * (b_backwards? -1 : 1);
	
	var newPos = m_connector.GetSurfacePoint(m_t);
	
	m_deltaP = newPos - m_pos;
	
	m_pos = newPos;
    
    var m_normal : Vector3 = Vector3(0, m_deltaP.z, -m_deltaP.y) * (b_backwards? -1 : 1);
	
	m_junc.SetPositionOnSpeedRamp(m_pos, m_normal.normalized);
	
	if ((b_backwards && m_t <= 0) || (!b_backwards && m_t >= 1) )
	{
		StartCoroutine(DoCooldown());
		b_haveJunc = false;
		m_junc.ExitSpeedRamp(this);
	}
	
	
}

function Start()
{
	m_connector = GetComponent(Connector);
}

private function DoCooldown() : IEnumerator
{
	b_cooling = true;
	yield  WaitForSeconds(0.2);
	b_cooling = false;
}
