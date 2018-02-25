using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public interface IBreaker {
    bool IBreakerActive();
}

public class LevelObjectBreakable : LevelObjectBase {

    public int disintegrateAfter = 1;
    public GameObject destructionFX;
    public bool startBreakable;

    private AudioSource hitSound;
    private Rigidbody rigidBody;
    private int collisionCount = 0;

    private Vector3 startPos;
    private Quaternion startRot;
    private bool breakable;

    public float colThreshold = 20f;

    public void MakeBreakable(bool b) {
        breakable = b;
        rigidBody.isKinematic = !b;
    }

    public override void Awake() {
        base.Awake();
        startPos = transform.position;
        startRot = transform.rotation;
        hitSound = GetComponent<AudioSource>();
        rigidBody = GetComponent<Rigidbody>();
    }

    void Reset()
    {
        rigidBody.isKinematic = true;
        transform.position = startPos;
        transform.rotation = startRot;
        GetComponent<Renderer>().enabled = true;
        GetComponent<Collider>().isTrigger = false;
        MakeBreakable(startBreakable);
    }

    protected override void DidEnterGameState(EGameState gameState, EGameState fromState)
    {
        base.DidEnterGameState(gameState, fromState);
        if (gameState == EGameState.Intro || (gameState == EGameState.Play && (fromState != EGameState.Paused && fromState != EGameState.Map)))
        {
            Reset();
        }
    }
    
    public void OnCollisionEnter(Collision collision) {
        float colSpeed = collision.relativeVelocity.magnitude;
        if (hitSound != null && (colSpeed > colThreshold))
        {
            hitSound.volume = Mathf.Lerp(0.1f, 1f, (colSpeed - colThreshold) / (400f));
            hitSound.Play();

        }
        if (breakable && colSpeed > colThreshold) collisionCount++;
        if (disintegrateAfter > 0 && collisionCount >= disintegrateAfter) Disintegrate();
    }
    void Disintegrate()
    {
        breakable = false;
        if (GetComponent<Renderer>().enabled)
        {
 
            GetComponent<Renderer>().enabled = false;
            GetComponent<Collider>().isTrigger = true;
            rigidBody.isKinematic = true;
            if (destructionFX != null)
            {
                Instantiate(destructionFX, transform.position, Quaternion.identity);
            }
                

            
        }
    }

}


	

