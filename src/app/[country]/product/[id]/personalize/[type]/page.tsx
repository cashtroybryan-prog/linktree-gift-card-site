import GiftSite from "@/components/GiftSite";

type CountryPersonalizePageProps = {
  params: Promise<{
    country: string;
    id: string;
    type: string;
  }>;
  searchParams: Promise<{
    amount?: string;
    creator?: string;
    name?: string;
    email?: string;
    phone?: string;
  }>;
};

export default async function CountryPersonalizePage({
  params,
  searchParams,
}: CountryPersonalizePageProps) {
  const { country, id, type } = await params;
  const { amount, creator, name, email, phone } = await searchParams;

  const recipientType =
    type === "creator" || type === "someone" || type === "myself"
      ? type
      : "someone";

  return (
    <GiftSite
      key={`${country}-personalize-${id}-${recipientType}-${amount ?? ""}-${creator ?? ""}-${email ?? ""}-${phone ?? ""}`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode={country}
      initialProductStep="personalize"
      initialRecipientType={recipientType}
      initialAmount={amount ? Number(amount) : null}
      initialCreatorHandle={creator}
      initialRecipientName={name}
      initialRecipientEmail={email}
      initialRecipientPhone={phone}
    />
  );
}
