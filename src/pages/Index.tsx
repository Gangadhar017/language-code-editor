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

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-primary">Powerful</span> Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for modern development in one seamless platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-glow transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Containerized Environments</h3>
              <p className="text-muted-foreground">
                Isolated, secure coding environments with pre-configured runtime environments for every project.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-glow transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                <Settings className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Execution</h3>
              <p className="text-muted-foreground">
                Interactive terminal, live code execution, and instant feedback for rapid development cycles.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-glow transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                <Save className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Persistent Storage</h3>
              <p className="text-muted-foreground">
                Your code and projects are persistent across sessions. Never lose your work again.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-glow transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                <Folder className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sandboxed Execution</h3>
              <p className="text-muted-foreground">
                Secure execution environments with resource limits that ensures safe code execution.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-glow transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Collaboration</h3>
              <p className="text-muted-foreground">
                Code together with your team in real-time with synchronized editing and shared workspaces.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-glow transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Git Integration</h3>
              <p className="text-muted-foreground">
                Built-in Git support with visual branching, merging, and collaborative version control.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="container mx-auto px-6 py-24 bg-muted/20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Language <span className="text-primary">Support</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Full-featured development environments for all major programming languages
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Card key={lang.id} className="bg-card/70 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-glow transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{lang.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {lang.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {lang.version}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Full IDE support with syntax highlighting, debugging, and package management
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Developer Resources Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Developer <span className="text-primary">Resources</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides and documentation to accelerate your development workflow
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Quick Start Guide */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Code className="h-4 w-4 text-primary" />
                </div>
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Get up and running in minutes with our streamlined onboarding process. No downloads, no setup required.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Create your account to access the IDE framework
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Choose from 9+ programming languages
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Start coding with our intelligent code editor
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Deploy and share your projects seamlessly
                </li>
              </ul>
              <Button className="mt-6 bg-gradient-primary hover:opacity-90">
                View Documentation
              </Button>
            </CardContent>
          </Card>

          {/* API & Integrations */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-accent" />
                </div>
                API & Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Extend TAG with our comprehensive RESTful API and webhooks. Build custom workflows and integrate with your existing tools.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">REST API</Badge>
                  <span className="text-sm text-muted-foreground">Complete API documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">WebHooks</Badge>
                  <span className="text-sm text-muted-foreground">Real-time event notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">SDKs</Badge>
                  <span className="text-sm text-muted-foreground">Official libraries for multiple platforms</span>
                </div>
              </div>
              <Button variant="outline" className="mt-6">
                Explore API
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features & Community Support */}
        <div className="grid lg:grid-cols-2 gap-12 mt-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Advanced Features</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Real-time syntax highlighting & auto-completion</p>
                  <p className="text-sm text-muted-foreground">IntelliSense-powered code assistance</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Environment code templates and debugging</p>
                  <p className="text-sm text-muted-foreground">Pre-configured setups for faster development</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Multi-file collaborative editing with team chat</p>
                  <p className="text-sm text-muted-foreground">Work together seamlessly with your team</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Integrated terminal with full shell access</p>
                  <p className="text-sm text-muted-foreground">Complete command-line interface</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6">Community & Support</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of developers in our thriving community. Get help, share knowledge, and collaborate on amazing projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-primary hover:opacity-90">
                Join Community - 50K+
              </Button>
              <Button variant="outline">
                Get Support - 24/7
              </Button>
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

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Code className="h-4 w-4 text-primary-foreground font-bold" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">TAG</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Transforming development with cloud-native coding environments. Build, deploy, and collaborate from anywhere.
              </p>
              <p className="text-sm text-muted-foreground">
                © 2024 TAG IDE. All rights reserved. Made with ❤️ for developers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Follow us:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <span className="sr-only">Twitter</span>
                  🐦
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <span className="sr-only">GitHub</span>
                  🐙
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <span className="sr-only">Discord</span>
                  💬
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;