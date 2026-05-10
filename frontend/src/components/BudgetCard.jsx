function BudgetCard({ category, amount }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl text-center hover:scale-105 duration-300">

      <h1 className="text-3xl font-bold text-orange-500">
        {category}
      </h1>

      <p className="text-5xl font-bold mt-6">
        ₹{amount}
      </p>

    </div>
  )
}

export default BudgetCard