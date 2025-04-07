import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface OverallReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OverallReportDialog = ({
  open,
  onOpenChange,
}: OverallReportDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const pdfUrl = "/data/report/sample-report.pdf";

  // Handle loading state for iframe
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const enhancedPdfUrl = `${pdfUrl}#view=FitH&navpanes=0&toolbar=1&statusbar=1&pagemode=none&zoom=100`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pr-8">
          <DialogTitle>Overall Assessment Report</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center bg-muted/30 rounded-lg p-4 relative">
          {isLoading && (
            <div className="flex items-center justify-center p-8 absolute inset-0 bg-background/80 z-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading PDF...
              </span>
            </div>
          )}

          <iframe
            src={`${enhancedPdfUrl}`}
            className="w-full h-[70vh] rounded-lg"
            onLoad={handleIframeLoad}
            title="PDF Viewer"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OverallReportDialog;
