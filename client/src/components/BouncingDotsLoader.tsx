import React from 'react';

const BouncingDotsLoader: React.FC = () => {
  return (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" />
    </div>
  );
};

export default BouncingDotsLoader;
