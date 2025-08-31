import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Square, RotateCcw, Terminal, Bug, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  language: string;
  code: string;
}

const OutputPanel = ({ language, code }: OutputPanelProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState('');

  const simulateCodeExecution = async () => {
    setIsRunning(true);
    setOutput('');
    setErrors('');

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate output based on language
    const sampleOutputs: Record<string, { output: string; errors?: string }> = {
      python: { 
        output: 'Hello, World!\nPython 3.9+ is running successfully!\n\nEnvironment: Python IDE\nLibraries loaded: numpy, pandas, matplotlib' 
      },
      javascript: { 
        output: 'Hello, World!\nJavaScript ES2023 features active\n\nNode.js runtime ready\nModules: React, Express, Lodash' 
      },
      typescript: { 
        output: 'Hello, World!\nTypeScript 5.0+ compilation successful\n\nType checking: ✓ Passed\nBuild target: ES2023' 
      },
      java: { 
        output: 'Hello, World!\nJava 17 LTS runtime active\n\nJVM version: OpenJDK 17\nClasspath configured' 
      },
      cpp: { 
        output: 'Hello, World!\nC++20 standard library loaded\n\nCompiler: GCC 11+\nOptimization: -O2' 
      },
      go: { 
        output: 'Hello, World!\nGo 1.21+ module system ready\n\nGOPATH configured\nModules: gin, gorm' 
      },
      rust: { 
        output: 'Hello, World!\nRust 1.70+ cargo system active\n\nCargo version: 1.70.0\nCrates: serde, tokio' 
      },
      php: { 
        output: 'Hello, World!\nPHP 8.2+ interpreter ready\n\nExtensions: PDO, cURL, JSON\nComposer available' 
      },
      ruby: { 
        output: 'Hello, World!\nRuby 3.2+ gem system loaded\n\nGems: rails, sinatra, rspec\nBundler ready' 
      }
    };

    const result = sampleOutputs[language] || { output: 'Language output simulation...' };
    setOutput(result.output);
    if (result.errors) setErrors(result.errors);

    setIsRunning(false);
  };

  const clearOutput = () => {
    setOutput('');
    setErrors('');
  };

  return (
    <Card className="h-full bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Output & Debugging
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={simulateCodeExecution}
              disabled={isRunning}
              variant="default"
              size="sm"
              className="bg-gradient-primary hover:opacity-90"
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-1" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Run Code
                </>
              )}
            </Button>
            <Button
              onClick={clearOutput}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs defaultValue="output" className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="output" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Output
              {output && <Badge variant="secondary" className="ml-1 text-xs">1</Badge>}
            </TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Debug
              {errors && <Badge variant="destructive" className="ml-1 text-xs">!</Badge>}
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Packages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="output" className="mt-4">
            <ScrollArea className="h-[200px] w-full">
              <div className={cn(
                "p-4 rounded-lg font-mono text-sm",
                "bg-background border border-border",
                isRunning && "animate-pulse"
              )}>
                {isRunning ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Executing {language} code...
                  </div>
                ) : output ? (
                  <pre className="whitespace-pre-wrap text-foreground">{output}</pre>
                ) : (
                  <div className="text-muted-foreground italic">
                    Click "Run Code" to execute your {language} program
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="debug" className="mt-4">
            <ScrollArea className="h-[200px] w-full">
              <div className="p-4 rounded-lg bg-background border border-border font-mono text-sm">
                {errors ? (
                  <pre className="whitespace-pre-wrap text-destructive">{errors}</pre>
                ) : (
                  <div className="text-muted-foreground italic">
                    No debugging information available
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="packages" className="mt-4">
            <ScrollArea className="h-[200px] w-full">
              <div className="space-y-2">
                {language === 'python' && (
                  <>
                    <Badge variant="outline">numpy 1.24.0</Badge>
                    <Badge variant="outline">pandas 2.0.0</Badge>
                    <Badge variant="outline">matplotlib 3.7.0</Badge>
                  </>
                )}
                {language === 'javascript' && (
                  <>
                    <Badge variant="outline">react 18.2.0</Badge>
                    <Badge variant="outline">express 4.18.0</Badge>
                    <Badge variant="outline">lodash 4.17.21</Badge>
                  </>
                )}
                {language === 'typescript' && (
                  <>
                    <Badge variant="outline">@types/node 20.0.0</Badge>
                    <Badge variant="outline">typescript 5.0.0</Badge>
                  </>
                )}
                <div className="text-muted-foreground text-sm mt-4">
                  Package management system ready for {language}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OutputPanel;