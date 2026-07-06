import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { COMPANY_INFO } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Sunidhi Securities
            </h3>
            <p className="text-sm mb-4">
              Where financial goals take wings to make a difference. Serving clients with excellence for over 58 years.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about/story" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/about/leadership" className="hover:text-white transition-colors">Leadership</Link></li>
              <li><Link href="/markets/research" className="hover:text-white transition-colors">Research Reports</Link></li>
              <li><Link href="/about/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/about/foundation" className="hover:text-white transition-colors">Sunidhi Foundation</Link></li>
              <li><Link href="/support/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>{COMPANY_INFO.address.full}</span>
              </li>
              <li className="flex gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>{COMPANY_INFO.phoneDisplay}</span>
              </li>
              <li className="flex gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <Link href="/support/contact" className="hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Disclaimer */}
      <div className="border-t border-gray-800">
        <Container>
          <div className="py-6">
            <p className="text-xs text-gray-400 mb-4">
              <strong className="text-gray-300">DISCLAIMER:</strong> Investment in securities market are subject to market risks, read all the related documents carefully before investing. Sunidhi Securities & Finance Limited is a SEBI registered Stock Broker. SEBI Registration No: INZ000183631. Member of NSE, BSE, MCX. Please read the Risk Disclosure Document prescribed by the Stock Exchanges carefully before investing.
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>
                <strong className="text-gray-300">Compliance Officer:</strong> {COMPANY_INFO.compliance.name} |
                Email: <a href={`mailto:${COMPANY_INFO.compliance.email}`} className="hover:text-white transition-colors">{COMPANY_INFO.compliance.email}</a> |
                Phone: {COMPANY_INFO.compliance.phone}
              </p>
              <p>
                <strong className="text-gray-300">Head of Customer Care:</strong> {COMPANY_INFO.customerCare.head} |
                Email: <a href={`mailto:${COMPANY_INFO.customerCare.email}`} className="hover:text-white transition-colors">{COMPANY_INFO.customerCare.email}</a> |
                Phone: {COMPANY_INFO.customerCare.phone}
              </p>
              <p>
                <strong className="text-gray-300">Support:</strong> {COMPANY_INFO.support.name} |
                Email: <a href={`mailto:${COMPANY_INFO.support.email}`} className="hover:text-white transition-colors">{COMPANY_INFO.support.email}</a> |
                Phone: {COMPANY_INFO.support.phone}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <Container>
          <div className="py-4 flex flex-col md:flex-row justify-between items-center text-sm">
            <div>
              <p>© {currentYear} {COMPANY_INFO.name} All rights reserved.</p>
              <p className="text-xs text-gray-400 mt-1">CIN: {COMPANY_INFO.cin}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-2 md:mt-0">
              <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/legal/disclosure-disclaimer" className="hover:text-white transition-colors">Disclosure & Disclaimer</Link>
              <Link href="/legal/regulatory-information" className="hover:text-white transition-colors">Regulatory Info</Link>
              <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Admin</Link>
              <span className="text-xs text-gray-500">Designed and Developed by <strong>AI Operations Department - Sunidhi Securities & Finance Ltd.</strong></span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
