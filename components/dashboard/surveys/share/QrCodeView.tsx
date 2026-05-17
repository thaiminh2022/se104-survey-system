"use client";

import { Button } from "@/components/ui/button";
import { IconCopy, IconDownload } from "@tabler/icons-react";
import { useRef } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

type Props = {
  value: string;
};

export default function QrCodeView({ value }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  async function getQRCodePngBlob() {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) return null;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.src = url;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    URL.revokeObjectURL(url);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
  }

  async function copyQRCode() {
    const blob = await getQRCodePngBlob();

    if (!blob) return;

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);

    toast.success("QR code copied");
  }

  async function downloadQRCode() {
    const blob = await getQRCodePngBlob();

    if (!blob) return;

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.png";
    link.click();

    URL.revokeObjectURL(url);
    toast.success("QR code downloaded");
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={qrRef}
        className="rounded-lg border border-border bg-white p-4 shadow-sm"
      >
        <QRCode value={value} size={220} />
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        <Button type="button" variant="outline" onClick={copyQRCode}>
          <IconCopy />
          Copy
        </Button>
        <Button type="button" onClick={downloadQRCode}>
          <IconDownload />
          Download
        </Button>
      </div>
    </div>
  );
}
