using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttachmentHammer : AttachmentBase, IBreaker {

    //public CollisionEventSource hammerCollider;

    public float swing;

    public float breakStart = 0.1f;
    public float breakEnd = 0.25f;

    float breakTimer;
    Rigidbody hammerBody;
    ConfigurableJoint hammerJoint;

    bool breakActive;

    public override void OnAttachToKoboto(Koboto koboto) {
        base.OnAttachToKoboto(koboto);
        hammerBody = GetComponent<Rigidbody>();
        hammerJoint = GetComponent<ConfigurableJoint>();

        hammerJoint.connectedBody = koboto.GetComponent<Rigidbody>();
        hammerJoint.connectedAnchor = koboto.transform.InverseTransformPoint(transform.position);

        breakTimer = 0f ;
        
 
    }

    public void FixedUpdate() {
        if (hammerJoint == null) {
            return;
        }
        
        hammerJoint.targetRotation = Quaternion.Euler(-swing * 90, 0, 0);
        breakTimer += Time.fixedDeltaTime;
    }


    public bool IBreakerActive()
    {
        return breakTimer > breakStart && breakTimer <= breakEnd;
    }




}
