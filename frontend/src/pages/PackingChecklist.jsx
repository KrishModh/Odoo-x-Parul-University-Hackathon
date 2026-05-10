import Navbar from "../components/Navbar"

function PackingChecklist() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10">

        <div className="bg-white p-10 rounded-[40px] shadow-2xl">

          <div className="flex justify-between items-center">

            <h1 className="text-5xl font-bold text-orange-500">
              Packing Checklist
            </h1>

            <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl">
              Add Item
            </button>

          </div>

          <div className="mt-10 space-y-6 text-xl">

            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-6 h-6" />
              Passport
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-6 h-6" />
              Clothes
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-6 h-6" />
              Charger
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-6 h-6" />
              Shoes
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-6 h-6" />
              Camera
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default PackingChecklist