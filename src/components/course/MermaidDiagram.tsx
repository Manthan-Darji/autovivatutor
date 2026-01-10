import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, AlertTriangle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MermaidDiagramProps {
  chart: string;
}

// Clean and sanitize Mermaid chart code
function sanitizeChart(chart: string): string {
  let cleaned = chart.trim();
  
  // Remove incomplete style statements (common AI error)
  cleaned = cleaned.replace(/style\s+\w+\s*$/gm, '');
  cleaned = cleaned.replace(/style\s+\w+\s*\n/gm, '\n');
  
  // Fix common syntax issues
  cleaned = cleaned.replace(/\s+style\s+$/gm, '');
  
  // Remove empty lines at the end
  cleaned = cleaned.replace(/\n\s*\n\s*$/g, '\n');
  
  return cleaned;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const mermaid = await import("mermaid");
        mermaid.default.initialize({
          startOnLoad: false,
          theme: "dark",
          suppressErrorRendering: true,
          themeVariables: {
            primaryColor: "#6366f1",
            primaryTextColor: "#f8fafc",
            primaryBorderColor: "#4f46e5",
            lineColor: "#64748b",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
            background: "#0f172a",
            mainBkg: "#1e293b",
            nodeBorder: "#4f46e5",
            clusterBkg: "#1e293b",
            titleColor: "#f8fafc",
            edgeLabelBackground: "#1e293b",
          },
          flowchart: {
            curve: "basis",
            padding: 20,
          },
        });

        const sanitized = sanitizeChart(chart);
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.default.render(id, sanitized);
        setSvg(svg);
        setError("");
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Diagram has syntax issues");
      }
    };

    renderDiagram();
  }, [chart]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  if (error) {
    return (
      <div className="my-3 rounded-lg border border-amber-500/50 bg-amber-500/10 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Diagram couldn't render</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs text-amber-500 hover:text-amber-400"
            onClick={() => setShowCode(!showCode)}
          >
            <Code className="h-3 w-3 mr-1" />
            {showCode ? "Hide" : "Show"} Code
          </Button>
        </div>
        {showCode && (
          <pre className="p-3 text-xs text-muted-foreground overflow-auto max-h-40 bg-secondary/30">
            <code>{chart}</code>
          </pre>
        )}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-3 rounded-lg border border-border bg-secondary/50 p-8 flex items-center justify-center">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-lg border border-border bg-secondary/30 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/50">
        <span className="text-xs font-medium text-muted-foreground">📊 Diagram</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleZoomOut}>
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleReset}>
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleZoomIn}>
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="overflow-auto p-4" style={{ maxHeight: "400px" }}>
        <div
          ref={containerRef}
          className="flex items-center justify-center transition-transform"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}
