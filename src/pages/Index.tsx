import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Code, Folder, Settings, Save } from "lucide-react";
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector, { SUPPORTED_LANGUAGES } from '@/components/LanguageSelector';
import FileTab from '@/components/FileTab';
import OutputPanel from '@/components/OutputPanel';
import { useToast } from "@/hooks/use-toast";

interface FileData {
  id: string;
  name: string;
  language: string;
  content: string;
  isDirty: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileData[]>([
    {
      id: '1',
      name: 'main.py',
      language: 'python',
      content: `# Welcome to the Multi-Language Code Editor
# Python 3.9+ with full IDE support

def hello_world():
    """A simple hello world function with type hints."""
    message: str = "Hello, World!"
    print(message)
    return message

if __name__ == "__main__":
    result = hello_world()
    print(f"Function returned: {result}")
`,
      isDirty: false
    }
  ]);

  const [activeFileId, setActiveFileId] = useState('1');
  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const updateFileContent = (content: string | undefined) => {
    if (!content || !activeFile) return;
    
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, content, isDirty: file.content !== content }
        : file
    ));
  };

  const changeLanguage = (newLanguage: string) => {
    if (!activeFile) return;
    
    const langData = SUPPORTED_LANGUAGES.find(lang => lang.id === newLanguage);
    if (!langData) return;

    const newFileName = activeFile.name.replace(/\.[^.]+$/, langData.extension);
    
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, language: newLanguage, name: newFileName, isDirty: true }
        : file
    ));
  };

  const createNewFile = () => {
    const newId = Date.now().toString();
    const newFile: FileData = {
      id: newId,
      name: 'untitled.py',
      language: 'python',
      content: '# New file\n',
      isDirty: false
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newId);
    
    toast({
      title: "New file created",
      description: "Ready to start coding!",
    });
  };

  const closeFile = (fileId: string) => {
    if (files.length === 1) return; // Don't close the last file
    
    setFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (activeFileId === fileId) {
      const remainingFiles = files.filter(f => f.id !== fileId);
      setActiveFileId(remainingFiles[0]?.id || '');
    }
  };

  const saveFile = () => {
    if (!activeFile) return;
    
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, isDirty: false }
        : file
    ));
    
    toast({
      title: "File saved",
      description: `${activeFile.name} has been saved successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Code Editor</h1>
                <p className="text-xs text-muted-foreground">Multi-Language IDE</p>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <LanguageSelector 
              selectedLanguage={activeFile?.language || 'python'}
              onLanguageChange={changeLanguage}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={saveFile}
              variant="outline"
              size="sm"
              disabled={!activeFile?.isDirty}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              onClick={createNewFile}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              New File
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-sidebar-foreground" />
              <span className="font-medium text-sidebar-foreground">Explorer</span>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-sidebar-accent ${
                    activeFileId === file.id ? 'bg-sidebar-accent' : ''
                  }`}
                  onClick={() => setActiveFileId(file.id)}
                >
                  <span className="text-sm">
                    {SUPPORTED_LANGUAGES.find(lang => lang.id === file.language)?.icon || '📄'}
                  </span>
                  <span className="text-sm text-sidebar-foreground flex-1 truncate">
                    {file.name}
                  </span>
                  {file.isDirty && (
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="flex items-center bg-muted/30 border-b border-border overflow-x-auto">
            {files.map((file) => (
              <FileTab
                key={file.id}
                fileName={file.name}
                language={file.language}
                isActive={activeFileId === file.id}
                isDirty={file.isDirty}
                onSelect={() => setActiveFileId(file.id)}
                onClose={() => closeFile(file.id)}
              />
            ))}
          </div>

          {/* Editor and Output */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 p-4">
              <Card className="h-full bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {activeFile?.name || 'Editor'}
                    <Badge variant="secondary" className="ml-2">
                      {SUPPORTED_LANGUAGES.find(lang => lang.id === activeFile?.language)?.name}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 h-[calc(100%-80px)]">
                  <CodeEditor
                    language={activeFile?.language || 'python'}
                    value={activeFile?.content || ''}
                    onChange={updateFileContent}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Output Panel */}
            <div className="w-96 p-4 pl-0">
              <OutputPanel
                language={activeFile?.language || 'python'}
                code={activeFile?.content || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;