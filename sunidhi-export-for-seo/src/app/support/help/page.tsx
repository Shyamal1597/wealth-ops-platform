import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, ChevronRight } from "lucide-react";

export default function HelpPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-primary-100">Find answers to your questions</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {faqs.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary-600" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.questions.map((q, qIndex) => (
                        <div key={qIndex} className="border-b last:border-0 pb-3 last:pb-0">
                          <div className="flex justify-between items-start group cursor-pointer">
                            <div>
                              <h4 className="font-medium mb-1 group-hover:text-primary-600">{q.question}</h4>
                              <p className="text-sm text-gray-600">{q.answer}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

const faqs = [
  {
    category: "Account Opening",
    questions: [
      {
        question: "How do I open a trading account?",
        answer: "You can open an account online using our eKYC process, which takes just 10-15 minutes."
      },
      {
        question: "What documents are required?",
        answer: "PAN card, Aadhaar card, bank account details, and a cancelled cheque or bank statement."
      },
      {
        question: "Is there any account opening fee?",
        answer: "Account opening is completely free. You only pay brokerage on trades."
      }
    ]
  },
  {
    category: "Trading",
    questions: [
      {
        question: "What are your brokerage charges?",
        answer: "We offer competitive brokerage starting from 0.03% for equity delivery and flat ₹20 per order for intraday."
      },
      {
        question: "How do I place my first trade?",
        answer: "Log in to your trading account, search for the stock, enter quantity, and click Buy or Sell."
      },
      {
        question: "What is margin trading?",
        answer: "Margin trading allows you to trade with borrowed funds, amplifying both potential gains and losses."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "I forgot my password. What should I do?",
        answer: "Click on 'Forgot Password' on the login page and follow the instructions to reset it."
      },
      {
        question: "The platform is not loading. What should I do?",
        answer: "Clear your browser cache, check your internet connection, or try using a different browser."
      }
    ]
  }
];
