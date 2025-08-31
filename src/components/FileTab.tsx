import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTabProps {
  fileName: string;
  language: string;
  isActive: boolean;
  isDirty?: boolean;
  onSelect: () => void;
  onClose: () => void;
}

const FileTab = ({ fileName, language, isActive, isDirty, onSelect, onClose }: FileTabProps) => {
  const getLanguageIcon = (lang: string) => {
    const icons: Record<string, string> = {
      python: '🐍',
      javascript: '⚡',
      typescript: '🔷',
      java: '☕',
      cpp: '⚙️',
      go: '🐹',
      rust: '🦀',
      php: '🐘',
      ruby: '💎'
    };
    return icons[lang] || '📄';
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer group relative",
        isActive 
          ? "bg-background text-primary border-b-2 border-primary" 
          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onSelect}
    >
      <span className="text-sm">{getLanguageIcon(language)}</span>
      
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium truncate max-w-[120px]">
          {fileName}
        </span>
        {isDirty && (
          <div className="w-2 h-2 rounded-full bg-accent"></div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="p-0 h-auto w-4 hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="h-3 w-3" />
      </Button>

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"></div>
      )}
    </div>
  );
};

export default FileTab;