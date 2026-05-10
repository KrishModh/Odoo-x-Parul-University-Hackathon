import { useNavigate } from "react-router-dom"

function DestinationCard({ image, title }) {

  const navigate = useNavigate()

  return (

    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">

      <img
        src={image}
        alt={title}
        className="h-64 w-full object-cover"
      />

      <div className="p-5">

        <h2 className="text-2xl font-bold text-orange-500">
          {title}
        </h2>

        <p className="text-gray-600 mt-2 text-sm leading-6">
          Explore amazing destinations and activities.
        </p>

        <button
          onClick={() => navigate("/city-search")}
          className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-5 py-3 rounded-2xl font-semibold"
        >
          Explore Destination
        </button>

      </div>

    </div>

  )
}

export default DestinationCard