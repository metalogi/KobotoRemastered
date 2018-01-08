using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentHammer : AttachmentBase {

    public CollisionEventSource hammerCollider;

    public float swing;
    Rigidbody hammerBody;
    ConfigurableJoint hammerJoint;

    bool hitReady;

    public override void OnAttachToKoboto(Koboto koboto) {
        base.OnAttachToKoboto(koboto);
        hammerBody = GetComponent<Rigidbody>();
        hammerJoint = GetComponent<ConfigurableJoint>();

        hammerJoint.connectedBody = koboto.GetComponent<Rigidbody>();
        hammerJoint.connectedAnchor = koboto.transform.InverseTransformPoint(transform.position);
 
    }

    public void FixedUpdate() {
        if (hammerJoint == null) {
            return;
        }
        hammerJoint.targetRotation = Quaternion.Euler(-swing * 90, 0, 0);
    }

    public void OnEnable() {
        hammerCollider.enabled = true;
        hammerCollider.onCollisionEnter += HammerDidHit;

        
       
    }

    public void OnDisable() {
        hammerCollider.onCollisionEnter -= HammerDidHit;
    
        hammerCollider.enabled = false;
    }

    public void HammerDidHit(CollisionEventSource source, Collider collider, Collision collision) {
        if (hitReady) {
            var target = collision.gameObject.GetComponent<Hammerable>();
            if (target != null) {
                hitReady = !target.HitByHammer(this);
            }
        }
    }


}
