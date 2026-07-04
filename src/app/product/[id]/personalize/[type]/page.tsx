import GiftSite from "@/components/GiftSite";

type PersonalizePageProps = {
  params: Promise<{
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

export default async function PersonalizePage({
  params,
  searchParams,
}: PersonalizePageProps) {
  const { id, type } = await params;
  const { amount, creator, name, email, phone } = await searchParams;

  const recipientType =
    type === "creator" || type === "someone" || type === "myself"
      ? type
      : "someone";

  return (
    <GiftSite
      key={`us-personalize-${id}-${recipientType}-${amount ?? ""}-${creator ?? ""}-${email ?? ""}-${phone ?? ""}`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode="US"
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
