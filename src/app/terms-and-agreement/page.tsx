"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, CheckCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { saveUserAgreement } from "@/lib/firebase/firestore"

export default function TermsAgreementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isAgreed, setIsAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching terms content
    const fetchTerms = async () => {
      try {
        // In a real app, you might fetch this from a CMS or API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load terms and conditions. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const handleSubmit = async () => {
    if (!isAgreed || !user) return

    setIsSubmitting(true)

    try {
      // Fetch IP address
      const ipResponse = await fetch("https://api.ipify.org?format=json")
      const ipData = await ipResponse.json()
      const ip = ipData.ip

      // Get device info
      const userAgent = navigator.userAgent

      // Save agreement data
      await saveUserAgreement(user.uid, { ip, userAgent })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSubmitting(false)
      setIsAccepted(true)

      // Here you would typically redirect or call an API
      setTimeout(() => {
        router.push('/onboarding')
      }, 2000)
    } catch (error) {
      console.error("Error submitting agreement:", error)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-teal-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">Thank you, your agreement has been recorded.</h2>
          <p className="text-gray-600">You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900 text-center">Terms & Agreement</h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 flex flex-col py-6">
        <div className="flex-1 px-4 sm:px-6">
          <div className="bg-white max-w-4xl mx-auto rounded-lg shadow-md">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="p-6 prose prose-sm max-w-none text-gray-700 space-y-6">
                <div className="text-center font-bold text-lg">TERMS AND AGREEMENT</div>

                <div className="text-center">
                  <p className="font-medium">Between</p>
                  <p className="font-semibold">CaringEdge Digital Services LLP</p>

                  <p className="font-medium mt-2">AND</p>
                <p className="font-semibold">The Staff Member / Worker</p>

                <p className="text-sm mt-2 italic">Effective from the date of digital acceptance by the Worker</p>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="font-semibold text-base mb-3">1. Nature of Engagement</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">1.1</span> You acknowledge and agree that you are being engaged as a
                      gig worker and not as a permanent employee.
                    </p>
                    <p>
                      <span className="font-medium">1.2</span> You may be sourced either directly by the Company or
                      referred via a third-party agency.
                    </p>
                    <p>
                      <span className="font-medium">1.3</span> The Company acts solely as a facilitator, connecting
                      service seekers (customers) with service providers (you), and does not guarantee continuous
                      employment or assignments.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">2. Scope of Work</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">2.1</span> You agree to undertake duties as per the service category
                      (e.g., Nurse, Attendant) assigned to you, which may include but are not limited to:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Patient care and hygiene</li>
                      <li>Vital signs monitoring</li>
                      <li>Medication management</li>
                      <li>Basic household support</li>
                      <li>Emotional and psychological assistance</li>
                    </ul>
                    <p>
                      <span className="font-medium">2.2</span> The scope of each assignment will be communicated to you
                      prior to acceptance.
                    </p>
                    <p>
                      <span className="font-medium">2.3</span> You are free to accept or decline any assignment.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">3. Payments and Fees</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">3.1</span> You will be paid for services rendered as per the terms
                      agreed upon before each assignment.
                    </p>
                    <p>
                      <span className="font-medium">3.2</span> Payments will be made directly by the Company
                      post-confirmation of duty completion and subject to deductions for any applicable taxes or
                      penalties.
                    </p>
                    <p>
                      <span className="font-medium">3.3</span> No fixed salary or monthly compensation is guaranteed.
                      Payment is strictly based on completed and approved work.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">4. Code of Conduct</h3>
                  <p className="text-sm mb-2">You agree to the following code of conduct during every assignment:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                    <li>Maintain professionalism and respect towards the patient and their family.</li>
                    <li>Refrain from using mobile phones for personal use during active duty hours.</li>
                    <li>Strictly avoid consumption of alcohol, tobacco, or any narcotic substances while on duty.</li>
                    <li>Do not engage in any financial dealings with the patient or their family.</li>
                    <li>Follow hygiene, cleanliness, and safety protocols at all times.</li>
                    <li>Do not bring any unauthorised individuals to the client location.</li>
                    <li>Report to the Company in case of any emergency, conflict, or abuse.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">5. Confidentiality</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">5.1</span> You shall maintain the confidentiality of all personal,
                      medical, or sensitive information of the patient and their family.
                    </p>
                    <p>
                      <span className="font-medium">5.2</span> You agree not to share, distribute, or misuse such
                      information in any manner.
                    </p>
                    <p>
                      <span className="font-medium">5.3</span> This obligation continues even after your engagement
                      ends.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">6. Tracking, Monitoring & Documentation</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">6.1</span> You consent to the use of GPS tracking while on duty for
                      security and verification purposes.
                    </p>
                    <p>
                      <span className="font-medium">6.2</span> You consent to the use of your image/video/audio for
                      internal documentation, compliance, training, or quality checks.
                    </p>
                    <p>
                      <span className="font-medium">6.3</span> All data collected will be retained and used in
                      accordance with the Company's data protection policy.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">7. Termination and Exit</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">7.1</span> You may terminate your services by giving a 3-day notice.
                    </p>
                    <p>
                      <span className="font-medium">7.2</span> The Company reserves the right to terminate your
                      engagement immediately without notice in cases of:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Misconduct</li>
                      <li>Breach of duty</li>
                      <li>Fraudulent or criminal behavior</li>
                      <li>Abandonment of duty</li>
                      <li>Repeated complaints from clients</li>
                    </ul>
                    <p>
                      <span className="font-medium">7.3</span> Upon termination, you shall promptly return any property
                      or records belonging to the Company or the client.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">8. Penalties</h3>
                  <div className="space-y-2 text-sm">
                    <p>You acknowledge and agree that:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        Any form of fraud, impersonation, submission of false documents, or misrepresentation will
                        result in immediate termination and may be subject to legal action.
                      </li>
                      <li>
                        Abandoning duty mid-assignment without valid reason will lead to deactivation from the platform
                        and a monetary penalty as per internal policy.
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">9. Notices</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">9.1</span> Any official communication regarding duty, payments, or
                      termination may be sent to you via:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>WhatsApp</li>
                      <li>Email</li>
                      <li>SMS</li>
                      <li>Phone call</li>
                      <li>In-person notification</li>
                    </ul>
                    <p>All of these are considered valid modes of communication.</p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">10. Legal Jurisdiction</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">10.1</span> Any disputes arising from this agreement shall be
                      subject to the exclusive jurisdiction of the courts in Delhi, India.
                    </p>
                    <p>
                      <span className="font-medium">10.2</span> The governing law shall be the laws of India.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-3">11. Declaration and Consent</h3>
                  <div className="space-y-2 text-sm">
                    <p>By clicking "Accept", you confirm that:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>You have read, understood, and voluntarily agree to the terms above.</li>
                      <li>You are legally eligible to work in India and are above 18 years of age.</li>
                      <li>The information you provide during onboarding is truthful to the best of your knowledge.</li>
                    </ul>
                  </div>
                </section>

                <section className="border-t pt-4">
                  <div className="text-sm">
                    <p className="font-medium">Issued by:</p>
                    <p className="font-semibold">CaringEdge Digital Services LLP</p>
                    <p>
                      SHOP NO 7, 11/20 Subhash Nagar, Subhash Nagar West, Rajouri Garden, New Delhi, West Delhi -
                      110027, Delhi, India
                    </p>
                  </div>
                </section>
              </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-3 mb-4">
            <Checkbox
              id="agree-terms"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="agree-terms" className="text-sm font-medium text-gray-700 cursor-pointer leading-5">
              I have read and agree to the Terms and Agreement
            </label>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!isAgreed || isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Accept and Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
