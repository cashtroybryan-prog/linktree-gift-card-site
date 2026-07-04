import GiftSite from "@/components/GiftSite";

type CountryShopPageProps = {
  params: Promise<{
    country: string;
  }>;
};

export default async function CountryShopPage({ params }: CountryShopPageProps) {
  const { country } = await params;

  return (
    <GiftSite
      key={`${country}-shop`}
      initialPage="wall"
      initialCountryCode={country}
    />
  );
}
