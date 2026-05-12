import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import type { WordCloudKeyword } from '@/lib/api/keywordScoringApi';

interface WordCloudDisplayProps {
  keywords: WordCloudKeyword[];
}

const WordCloudDisplay: React.FC<WordCloudDisplayProps> = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <span className="text-sm text-gray-400">No keywords extracted yet.</span>
      </div>
    );
  }

  const options = {
    fontSizes: [14, 48] as [number, number],
    rotationAngles: [0, 0] as [number, number],
    deterministic: true,
    enableTooltip: true,
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: 2,
    rotations: 1,
    transitionDuration: 1000,
  };

  const callbacks = {
    getWordColor: (word: any) => {
      // Find the original keyword to get its category
      const kw = keywords.find((k) => k.text === word.text);
      if (kw?.category === 'technical') {
        return '#2563EB'; // tailwind blue-600
      }
      return '#059669'; // tailwind emerald-600
    },
  };

  return (
    <div className="h-[280px] w-full bg-white rounded-lg p-2 border border-gray-200 shadow-sm flex items-center justify-center">
      <div className="w-full h-full">
        <ReactWordcloud
          words={keywords}
          options={options}
          callbacks={callbacks}
        />
      </div>
    </div>
  );
};

export default WordCloudDisplay;
