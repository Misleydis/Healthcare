import Link from "next/link"
import { Activity } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-md bg-emerald-600 p-1">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">MJ's Health Hub</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Transforming rural healthcare in Zimbabwe through AI and telemedicine solutions.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Telehealth
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  ML Capabilities
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Data Protection
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MJ's Health Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
