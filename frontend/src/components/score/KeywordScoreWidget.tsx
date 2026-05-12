import React from 'react';
import { RefreshCw } from 'lucide-react';

interface KeywordScoreWidgetProps {
  score: number | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const KeywordScoreWidget: React.FC<KeywordScoreWidgetProps> = ({ score, isRefreshing, onRefresh }) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  
  let color = '#d1d5db'; // gray-300 stroke for null state
  let strokeDashoffset = circumference;
  
  if (score !== null) {
    if (score <= 40) color = '#EF4444'; // red-500
    else if (score <= 70) color = '#F59E0B'; // amber-500
    else color = '#10B981'; // emerald-500
    
    strokeDashoffset = circumference - (score / 100) * circumference;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center w-[120px] h-[120px]">
        {/* Background Circle */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#e5e7eb" // gray-200
            strokeWidth="8"
          />
          {/* Foreground Progress Circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="flex items-baseline z-10">
          {score !== null ? (
            <>
              <span className="text-3xl font-bold text-gray-800">{Math.round(score)}</span>
              <span className="text-lg text-gray-500 font-semibold">%</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-400">--</span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        <span className="text-sm text-gray-500 font-medium">Keyword Match Score</span>
        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          <span>Refresh Score</span>
        </button>
      </div>
    </div>
  );
};

export default KeywordScoreWidget;
