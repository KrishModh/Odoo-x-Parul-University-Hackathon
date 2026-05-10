import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Plane,
  Wallet,
  NotebookPen,
  MapPinned
} from "lucide-react"

function Sidebar() {
  return (
    <div className="w-[280px] min-h-screen bg-white shadow-2xl p-8">

      <h1 className="text-4xl font-bold text-orange-500 mb-10">
        Dashboard
      </h1>

      <div className="flex flex-col gap-6 text-lg font-semibold">

        <Link
          to="/dashboard"
          className="flex gap-3 hover:text-orange-500"
        >
          <LayoutDashboard />
          Dashboard
        </Link>

        <Link
          to="/create-trip"
          className="flex gap-3 hover:text-orange-500"
        >
          <Plane />
          Create Trip
        </Link>

        <Link
          to="/budget"
          className="flex gap-3 hover:text-orange-500"
        >
          <Wallet />
          Budget
        </Link>

        <Link
          to="/notes"
          className="flex gap-3 hover:text-orange-500"
        >
          <NotebookPen />
          Notes
        </Link>

        <Link
          to="/city-search"
          className="flex gap-3 hover:text-orange-500"
        >
          <MapPinned />
          Explore
        </Link>

      </div>

    </div>
  )
}

export default Sidebar