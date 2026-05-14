function Footer() {
  return (
    <footer className="bg-gradient-to-b from-green-50 to-emerald-100 border-t border-green-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10 mb-8">
          <div className="md:col-span-1">
            <h4 className="font-bold text-2xl mb-4 text-emerald-900">Gomviet</h4>
            <p className="text-emerald-800 leading-relaxed mb-4">
              Gốm sứ thủ công Việt Nam
            </p>
            <p className="text-emerald-700 text-sm italic">
              "Tinh hoa gốm sứ - Nét đẹp truyền thống"
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-emerald-900 text-lg">Sản phẩm</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-emerald-800 hover:text-emerald-950 transition-colors">Bát đĩa</a></li>
              <li><a href="#" className="text-emerald-800 hover:text-emerald-950 transition-colors">Ấm chén</a></li>
              <li><a href="#" className="text-emerald-800 hover:text-emerald-950 transition-colors">Lọ hoa</a></li>
              <li><a href="#" className="text-emerald-800 hover:text-emerald-950 transition-colors">Trang trí</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-emerald-900 text-lg">Liên hệ</h4>
            <div className="space-y-3 text-emerald-800">
              <p className="flex items-start">
                <span className="mr-2">📍</span>
                <span>Phuoc Long B, Thủ Đức, HCMC</span>
              </p>
              <p className="flex items-center">
                <span className="mr-2">📧</span>
                <span>info@gomviet.vn</span>
              </p>
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                <span className="font-semibold">0901 234 567</span>
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-emerald-900 text-lg">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-emerald-800 hover:text-emerald-950 transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="text-emerald-800 hover:text-emerald-950 transition-colors">Bảo hành sản phẩm</a></li>
              <li><a href="#" className="text-emerald-800 hover:text-emerald-950 transition-colors">Vận chuyển</a></li>
              <li><a href="#" className="text-emerald-800 hover:text-emerald-950 transition-colors">Hướng dẫn bảo quản</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-300 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-emerald-700 text-sm mb-3 md:mb-0">
            © 2025 Gomviet - Gốm Sứ Thủ Công Việt Nam
          </p>
          <div className="flex gap-4">
            <a href="https://web.facebook.com/trinh.slayyyy2711/" className="w-8 h-8 bg-green-200 hover:bg-green-300 rounded-full flex items-center justify-center transition-colors">
              <span className="text-emerald-900">f</span>
            </a>
            <a href="#" className="w-8 h-8 bg-green-200 hover:bg-green-300 rounded-full flex items-center justify-center transition-colors">
              <span className="text-emerald-900">in</span>
            </a>
            <a href="https://www.instagram.com/trluu_/" className="w-8 h-8 bg-green-200 hover:bg-green-300 rounded-full flex items-center justify-center transition-colors">
              <span className="text-emerald-900">ig</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;