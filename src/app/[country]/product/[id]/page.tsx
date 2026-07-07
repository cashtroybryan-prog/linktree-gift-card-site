import GiftSite from "@/components/GiftSite";

type CountryProductPageProps = {
  params: Promise<{
    country: string;
    id: string;
  }>;
};

export default async function CountryProductPage({
  params,
}: CountryProductPageProps) {
  const { country, id } = await params;

  return (
    <GiftSite
      key={`${country}-product-${id}`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode={country}
    />
  );
}