import Navbar from "../components/Navbar"

function CreateTrip() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10 flex justify-center">

        <div className="bg-white w-[900px] p-10 rounded-[40px] shadow-2xl">

          <h1 className="text-5xl font-bold text-orange-500 mb-10">
            Create Your Dream Trip
          </h1>

          <div className="grid grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Trip Name"
              className="border p-5 rounded-2xl text-lg"
            />

            <input
              type="number"
              placeholder="Budget"
              className="border p-5 rounded-2xl text-lg"
            />

            <input
              type="date"
              className="border p-5 rounded-2xl text-lg"
            />

            <input
              type="date"
              className="border p-5 rounded-2xl text-lg"
            />

          </div>

          <textarea
            rows="6"
            placeholder="Trip Description"
            className="border p-5 rounded-2xl w-full mt-6 text-lg"
          ></textarea>

          <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-4 rounded-2xl mt-8 text-xl">
            Save Trip
          </button>

        </div>

      </div>

    </div>
  )
}

export default CreateTrip