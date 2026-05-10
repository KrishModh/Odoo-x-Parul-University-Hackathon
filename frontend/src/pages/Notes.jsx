import Navbar from "../components/Navbar"

function Notes() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10">

        <div className="bg-white rounded-[40px] shadow-2xl p-10">

          <div className="flex justify-between items-center mb-8">

            <h1 className="text-5xl font-bold text-orange-500">
              Travel Journal
            </h1>

            <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl">
              Save Notes
            </button>

          </div>

          <textarea
            rows="15"
            placeholder="Write your travel memories..."
            className="w-full border rounded-3xl p-6 text-lg"
          ></textarea>

        </div>

      </div>

    </div>
  )
}

export default Notes