"use client";
import { Check, Copy, Facebook, Linkedin, Mail, X, XIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";

// ShareModal Component
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
  venueUrl: string;
}

type Social = {
  name: string;
  url: string;
  color: string;
  icon: ReactNode; // 👈 important
};

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  venueName,
  venueUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(venueUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = venueUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const socialShares: Social[] = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(venueUrl)}`,
      icon: <Facebook className="w-6 h-6" />,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(venueUrl)}&url=${encodeURIComponent(venueUrl)}`,
      icon: <XIcon className="w-6 h-6" />,
      color: "bg-black hover:bg-gray-600",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(venueUrl)}`,
      icon: <Linkedin className="w-6 h-6" />,
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(`${venueUrl} - ${venueUrl}`)}`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.46 3.488" />
        </svg>
      ),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Email",
      url: `mailto:?subject=${encodeURIComponent(venueName)}&body=${encodeURIComponent(`Check out this article: ${venueUrl}`)}`,
      icon: <Mail className="w-6 h-6" />,
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Share</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Social Share Icons */}
        <div className="p-6">
          <div className="grid grid-cols-5 gap-3 mb-6">
            {socialShares.map((social) => {
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} text-white p-3 rounded-lg flex items-center justify-center transition-colors`}
                  title={`Share on ${social.name}`}
                >
                  {social.icon}
                </a>
              );
            })}
          </div>

          {/* Article Link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Link
            </label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <input
                type="text"
                value={venueUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
              />
            </div>
          </div>

          {/* Copy Link Button */}
          <Button
            onClick={copyToClipboard}
            className="w-full bg-red-600 hover:bg-red-800 text-white font-medium py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ShareModal;
