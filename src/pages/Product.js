import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const url = selectedCategory
      ? `http://127.0.0.1:8000/api/product-list?category_id=${selectedCategory}`
      : "http://127.0.0.1:8000/api/product-list";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <section
      id="products"
      className="py-24 bg-gradient-to-b from-white via-amber-50/30 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-4">
            ✨ Bộ sưu tập đặc biệt
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Sản phẩm nổi bật
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p>Không có sản phẩm trong danh mục này</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Products;
