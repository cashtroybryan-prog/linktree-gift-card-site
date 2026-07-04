import GiftSite from "@/components/GiftSite";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <GiftSite
      key={`us-product-${id}`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode="US"
    />
  );
}
