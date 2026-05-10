import Navbar from "../components/Navbar"

function ItineraryBuilder() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-5xl font-bold text-orange-500">
            Itinerary Builder
          </h1>

          <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-4 rounded-2xl text-xl shadow-lg">
            Add New Stop
          </button>

        </div>

        <div className="space-y-8">

          <div className="bg-white rounded-[40px] p-8 shadow-2xl">

            <div className="flex justify-between items-center">

              <div>

                <h1 className="text-4xl font-bold text-orange-500">
                  Day 1 - Goa
                </h1>

                <p className="text-lg text-gray-600 mt-3">
                  Beaches and nightlife exploration
                </p>

              </div>

              <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl">
                Edit Day
              </button>

            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">

              <div className="bg-orange-100 p-6 rounded-3xl">

                <h2 className="text-2xl font-bold text-orange-500">
                  Morning
                </h2>

                <p className="mt-4 text-lg">
                  Beach Visit
                </p>

              </div>

              <div className="bg-orange-100 p-6 rounded-3xl">

                <h2 className="text-2xl font-bold text-orange-500">
                  Afternoon
                </h2>

                <p className="mt-4 text-lg">
                  Food Tour
                </p>

              </div>

              <div className="bg-orange-100 p-6 rounded-3xl">

                <h2 className="text-2xl font-bold text-orange-500">
                  Night
                </h2>

                <p className="mt-4 text-lg">
                  Club Party
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white rounded-[40px] p-8 shadow-2xl">

            <div className="flex justify-between items-center">

              <div>

                <h1 className="text-4xl font-bold text-orange-500">
                  Day 2 - Adventure
                </h1>

                <p className="text-lg text-gray-600 mt-3">
                  Water sports and activities
                </p>

              </div>

              <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl">
                Edit Day
              </button>

            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">

              <div className="bg-orange-100 p-6 rounded-3xl">

                <h2 className="text-2xl font-bold text-orange-500">
                  Morning
                </h2>

                <p className="mt-4 text-lg">
                  Parasailing
                </p>

              </div>

              <div className="bg-orange-100 p-6 rounded-3xl">

                <h2 className="text-2xl font-bold text-orange-500">
                  Afternoon
                </h2>

                <p className="mt-4 text-lg">
                  Jet Ski
                </p>

              </div>

              <div className="bg-orange-100 p-6 rounded-3xl">

                <h2 className="text-2xl font-bold text-orange-500">
                  Night
                </h2>

                <p className="mt-4 text-lg">
                  Cruise Dinner
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ItineraryBuilder