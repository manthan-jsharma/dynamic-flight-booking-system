"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export default function Header({ userBalance = 50000 }) {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-rose-600">
          Dynamic Flight System
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`font-medium ${pathname === "/" ? "text-rose-600" : "text-gray-600 hover:text-rose-600"}`}
          >
            Home
          </Link>
          <Link
            href="/bookings"
            className={`font-medium ${pathname === "/bookings" ? "text-rose-600" : "text-gray-600 hover:text-rose-600"}`}
          >
            My Bookings
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm">
            <span className="text-gray-500">Wallet Balance:</span>
            <span className="ml-1 font-semibold">₹{userBalance.toLocaleString()}</span>
          </div>

          <Button variant="outline" size="sm" className="rounded-full">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Account</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
