import Navbar from "../components/Navbar"
import TripCard from "../components/TripCard"

function MyTrips() {

  return (

    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="w-full px-6 py-10">

        {/* Heading */}

        <h1 className="text-4xl font-bold text-orange-500 mb-10">

          My Trips

        </h1>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          <TripCard
            title="Goa Trip"
            days="5"
            budget="15000"
          />

          <TripCard
            title="Dubai Tour"
            days="7"
            budget="70000"
          />

          <TripCard
            title="Manali Adventure"
            days="4"
            budget="12000"
          />

        </div>

      </div>

    </div>

  )
}

export default MyTrips