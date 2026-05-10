function ActivityCard({ title, type, price }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 duration-300">

      <h1 className="text-3xl font-bold text-orange-500">
        {title}
      </h1>

      <p className="mt-3 text-lg">
        Type: {type}
      </p>

      <p className="text-lg">
        Cost: ₹{price}
      </p>

      <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl mt-5 w-full">
        Add Activity
      </button>

    </div>
  )
}

export default ActivityCard