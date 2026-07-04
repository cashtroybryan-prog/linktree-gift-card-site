import GiftSite from "@/components/GiftSite";

type CountryRecipientPageProps = {
  params: Promise<{
    country: string;
    id: string;
  }>;
  searchParams: Promise<{
    amount?: string;
  }>;
};

export default async function CountryRecipientPage({
  params,
  searchParams,
}: CountryRecipientPageProps) {
  const { country, id } = await params;
  const { amount } = await searchParams;

  return (
    <GiftSite
      key={`${country}-recipient-${id}-${amount ?? ""}`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode={country}
      initialProductStep="recipient"
      initialAmount={amount ? Number(amount) : null}
    />
  );
}
