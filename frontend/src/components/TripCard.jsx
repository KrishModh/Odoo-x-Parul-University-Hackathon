import { useNavigate } from "react-router-dom"

function TripCard({ title, days, budget }) {

  const navigate = useNavigate()

  const handleDelete = () => {
    alert(`${title} deleted`)
  }

  const handleShare = () => {
    navigate("/shared")
  }

  return (

    <div className="bg-white rounded-3xl shadow-xl p-7 min-h-[230px] flex flex-col justify-between hover:shadow-2xl transition duration-300">

      {/* Trip Info */}

      <div>

        <h2 className="text-3xl font-bold text-orange-500 mb-4">
          {title}
        </h2>

        <p className="text-gray-700 text-lg mb-2">
          Duration: {days} Days
        </p>

        <p className="text-gray-700 text-lg">
          Budget: ₹{budget}
        </p>

      </div>

      {/* Buttons */}

      <div className="flex flex-wrap gap-4 mt-8">

        <button
          onClick={() => navigate("/view")}
          className="bg-orange-500 text-white px-6 py-3 rounded-2xl text-lg font-medium hover:bg-orange-600"
        >
          View
        </button>

        <button
          onClick={() => navigate("/create-trip")}
          className="bg-yellow-500 text-white px-6 py-3 rounded-2xl text-lg font-medium hover:bg-yellow-600"
        >
          Edit
        </button>

        <button
          onClick={handleShare}
          className="bg-blue-500 text-white px-6 py-3 rounded-2xl text-lg font-medium hover:bg-blue-600"
        >
          Share
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-6 py-3 rounded-2xl text-lg font-medium hover:bg-red-600"
        >
          Deletee
        </button>

      </div>

    </div>

  )
}

export default TripCard