import React from "react";

const NoService = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-2/3 lg:w-1/3 text-center">
        <h2 className="text-2xl font-bold mb-4">Out Of Service</h2>
        <p className="text-gray-600 mb-6">
          Sorry for the inconvenience as we ran out of OpenAI usage tokens. we
          will be back soon
        </p>
        {/* <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button> */}
      </div>
    </div>
  );
};

export default NoService;
