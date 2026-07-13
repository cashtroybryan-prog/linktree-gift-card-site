import GiftSite from "@/components/GiftSite";

type ShopPageProps = {
  params: {
    country: string;
  };
};

export default function ShopPage({ params }: ShopPageProps) {
  return <GiftSite initialPage="wall" initialCountryCode={params.country} />;
}