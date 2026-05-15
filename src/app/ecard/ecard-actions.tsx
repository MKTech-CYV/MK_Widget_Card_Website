"use client";

import { Check, Copy, Download, Share2 } from "lucide-react";
import { useState } from "react";

export type EcardActionLabels = {
  copied: string;
  copyLink: string;
  saveContact: string;
  share: string;
  shareText: string;
};

type EcardActionsProps = {
  fileName: string;
  fullName: string;
  labels: EcardActionLabels;
  shareUrl: string;
  vcardHref: string;
};

export function EcardActions({
  fileName,
  fullName,
  labels,
  shareUrl,
  vcardHref,
}: EcardActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyShareUrl() {
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareEcard() {
    if (navigator.share) {
      await navigator.share({
        title: `${fullName || "MK eCard"}`,
        text: labels.shareText,
        url: shareUrl,
      });
      return;
    }

    await copyShareUrl();
  }

  return (
    <div className="ecard-actions">
      <a className="ecard-action ecard-action--primary" download={fileName} href={vcardHref}>
        <Download aria-hidden="true" size={18} strokeWidth={2.3} />
        <span>{labels.saveContact}</span>
      </a>
      <button className="ecard-action" type="button" onClick={shareEcard}>
        <Share2 aria-hidden="true" size={18} strokeWidth={2.3} />
        <span>{labels.share}</span>
      </button>
      <button className="ecard-action" type="button" onClick={copyShareUrl}>
        {copied ? (
          <Check aria-hidden="true" size={18} strokeWidth={2.3} />
        ) : (
          <Copy aria-hidden="true" size={18} strokeWidth={2.3} />
        )}
        <span>{copied ? labels.copied : labels.copyLink}</span>
      </button>
    </div>
  );
}
