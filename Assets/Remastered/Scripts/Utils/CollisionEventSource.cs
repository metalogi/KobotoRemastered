using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public delegate void TriggerEventHandler(CollisionEventSource source, Collider collider);
public delegate void CollisionEventHandler(CollisionEventSource source, Collider collider, Collision collision);

public class CollisionEventSource : MonoBehaviour {

    public bool includeTriggers = true;

	public event CollisionEventHandler onCollisionEnter;
    public event CollisionEventHandler onCollisionExit;

    public event TriggerEventHandler onTriggerEnter;
    public event TriggerEventHandler onTriggerExit;

    public void OnCollisionEnter(Collision collision) {
        if (onCollisionEnter != null) {
            onCollisionEnter(this, collision.collider, collision);
        } 
    }

    public void OnCollisionExit(Collision collision) {
        if (onCollisionExit != null) {
            onCollisionExit(this, collision.collider, collision);
        }
    }

    public void OnTriggerEnter(Collider other) {
        if (onTriggerEnter != null) {
            onTriggerEnter(this, other);
        }
    }


    public void OnTriggerExit(Collider other) {
        if (onTriggerExit != null) {
            onTriggerExit(this, other);
        }
    }

}
