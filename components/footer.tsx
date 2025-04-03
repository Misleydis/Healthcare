import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">HealthConnect</h3>
            <p className="text-sm text-foreground/70">
              Improving healthcare access in rural Zimbabwe through telemedicine and AI-powered health insights.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/assessment" className="text-sm text-foreground/70 hover:text-foreground">
                  Health Assessment
                </Link>
              </li>
              <li>
                <Link href="/telemedicine" className="text-sm text-foreground/70 hover:text-foreground">
                  Telemedicine
                </Link>
              </li>
              <li>
                <Link href="/monitoring" className="text-sm text-foreground/70 hover:text-foreground">
                  Health Monitoring
                </Link>
              </li>
              <li>
                <Link href="/treatment" className="text-sm text-foreground/70 hover:text-foreground">
                  Treatment Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-foreground/70 hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-foreground/70 hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-foreground/70 hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-foreground/70 hover:text-foreground">
                  Health Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-foreground/70 hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-foreground/70 hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/data-protection" className="text-sm text-foreground/70 hover:text-foreground">
                  Data Protection
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-center text-foreground/70">
            © {new Date().getFullYear()} HealthConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

