import GiftSite from "@/components/GiftSite";

type CountryHomePageProps = {
  params: Promise<{
    country: string;
  }>;
};

export default async function CountryHomePage({ params }: CountryHomePageProps) {
  const { country } = await params;

  return (
    <GiftSite
      key={`${country}-home`}
      initialPage="home"
      initialCountryCode={country}
    />
  );
}
