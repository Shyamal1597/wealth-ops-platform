"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Building2, User } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you shortly.' });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-primary-100">We're here to help. Reach out to us anytime.</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
                </CardHeader>
                <CardContent>
                  {status && (
                    <div className={`mb-4 p-4 rounded-md text-sm ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                      {status.message}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Name *</label>
                        <input
                          type="text"
                          id="contact-name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          id="contact-email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          id="contact-phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="+91 1234567890"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">Subject *</label>
                        <input
                          type="text"
                          id="contact-subject"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Subject"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium mb-2">Message *</label>
                      <textarea
                        id="contact-message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full border rounded-md px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your message"
                      />
                    </div>
                    <Button type="submit" size="lg" disabled={submitting}>
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    Registered & Corporate Office
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Sunidhi Securities & Finance Limited<br />
                    8th Floor, Kalpataru Inspire<br />
                    Opp. Grand Hyatt Hotel<br />
                    Santacruz (E), Mumbai - 400 055<br />
                    India
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    CIN: U67190MH1985PLC037326
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary-600" />
                    Phone Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <div className="font-medium text-gray-900">Franchise/Client Enquiry:</div>
                      <div>022-66771696 / 022-43222696</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Online Trading:</div>
                      <div>022-66771601 / 022-43222602</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Client Queries:</div>
                      <div>022-66771593 / 022-43222593</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Depository (CDSL):</div>
                      <div>022-66771461 / 022-66771462</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary-600" />
                    Email Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <div className="font-medium text-gray-900">Franchise/AP/Client:</div>
                      <div>associate@sunidhi.com</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Online Trading:</div>
                      <div>onlinetrading@sunidhi.com</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Client Queries:</div>
                      <div>retailrm@sunidhi.com</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Depository:</div>
                      <div>dp@sunidhi.com</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Investor Grievances:</div>
                      <div>complaints.redressal@sunidhi.com</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary-600" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Monday - Friday: 9:30 AM - 6:00 PM<br />
                    Saturday & Sunday: Closed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* NBFC Contact Information */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Sunidhi Capital Pvt Ltd (NBFC)</CardTitle>
                <CardDescription>For loans, repayments, and NBFC-related queries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Queries */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="h-6 w-6 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">For Sunidhi Capital Queries</h3>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">(NBFC – Loans and Repayments)</p>
                    <div className="space-y-2">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Phone:</div>
                        <div className="text-sm text-gray-600">(+91-22) 66771777</div>
                        <div className="text-sm text-gray-600">(+91-22) 43222777</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Email:</div>
                        <a href="mailto:support@sunidhi.com" className="text-sm text-primary-600 hover:text-primary-700">
                          support@sunidhi.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Grievances */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      <User className="h-6 w-6 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">For Sunidhi Capital Grievances</h3>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">(NBFC – Loans and Repayments)</p>
                    <div className="space-y-2">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Grievance Officer:</div>
                        <div className="text-sm text-gray-700">Nikhil Rasal</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Phone:</div>
                        <div className="text-sm text-gray-600">(+91-22) 66771777</div>
                        <div className="text-sm text-gray-600">(+91-22) 43222777</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Email:</div>
                        <a href="mailto:nikhil.r@sunidhi.com" className="text-sm text-primary-600 hover:text-primary-700">
                          nikhil.r@sunidhi.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Escalation Matrix */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Escalation Matrix</CardTitle>
                <CardDescription>
                  For Complaints and Grievances Redressal with respect to loans / products provided by NBFC — Sunidhi Capital Pvt Limited
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-6">
                  Please follow the steps below to register any complaints you might have with our services. Approach the next level only after you have raised the issue at the previous level.
                </p>
                <div className="space-y-4">
                  {/* Level 1 */}
                  <div className="flex gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex-shrink-0 w-20">
                      <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">Level 1</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      Write to us at{" "}
                      <a href="mailto:support@sunidhi.com" className="text-primary-600 hover:text-primary-700 font-medium">
                        support@sunidhi.com
                      </a>{" "}
                      or call us on{" "}
                      <span className="font-medium">91-22-66771777</span> or{" "}
                      <span className="font-medium">91-22-33222777</span>
                    </div>
                  </div>

                  {/* Level 2 */}
                  <div className="flex gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex-shrink-0 w-20">
                      <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">Level 2</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold text-gray-900 mb-1">Escalate to Customer Grievance Redressal Officer</div>
                      If you are not satisfied with the resolution provided, please send your Level 1 complaint details to{" "}
                      <span className="font-medium">Nikhil Rasal</span> at{" "}
                      <a href="mailto:nikhil.r@sunidhi.com" className="text-primary-600 hover:text-primary-700 font-medium">
                        nikhil.r@sunidhi.com
                      </a>{" "}
                      who will help resolve your concern at the earliest.
                    </div>
                  </div>

                  {/* Level 3 */}
                  <div className="flex gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex-shrink-0 w-20">
                      <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">Level 3</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold text-gray-900 mb-1">Escalate to Chief Customer Redressal Officer</div>
                      If still not satisfied after Level 1 and Level 2, please send your complaint details to{" "}
                      <span className="font-medium">Janak Doshi</span> at{" "}
                      <a href="mailto:drjanak@sunidhi.com" className="text-primary-600 hover:text-primary-700 font-medium">
                        drjanak@sunidhi.com
                      </a>{" "}
                      who will help resolve your concern at the earliest.
                    </div>
                  </div>

                  {/* Level 4 */}
                  <div className="flex gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex-shrink-0 w-20">
                      <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">Level 4</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold text-gray-900 mb-1">Approach the RBI and the Ombudsman</div>
                      In case your complaint has not been addressed to your satisfaction after following all the above steps, you can approach the RBI&apos;s Complaint Management System and Banking Ombudsman at:{" "}
                      <a
                        href="https://cms.rbi.org.in/cms/indexpage.html#eng"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-medium break-all"
                      >
                        https://cms.rbi.org.in/cms/indexpage.html#eng
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
