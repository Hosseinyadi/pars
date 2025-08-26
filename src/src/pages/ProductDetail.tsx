import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleProducts } from "@/data/products";
import { useEffect, useState } from "react";

/**
 * ProductDetail displays detailed information about a single product or service.
 * It looks up the product by its ID from the sampleProducts dataset. In a
 * real application this would fetch data from Supabase based on the slug or ID.
 */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState(() => sampleProducts.find(p => p.id === id));

  // This effect could fetch data from Supabase when mounted
  useEffect(() => {
    if (!product) {
      const found = sampleProducts.find(p => p.id === id);
      setProduct(found);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">محصول یافت نشد</h1>
          <p className="text-muted-foreground mb-6">محصول مورد نظر شما در پایگاه داده موجود نیست.</p>
          <Button onClick={() => navigate(-1)}>بازگشت</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          بازگشت
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            {product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                className="w-full h-72 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-72 bg-muted rounded-lg mb-4"></div>
            )}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx + 2}`}
                    loading="lazy"
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
          {/* Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <Badge variant="secondary">{product.category}</Badge>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="text-primary text-3xl font-bold">
                {product.price.toLocaleString('fa-IR')} <span className="text-base text-muted-foreground">تومان</span>
              </div>
              {product.specs && (
                <div>
                  <h3 className="font-medium mb-2">مشخصات فنی:</h3>
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded">
{product.specs}
                  </pre>
                </div>
              )}
              <div>
                <h3 className="font-medium mb-2">فروشنده:</h3>
                <p>{product.seller.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;