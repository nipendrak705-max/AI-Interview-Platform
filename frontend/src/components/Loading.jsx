function Loading() {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white p-8 rounded-xl shadow-xl text-center">

        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>

        <h2 className="mt-6 text-xl font-bold">
          AI is working...
        </h2>

        <p className="text-gray-500">
          Please wait...
        </p>

      </div>

    </div>
  );
}

export default Loading;