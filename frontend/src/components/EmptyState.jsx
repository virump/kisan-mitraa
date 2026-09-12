import React from 'react';
import { Sprout, SearchX, Inbox } from 'lucide-react';

export const EmptyState = ({
  title = "No information found",
  description = "Try adjusting your filters or search keywords.",
  actionText,
  onAction,
  icon = "search"
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200 my-6 shadow-sm">
      <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon === "search" ? (
          <SearchX className="w-8 h-8" />
        ) : icon === "sprout" ? (
          <Sprout className="w-8 h-8" />
        ) : (
          <Inbox className="w-8 h-8" />
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm md:text-base">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-medium rounded-xl transition duration-200 text-sm shadow-sm hover:shadow"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
