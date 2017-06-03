using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Koboto : MonoBehaviour {

    Dictionary<EAttachmentTarget, Transform> attachmentPointLookup;

    Dictionary<EAttachmentTarget, AttachmentBase> currentAttachments;
    BoxCollider boxCollider;
    Vector3 colliderBaseCenter;
    Vector3 colliderBaseSize;

    Vector3 colliderCenterTarget;
    Vector3 colliderSizeTarget;

    public void Awake() {
        boxCollider = GetComponent<BoxCollider>();
        colliderBaseCenter = boxCollider.center;
        colliderBaseSize = boxCollider.size;
        currentAttachments = new Dictionary<EAttachmentTarget, AttachmentBase>();
        attachmentPointLookup = new Dictionary<EAttachmentTarget, Transform>();
        var attachPoints = GetComponentsInChildren<KobotoAttachPoint>();
        foreach (var point in attachPoints) {
            attachmentPointLookup.Add(point.targetType, point.transform);
        }


        AddAttachment(EAttachmentType.Wheels);



    }



    public void AddAttachment(EAttachmentType type) {
        var attachment = Attachments.CreateNewAttachment(type);

        Transform attachToTransform = GetAttachmentTargetTransform(attachment.attachmentTarget);
        attachment.transform.SetParent(attachToTransform, false);
        currentAttachments[attachment.attachmentTarget] = attachment;
        RecalculateColliderBounds();

        attachment.OnAttachToKoboto(this);
    }

    public Transform GetAttachmentTargetTransform(EAttachmentTarget target) {
        Transform t = transform;
        attachmentPointLookup.TryGetValue(target, out t);
        return t;

    }

    void RecalculateColliderBounds() {
        float minY = colliderBaseCenter.y - colliderBaseSize.y/2f;
        float maxY = colliderBaseCenter.y + colliderBaseSize.y/2f;

        foreach (var attachment in currentAttachments.Values) {
            minY = Mathf.Min(minY, colliderBaseCenter.y - colliderBaseSize.y/2f - attachment.kobotoColliderExtendDown);
            maxY = Mathf.Max(maxY, colliderBaseCenter.y + colliderBaseSize.y/2f + attachment.kobotoColliderExtendUp);
        }

        float centerY = (minY + maxY)/2f;
        float sizeY = maxY - minY;

        colliderCenterTarget = new Vector3(colliderBaseCenter.x, centerY, colliderBaseCenter.z);
        colliderSizeTarget = new Vector3(colliderBaseSize.x, sizeY, colliderBaseSize.z);

        boxCollider.center = colliderCenterTarget;
        boxCollider.size = colliderSizeTarget;
        
    }

   

}
