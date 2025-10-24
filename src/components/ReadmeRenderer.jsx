"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import ShadowDOM from "react-shadow";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Spinner } from "./ui/spinner";

export default function ReadmeRenderer({ content }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4 w-full overflow-x-auto">
      <ShadowDOM.div className="w-full">
        <link
          rel="stylesheet"
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-dark.min.css"
          }
        />
        <style>{`

        
            .markdown-body table {
              display: block;
              width: 100%;
              max-width: 100%;
              overflow-x: auto;
            }

            /* Add text selection styles */
            .markdown-body ::selection {
              background-color: #b3d7ff;
              color: inherit;
            }
            
            .markdown-body ::-moz-selection {
              background-color: #b3d7ff;
              color: inherit;
            }
            
            /* Dark theme selection */
            .markdown-body ::selection {
                background-color: #1f6feb;
                color: #ffffff;
              }
              
              .markdown-body ::-moz-selection {
                background-color: #1f6feb;
                color: #ffffff;
              }
        `}</style>
        <div className="markdown-body break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </ShadowDOM.div>
    </div>
  );
}
