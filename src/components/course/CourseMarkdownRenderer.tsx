import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { YouTubeEmbed, extractYouTubeId } from "./YouTubeEmbed";
import { MermaidDiagram } from "./MermaidDiagram";

interface CourseMarkdownRendererProps {
  content: string;
}

export function CourseMarkdownRenderer({ content }: CourseMarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeContent = String(children).replace(/\n$/, "");
          
          // Handle mermaid diagrams
          if (match && match[1] === "mermaid") {
            return <MermaidDiagram chart={codeContent} />;
          }
          
          const isInline = !match;
          return isInline ? (
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono" {...props}>
              {children}
            </code>
          ) : (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              className="rounded-lg !my-2 !text-xs"
            >
              {codeContent}
            </SyntaxHighlighter>
          );
        },
        // Custom link renderer for YouTube videos
        a({ href, children, ...props }) {
          if (href) {
            const videoId = extractYouTubeId(href);
            if (videoId && href.includes("youtube") || href.includes("youtu.be")) {
              return (
                <YouTubeEmbed 
                  videoId={videoId} 
                  title={typeof children === "string" ? children : undefined} 
                />
              );
            }
          }
          return (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
              {...props}
            >
              {children}
            </a>
          );
        },
        // Style improvements for lists
        ul({ children }) {
          return <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>;
        },
        // Headers with better styling
        h1({ children }) {
          return <h1 className="text-lg font-bold mt-4 mb-2 text-foreground">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-base font-semibold mt-3 mb-2 text-foreground">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-sm font-semibold mt-2 mb-1 text-foreground">{children}</h3>;
        },
        // Blockquotes for tips
        blockquote({ children }) {
          return (
            <blockquote className="border-l-2 border-primary pl-3 my-2 italic text-muted-foreground">
              {children}
            </blockquote>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
