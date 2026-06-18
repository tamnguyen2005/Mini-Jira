import React from "react";
import type { FallbackProps } from "react-error-boundary";

export const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const message = error instanceof Error ? error.message : "Unknown error";

  return (
    <div
      role="alert"
      className="min-h-screen bg-red-50/50 flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md w-full">
        <div className="text-4xl mb-4">🚨</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Hệ thống Jira đã xảy ra sự cố
        </h2>
        <p className="text-xs text-red-600 bg-red-50 p-3 rounded font-mono mb-4 text-left overflow-auto max-h-32">
          {message}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
        >
          🔄 Thử tải lại vùng lỗi
        </button>
      </div>
    </div>
  );
};
