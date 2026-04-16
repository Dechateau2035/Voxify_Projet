"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type PDFViewerProps = {
  title: string;
  url?: string;
};

export function PDFViewer({ title, url }: PDFViewerProps) {
  if (!url) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-full">
          <FileText className="size-4" />
          Voir partition
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[85vh] w-[min(96vw,1100px)] max-w-[1100px] rounded-3xl p-3 sm:p-4">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Partition PDF consultee directement dans Voxify.</DialogDescription>
        <iframe
          src={url}
          title={title}
          className="mt-2 h-full min-h-0 w-full rounded-2xl border border-border/60 bg-background"
        />
      </DialogContent>
    </Dialog>
  );
}
