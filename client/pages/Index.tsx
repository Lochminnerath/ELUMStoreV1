import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();

  // Check if card is already activated
  useEffect(() => {
    const activated = localStorage.getItem("sl-airlines-activated");
    if (activated) {
      // User already activated - show review status
      navigate("/review-status");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F8d330572a69d41f0b535ef0b58b374e5%2Fd021add0cfe64fe394153b013ec25c99?format=webp&width=50" alt="SL Airlines" className="h-10 w-10" />
            <span className="font-bold text-xl text-primary">SL Airlines</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left Content */}
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Welcome to SL Airlines Card Activation
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Activate your SL Airlines credit card in minutes to unlock exclusive benefits and start earning miles on every transaction.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're a <span className="font-semibold text-primary">Travel Card</span> (Gray) or <span className="font-semibold text-sl-club-black">Club Card</span> (Black) member, the activation process is quick and secure.
            </p>

            <Button
              onClick={() => navigate("/activate")}
              className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 h-auto rounded-lg font-semibold"
            >
              Activate Your Card
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
            <div className="relative">
              {/* Travel Card */}
              <div
                className="absolute top-0 right-0 w-72 h-44 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl shadow-xl p-6 text-white transform -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-default"
                style={{ perspective: "1000px" }}
              >
                <div className="flex justify-between items-start mb-20">
                  <div>
                    <p className="text-xs opacity-75">CARD TYPE</p>
                    <p className="text-base font-bold leading-tight">Travel</p>
                  </div>
                  <img src="https://cdn.builder.io/api/v1/image/assets%2F8d330572a69d41f0b535ef0b58b374e5%2Fd021add0cfe64fe394153b013ec25c99?format=webp&width=40" alt="SL" className="h-8 w-8 opacity-90" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-75">CARDHOLDER</p>
                    <p className="text-xs font-semibold leading-tight">Emma Richardson</p>
                  </div>
                  <p className="text-xs opacity-75">SL</p>
                </div>
              </div>

              {/* Club Card */}
              <div
                className="absolute top-32 left-0 w-72 h-44 bg-gradient-to-br from-sl-club-black to-slate-700 rounded-2xl shadow-xl p-6 text-white transform rotate-6 hover:rotate-0 transition-transform duration-300 cursor-default"
                style={{ perspective: "1000px" }}
              >
                <div className="flex justify-between items-start mb-20">
                  <div>
                    <p className="text-xs opacity-75">CARD TYPE</p>
                    <p className="text-base font-bold leading-tight">Club</p>
                  </div>
                  <img src="https://cdn.builder.io/api/v1/image/assets%2F8d330572a69d41f0b535ef0b58b374e5%2Fd021add0cfe64fe394153b013ec25c99?format=webp&width=40" alt="SL" className="h-8 w-8 opacity-90" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-75">CARDHOLDER</p>
                    <p className="text-xs font-semibold leading-tight">James Mitchell</p>
                  </div>
                  <p className="text-xs opacity-75">SL</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12 border border-border">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            What You Need to Activate
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Verification Code</h3>
              <p className="text-muted-foreground">
                A secure code sent to your email to verify your identity
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Security PIN</h3>
              <p className="text-muted-foreground">
                A PIN provided in your activation email for additional security
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Personal Details</h3>
              <p className="text-muted-foreground">
                Your name, card number, and date of birth (must be 16+)
              </p>
            </div>
          </div>
        </div>

        {/* Card Type Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Travel Card */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-4">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F8d330572a69d41f0b535ef0b58b374e5%2Fd021add0cfe64fe394153b013ec25c99?format=webp&width=50" alt="Travel" className="h-12 w-12" />
              <div>
                <h3 className="text-2xl font-bold text-gray-700">Travel Card</h3>
                <p className="text-sm text-muted-foreground">Perfect for frequent travelers</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-foreground">
              <p>✓ Earn 2 miles per dollar on all purchases</p>
              <p>✓ Free checked bag on SL Airlines flights</p>
              <p>✓ Priority boarding privileges</p>
              <p>✓ Annual travel credit</p>
            </div>
          </div>

          {/* Club Card */}
          <div className="bg-gradient-to-br from-sl-club-black/5 to-slate-700/5 border border-sl-club-black/20 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-4">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F8d330572a69d41f0b535ef0b58b374e5%2Fd021add0cfe64fe394153b013ec25c99?format=webp&width=50" alt="Club" className="h-12 w-12 opacity-70" />
              <div>
                <h3 className="text-2xl font-bold text-sl-club-black">Club Card</h3>
                <p className="text-sm text-muted-foreground">Premium elite member benefits</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-foreground">
              <p>✓ Earn 3 miles per dollar on all purchases</p>
              <p>✓ 2 free checked bags on SL Airlines flights</p>
              <p>✓ First class upgrade certificates</p>
              <p>✓ Premium annual credit</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Activate Your Card?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            The activation process takes less than 5 minutes and is completely secure. Your card will be ready to use immediately after activation.
          </p>
          <Button
            onClick={() => navigate("/activate")}
            className="bg-white hover:bg-white/90 text-primary font-semibold text-lg px-8 py-6 h-auto rounded-lg"
          >
            Activate Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow p-8 md:p-12 border border-border">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">How long does activation take?</h3>
              <p className="text-muted-foreground">
                The activation process typically takes 3-5 minutes. Once completed, your card is immediately active and ready to use.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">What if I don't have my PIN?</h3>
              <p className="text-muted-foreground">
                The PIN was sent to your email along with the activation code. Check your email inbox and spam folder, or contact support.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Can I activate multiple times?</h3>
              <p className="text-muted-foreground">
                No, each card can only be activated once for security purposes. Once activated, you'll be locked out of the activation process.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Yes, all data is encrypted and transmitted securely. We never store PIN codes or full card numbers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 mt-12 py-8 text-center text-muted-foreground text-sm">
        <p>&copy; 2025 SL Airlines. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://sites.google.com/view/sl-airlines/our-policy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Policies</a>
          <a href="https://sites.google.com/view/sl-airlines/club-open-page" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Support</a>
        </div>
      </div>
    </div>
  );
}
