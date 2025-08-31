import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python', version: '3.9+', extension: '.py', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', version: 'ES2023', extension: '.js', icon: '⚡' },
  { id: 'typescript', name: 'TypeScript', version: '5.0+', extension: '.ts', icon: '🔷' },
  { id: 'java', name: 'Java', version: '17 LTS', extension: '.java', icon: '☕' },
  { id: 'cpp', name: 'C++', version: 'C++20', extension: '.cpp', icon: '⚙️' },
  { id: 'go', name: 'Go', version: '1.21+', extension: '.go', icon: '🐹' },
  { id: 'rust', name: 'Rust', version: '1.70+', extension: '.rs', icon: '🦀' },
  { id: 'php', name: 'PHP', version: '8.2+', extension: '.php', icon: '🐘' },
  { id: 'ruby', name: 'Ruby', version: '3.2+', extension: '.rb', icon: '💎' }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.id === selectedLanguage);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Language:</span>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[200px] bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.id} value={lang.id} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs text-muted-foreground">{lang.version}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {currentLang && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {currentLang.extension}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {currentLang.version}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;