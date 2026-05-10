import Navbar from "../components/Navbar"

function ItineraryView() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-5xl font-bold text-orange-500">
            Trip Timeline
          </h1>

          <button className="bg-orange-500 text-white px-8 py-4 rounded-2xl text-xl">
            Share Trip
          </button>

        </div>

        <div className="space-y-10">

          <div className="bg-white rounded-[40px] shadow-2xl p-10 border-l-[12px] border-orange-500">

            <h1 className="text-4xl font-bold text-orange-500">
              Day 1
            </h1>

            <p className="text-xl mt-4 text-gray-600">
              Arrival and beach exploration
            </p>

            <div className="mt-8 space-y-4">

              <div className="bg-orange-100 p-5 rounded-2xl">
                Morning → Airport Arrival
              </div>

              <div className="bg-orange-100 p-5 rounded-2xl">
                Afternoon → Beach Activities
              </div>

              <div className="bg-orange-100 p-5 rounded-2xl">
                Evening → Dinner Party
              </div>

            </div>

          </div>

          <div className="bg-white rounded-[40px] shadow-2xl p-10 border-l-[12px] border-orange-500">

            <h1 className="text-4xl font-bold text-orange-500">
              Day 2
            </h1>

            <p className="text-xl mt-4 text-gray-600">
              Adventure and nightlife
            </p>

            <div className="mt-8 space-y-4">

              <div className="bg-orange-100 p-5 rounded-2xl">
                Morning → Water Sports
              </div>

              <div className="bg-orange-100 p-5 rounded-2xl">
                Afternoon → Shopping
              </div>

              <div className="bg-orange-100 p-5 rounded-2xl">
                Evening → Cruise Dinner
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ItineraryView