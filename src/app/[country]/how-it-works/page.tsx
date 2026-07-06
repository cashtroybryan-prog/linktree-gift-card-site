import GiftSite from "@/components/GiftSite";

type HowItWorksPageProps = {
  params: {
    country: string;
  };
};

export default function HowItWorksPage({ params }: HowItWorksPageProps) {
  return <GiftSite initialPage="how" initialCountryCode={params.country} />;
}