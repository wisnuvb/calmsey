"use client";

import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

const copy = {
  en: {
    leftTitle: "Policies not listed here",
    leftBody:
      "Some policies may currently be in development. Where policies are not listed, Turning Tides adheres to the legal and financial governance requirements of our fiscal sponsor, The Tenure Facility Fund, and the operational policies of the International Land and Forest Tenure Facility.",
    rightTitle: "Contact Information",
    rightIntro:
      "For questions or clarification regarding governance or policies:",
    emailLabel: "Email:",
    phoneLabel: "Phone:",
    addressLabel: "Mailing Address:",
    phoneLine:
      "+62 858 439 88093 (also available for whatsapp contact)",
    addressLine:
      "170 Norfolk Street #12, New York, NY 10002 USA",
  },
  id: {
    leftTitle: "Kebijakan yang tidak tercantum di sini",
    leftBody:
      "Beberapa kebijakan mungkin masih dalam penyusunan. Apabila kebijakan belum dicantumkan di sini, Turning Tides mematuhi persyaratan tata kelola hukum dan keuangan dari sponsor fiskal kami, The Tenure Facility Fund, serta kebijakan operasional International Land and Forest Tenure Facility.",
    rightTitle: "Informasi kontak",
    rightIntro:
      "Untuk pertanyaan atau klarifikasi seputar tata kelola atau kebijakan:",
    emailLabel: "Email:",
    phoneLabel: "Telepon:",
    addressLabel: "Alamat surat:",
    phoneLine:
      "+62 858 439 88093 (juga dapat dihubungi melalui WhatsApp)",
    addressLine:
      "170 Norfolk Street #12, New York, NY 10002 USA",
  },
} as const;

const DEFAULT_CONTACT_EMAIL = "info@TurningTidesFacility.org";

interface GovernancePolicyContactSectionProps {
  /** Override labels when content is wired from CMS (optional) */
  leftTitle?: string;
  leftBody?: string;
  rightTitle?: string;
  rightIntro?: string;
  phoneLine?: string;
  addressLine?: string;
  emailLabel?: string;
  phoneLabel?: string;
  addressLabel?: string;
  contactEmail?: string;
  backgroundColor?: string;
}

export function GovernancePolicyContactSection({
  leftTitle: propLeftTitle,
  leftBody: propLeftBody,
  rightTitle: propRightTitle,
  rightIntro: propRightIntro,
  phoneLine: propPhoneLine,
  addressLine: propAddressLine,
  emailLabel: propEmailLabel,
  phoneLabel: propPhoneLabel,
  addressLabel: propAddressLabel,
  contactEmail: propContactEmail,
  backgroundColor = "bg-white",
}: GovernancePolicyContactSectionProps = {}) {
  const { getValue, language } = usePageContentHelpers();
  const langKey = language === "id" ? "id" : "en";
  const t = copy[langKey];

  const leftTitle = getValue(
    "governancePolicyContact.leftTitle",
    propLeftTitle,
    t.leftTitle
  );

  const leftBody = getValue(
    "governancePolicyContact.leftBody",
    propLeftBody,
    t.leftBody
  );

  const rightTitle = getValue(
    "governancePolicyContact.rightTitle",
    propRightTitle,
    t.rightTitle
  );

  const rightIntro = getValue(
    "governancePolicyContact.rightIntro",
    propRightIntro,
    t.rightIntro
  );

  const phoneLine = getValue(
    "governancePolicyContact.phoneLine",
    propPhoneLine,
    t.phoneLine
  );

  const addressLine = getValue(
    "governancePolicyContact.addressLine",
    propAddressLine,
    t.addressLine
  );

  const emailLabel = getValue(
    "governancePolicyContact.emailLabel",
    propEmailLabel,
    t.emailLabel
  );

  const phoneLabel = getValue(
    "governancePolicyContact.phoneLabel",
    propPhoneLabel,
    t.phoneLabel
  );

  const addressLabel = getValue(
    "governancePolicyContact.addressLabel",
    propAddressLabel,
    t.addressLabel
  );

  const contactEmail = getValue(
    "governancePolicyContact.contactEmail",
    propContactEmail,
    DEFAULT_CONTACT_EMAIL
  ).trim() || DEFAULT_CONTACT_EMAIL;

  return (
    <section className={`w-full ${backgroundColor}`}>
      <div className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="flex flex-col md:flex-row md:items-stretch gap-10 md:gap-0 lg:gap-4">
          <div className="flex-1 min-w-0 md:pr-8 lg:pr-16">
            <h2
              id="gov-policy-contact-left"
              className="text-xl md:text-2xl font-bold text-[#010107] font-nunito mb-4 md:mb-6"
            >
              {leftTitle}
            </h2>
            <p className="text-[#060726CC] font-normal font-work-sans text-base leading-relaxed">
              {leftBody}
            </p>
          </div>

          <div
            className="hidden md:block w-px shrink-0 bg-neutral-300 self-stretch mx-2 lg:mx-4"
            aria-hidden
          />

          <div className="md:hidden w-full h-px bg-neutral-300 shrink-0" aria-hidden />

          <div className="flex-1 min-w-0 md:pl-8 lg:pl-16">
            <h2
              id="gov-policy-contact-right"
              className="text-xl md:text-2xl font-bold text-[#010107] font-nunito mb-4 md:mb-6"
            >
              {rightTitle}
            </h2>
            <div className="space-y-1 text-left text-[#060726CC] font-normal font-work-sans text-base leading-relaxed">
              <p>{rightIntro}</p>
              <p>
                <span className="text-[#010107]">{emailLabel}</span>{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-[#3C62ED] font-medium hover:underline"
                >
                  {contactEmail}
                </a>
              </p>
              <p>
                <span className="text-[#010107]">{phoneLabel}</span>{" "}
                {phoneLine}
              </p>
              <p>
                <span className="text-[#010107]">{addressLabel}</span>{" "}
                {addressLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
