import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2 border border-green-100">
        
        {/* Ảnh sản phẩm */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 aspect-square">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay khi hover */}
          <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-all duration-500"></div>
          
          {/* Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-full shadow-lg">
              Xem chi tiết →
            </span>
          </div>
          
          {/* Icon yêu thích */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              alert('Đã thêm vào yêu thích!');
            }}
            className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-50"
          >
            <span className="text-lg">💚</span>
          </button>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="p-6 bg-gradient-to-b from-white to-green-50/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-relaxed">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-green-600">✓</span> Giá đã bao gồm VAT
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;