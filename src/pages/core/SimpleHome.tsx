import React from "react";

const SimpleHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">ICMS</h1>
          <h2 className="text-2xl text-gray-700 mb-6">
            ระบบจัดการโครงการก่อสร้างภายในองค์กร
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Internal Construction Management System for Solar Projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">PEA</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Provincial Electricity Authority
            </h3>
            <p className="text-gray-600">การไฟฟ้าส่วนภูมิภาค</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">PWA</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Progressive Web App
            </h3>
            <p className="text-gray-600">Modern Web Application</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            🌟 System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl text-green-500 mb-2">✅</div>
              <p className="text-sm text-gray-600">Frontend Deployed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl text-blue-500 mb-2">🚀</div>
              <p className="text-sm text-gray-600">React + TypeScript</p>
            </div>
            <div className="text-center">
              <div className="text-3xl text-purple-500 mb-2">⚡</div>
              <p className="text-sm text-gray-600">Powered by Vite</p>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <p>© 2025 ICMS - Solar Project Management System</p>
          <p className="text-sm mt-2">
            Environment:{" "}
            <span className="font-mono bg-gray-200 px-2 py-1 rounded">
              {import.meta.env.MODE}
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SimpleHome;
