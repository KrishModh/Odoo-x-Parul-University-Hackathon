import Navbar from "../components/Navbar"

function AdminDashboard() {
  return (
    <div className="bg-orange-50 min-h-screen">

      <Navbar />

      <div className="p-10">

        <h1 className="text-5xl font-bold text-orange-500 mb-10">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-4 gap-8">

          <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center">

            <h1 className="text-5xl font-bold text-orange-500">
              1200
            </h1>

            <p className="text-xl mt-4">
              Total Users
            </p>

          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center">

            <h1 className="text-5xl font-bold text-orange-500">
              320
            </h1>

            <p className="text-xl mt-4">
              Trips Created
            </p>

          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center">

            <h1 className="text-5xl font-bold text-orange-500">
              56
            </h1>

            <p className="text-xl mt-4">
              Popular Cities
            </p>

          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center">

            <h1 className="text-5xl font-bold text-orange-500">
              4.9
            </h1>

            <p className="text-xl mt-4">
              Ratings
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminDashboard