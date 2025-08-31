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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Code className="h-6 w-6 text-primary-foreground font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">TAG</h1>
                <p className="text-sm text-muted-foreground">Cloud-powered Online IDE</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Cloud-powered</span>
            <br />
            <span className="text-foreground">Online IDE</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Access your personal, containerized coding environment with{' '}
            <span className="text-primary font-semibold">real-time execution</span>,{' '}
            <span className="text-accent font-semibold">collaborative features</span>, and{' '}
            <span className="text-primary font-semibold">unlimited possibilities</span>.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <LanguageSelector 
              selectedLanguage={activeFile?.language || 'python'}
              onLanguageChange={changeLanguage}
            />
            <Button
              onClick={saveFile}
              variant="outline"
              size="sm"
              disabled={!activeFile?.isDirty}
              className="shadow-soft"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={createNewFile}
              variant="outline"
              size="sm"
              className="shadow-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              New File
            </Button>
          </div>
        </div>
      </section>

      {/* IDE Interface */}
      <section className="container mx-auto px-6 pb-16">
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 shadow-glow overflow-hidden">
          {/* IDE Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-accent"></div>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {activeFile?.name || 'main.js'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Reset
              </Button>
              <Button size="sm" className="bg-gradient-primary text-xs px-4">
                ▶ Run
              </Button>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 bg-sidebar/50 border-r border-sidebar-border/50">
              <div className="p-4 border-b border-sidebar-border/50">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-sidebar-foreground" />
                  <span className="text-sm font-medium text-sidebar-foreground">Explorer</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-sidebar-accent/50 ${
                        activeFileId === file.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                      }`}
                      onClick={() => setActiveFileId(file.id)}
                    >
                      <span className="text-xs">
                        {SUPPORTED_LANGUAGES.find(lang => lang.id === file.language)?.icon || '📄'}
                      </span>
                      <span className="text-xs text-sidebar-foreground flex-1 truncate">
                        {file.name}
                      </span>
                      {file.isDirty && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex-1 flex">
              {/* Code Editor */}
              <div className="flex-1">
                {/* File Tabs */}
                <div className="flex items-center bg-muted/20 border-b border-border/50 overflow-x-auto">
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

                <div className="p-6 h-[500px]">
                  <div className="h-full rounded-xl border border-border/50 bg-background/50 overflow-hidden">
                    <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Code Editor</span>
                        <Badge variant="secondary" className="text-xs">
                          {SUPPORTED_LANGUAGES.find(lang => lang.id === activeFile?.language)?.name}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{activeFile?.language || 'python'}</span>
                        <span>•</span>
                        <span>UTF-8</span>
                        <span>•</span>
                        <span>Connected</span>
                      </div>
                    </div>
                    <div className="h-[calc(100%-50px)]">
                      <CodeEditor
                        language={activeFile?.language || 'python'}
                        value={activeFile?.content || ''}
                        onChange={updateFileContent}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Console Output */}
              <div className="w-80 border-l border-border/50 bg-muted/10">
                <div className="p-6 h-[500px]">
                  <OutputPanel
                    language={activeFile?.language || 'python'}
                    code={activeFile?.content || ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Start Coding Free</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers and start building amazing projects today.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow px-8">
              ▶ Start Coding Free
            </Button>
            <Button variant="outline" size="lg">
              👁 Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;