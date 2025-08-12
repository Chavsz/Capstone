import React from "react";

function OurTutors() {
  return (
    <div
      id="ourtutors"
      className="container min-h-screen mx-auto py-10 md:px-20 lg:px-32 w-full overflow-hidden px-5 mb-5 "
    >
      <h1 className="sm:text-4xl md:text-3xl font-semibold">Tutors</h1>
      
      <div className="mt-5 flex flex-col gap-12">
        <div>
          <p className="text-2xl font-semibold text-center mb-7">
            Programming
          </p>

          {/* Programming Tutors */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-15 sm:gap-4">
            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-2xl font-semibold text-center mb-7">Calculus</p>

          {/* Calculus Tutors */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-15 sm:gap-4">
            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-2xl font-semibold text-center mb-7">Chemistry</p>

          {/* Chemistry Tutors */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-15 sm:gap-4">
            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-2xl font-semibold text-center mb-7">Physics</p>

          {/* Physics Tutors */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-15 sm:gap-4">
            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden p-20"></div>
              <p className="text-center text-black">John Doe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurTutors;
