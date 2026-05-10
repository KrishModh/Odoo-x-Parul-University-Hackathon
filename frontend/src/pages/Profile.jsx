import Navbar from "../components/Navbar"

function Profile() {

  return (

    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10">

          {/* Circular Profile Photo */}

          <div className="flex justify-center">

            

          </div>

          {/* Profile Details */}

          <div className="flex-1">

            <h1 className="text-5xl font-bold text-orange-500">

              Aakansha

            </h1>

            <p className="text-gray-600 text-xl mt-3">

              Travel Enthusiast ✈️

            </p>

            <p className="text-gray-500 mt-5 text-lg leading-8">

              Loves exploring new destinations, creating travel plans,
              and sharing amazing memories with friends and family.

            </p>

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl mt-8 text-lg font-semibold">

              Edit Profile

            </button>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Profile