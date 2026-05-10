import { Link } from "react-router-dom"

function Navbar() {

  return (

    <nav className="bg-orange-500 w-full shadow-lg">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <h1 className="text-3xl font-bold text-white">
          Traveloop
        </h1>

        <div className="flex gap-8 text-white text-lg">

          <Link to="/dashboard">Home</Link>

          <Link to="/my-trips">Trips</Link>

          <Link to="/create-trip">Create Trip</Link>

          <Link to="/notes">Notes</Link>

          <Link to="/profile">Profile</Link>

        </div>

      </div>

    </nav>

  )
}

export default Navbar