import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("sl-disclaimer-agreed");
    if (!hasAgreed) {
      setIsOpen(true);
    } else {
      setAgreed(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("sl-disclaimer-agreed", "true");
    setAgreed(true);
    setIsOpen(false);
  };

  if (agreed) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
              <h2 className="text-3xl font-bold">Important Disclaimer</h2>
              <p className="text-white/85 mt-2">Please read before proceeding</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 text-foreground">
              {/* Alert Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">Fictional Demonstration Website</p>
                  <p className="text-sm text-blue-800 mt-1">This is a test and demonstration environment only</p>
                </div>
              </div>

              {/* Main Points */}
              <div className="space-y-5 text-sm leading-relaxed">
                <div>
                  <p>
                    <strong>SL Airlines is a fully fictional air carrier</strong> created for demonstration and testing purposes only. This website and all associated services are not real airline or financial services.
                  </p>
                </div>

                <div>
                  <p className="mb-3">
                    The <strong>SL Airlines Credit Card Activation Website</strong> is designed to simulate how travelers might activate their rewards card. This site exists solely for:
                  </p>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start gap-3">
                      <span className="text-primary font-bold flex-shrink-0">•</span>
                      <span>Training and educational purposes</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary font-bold flex-shrink-0">•</span>
                      <span>Testing user experience and interface design</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary font-bold flex-shrink-0">•</span>
                      <span>Illustrative scenarios and demonstrations</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border pt-5">
                  <p className="font-semibold mb-3">This website is NOT:</p>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 font-bold flex-shrink-0">✕</span>
                      <span>Connected to any real financial institution</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 font-bold flex-shrink-0">✕</span>
                      <span>Connected to any real airline service</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 font-bold flex-shrink-0">✕</span>
                      <span>A functioning payment or credit card system</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 font-bold flex-shrink-0">✕</span>
                      <span>Authorized by any banking or regulatory authority</span>
                    </div>
                  </div>
                </div>

                {/* Key Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-900">
                    <strong>All data, card numbers, and personal information you enter here is not processed by any real financial system</strong> and is used only for demonstration purposes.
                  </p>
                </div>

                {/* Agreement */}
                <p className="text-muted-foreground text-xs pt-2">
                  By clicking "I Agree," you acknowledge that you understand this is a fictional demonstration and agree to use this website for its intended educational and testing purposes only.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 flex gap-3 bg-muted/40 flex-shrink-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.location.href = "https://slairlines.netlify.app";
                }}
              >
                Decline & Leave
              </Button>
              <Button
                onClick={handleAgree}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                I Agree & Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
