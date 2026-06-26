export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <svg 
              className="w-16 h-16 text-primary-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            E-Commerce Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Frontend Service is Running
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-gray-700 font-medium">Status: Online</span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>✅ Next.js App Router</p>
            <p>✅ Tailwind CSS</p>
            <p>✅ TypeScript</p>
            <p>✅ Axios API Client</p>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Powered by Docker & Next.js</p>
        </div>
      </div>
    </main>
  )
}
