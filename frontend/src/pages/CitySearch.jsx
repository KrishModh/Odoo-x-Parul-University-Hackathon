import Navbar from "../components/Navbar"

function CitySearch() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10">

        <input
          type="text"
          placeholder="Search Destination..."
          className="w-full border p-5 rounded-2xl text-lg shadow-lg"
        />

        <h1 className="text-5xl font-bold text-orange-500 mt-10 mb-8">
          Trending Cities
        </h1>

        <div className="grid grid-cols-3 gap-8">

          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">

            <img
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"
              className="h-60 w-full object-cover"
            />

            <div className="p-6">

              <h1 className="text-4xl font-bold text-orange-500">
                Goa
              </h1>

              <p className="mt-4 text-lg text-gray-600">
                Beaches, nightlife and amazing food experience.
              </p>

              <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl mt-6">
                Add To Trip
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CitySearch