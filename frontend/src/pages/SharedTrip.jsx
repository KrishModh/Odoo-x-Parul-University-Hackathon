import Navbar from "../components/Navbar"

function SharedTrip() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10 flex justify-center">

        <div className="bg-white w-[1000px] rounded-[40px] shadow-2xl overflow-hidden">

          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            className="h-[400px] w-full object-cover"
          />

          <div className="p-10">

            <div className="flex justify-between items-center">

              <div>

                <h1 className="text-6xl font-bold text-orange-500">
                  Goa Adventure Trip
                </h1>

                <p className="text-xl text-gray-600 mt-4">
                  Shared public itinerary for friends and travelers.
                </p>

              </div>

              <button className="bg-orange-500 text-white px-8 py-4 rounded-2xl text-xl">
                Copy Trip
              </button>

            </div>

            <div className="grid grid-cols-3 gap-8 mt-12">

              <div className="bg-orange-100 p-8 rounded-3xl">

                <h1 className="text-3xl font-bold text-orange-500">
                  5 Days
                </h1>

                <p className="mt-4 text-lg">
                  Trip Duration
                </p>

              </div>

              <div className="bg-orange-100 p-8 rounded-3xl">

                <h1 className="text-3xl font-bold text-orange-500">
                  ₹45000
                </h1>

                <p className="mt-4 text-lg">
                  Estimated Budget
                </p>

              </div>

              <div className="bg-orange-100 p-8 rounded-3xl">

                <h1 className="text-3xl font-bold text-orange-500">
                  10+
                </h1>

                <p className="mt-4 text-lg">
                  Activities
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default SharedTrip