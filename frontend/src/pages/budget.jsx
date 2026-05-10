import Navbar from "../components/Navbar"
import BudgetCard from "../components/BudgetCard"

function Budget() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10">

        <h1 className="text-5xl font-bold text-orange-500 mb-10">
          Budget Overview
        </h1>

        <div className="grid grid-cols-4 gap-8">

          <BudgetCard category="Hotels" amount="25000" />

          <BudgetCard category="Food" amount="12000" />

          <BudgetCard category="Travel" amount="18000" />

          <BudgetCard category="Activities" amount="10000" />

        </div>

        <div className="bg-white rounded-[40px] shadow-2xl p-10 mt-12">

          <h1 className="text-4xl font-bold text-orange-500 mb-8">
            Expense Summary
          </h1>

          <div className="space-y-6">

            <div className="flex justify-between text-xl">
              <p>Hotel Booking</p>
              <p>₹25000</p>
            </div>

            <div className="flex justify-between text-xl">
              <p>Flights</p>
              <p>₹18000</p>
            </div>

            <div className="flex justify-between text-xl">
              <p>Food & Dining</p>
              <p>₹12000</p>
            </div>

            <div className="flex justify-between text-xl">
              <p>Activities</p>
              <p>₹10000</p>
            </div>

            <hr />

            <div className="flex justify-between text-3xl font-bold text-orange-500">
              <p>Total</p>
              <p>₹65000</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Budget