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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full border rounded-md px-4 py-2"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full border rounded-md px-4 py-2"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full border rounded-md px-4 py-2"
                          placeholder="+91 1234567890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject *</label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="w-full border rounded-md px-4 py-2"
                          placeholder="Subject"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full border rounded-md px-4 py-2 h-32"
                        placeholder="Your message"
                      />
                    </div>
                    <Button type="submit" size="lg">Send Message</Button>
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
                <CardDescription>For urgent matters or escalations, please contact:</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">Customer Care</div>
                    <div className="text-sm text-gray-600">Hemant Sarmalkar</div>
                    <div className="text-sm text-gray-600">022-66771777 Extn: 590</div>
                    <div className="text-sm text-gray-600">
                      <a href="mailto:hemant@sunidhi.com" className="text-primary-600 hover:text-primary-700">
                        hemant@sunidhi.com
                      </a>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">Head of Customer Care</div>
                    <div className="text-sm text-gray-600">Avijit Kushari</div>
                    <div className="text-sm text-gray-600">7045786888</div>
                    <div className="text-sm text-gray-600">
                      <a href="mailto:avijitkushari@sunidhi.com" className="text-primary-600 hover:text-primary-700">
                        avijitkushari@sunidhi.com
                      </a>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">Compliance Officer/Principal Officer</div>
                    <div className="text-sm text-gray-600">Mahesh S Desai</div>
                    <div className="text-sm text-gray-600">022-66771777 Extn: 608</div>
                    <div className="text-sm text-gray-600">
                      <a href="mailto:maheshdesai@sunidhi.com" className="text-primary-600 hover:text-primary-700">
                        maheshdesai@sunidhi.com
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
