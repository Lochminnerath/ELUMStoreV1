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
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white sticky top-0">
              <h2 className="text-2xl font-bold">Important Disclaimer</h2>
              <p className="text-white/90 text-sm mt-1">Please read before proceeding</p>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-4 text-foreground">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">Fictional Demonstration Website</p>
                  <p className="text-sm text-blue-800 mt-1">This is a test and demonstration environment only</p>
                </div>
              </div>

              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  <strong>SL Airlines is a fully fictional air carrier</strong> created for demonstration and testing purposes only. This website and all associated services are not real airline or financial services.
                </p>

                <p>
                  The <strong>SL Airlines Credit Card Activation Website</strong> is designed to simulate how travelers might activate their rewards card. While this site looks and functions like a real activation portal, it exists solely for:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Training and educational purposes</li>
                  <li>Testing user experience and interface design</li>
                  <li>Illustrative scenarios and demonstrations</li>
                </ul>

                <p>
                  <strong>This website is NOT:</strong>
                </p>

                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Connected to any real financial institution</li>
                  <li>Connected to any real airline service</li>
                  <li>A functioning payment or credit card system</li>
                  <li>Authorized by any banking or regulatory authority</li>
                </ul>

                <p className="pt-2">
                  <strong>All data, card numbers, and personal information you enter here is not processed by any real financial system and is used only for demonstration purposes.</strong>
                </p>

                <p className="pt-4 text-muted-foreground">
                  By clicking "I Agree," you acknowledge that you understand this is a fictional demonstration and agree to use this website for its intended educational and testing purposes only.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 flex gap-3 bg-muted/30 sticky bottom-0">
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
