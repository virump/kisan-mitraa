import React from 'react';

export const LoadingSkeleton = ({ type = 'cards', count = 3 }) => {
  if (type === 'table') {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse space-y-6 max-w-4xl mx-auto p-4">
        <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="h-40 bg-gray-200 rounded-xl w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-4/5"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-full pt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
