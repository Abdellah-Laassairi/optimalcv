import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../App.css";

type PreviewProps = {
  markdown: string;
};

const Preview = memo(function Preview({ markdown }: PreviewProps) {
  return (
    <div className="acv-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
});

export default Preview;
