import { useEffect, useState } from "react";

function Category({ onSelectCategory = () => {} }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/category-list")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p>Đang tải danh mục...</p>
      </section>
    );
  }

  return (
    <section
      id="category"
      className="py-20 bg-gradient-to-b from-white via-amber-50/50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900">
            Danh mục sản phẩm
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group cursor-pointer relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Category;
