import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/product-row/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));

    fetch("http://127.0.0.1:8000/api/product-list")
      .then(res => res.json())
      .then(data => {
        const others = data.filter(p => p.id !== parseInt(id));
        setRelated(others.slice(0, 4));
      });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl font-medium text-gray-700">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  const increaseQty = () => setQty(qty + 1);
  const decreaseQty = () => qty > 1 && setQty(qty - 1);

  const handleAddToCart = () => {
    alert(`Đã thêm ${qty} x ${product.name} vào giỏ hàng`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-emerald-700 transition">Trang chủ</a>
          <span>/</span>
          <a href="/products" className="hover:text-emerald-700 transition">Sản phẩm</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* CHI TIẾT SẢN PHẨM */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">

          {/* Ảnh sản phẩm */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg">
                  Thủ công
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex flex-col justify-center space-y-6">
            
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              
            </div>

            {/* Mô tả */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Mô tả sản phẩm
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.content}
              </p>
            </div>

            {/* Đặc điểm nổi bật */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">🏺</div>
                <div className="text-sm text-gray-600">Thủ công</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">🌿</div>
                <div className="text-sm text-gray-600">Thân thiện</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">✨</div>
                <div className="text-sm text-gray-600">Cao cấp</div>
              </div>
            </div>
            {/* Thông tin thêm */}
            <div className="flex gap-6 text-sm text-gray-600 pt-4">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Miễn phí giao hàng</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Bảo hành 12 tháng</span>
              </div>
            </div>
          </div>
        </div>

        {/* GỢI Ý SẢN PHẨM KHÁC */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sản phẩm tương tự
            </h2>
            <p className="text-gray-600 text-lg">
              Khám phá thêm những sản phẩm gốm thủ công khác
            </p>
          </div>

          {related.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">🏺</div>
              <p>Chưa có sản phẩm tương tự</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;