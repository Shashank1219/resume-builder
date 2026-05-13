import React from "react";

export interface WordCloudKeyword {
  keyword: string;
  frequency: number;
}

interface WordCloudDisplayProps {
  image: string | null;
  keywords?: WordCloudKeyword[];
}

const WordCloudDisplay: React.FC<WordCloudDisplayProps> = ({ image, keywords = [] }) => {
  return (
    <div className="space-y-4">
      {image ? (
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <img
            src={`data:image/png;base64,${image}`}
            alt="Job description word cloud — font size reflects how often each term appears in the JD"
            className="w-full h-auto"
          />
        </div>
      ) : (
        <div className="h-[280px] w-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <span className="text-sm text-gray-400">No word cloud yet. Analyse a job description first.</span>
        </div>
      )}

      {keywords.length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Semantic keywords (weighted by frequency in the JD)
          </h4>
          <ul className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
            {keywords.map((k, i) => (
              <li
                key={`${k.keyword}-${i}`}
                className="text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200"
              >
                <span className="font-medium">{k.keyword}</span>
                <span className="text-slate-500 ml-1 tabular-nums">×{k.frequency}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default WordCloudDisplay;
