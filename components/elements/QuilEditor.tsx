"use client";

import { useRef } from "react";
import ReactDOM from "react-dom";

// Polyfill for findDOMNode in React 19
if (typeof window !== "undefined") {
  // Type assertion to add findDOMNode to ReactDOM
  const ReactDOMWithFindNode = ReactDOM as typeof ReactDOM & {
    findDOMNode?: (instance: unknown) => Element | null;
  };

  if (!ReactDOMWithFindNode.findDOMNode) {
    ReactDOMWithFindNode.findDOMNode = (instance: unknown) => {
      if (instance && typeof instance === "object" && "nodeType" in instance) {
        return instance as Element;
      }
      if (
        instance &&
        typeof instance === "object" &&
        "_reactInternalFiber" in instance
      ) {
        const fiber = (
          instance as { _reactInternalFiber?: { stateNode?: Element } }
        )._reactInternalFiber;
        return fiber?.stateNode || null;
      }
      if (instance && typeof instance === "object" && "stateNode" in instance) {
        return (instance as { stateNode?: Element }).stateNode || null;
      }
      return null;
    };
  }
}

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  theme?: string;
  style?: React.CSSProperties;
  modules?: Record<string, unknown>;
  formats?: string[];
}

export const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  theme = "snow",
  style,
  modules,
  formats,
}) => {
  const quillRef = useRef<ReactQuill>(null);

  return (
    <div style={{ minHeight: "200px" }}>
      <ReactQuill
        ref={quillRef}
        theme={theme}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default QuillEditor;
