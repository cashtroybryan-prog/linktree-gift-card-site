import GiftSite from "@/components/GiftSite";

type GiftTrackerPageProps = {
  params: {
    country: string;
  };
};

export default function GiftTrackerPage({ params }: GiftTrackerPageProps) {
  return <GiftSite initialPage="tracker" initialCountryCode={params.country} />;
}