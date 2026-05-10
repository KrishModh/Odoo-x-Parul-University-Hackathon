import Navbar from "../components/Navbar"
import ActivityCard from "../components/ActivityCard"

function ActivitySearch() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-5xl font-bold text-orange-500">
            Activities
          </h1>

          <input
            type="text"
            placeholder="Search Activities..."
            className="border p-4 rounded-2xl w-[350px] shadow-lg"
          />

        </div>

        <div className="grid grid-cols-3 gap-8">

          <ActivityCard
            title="River Rafting"
            type="Adventure"
            price="2500"
          />

          <ActivityCard
            title="Desert Safari"
            type="Adventure"
            price="4000"
          />

          <ActivityCard
            title="Food Tour"
            type="Food"
            price="1500"
          />

          <ActivityCard
            title="Sky Diving"
            type="Adventure"
            price="15000"
          />

          <ActivityCard
            title="Mountain Hiking"
            type="Nature"
            price="2000"
          />

          <ActivityCard
            title="Cruise Party"
            type="Luxury"
            price="8000"
          />

        </div>

      </div>

    </div>
  )
}

export default ActivitySearch