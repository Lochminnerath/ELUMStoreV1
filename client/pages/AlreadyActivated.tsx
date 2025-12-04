import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ActivationData {
  verificationCode: string;
  pin: string;
  name: string;
  cardNumberLastTwo: string;
  dateOfBirth: string;
  cardType: "travel" | "club" | "";
  completedAt: string;
}

export default function AlreadyActivated() {
  const navigate = useNavigate();
  const data = JSON.parse(
    localStorage.getItem("sl-airlines-activated") || "{}",
  ) as ActivationData;
  const completedDate = new Date(data.completedAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      {/* Header with Logo */}
      <div className="border-b border-border/50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F58f2265166be4d0db08ea914234affec%2F41558cec03da4b39b5bb4960324d8449?format=webp&width=64"
              alt="SL Airlines"
              className="h-8 w-8"
            />
            <span className="font-bold text-lg text-primary">SL Airlines</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 flex items-center min-h-[calc(100vh-80px)]">
        <div className="w-full">
          {/* Locked State Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8 text-center animate-slide-up">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Card Already Activated
            </h1>
            <p className="text-blue-700">
              Your SL Airlines card has already been activated and registered to
              your account.
            </p>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow p-6 md:p-8 border border-border mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Activation Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Cardholder Name
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {data.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Card Type
                  </p>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {data.cardType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Activated On
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {completedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Activation Time
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {completedDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">
                Why is my card locked?
              </h3>
              <p className="text-sm text-foreground">
                For security purposes, each SL Airlines card can only be
                activated once. This prevents unauthorized activation attempts
                and protects your account from fraud.
              </p>
            </div>
          </div>

          {/* What to do next */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-green-900 mb-4">
              What you can do now
            </h2>
            <ul className="space-y-3 text-sm text-green-800">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Access your SL Airlines dashboard to manage your account
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>View your card status and activation history</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Start earning miles on every transaction</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Contact SL Airlines support if you need assistance</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://slairlines.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Go to Dashboard
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m4-6l-8 8m0 0l-4-4m4 4l4-4"
                  />
                </svg>
              </Button>
            </a>
            <Button
              variant="outline"
              onClick={() => navigate("/review-status")}
            >
              View Card Status
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </Button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p className="flex items-start gap-2">
              <span className="text-lg mt-0.5">🔐</span>
              <span>
                <strong>Security Notice:</strong> If you believe this activation
                was not authorized by you, please contact SL Airlines support
                immediately.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 mt-12 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 SL Airlines. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a
              href="https://sites.google.com/view/sl-airlines/our-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Policies
            </a>
            <a
              href="https://sites.google.com/view/sl-airlines/club-open-page"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
