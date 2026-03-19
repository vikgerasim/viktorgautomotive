import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Viktor G Automotive",
  description: "Privacy policy for Viktor G Automotive.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2 pb-2 border-b-2 border-red-600">
        Privacy Policy
      </h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Overview</h2>
        <p className="text-gray-700 leading-relaxed">
          Viktor G Automotive ("we", "us", or "our") operates viktorgautomotive.com. This page explains what data is collected when you visit this site, how it is used, and your rights regarding that data. We do not directly collect, store, or sell any personal information. However, third party services embedded on this site may collect data as described below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Third Party Services</h2>

        <h3 className="font-bold mb-2 mt-4">Google Analytics</h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          This site uses Google Analytics to collect anonymous visitor data including pages visited, time spent on pages, geographic location, and device type. This data is used solely to understand how visitors use the site and to improve content. Google Analytics uses cookies to collect this information. You can opt out of Google Analytics tracking by installing the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>

        <h3 className="font-bold mb-2 mt-4">YouTube</h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          This site embeds videos from YouTube. When you watch an embedded video, YouTube may collect data and set cookies in accordance with{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
            Google's Privacy Policy
          </a>. We have no control over data collected by YouTube.
        </p>

        <h3 className="font-bold mb-2 mt-4">Amazon Associates</h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          This site participates in the Amazon Associates Program. When you click an Amazon affiliate link, Amazon may collect data in accordance with{" "}
          <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
            Amazon's Privacy Notice
          </a>. We earn a small commission on qualifying purchases at no extra cost to you.
        </p>

        <h3 className="font-bold mb-2 mt-4">eBay Partner Network</h3>
        <p className="text-gray-700 leading-relaxed">
          Some product links on this site are eBay affiliate links. When you click an eBay affiliate link, eBay may collect data in accordance with{" "}
          <a href="https://www.ebay.com/help/policies/member-behaviour-policies/user-privacy-notice-privacy-policy?id=4260" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
            eBay's User Privacy Notice
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Cookies</h2>
        <p className="text-gray-700 leading-relaxed">
          This site does not set any first-party cookies directly. Cookies may be set by third party services including Google Analytics and YouTube as described above. You can control cookies through your browser settings or by using a browser extension to block third party cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Children's Privacy</h2>
        <p className="text-gray-700 leading-relaxed">
          This site is not directed at children under the age of 13 and we do not knowingly collect any personal information from children.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Changes to This Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          We may update this privacy policy from time to time. Any changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Contact</h2>
        <p className="text-gray-700 leading-relaxed">
          For any privacy related questions or requests, contact us at{" "}
          <a href="mailto:privacy@viktorgautomotive.com" className="text-red-600 hover:underline">
            privacy@viktorgautomotive.com
          </a>.
        </p>
      </section>

    </main>
  );
}