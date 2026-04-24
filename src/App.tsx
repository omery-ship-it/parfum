/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Wind, 
  Leaf, 
  Flame, 
  Droplets,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gift,
  Plus,
  ArrowRight
} from 'lucide-react';

// --- Types ---
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  notes: {
    top: string;
    middle: string;
    base: string;
  };
  category: string;
  gender: 'Erkek' | 'Kadın' | 'Unisex';
  isBestSeller?: boolean;
  campaign?: string;
  stock: number;
  reviewsCount?: number;
  rating?: number;
  volume?: string;
  concentration?: string;
  stockStatus?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Hazırlanıyor' | 'Kargoya Verildi' | 'Teslim Edildi';
}

interface CartItem extends Product {
  quantity: number;
}

const SIGNATURE_IMAGE = 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1200';

const PRODUCTS_DATA: Product[] = [
  {
    id: 's-1',
    brand: 'Dior',
    name: 'Sauvage',
    price: 1250,
    originalPrice: 3900,
    image: SIGNATURE_IMAGE,
    category: 'Fresh',
    gender: 'Erkek',
    isBestSeller: true,
    campaign: '3 ADET 1250 TL',
    notes: { top: 'Bergamot', middle: 'Lavender', base: 'Ambroxan' },
    stock: 42
  },
  {
    id: 'f-1',
    brand: 'Dior',
    name: 'Fahrenheit',
    price: 1250,
    originalPrice: 3600,
    image: SIGNATURE_IMAGE,
    category: 'Spicy',
    gender: 'Erkek',
    isBestSeller: true,
    campaign: '3 ADET 1250 TL',
    notes: { top: 'Mandarin', middle: 'Violet', base: 'Leather' },
    stock: 15
  },
  {
    id: 'l-1',
    brand: 'Lacoste',
    name: 'L.12.12 Noir',
    price: 1250,
    originalPrice: 4800,
    image: SIGNATURE_IMAGE,
    category: 'Fresh',
    gender: 'Erkek',
    isBestSeller: true,
    campaign: '3 ADET 1250 TL',
    notes: { top: 'Watermelon', middle: 'Basil', base: 'Dark Chocolate' },
    stock: 28
  },
  {
    id: 'a-1',
    brand: 'Armani',
    name: 'Stronger With You',
    price: 1250,
    originalPrice: 2200,
    image: SIGNATURE_IMAGE,
    category: 'Spicy',
    gender: 'Erkek',
    isBestSeller: true,
    campaign: '3 ADET 1250 TL',
    notes: { top: 'Cardamom', middle: 'Sage', base: 'Vanilla' },
    stock: 12
  },
  {
    id: 'p-1',
    brand: 'Prada',
    name: 'Paradoxe',
    price: 1250,
    originalPrice: 3800,
    image: SIGNATURE_IMAGE,
    category: 'Floral',
    gender: 'Kadın',
    isBestSeller: true,
    campaign: '3 ADET 1250 TL',
    notes: { top: 'Neroli', middle: 'Amber', base: 'Musk' },
    stock: 50
  },
  {
    id: 'v-1',
    brand: 'Valentino',
    name: 'Born In Roma',
    price: 1250,
    originalPrice: 4100,
    image: SIGNATURE_IMAGE,
    category: 'Floral',
    gender: 'Kadın',
    isBestSeller: true,
    campaign: '3 ADET 1250 TL',
    notes: { top: 'Jasmine', middle: 'Vanilla', base: 'Woody' },
    stock: 33
  },
  {
    id: 'c-1',
    brand: 'Chanel',
    name: 'Bleu de Chanel',
    price: 1250,
    originalPrice: 4500,
    image: SIGNATURE_IMAGE,
    category: 'Woody',
    gender: 'Erkek',
    notes: { top: 'Grapefruit', middle: 'Ginger', base: 'Cedar' },
    stock: 19
  },
  {
    id: 'y-1',
    brand: 'YSL',
    name: 'Libre',
    price: 1250,
    originalPrice: 3950,
    image: SIGNATURE_IMAGE,
    category: 'Floral',
    gender: 'Kadın',
    notes: { top: 'Lavender', middle: 'Orange Blossom', base: 'Musk' },
    stock: 24
  }
];

  const NOTE_CATEGORIES = [
    { id: 'all', name: 'Tümü', icon: <Star size={16} /> },
    { id: 'deals', name: 'Günün Fırsatları 🔥', icon: <Flame size={16} className="text-red-500 animate-pulse" /> },
    { id: 'Woody', name: 'Odunsu', icon: <Leaf size={16} /> },
    { id: 'Floral', name: 'Çiçeksi', icon: <Wind size={16} /> },
    { id: 'Fresh', name: 'Taze', icon: <Droplets size={16} /> },
    { id: 'Spicy', name: 'Baharatlı', icon: <Flame size={16} /> },
  ];

const ProductCard = ({ product, styleClass, onAdd, onToggleFavorite, addingId, isFavorite }: any) => {
  const volume = product.volume || "100 ML";
  const concentration = product.concentration || "EDP";
  const reviewsCount = product.reviewsCount || Math.floor((product.price || 1) % 500) + 120;
  const rating = product.rating || 4.9;
  const stockStatus = product.stockStatus || (product.stock < 20 ? `SON ${product.stock} ÜRÜN` : null);
  const originalPrice = product.originalPrice;
  const currentPrice = product.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white flex flex-col group cursor-pointer transition-all duration-700 luxury-shadow border border-ink/5 ${styleClass}`}
    >
      <div className="aspect-square lg:aspect-[3/4] overflow-hidden relative bg-[#FBFBFB] flex items-center justify-center p-4 md:p-6 lg:p-8">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10">
          {product.campaign && (
            <div className="bg-red-600 text-white text-[8px] md:text-[9px] uppercase tracking-widest font-black px-3 py-1.5 w-max shadow-sm">
              {product.campaignBadge || "FIRSAT"}
            </div>
          )}
          {product.isBestSeller && !product.campaign && (
            <div className="bg-ink text-bone text-[8px] md:text-[9px] uppercase tracking-widest font-black px-3 py-1.5 w-max">
              ÖZEL SERİ
            </div>
          )}
          {stockStatus && (
            <div className="bg-orange-500 text-white text-[8px] md:text-[9px] uppercase tracking-widest font-black px-3 py-1.5 w-max shadow-sm animate-pulse">
              {stockStatus}
            </div>
          )}
        </div>

        {/* Mobile touch target minimum 44x44 */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          className="absolute top-4 right-4 z-40 w-11 h-11 lg:w-9 lg:h-9 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-sm sm:hover:bg-white transition-all shadow-sm"
        >
          <Heart size={18} className={isFavorite ? 'fill-gold text-gold' : 'text-gray-400 hover:text-gold'} strokeWidth={isFavorite ? 1 : 1.5} />
        </button>

        {/* Hover Notes Overlay - Desktop Only */}
        <div className="absolute inset-0 bg-ink/90 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-20 hidden lg:flex flex-col items-center justify-center text-white p-6 text-center pointer-events-none">
          <h4 className="text-[10px] tracking-[0.3em] text-gold mb-4 uppercase">Koku Profili</h4>
          <div className="flex flex-col gap-4 text-xs font-light">
            <span className="flex items-center gap-2"><Wind size={14} className="text-gold" /> Üst: {product.notes?.top || 'Narenciye'}</span>
            <span className="flex items-center gap-2"><Leaf size={14} className="text-gold" /> Orta: {product.notes?.middle || 'Çiçeksi'}</span>
            <span className="flex items-center gap-2"><Droplets size={14} className="text-gold" /> Alt: {product.notes?.base || 'Odunsu'}</span>
          </div>
        </div>

        {/* Desktop Quick Actions - Hover Only */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 z-30 hidden lg:block">
            <button 
              onClick={(e) => { e.stopPropagation(); onAdd(product); }}
              className={`w-full h-12 flex items-center justify-center gap-2 rounded-none transition-all font-bold tracking-[0.2em] text-[10px] uppercase shadow-md ${addingId === product.id ? 'bg-red-600 text-white cursor-default' : 'bg-white text-ink hover:bg-red-600 hover:text-white'}`}
            >
              {addingId === product.id ? 'EKLENDİ' : 'SEPETE EKLE'}
            </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3 md:p-5 lg:p-8">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <span className="text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star size={10} fill="#D4AF37" color="#D4AF37" strokeWidth={0} />
            <span className="text-[8px] md:text-[9px] lg:text-[10px] text-gray-600 font-mono font-medium">{rating} <span className="opacity-50 hidden lg:inline">({reviewsCount})</span></span>
          </div>
        </div>

        <div className="mb-3 md:mb-4">
          {/* Truncate aggressively on mobile */}
          <h3 className="text-sm md:text-base lg:text-xl font-sans font-medium uppercase tracking-wider leading-tight line-clamp-2 text-ink mb-2 lg:mb-3">{product.name}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 lg:gap-2">
              <span className="text-[7px] md:text-[8px] lg:text-[9px] font-bold tracking-widest text-ink bg-stone-100 px-1 lg:px-2 py-0.5 lg:py-1 uppercase">{volume}</span>
              <span className="text-[7px] md:text-[8px] lg:text-[9px] font-bold tracking-widest text-ink bg-stone-100 px-1 lg:px-2 py-0.5 lg:py-1 uppercase">{concentration}</span>
            </div>
            
            {/* Mobile Scent Icons */}
            <div className="flex lg:hidden items-center gap-1.5 text-gold">
               <Wind size={12} />
               <Leaf size={12} />
               <Droplets size={12} />
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-3 md:pt-4 lg:pt-6 border-t border-ink/5">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {originalPrice ? (
                <>
                  <span className="text-[9px] md:text-[10px] lg:text-xs text-gray-400 line-through leading-none mb-1">₺ {originalPrice.toLocaleString()}</span>
                  <span className="text-base md:text-lg lg:text-2xl font-bold tracking-tighter leading-none text-red-600">₺ {currentPrice.toLocaleString()}</span>
                </>
              ) : (
                <span className="text-base md:text-lg lg:text-2xl font-bold tracking-tighter leading-none text-ink mt-auto">₺ {currentPrice.toLocaleString()}</span>
              )}
            </div>
            {product.campaign && (
              <span className="text-[7px] md:text-[8px] lg:text-[9px] uppercase tracking-widest text-red-600 font-black max-w-[70px] lg:max-w-[80px] text-right leading-tight">
                {product.campaign}
              </span>
            )}
          </div>
          
          {/* Mobile Always Visible Add to Cart */}
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className={`w-full mt-3 md:mt-5 h-9 md:h-11 lg:hidden flex items-center justify-center gap-2 rounded-none transition-all font-bold tracking-[0.2em] text-[8px] md:text-[9px] uppercase shadow-sm ${addingId === product.id ? 'bg-red-600 text-white cursor-default' : 'bg-ink text-white hover:bg-red-600 hover:text-white'}`}
          >
            {addingId === product.id ? 'EKLENDİ' : 'SEPETE EKLE'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'store' | 'cargo' | 'checkout' | 'admin'>('store');
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [show3DS, setShow3DS] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', address: '', phone: '' });
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ brand: '', name: '', price: 0, stock: 10, category: 'Woody', gender: 'Unisex', image: SIGNATURE_IMAGE });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(54000); // 15 hours in seconds
  const [hoveredSide, setHoveredSide] = useState<'none' | 'Erkek' | 'Kadın'>('none');
  const sliderRefTop = useRef<HTMLDivElement>(null);
  const sliderRefBottom = useRef<HTMLDivElement>(null);
  const nextSlideRef = useRef<'top' | 'bottom'>('top');
  const isTopPausedRef = useRef(false);
  const isBottomPausedRef = useRef(false);

  const filteredProducts = products.filter(p => {
    if (activeCategory === 'deals') {
        return !!p.campaign;
    }
    const matchesCategory = activeCategory === 'all' || p.gender === activeCategory || p.category === activeCategory;
    return matchesCategory;
  });

  const searchResults = products.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(searchLower) || 
           p.brand.toLowerCase().includes(searchLower) ||
           p.category.toLowerCase().includes(searchLower);
  });

  const bestSellersTop = products.filter(p => 
    p.isBestSeller && 
    (activeCategory === 'all' || p.gender === activeCategory)
  );

  const bestSellersBottom = [...bestSellersTop.slice(1), ...bestSellersTop.slice(0, 1)];

  const scrollSlider = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null> = sliderRefTop) => {
    if (ref.current) {
      const children = ref.current.children;
      if (children.length > 0) {
        const itemWidth = (children[0] as HTMLElement).offsetWidth + 20; // gap-5 is 20px
        const currentScroll = ref.current.scrollLeft;
        const { scrollWidth } = ref.current;
        const singleSetWidth = scrollWidth / 3;

        let nextScroll = currentScroll + itemWidth;

        // Infinite loop junction
        if (nextScroll >= singleSetWidth * 2) {
          ref.current.scrollLeft = currentScroll - singleSetWidth;
          nextScroll = ref.current.scrollLeft + itemWidth;
        }

        ref.current.scrollTo({
          left: nextScroll,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleSliderScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth } = ref.current;
    if (scrollWidth === 0) return;
    
    const singleSetWidth = scrollWidth / 3;
    
    // Görünmez sıçrama noktaları (Infinite Loop)
    if (scrollLeft >= singleSetWidth * 2.5) {
      ref.current.scrollLeft = scrollLeft - singleSetWidth;
    } else if (scrollLeft <= singleSetWidth * 0.5) {
      ref.current.scrollLeft = scrollLeft + singleSetWidth;
    }
  };

  useEffect(() => {
    // Initial center position for infinite loop with a small delay to ensure render
    const initTimer = setTimeout(() => {
      [sliderRefTop, sliderRefBottom].forEach((ref, index) => {
        const dataLength = index === 0 ? bestSellersTop.length : bestSellersBottom.length;
        if (ref.current && dataLength > 0 && ref.current.children.length > 0) {
          const children = ref.current.children;
          const itemWidth = (children[0] as HTMLElement).offsetWidth;
          const gap = 20;
          const singleSetWidth = dataLength * (itemWidth + gap);
          ref.current.scrollTo({ left: singleSetWidth, behavior: 'auto' });
        }
      });
    }, 200);
    return () => clearTimeout(initTimer);
  }, [bestSellersTop.length, bestSellersBottom.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Auto-slide effect for hero slider
    const slideTimer = setInterval(() => {
      if (currentView === 'store') {
        if (nextSlideRef.current === 'top') {
          if (!isTopPausedRef.current) scrollSlider('right', sliderRefTop);
          nextSlideRef.current = 'bottom';
        } else {
          if (!isBottomPausedRef.current) scrollSlider('right', sliderRefBottom);
          nextSlideRef.current = 'top';
        }
      }
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(slideTimer);
    };
  }, [currentView]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addToCart = (product: Product) => {
    setAddingId(product.id);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartToast(`"${product.name}" SEPETE EKLENDİ`);
    setTimeout(() => {
      setAddingId(null);
      setCartToast(null);
    }, 1500);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        setCartToast("FAVORİLERDEN ÇIKARILDI");
        return prev.filter(favId => favId !== id);
      } else {
        setCartToast("FAVORİLERE EKLENDİ");
        return [...prev, id];
      }
    });
    setTimeout(() => setCartToast(null), 1500);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const completeOrder = () => {
    setIsProcessing(true);
    // Simulate payment gateway handoff (iyzico/PayTR)
    setTimeout(() => {
      setIsProcessing(false);
      setShow3DS(true);
    }, 2000);
  };

  const verify3DS = () => {
    setShow3DS(false);
    setIsProcessing(true);
    
    // Finalize order
    setTimeout(() => {
      const newOrder: Order = {
        id: `ESS-${Math.floor(Math.random() * 90000) + 10000}`,
        customerName: checkoutData.name || 'Misafir Müşteri',
        customerEmail: checkoutData.email || 'bilgi@lessence.com',
        items: [...cart],
        total: cartTotal,
        date: new Date().toLocaleString('tr-TR'),
        status: 'Hazırlanıyor'
      };
      
      setOrders(prev => [newOrder, ...prev]);
      
      // Decrease stock
      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(ci => ci.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      }));
      
      setCart([]);
      setIsProcessing(false);
      setCartToast("ÖDEME BAŞARILI. SİPARİŞİNİZ ALINDI.");
      setCurrentView('store');
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 1500);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.price) return;
    
    const p: Product = {
      id: `new-${Date.now()}`,
      brand: newProduct.brand || '',
      name: newProduct.name || '',
      price: Number(newProduct.price) || 0,
      image: newProduct.image || SIGNATURE_IMAGE,
      category: newProduct.category || 'Odunsu',
      gender: (newProduct.gender as any) || 'Unisex',
      notes: { top: 'Belirtilmemiş', middle: 'Belirtilmemiş', base: 'Belirtilmemiş' },
      stock: Number(newProduct.stock) || 0
    };

    setProducts(prev => [...prev, p]);
    setNewProduct({ brand: '', name: '', price: 0, stock: 10, category: 'Woody', gender: 'Unisex', image: SIGNATURE_IMAGE });
    setCartToast("YENİ ÜRÜN EKLENDİ");
  };

  const updateStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, stock: Math.max(0, p.stock + delta) };
      }
      return p;
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setCartToast("ÜRÜN BAŞARIYLA SİLİNDİ");
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setCartToast(`SİPARİŞ DURUMU: ${newStatus.toUpperCase()}`);
  };

  const getCartProgressMessage = () => {
    if (cartCount === 0) return "Fırsatları kaçırmak üzeresin! Sepetine ürün ekle.";
    if (cartCount === 1) return "🔥 3 AL 1 ÖDE fırsatına sadece 2 ürün kaldı!";
    if (cartCount === 2) return "🚨 Son 1 ürün! Ekleyerek SONRAKİ ÜRÜNÜ BEDAVA kazan!";
    return "🎉 TEBRİKLER! 3 Al 1 Öde (1 Ürün Bedava) kazandınız!";
  };
  const cartProgressPercentage = Math.min((cartCount / 3) * 100, 100);

  // Fake social proof notification state
  const [socialProof, setSocialProof] = useState<{name: string, location: string, product: string, time: string} | null>(null);

  useEffect(() => {
    const notifications = [
      { name: 'Ali', location: 'İstanbul', product: 'Sauvage', time: '1 dakika önce' },
      { name: 'Ayşe', location: 'Ankara', product: 'Paradoxe', time: 'Şimdi' },
      { name: 'Mehmet', location: 'İzmir', product: 'L.12.12 Noir', time: '2 dakika önce' },
      { name: 'Selin', location: 'Bursa', product: 'Stronger With You', time: 'Şimdi' },
      { name: 'Kerem', location: 'Antalya', product: 'Born In Roma', time: '5 dakika önce' }
    ];

    const showRandomNotification = () => {
      const idx = Math.floor(Math.random() * notifications.length);
      setSocialProof(notifications[idx]);
      setTimeout(() => setSocialProof(null), 5000); // Hide after 5 seconds
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.4) showRandomNotification();
    }, 12000); // Check every 12 seconds
    
    setTimeout(() => showRandomNotification(), 3000); // Initial fast notification
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen selection:bg-accent/30 font-sans bg-bone text-ink">
      {/* --- Search Overlay --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col p-8 md:p-20"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="text-xl md:text-2xl font-sans font-bold tracking-[0.4em] uppercase">L'Essence</span>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
                className="p-4 hover:bg-bone transition-colors rounded-full"
              >
                <X size={32} />
              </button>
            </div>
            
            <div className="max-w-4xl mx-auto w-full">
              <div className="relative mb-12">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="ARADIĞINIZ KOKUYU YAZIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink py-8 text-2xl md:text-5xl font-sans font-extralight tracking-tighter focus:outline-none placeholder:text-gray-200"
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300" size={40} />
              </div>
              
              <div className="flex flex-wrap gap-4 mb-20">
                <span className="text-[10px] font-black tracking-widest opacity-30 mr-4">POPÜLER:</span>
                {['Sauvage', 'Libre', 'Fahrenheit', 'Odunsu', 'Erkek'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="text-[10px] font-bold tracking-widest px-4 py-2 bg-bone hover:bg-gold transition-colors"
                  >
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>

              {searchTerm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[40vh] no-scrollbar">
                  {searchResults.slice(0, 4).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => { 
                        setIsSearchOpen(false); 
                        setSearchTerm('');
                        setActiveCategory('all');
                        document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); 
                      }}
                      className="flex gap-6 items-center group cursor-pointer border-b border-bone pb-6 relative"
                    >
                      <div className="w-20 h-24 bg-bone p-4 overflow-hidden relative">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gold font-black tracking-widest mb-1">{p.brand.toUpperCase()}</p>
                        <h4 className="text-lg font-sans font-light uppercase tracking-wide">{p.name}</h4>
                        <p className="text-sm font-bold mt-2">₺ {p.price.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                        className={`p-3 rounded-full transition-colors ${favorites.includes(p.id) ? 'text-gold' : 'text-gray-200 hover:text-gold'}`}
                      >
                        <Heart size={20} className={favorites.includes(p.id) ? 'fill-current' : ''} />
                      </button>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <p className="text-xl opacity-30">ARAMANIZA UYGUN ÜRÜN BULUNAMADI.</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Bar */}
      <div className="bg-red-600 text-[10px] md:text-xs uppercase tracking-[0.3em] font-black py-3 md:py-4 text-center text-white flex items-center justify-center gap-4 px-4 z-[60] shadow-md">
        <span className="hidden md:inline">🔥 SON FIRSATIN BİTMESİNE:</span>
        <span className="text-white font-mono text-base md:text-xl tracking-wider animate-pulse drop-shadow-md">{formatTime(timeLeft)}</span>
        <span className="hidden md:inline">🔥</span>
        <div className="mx-4 h-4 w-px bg-white/30 hidden md:block" />
        <span className="inline-block skew-x-[-10deg]"><span className="skew-x-[10deg] block">TÜM ÜRÜNLERDE <span className="text-yellow-300">3 AL 1 ÖDE!</span></span></span>
      </div>

      {/* --- Header --- */}
      {/* --- Floating Designer Rail (Luxury Refined) --- */}
      <motion.div 
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 top-24 bottom-0 z-40 hidden xl:flex flex-col items-center justify-between w-12 py-20 pointer-events-none"
      >
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-gold/50 to-gold" />
        
        <div className="py-12 flex flex-col items-center gap-6">
          <div className="w-1.5 h-1.5 border border-gold rotate-45" />
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] uppercase tracking-[1.2em] font-bold text-ink/80 antialiased">
            EST. 2026 <span className="text-gold font-black">L'ESSENCE MAISON</span>
          </span>
          <div className="w-1.5 h-1.5 border border-gold rotate-45" />
        </div>

        <div className="w-px flex-1 bg-gradient-to-t from-transparent via-gold/50 to-gold" />
      </motion.div>

      <header 
        className={`sticky top-0 left-0 right-0 h-20 transition-all duration-300 border-b z-50 glass backdrop-blur-md ${
          scrolled 
            ? 'py-2 shadow-lg bg-white/95' 
            : 'border-transparent py-4 bg-white/60'
        }`}
      >
        <div className="w-full px-6 md:px-12 h-full flex items-center justify-between relative">
          {/* Left: Navigation */}
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="xl:hidden text-ink p-2 -ml-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <nav className="hidden xl:flex items-center gap-10 text-[11px] tracking-[0.4em] font-semibold text-ink/50">
              <button 
                onClick={() => { document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="transition-all duration-300 whitespace-nowrap hover:text-ink"
              >
                KOLEKSİYON
              </button>
              <button 
                onClick={() => { setActiveCategory('Erkek'); document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="transition-all duration-300 whitespace-nowrap hover:text-ink"
              >
                ERKEK
              </button>
              <button 
                onClick={() => { setActiveCategory('Kadın'); document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="transition-all duration-300 whitespace-nowrap hover:text-ink"
              >
                KADIN
              </button>
              <button 
                onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="hover:text-ink transition-all duration-300 whitespace-nowrap"
              >
                HAKKIMIZDA
              </button>
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none px-4">
              <a href="/" className="flex flex-col items-center pointer-events-auto group">
                <span className="text-xl md:text-2xl font-sans font-bold tracking-[0.4em] uppercase leading-none">L'Essence</span>
                <span className="text-[7px] uppercase tracking-[0.6em] font-medium opacity-40 group-hover:opacity-100 transition-opacity mt-1">Parfüm Evi</span>
              </a>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-4 md:gap-6 items-center justify-end flex-1 text-[10px] xl:text-[11px] letter-spacing-wide font-medium">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-accent transition-colors hidden sm:flex items-center gap-2 uppercase"
            >
              <Search size={18} strokeWidth={1.5} />
              ARA
            </button>
            <button 
              onClick={() => setIsFavoritesOpen(true)}
              className="hidden sm:flex items-center gap-2 hover:text-accent transition-colors uppercase leading-none"
            >
              <Heart size={18} strokeWidth={1.5} className={favorites.length > 0 ? 'fill-red-500 text-red-500' : ''} />
              FAVORİLER ({favorites.length})
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-accent transition-colors flex items-center gap-2"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="hidden md:inline">Sepet ({cartCount})</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-gold text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm font-bold">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* --- Favorites Sidebar --- */}
      <AnimatePresence>
        {isFavoritesOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100]"
              onClick={() => setIsFavoritesOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-ink/5">
                <h3 className="text-sm font-sans font-bold tracking-[0.4em]">FAVORİLERİM</h3>
                <button onClick={() => setIsFavoritesOpen(false)} className="p-2 hover:bg-bone transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                {favorites.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <Heart size={48} strokeWidth={1} className="mb-6" />
                    <p className="text-[10px] tracking-[0.3em] font-bold">FAVORİ LİSTENİZ HENÜZ BOŞ</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {products.filter(p => favorites.includes(p.id)).map((item) => (
                      <div key={item.id} className="flex gap-6 group">
                        <div className="w-24 h-32 bg-bone flex-shrink-0 p-4 border border-ink/5 relative overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between mb-2">
                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gold">{item.brand}</span>
                            <button onClick={() => toggleFavorite(item.id)} className="p-1 hover:bg-bone transition-colors">
                              <X size={14} className="text-gray-300 hover:text-ink" />
                            </button>
                          </div>
                          <h4 className="text-xs uppercase tracking-widest font-medium mb-4">{item.name}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold tracking-tighter">₺ {item.price.toLocaleString()}</span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="text-[9px] font-black tracking-widest border-b border-ink pb-1 hover:text-gold hover:border-gold transition-colors"
                            >
                              SEPETE EKLE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8 bg-bone/50 border-t border-ink/5">
                <button 
                  onClick={() => setIsFavoritesOpen(false)}
                  className="w-full border border-ink py-6 text-[10px] font-sans font-bold uppercase tracking-[0.5em] hover:bg-ink hover:text-white transition-all duration-500"
                >
                  KEŞFETMEYE DEVAM ET
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Cart Sidebar --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100]"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-ink/5">
                <h3 className="text-sm font-sans font-bold tracking-[0.4em]">ALIŞVERİŞ ÇANTASI</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-bone transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingBag size={48} strokeWidth={1} className="mb-6" />
                    <p className="text-[10px] tracking-[0.3em] font-bold">ÇANTANIZ HENÜZ BOŞ</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6 group">
                        <div className="w-24 h-32 bg-bone flex-shrink-0 p-4 border border-ink/5 relative overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          {/* Mini Branding Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-50">
                             <div className="bg-white px-2 py-1 border border-ink/10 shadow-sm flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-ink">L'Essence</span>
                             </div>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between mb-2">
                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gold">{item.brand}</span>
                            <button onClick={() => removeFromCart(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={14} className="text-gray-300 hover:text-ink" />
                            </button>
                          </div>
                          <h4 className="text-xs uppercase tracking-widest font-medium mb-4">{item.name}</h4>
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-mono text-gray-400">Adet: {item.quantity}</span>
                            <span className="text-sm font-bold tracking-tighter">₺ {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-bone/50 border-t border-ink/5">
                  <div className="mb-6 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-ink/80 text-center">
                      {getCartProgressMessage()}
                    </p>
                    <div className="h-1.5 w-full bg-ink/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-1000 ease-out"
                        style={{ width: `${cartProgressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mb-8">
                    <span className="text-xs tracking-widest font-bold opacity-60">TOPLAM</span>
                    <span className="text-2xl font-bold tracking-tighter">₺ {cartTotal.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                    className="w-full bg-ink text-white py-6 text-[10px] font-sans font-bold uppercase tracking-[0.5em] hover:bg-gold hover:text-ink transition-all duration-500 shadow-xl"
                  >
                    Ödemeye Geç
                  </button>
                  <p className="text-[8px] text-center mt-6 text-accent uppercase tracking-widest opacity-60">
                    Ücretsiz Kargo ve Lüks Paketleme Dahildir
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink/60 z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-bone z-[70] p-10 flex flex-col shadow-2xl"
            >
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="self-end p-2 -mr-4 mb-4"
              >
                <X size={24} />
              </button>
            <nav className="flex flex-col gap-8 text-xl font-sans tracking-[0.2em] font-light">
                <button onClick={() => { setMobileMenuOpen(false); setIsSearchOpen(true); }} className="text-left hover:text-accent transition-colors flex items-center gap-4">
                  <Search size={24} strokeWidth={1} />
                  ARA
                </button>
                <button onClick={() => { setMobileMenuOpen(false); setIsFavoritesOpen(true); }} className="text-left hover:text-accent transition-colors flex items-center gap-4">
                  <Heart size={24} strokeWidth={1} />
                  FAVORİLER
                </button>
                <button onClick={() => { setMobileMenuOpen(false); document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left hover:text-accent transition-colors">KOLEKSİYON</button>
                <button onClick={() => { setMobileMenuOpen(false); setActiveCategory('Erkek'); document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left hover:text-accent transition-colors">ERKEK</button>
                <button onClick={() => { setMobileMenuOpen(false); setActiveCategory('Kadın'); document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left hover:text-accent transition-colors">KADIN</button>
                <button onClick={() => { setMobileMenuOpen(false); setCurrentView('cargo'); }} className="text-left hover:text-accent transition-colors">SİPARİŞ TAKİBİ</button>
                <button onClick={() => { setMobileMenuOpen(false); setIsQuizOpen(true); }} className="text-left hover:text-accent transition-colors">KOKU TESTİ</button>
            </nav>
              <div className="mt-auto pt-10 border-t border-ink/10 text-xs uppercase tracking-widest opacity-60">
                <p>© 2026 L'Essence House</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className={currentView === 'cargo' ? 'pt-40' : ''}>
        {/* --- Multi-View Orchestration --- */}
        {currentView === 'store' ? (
          <>
            {/* --- Best Sellers (Slider) --- */}
            <section 
              id="best-sellers" 
              className="py-12 md:py-24 bg-[#FDFCFB] border-b border-ink/5 pt-16 md:pt-44"
            >
              <div className="w-full max-w-[1920px] mx-auto px-8 md:px-12">
                <div className="flex flex-col gap-8">
                  <div 
                    className="relative w-full"
                    onMouseEnter={() => { isTopPausedRef.current = true; }}
                    onMouseLeave={() => { isTopPausedRef.current = false; }}
                    onTouchStart={() => { isTopPausedRef.current = true; }}
                    onTouchEnd={() => { isTopPausedRef.current = false; }}
                  >
                    <div 
                      ref={sliderRefTop}
                      onScroll={() => handleSliderScroll(sliderRefTop)}
                      className="relative overflow-x-auto no-scrollbar flex gap-5 pb-12 snap-x snap-mandatory"
                    >
                      {[...bestSellersTop, ...bestSellersTop, ...bestSellersTop].map((product, idx) => (
                        <ProductCard 
                          key={`top-${product.id}-${idx}`}
                          product={{
                            ...product,
                            campaignBadge: product.campaign ? "ÇOK AL AZ ÖDE" : undefined
                          }}
                          isFavorite={favorites.includes(product.id)}
                          addingId={addingId}
                          onAdd={addToCart}
                          onToggleFavorite={toggleFavorite}
                          styleClass="flex-shrink-0 w-[180px] sm:w-[240px] xl:w-[320px] snap-center"
                        />
                      ))}
                    </div>
                  </div>

                  <div 
                    className="relative w-full"
                    onMouseEnter={() => { isBottomPausedRef.current = true; }}
                    onMouseLeave={() => { isBottomPausedRef.current = false; }}
                    onTouchStart={() => { isBottomPausedRef.current = true; }}
                    onTouchEnd={() => { isBottomPausedRef.current = false; }}
                  >
                    <div 
                      ref={sliderRefBottom}
                      onScroll={() => handleSliderScroll(sliderRefBottom)}
                      className="relative overflow-x-auto no-scrollbar flex gap-5 pb-12 snap-x snap-mandatory"
                    >
                      {[...bestSellersBottom, ...bestSellersBottom, ...bestSellersBottom].map((product, idx) => (
                        <ProductCard 
                          key={`bottom-${product.id}-${idx}`}
                          product={{
                            ...product,
                            campaignBadge: product.campaign ? "ÇOK AL AZ ÖDE" : undefined
                          }}
                          isFavorite={favorites.includes(product.id)}
                          addingId={addingId}
                          onAdd={addToCart}
                          onToggleFavorite={toggleFavorite}
                          styleClass="flex-shrink-0 w-[180px] sm:w-[240px] xl:w-[320px] snap-center"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cinematic Identity Split - New Interactive Design */}
                <section className="mt-40 mb-32 h-[80vh] md:h-[80vh] relative overflow-hidden flex flex-col md:flex-row bg-ink">
                    {/* Erkek Side - Back to Original Top */}
                    <div 
                        onClick={() => {
                            setActiveCategory('Erkek');
                            document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="relative flex-1 transition-all duration-700 cursor-pointer overflow-hidden border-b md:border-b-0 md:border-r border-white/10 group/item"
                    >
                        <motion.img 
                            src="https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=1200" 
                            className="absolute inset-0 w-full h-full object-cover object-[50%_20%] md:object-[50%_15%] grayscale group-hover/item:grayscale-0 transition-all duration-[2s] opacity-60 md:opacity-70 group-hover/item:opacity-30"
                            alt="Men's Lifestyle"
                        />
                        
                        <div className="absolute top-12 md:top-24 left-0 right-0 z-10 flex flex-col items-center justify-center px-8">
                            <div className="h-px bg-gold transition-all duration-1000 mb-8 w-0 group-hover/item:w-48 mx-auto" />
                            <h2 className="text-4xl md:text-8xl font-sans font-extralight text-white tracking-[0.15em] md:tracking-[0.3em] uppercase leading-none break-keep whitespace-nowrap">ERKEK</h2>
                        </div>
                    </div>

                    {/* Kadın Side - Back to Original Bottom */}
                    <div 
                        onClick={() => {
                            setActiveCategory('Kadın');
                            document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="relative flex-1 transition-all duration-700 cursor-pointer overflow-hidden group/item"
                    >
                        <motion.img 
                            src="https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&q=80&w=1200" 
                            className="absolute inset-0 w-full h-full object-cover object-[50%_40%] md:object-[50%_30%] sepia-[0.2] grayscale group-hover/item:grayscale-0 transition-all duration-[2s] opacity-60 md:opacity-70 group-hover/item:opacity-30"
                            alt="Kadın Yaşam Tarzı"
                        />
                        
                        <div className="absolute bottom-12 md:bottom-24 left-0 right-0 z-10 flex flex-col items-center justify-center px-8">
                            <h2 className="text-4xl md:text-8xl font-sans font-extralight text-white tracking-[0.15em] md:tracking-[0.3em] uppercase leading-none break-keep whitespace-nowrap">KADIN</h2>
                            <div className="h-px bg-gold transition-all duration-1000 mt-10 w-0 group-hover/item:w-48 mx-auto" />
                        </div>
                    </div>

                    {/* Center Stamp & Campaign Callout */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-none">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-white backdrop-blur-3xl border border-gold/30 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-6 md:p-8 text-center ring-4 ring-white/5 mb-8">
                            <div className="border-b border-gold/20 pb-1 md:pb-2 mb-1 md:mb-2 w-full">
                                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] md:tracking-[0.6em] font-medium opacity-60 text-ink block mb-0.5 md:mb-1">L'ESSENCE</span>
                                <span className="text-sm md:text-lg font-sans font-black tracking-[0.1em] md:tracking-[0.2em] uppercase text-ink leading-tight">MAİSON</span>
                            </div>
                            <span className="text-[5px] md:text-[6px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold text-gold">PARFÜM EVİ</span>
                        </div>
                        
                        <div className="flex flex-col items-center pointer-events-auto gap-4">
                            <div className="bg-red-600 text-white px-6 py-2 shadow-2xl skew-x-[-10deg]">
                                <span className="block skew-x-[10deg] font-black tracking-[0.2em] uppercase text-sm md:text-xl drop-shadow-md">
                                    TÜM ÜRÜNLERDE 3 AL 1 ÖDE
                                </span>
                            </div>
                            <button 
                                onClick={() => {
                                    setActiveCategory('deals');
                                    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-white/10 backdrop-blur-lg border border-white/30 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest px-8 md:px-12 py-3 md:py-4 hover:bg-white hover:text-red-600 transition-all duration-300 shadow-xl"
                            >
                                GÜNÜN FIRSATINI KEŞFET
                            </button>
                        </div>
                    </div>
                </section>
              </div>
            </section>
          </>
        ) : currentView === 'admin' ? (
          <section className="min-h-screen bg-bone pt-40 px-12 pb-24">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
               <div className="flex justify-between items-end">
                  <h1 className="text-4xl font-sans font-bold tracking-tighter">YÖNETİCİ PANELİ</h1>
                  <button onClick={() => setCurrentView('store')} className="text-[10px] uppercase tracking-widest font-black text-gold">← Mağazaya Dön</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 luxury-shadow border border-ink/5">
                    <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest mb-2">Toplam Ciro</p>
                    <p className="text-3xl font-bold tracking-tighter">₺ {orders.reduce((a, b) => a + b.total, 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-8 luxury-shadow border border-ink/5">
                    <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest mb-2">Toplam Sipariş</p>
                    <p className="text-3xl font-bold tracking-tighter">{orders.length}</p>
                  </div>
                  <div className="bg-white p-8 luxury-shadow border border-ink/5">
                    <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest mb-2">Atmosfer</p>
                    <p className="text-3xl font-bold tracking-tighter text-gold">Premium</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 bg-white p-10 luxury-shadow border border-ink/5 overflow-x-auto">
                    <h3 className="text-xs uppercase font-bold tracking-widest mb-8">Son Siparişler</h3>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest opacity-40 border-b border-ink/5">
                          <th className="pb-4">Sipariş No</th>
                          <th className="pb-4">Müşteri</th>
                          <th className="pb-4">Tutar</th>
                          <th className="pb-4">Durum</th>
                          <th className="pb-4">Tarih</th>
                          <th className="pb-4">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {orders.map(order => (
                          <tr key={order.id} className="border-b border-ink/5">
                            <td className="py-6 font-bold">{order.id}</td>
                            <td className="py-6">{order.customerName}</td>
                            <td className="py-6 font-mono font-bold">₺ {order.total.toLocaleString()}</td>
                            <td className="py-6">
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest outline-none bg-gold/10 text-gold`}
                              >
                                <option value="Hazırlanıyor">Hazırlanıyor</option>
                                <option value="Kargoya Verildi">Kargoya Verildi</option>
                                <option value="Teslim Edildi">Teslim Edildi</option>
                              </select>
                            </td>
                            <td className="py-6 opacity-40">{order.date}</td>
                            <td className="py-6">
                               <button className="text-[9px] bg-red-500/10 text-red-500 px-3 py-1 uppercase tracking-widest font-black">İptal</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="lg:col-span-4 bg-white p-10 luxury-shadow border border-ink/5">
                    <h3 className="text-xs uppercase font-bold tracking-widest mb-8">Stok ve Ürün Yönetimi</h3>
                    <div className="space-y-6 max-h-[600px] overflow-y-auto no-scrollbar">
                       {products.map(p => (
                         <div key={p.id} className="flex items-center justify-between group border-b border-ink/5 pb-4 last:border-0">
                            <div className="flex items-center gap-4">
                               <img src={p.image} className="w-12 h-12 object-contain bg-bone/30" />
                               <div>
                                  <p className="text-[10px] uppercase tracking-widest font-black leading-none mb-1">{p.name}</p>
                                  <p className="text-[9px] opacity-40">{p.brand}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="flex items-center bg-bone rounded overflow-hidden">
                                  <button onClick={() => updateStock(p.id, -1)} className="px-2 py-1 hover:bg-gold hover:text-white transition-colors">-</button>
                                  <span className={`text-[10px] font-bold px-3 min-w-[2rem] text-center ${p.stock < 15 ? 'text-red-500' : 'text-ink'}`}>{p.stock}</span>
                                  <button onClick={() => updateStock(p.id, 1)} className="px-2 py-1 hover:bg-gold hover:text-white transition-colors">+</button>
                               </div>
                               <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={14} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>

               <div className="bg-white p-10 luxury-shadow border border-ink/5">
                  <h3 className="text-xs uppercase font-bold tracking-widest mb-10">Koleksiyona Yeni Parfüm Ekle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">MARKA</label>
                        <input 
                           type="text" 
                           value={newProduct.brand}
                           onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                           placeholder="Dior, Chanel..." 
                           className="bg-transparent border-b border-ink/10 py-3 text-xs focus:border-gold outline-none" 
                        />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">ÜRÜN ADI</label>
                        <input 
                           type="text" 
                           value={newProduct.name}
                           onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                           placeholder="Sauvage, Libre..." 
                           className="bg-transparent border-b border-ink/10 py-3 text-xs focus:border-gold outline-none" 
                        />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">FİYAT (₺)</label>
                        <input 
                           type="number" 
                           value={newProduct.price || ''}
                           onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                           placeholder="1250" 
                           className="bg-transparent border-b border-ink/10 py-3 text-xs focus:border-gold outline-none" 
                        />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">STOK</label>
                        <input 
                           type="number" 
                           value={newProduct.stock || ''}
                           onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                           placeholder="50" 
                           className="bg-transparent border-b border-ink/10 py-3 text-xs focus:border-gold outline-none" 
                        />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">CİNSİYET</label>
                        <select 
                           value={newProduct.gender}
                           onChange={e => setNewProduct({...newProduct, gender: e.target.value as any})}
                           className="bg-transparent border-b border-ink/10 py-3 text-xs focus:border-gold outline-none appearance-none cursor-pointer"
                        >
                           <option value="Erkek">ERKEK</option>
                           <option value="Kadın">KADIN</option>
                           <option value="Unisex">UNISEX</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">KOKU AİLESİ</label>
                        <select 
                           value={newProduct.category}
                           onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
                           className="bg-transparent border-b border-ink/10 py-3 text-xs focus:border-gold outline-none appearance-none cursor-pointer"
                        >
                           <option value="Woody">ODUNSU</option>
                           <option value="Floral">ÇİÇEKSİ</option>
                           <option value="Fresh">TAZE</option>
                           <option value="Spicy">BAHARATLI</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2 lg:col-span-2">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">GÖRSEL YÜKLE (URL VEYA DOSYA)</label>
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={newProduct.image?.startsWith('data:') ? 'Özel Görsel Yüklendi' : newProduct.image}
                                onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                                placeholder="Görsel URL..." 
                                className="flex-1 bg-transparent border-b border-ink/10 py-3 text-xs focus:border-gold outline-none" 
                            />
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button className="bg-ink text-white px-4 py-3 text-[9px] uppercase tracking-widest font-black">Dosya Seç</button>
                            </div>
                        </div>
                     </div>
                     <div className="lg:col-span-4 mt-8">
                        <button 
                           onClick={handleAddProduct}
                           className="w-full bg-gold text-ink py-5 text-[11px] uppercase tracking-[0.6em] font-black hover:bg-ink hover:text-gold transition-all duration-700 shadow-2xl"
                        >
                           Ürünü Sisteme Kaydet
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </section>
        ) : currentView === 'cargo' ? (
          <section className="min-h-screen bg-bone py-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              {/* --- Cargo View Contents --- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Panel - Illustration/Info */}
                <div className="lg:col-span-7 bg-white p-12 md:p-16 border border-ink/5 relative overflow-hidden luxury-shadow">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                  
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-ink text-gold rounded-full mb-10 shadow-xl">
                    <Truck size={36} strokeWidth={1.5} />
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl font-sans font-extralight uppercase mb-12 tracking-tighter">Sipariş Takibi</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 border border-ink/5 bg-bone/30">
                      <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gold mb-4">Sorgu Tipi</p>
                      <p className="font-sans text-xs uppercase tracking-[0.3em] font-medium opacity-50">Sipariş + Telefon</p>
                    </div>
                    <div className="p-8 border border-ink/5 bg-bone/30">
                      <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gold mb-4">Durum</p>
                      <p className="font-sans text-xs uppercase tracking-[0.3em] font-medium opacity-50">Anlık Senkron</p>
                    </div>
                  </div>

                  <p className="mt-16 text-accent/60 text-sm leading-relaxed max-w-lg font-medium">
                    Siparişinizin yolculuğunu takip edin. L'Essence Maison, her bir şişenin size ulaşana kadar geçirdiği süreci şeffaf bir şekilde paylaşır. 
                    Takip kodunuz sipariş onay e-postanızda yer almaktadır.
                  </p>
                </div>

                {/* Right Panel - Form */}
                <div className="lg:col-span-5 bg-ink p-12 border border-white/10 luxury-shadow relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Search size={120} />
                  </div>
                  <div className="flex items-center gap-4 mb-12 relative">
                    <div className="w-12 h-12 bg-gold text-ink rounded-full flex items-center justify-center shadow-lg">
                      <Search size={22} />
                    </div>
                    <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-white mb-4">Sipariş Sorgula</h3>
                  </div>

                  <div className="space-y-8 relative">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gold mb-4 block">Sipariş Numarası</label>
                      <input 
                        type="text" 
                        placeholder="LS-882910" 
                        className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-5 text-white focus:border-gold focus:outline-none transition-all placeholder:text-white/20 font-serif italic"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gold mb-4 block">Telefon Numarası</label>
                      <input 
                        type="text" 
                        placeholder="05xx xxx xx xx" 
                        className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-5 text-white focus:border-gold focus:outline-none transition-all placeholder:text-white/20 font-serif italic"
                      />
                    </div>
                    
                    <button className="w-full bg-gold text-ink py-6 font-black uppercase tracking-[0.5em] text-[10px] hover:bg-white transition-all flex items-center justify-center gap-4">
                      Sorgula <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="min-h-screen bg-bone py-32 px-6 md:px-12 flex flex-col items-center">
            <div className="max-w-4xl w-full">
              <div className="flex items-center gap-4 mb-16">
                 <button onClick={() => setCurrentView('store')} className="p-2 hover:bg-ink hover:text-white rounded-full transition-colors">
                    <ChevronLeft size={24} />
                 </button>
                 <h2 className="text-4xl font-sans font-extralight uppercase tracking-tighter">Güvenli Ödeme</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left: Form */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="space-y-8">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">01. Teslimat Adresi</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="AD" className="bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                      <input type="text" placeholder="SOYAD" className="bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                    </div>
                    <input type="email" placeholder="E-POSTA" className="w-full bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                    <input type="text" placeholder="ADRES" className="w-full bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="ŞEHİR" className="bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                      <input type="text" placeholder="TELEFON" className="bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">02. Ödeme Yöntemi</h3>
                    <div className="p-6 border border-ink bg-ink text-white flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                          <span className="text-[8px] font-black">VISA</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Kredi ve Banka Kartı</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-gold bg-gold" />
                    </div>
                    
                    <div className="space-y-6 pt-4">
                       <input type="text" placeholder="KART ÜZERİNDEKİ İSİM" className="w-full bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                       <input type="text" placeholder="KART NUMARASI" className="w-full bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                       <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="AY / YIL" className="bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                          <input type="text" placeholder="CVV" className="bg-transparent border-b border-ink/20 py-4 text-xs uppercase tracking-widest focus:border-gold outline-none" />
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={completeOrder}
                    className="w-full bg-ink text-gold py-8 text-[11px] uppercase tracking-[0.6em] font-bold hover:bg-gold hover:text-ink transition-all duration-700 shadow-2xl relative overflow-hidden"
                  >
                    {isProcessing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <RotateCcw size={20} />
                      </motion.div>
                    ) : 'Siparişi Onayla ve Tamamla'}
                  </button>
                </div>

                {/* Right: Summary */}
                <div className="lg:col-span-5 bg-bone p-10 border border-ink/5 sticky top-40 h-fit">
                   <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 mb-8 font-sans">Sipariş Özeti</h3>
                   <div className="space-y-6 mb-8 max-h-60 overflow-y-auto no-scrollbar">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-start gap-4">
                            <div className="flex gap-4 items-center">
                               <div className="w-12 h-16 bg-white border border-ink/5 p-2 relative overflow-hidden flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                  <div className="absolute inset-0 flex items-center justify-center scale-[0.3]">
                                     <div className="bg-white p-2 border border-ink/20">
                                        <span className="text-xl font-bold uppercase tracking-widest text-ink">L'E</span>
                                     </div>
                                  </div>
                               </div>
                               <span className="text-[10px] uppercase tracking-widest font-medium max-w-[150px] truncate">{item.name} x {item.quantity}</span>
                            </div>
                            <span className="text-xs font-bold text-ink">₺ {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                   </div>
                   <div className="pt-6 border-t border-ink/10 space-y-4">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
                        <span>Ara Toplam</span>
                        <span>₺ {cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
                        <span>Gönderim</span>
                        <span className="text-gold font-bold">Ücretsiz</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-ink/10">
                        <span className="text-xs uppercase tracking-[0.3em] font-bold">Genel Toplam</span>
                        <span className="text-2xl font-bold tracking-tighter">₺ {cartTotal.toLocaleString()}</span>
                      </div>
                   </div>
                   <div className="mt-10 p-4 border border-gold/20 bg-gold/5 text-center">
                      <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Lüks Paketleme Hediye</p>
                   </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- Quick Filters Band --- */}
        <section className={`h-28 bg-white border-t border-ink/5 flex items-center px-12 justify-between space-x-6 overflow-hidden ${currentView === 'checkout' ? 'hidden' : 'block'}`}>
          <div className="flex items-center gap-12 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 whitespace-nowrap">Koku Ailesi:</span>
            <div className="flex gap-10 text-[11px] uppercase tracking-[0.2em] font-bold whitespace-nowrap">
              {NOTE_CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`transition-all duration-500 flex items-center gap-3 cursor-pointer pb-2 border-b-2 ${
                    activeCategory === cat.id
                      ? 'text-gold border-gold' 
                      : 'border-transparent text-gray-300 hover:text-ink hover:border-ink/20'
                  }`}
                >
                  <span className="opacity-40">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex gap-10 items-center justify-end flex-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
              <span className="text-[10px] uppercase letter-spacing-wide opacity-70">Orijinallik Garantisi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
              <span className="text-[10px] uppercase letter-spacing-wide opacity-70">Lüks Paketleme</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
              <span className="text-[10px] uppercase letter-spacing-wide opacity-70">Hızlı Kargo</span>
            </div>
          </div>
        </section>

        {/* --- Grid Listing --- */}
        <section id="all-products" className={`py-24 px-4 sm:px-12 bg-bone ${currentView === 'cargo' || currentView === 'checkout' ? 'hidden' : 'block'}`}>
          <div className="max-w-[1920px] mx-auto w-full">
            <div className="flex items-end justify-between mb-16 px-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-sans font-extralight uppercase mb-4 tracking-tighter">
                  {activeCategory === 'deals' ? <span className="text-red-600 font-bold">🔥 GÜNÜN FIRSATLARI</span> : activeCategory === 'Erkek' ? 'Erkek Koleksiyonu' : activeCategory === 'Kadın' ? 'Kadın Koleksiyonu' : 'Tüm Ürünler'}
                </h2>
                <p className="text-accent uppercase letter-spacing-wide text-[11px] font-bold">Özenle Seçilmiş Parfümler</p>
              </div>
              <button 
                onClick={() => setActiveCategory('all')}
                className="hidden sm:flex items-center gap-2 text-[11px] uppercase letter-spacing-wide font-bold group border-b border-ink pb-1"
              >
                Tümünü Gör
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4 no-scrollbar snap-x md:snap-none">
              <AnimatePresence>
                {filteredProducts.map((product, idx) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    addingId={addingId}
                    onAdd={addToCart}
                    onToggleFavorite={toggleFavorite}
                    styleClass="w-full snap-center"
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* --- 3D Secure Simulation --- */}
      <AnimatePresence>
        {show3DS && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-ink/90 backdrop-blur-md">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-white max-w-sm w-full p-10 text-center shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <ShieldCheck size={48} className="text-gold" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4">3D Secure Doğrulama</h2>
              <p className="text-xs opacity-60 mb-8 leading-relaxed uppercase tracking-widest">
                İyzico / PayTR Güvenli Giriş: L'Essence Maison Alışverişiniz İçin Telefonunuza Gelen 6 Haneli Kodu Girin.
              </p>
              <div className="flex gap-2 justify-center mb-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-8 h-10 border-b-2 border-ink/20 flex items-center justify-center text-lg font-bold">
                    {i === 0 ? '7' : i === 1 ? '4' : ''}
                  </div>
                ))}
              </div>
              <button 
                onClick={verify3DS}
                className="w-full bg-ink text-white py-5 text-[10px] uppercase font-bold tracking-[0.4em] hover:bg-gold hover:text-ink transition-all"
              >
                Onayla ve Öde
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Footer --- */}
        <footer id="contact" className="bg-bone pt-32 pb-16 px-12 border-t border-ink/5">

        {/* --- Scent Quiz Modal --- */}
        <AnimatePresence>
          {isQuizOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ink/80"
                onClick={() => setIsQuizOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-bone w-full max-w-2xl p-12 md:p-20 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8">
                  <button onClick={() => setIsQuizOpen(false)} className="hover:text-accent transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">KOKU YOLCULUĞU</span>
                  <h2 className="text-4xl font-sans font-extralight uppercase mb-8 tracking-widest">KÜRATÖR HAZIR</h2>
                  <p className="text-accent mb-12 leading-relaxed uppercase text-[10px] tracking-widest">
                    AURANIZLA BÜTÜNLEŞEN KOKUYU BULMAK İÇİN 3 BASİT SORUYU YANITLAYIN.
                  </p>

                  <div className="space-y-10 max-w-md mx-auto text-left">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-30">01. Tercih Edilen Atmosfer</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="border border-ink/10 py-5 hover:border-gold hover:text-gold transition-all text-[10px] uppercase tracking-[0.3em] font-bold">Gündüz</button>
                        <button className="border border-ink/10 py-5 hover:border-gold hover:text-gold transition-all text-[10px] uppercase tracking-[0.3em] font-bold">Gece</button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-30">02. Koku Karakteri</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="border border-ink/10 py-5 hover:border-gold hover:text-gold transition-all text-[10px] uppercase tracking-[0.3em] font-bold">Minimalist</button>
                        <button className="border border-ink/10 py-5 hover:border-gold hover:text-gold transition-all text-[10px] uppercase tracking-[0.3em] font-bold">İddialı</button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-30">03. Mevsimsel Tercih</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="border border-ink/10 py-5 hover:border-gold hover:text-gold transition-all text-[10px] uppercase tracking-[0.3em] font-bold">Sıcak</button>
                        <button className="border border-ink/10 py-5 hover:border-gold hover:text-gold transition-all text-[10px] uppercase tracking-[0.3em] font-bold">Serin</button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsQuizOpen(false)}
                      className="w-full bg-ink text-gold py-6 text-[10px] uppercase tracking-[0.5em] font-black hover:bg-gold hover:text-ink transition-all shadow-xl"
                    >
                      Kesfetmeye Basla
                    </button>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-accent to-gold opacity-30" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- Trust & Branding Bar --- */}
        <section id="about" className="py-20 border-t border-ink/5 bg-white">
          <div className="max-w-7xl mx-auto px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Truck className="text-gold" size={32} />
                <h4 className="text-xs font-bold tracking-widest">HIZLI VE ÜCRETSİZ KARGO</h4>
                <p className="text-[10px] text-gray-400">Tüm siparişlerinizde sigortalı ve ücretsiz gönderim ayrıcalığı.</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <ShieldCheck className="text-gold" size={32} />
                <h4 className="text-xs font-bold tracking-widest">GÜVENİLİR ALIŞVERİŞ</h4>
                <p className="text-[10px] text-gray-400">256-bit SSL sertifikası ve İyzico güvencesiyle korunan ödemeler.</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Gift className="text-gold" size={32} />
                <h4 className="text-xs font-bold tracking-widest">LÜKS PAKETLEME</h4>
                <p className="text-[10px] text-gray-400">Her siparişiniz özel mühürlü kutular ve lüks sunumla gelir.</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Star className="text-gold" size={32} />
                <h4 className="text-xs font-bold tracking-widest">A++ KALİTE ESANSLAR</h4>
                <p className="text-[10px] text-gray-400">Dünyanın en seçkin bahçelerinden toplanan 1. sınıf hammadde.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Customer Reviews --- */}
        <section className="py-24 bg-[#FBFBFB] border-t border-ink/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-sm md:text-base tracking-[0.4em] font-black uppercase mb-4 inline-block relative">
                MÜŞTERİ YORUMLARI
                <span className="absolute -bottom-2 lg:-bottom-4 left-0 right-0 h-0.5 bg-red-600 w-1/3 mx-auto"></span>
              </h2>
              <p className="text-xs tracking-widest uppercase opacity-50 mt-8">Gerçek deneyimler, benzersiz yorumlar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Kerem T.', product: 'Sauvage', comment: 'Kalıcılığı gerçekten efsane. 3 Al 1 Öde fırsatıyla stok yaptım, ertesi gün elime ulaştı. Satıcıya teşekkürler.', rating: 5 },
                { name: 'Merve S.', product: 'Paradoxe', comment: 'Kokusu harika ve kesinlikle orijinal olduğunu hissettiriyor. Çevremdeki herkes sormaya başladı. Hızlı kargo için ayrı teşekkürler.', rating: 5 },
                { name: 'Burak M.', product: 'Stronger With You', comment: 'İlk defa bu mağazadan aldım, paketlemesi bile ne kadar kaliteli olduklarını gösteriyor. Arkadaşlarıma da tavsiye ettim.', rating: 5 }
              ].map((review, idx) => (
                <div key={idx} className="bg-white p-8 luxury-shadow border border-ink/5 relative group cursor-default">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => <Star key={star} size={12} className="text-gold fill-gold" />)}
                  </div>
                  <p className="text-sm font-medium italic mb-6">"{review.comment}"</p>
                  <div className="flex justify-between items-center mt-auto border-t border-ink/10 pt-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase">{review.name}</span>
                    <span className="text-[9px] uppercase tracking-widest text-red-600 font-bold bg-red-50 py-1 px-2">{review.product}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Bilgilendirme Section --- */}
        <section className="bg-ink text-bone py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h5 className="text-gold uppercase tracking-[0.4em] text-[8px] font-black mb-8">Bilgilendirme & Teslimat</h5>
            <p className="text-[12px] leading-loose opacity-70 uppercase tracking-[0.2em] font-medium">
              Siparişleriniz aynı gün içinde titizlikle hazırlanarak kargoya teslim edilir. 
              Kargo takip numaranız SMS yoluyla tarafınıza iletilecektir. 
              Teslimat süresi 2-4 iş günüdür; uzak bölgelerde 1-2 gün ek süre oluşabilmektedir.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 pt-20">
          <div>
            <h3 className="text-xl font-sans font-bold tracking-[0.4em] uppercase mb-8">L'Essence</h3>
            <p className="text-accent text-[10px] uppercase tracking-widest leading-relaxed mb-8 opacity-60">
              LÜKS KOKU DENEYİMİNİ KÜRASYON, AYRICALIK VE DİJİTAL ZANAATKARLIKLA YENİDEN TANIMLIYORUZ.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/lessencemaison" target="_blank" rel="noreferrer" className="text-[10px] uppercase letter-spacing-wide font-bold hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30">
                Instagram
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="text-[10px] uppercase letter-spacing-wide font-bold hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30">
                Pinterest
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[10px] uppercase letter-spacing-wide font-bold hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30">
                Twitter
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] font-bold mb-8">KOLEKSİYONLAR</h4>
            <ul className="flex flex-col gap-4 text-accent text-sm">
              <li><button onClick={() => { setActiveCategory('Woody'); document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-ink transition-colors text-left">Odunsu Seçkisi</button></li>
              <li><button onClick={() => { setActiveCategory('Oriental'); document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-ink transition-colors text-left">Oryantal Serisi</button></li>
              <li><button onClick={() => { setActiveCategory('Floral'); document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-ink transition-colors text-left">Çiçeksi Notalar</button></li>
              <li><button onClick={() => { setActiveCategory('Fresh'); document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-ink transition-colors text-left">Fresh Esintiler</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.4em] font-semibold mb-10 text-ink/80 font-sans">MARKA</h4>
            <ul className="flex flex-col gap-4 text-accent text-sm font-medium">
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-ink transition-colors text-left">Hakkımızda</button></li>
              <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-ink transition-colors text-left">Hikayemiz</button></li>
            </ul>
          </div>
          <div>
            <h4 id="contact" className="text-[11px] tracking-[0.4em] font-semibold mb-10 text-ink/80">MÜŞTERİ İLİŞKİLERİ</h4>
            <ul className="flex flex-col gap-4 text-accent text-sm font-medium">
              <li><button onClick={() => setCurrentView('cargo')} className="hover:text-ink transition-colors text-left">Sipariş Takibi</button></li>
              <li><button className="hover:text-ink transition-colors text-left">Sıkça Sorulan Sorular</button></li>
              <li><button className="hover:text-ink transition-colors text-left">Bize Ulaşın</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.4em] font-semibold mb-10 text-ink/80">HABER BÜLTENİ</h4>
            <p className="text-accent text-xs mb-6 opacity-80">Yeni koleksiyonlara özel erişim için elit çemberimize katılın.</p>
            <div className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="E-posta Adresi" 
                className="bg-transparent border-b border-ink/20 py-3 text-sm focus:outline-none focus:border-ink transition-colors font-sans uppercase tracking-widest"
              />
              <button className="text-left text-[10px] uppercase font-bold tracking-[0.3em] hover:text-accent transition-colors">
                Abone Ol →
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.4em] font-semibold mb-10 text-ink/80">SİSTEM</h4>
            <ul className="flex flex-col gap-4 text-accent text-sm font-medium">
              <li><button onClick={() => { setCurrentView('admin'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-ink transition-colors opacity-30 hover:opacity-100">YÖNETİCİ GİRİŞİ</button></li>
              <li><a href="#" className="hover:text-ink transition-colors">API Dokümantasyonu</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">KVKK Metni</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-ink/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase letter-spacing-wide text-accent">
            © 2026 L'Essence Fragrance House. Tüm Hakları Saklıdır.
          </p>
          <div className="flex gap-8 text-[10px] uppercase letter-spacing-wide text-accent">
            <a href="#" className="hover:text-ink">Şartlar</a>
            <a href="#" className="hover:text-ink">Gizlilik</a>
            <a href="#" className="hover:text-ink">Çerezler</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 lg:bottom-6 right-6 z-[90] w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95 group"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.022-.014-.503-.245-.582-.273-.08-.027-.138-.04-.197.048-.058.088-.227.288-.278.345-.05.058-.102.065-.19.022a3.607 3.607 0 0 1-1.203-.741c-.469-.418-.787-.935-.879-1.092-.092-.157-.01-.242.068-.32.071-.07.157-.184.236-.276.08-.092.106-.157.158-.261.05-.106.026-.197-.013-.276-.04-.078-.197-.478-.27-.654-.07-.17-.142-.147-.197-.15-.05-.002-.108-.003-.166-.003-.058 0-.153.022-.234.108-.08.088-.307.3-.307.733 0 .433.315.852.359.91.044.057.621.948 1.503 1.33.21.09.373.144.501.185.21.066.402.057.553.035.168-.025.518-.212.591-.417.073-.205.073-.38.05-.417-.022-.037-.08-.058-.17-.1l-.001-.001z"></path>
        </svg>
        <span className="absolute right-full mr-4 bg-white text-ink px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl scale-0 group-hover:scale-100 transition-transform origin-right">
          Müşteri Desteği
        </span>
      </a>

      {/* --- Social Proof Notification --- */}
      <AnimatePresence>
        {socialProof && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="fixed bottom-24 lg:bottom-10 left-6 z-[100] bg-white text-ink p-4 shadow-2xl border border-ink/10 flex items-center gap-4 max-w-xs"
          >
            <div className="w-12 h-16 bg-bone overflow-hidden flex-shrink-0">
              <img src={SIGNATURE_IMAGE} alt="product" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-ink mb-1">{socialProof.name}, {socialProof.location}</p>
              <p className="text-[11px] font-medium leading-tight">Bir <span className="font-bold text-red-600 uppercase">{socialProof.product}</span> satın aldı!</p>
              <p className="text-[9px] uppercase tracking-widest opacity-50 mt-1">{socialProof.time}</p>
            </div>
            <div className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full animate-bounce">
              <ShoppingBag size={10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Mobile Sticky Opportunities Bottom Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 z-[80] md:hidden bg-white border-t border-ink/10 flex items-stretch h-16 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 flex flex-col items-center justify-center border-r border-ink/10 text-ink hover:bg-bone transition-colors"
        >
          <Search size={20} className="mb-1" />
          <span className="text-[8px] font-bold tracking-widest uppercase">Koku Bul</span>
        </button>
        <button 
          onClick={() => {
            setActiveCategory('deals');
            document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-[2] bg-red-600 text-white flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 animate-pulse opacity-50"></div>
          <span className="text-[11px] font-black tracking-[0.2em] uppercase relative z-10">TÜM FIRSATLAR 🔥</span>
        </button>
      </div>

      {/* --- Toast Notification --- */}
      <AnimatePresence>
        {cartToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[300] bg-ink text-gold px-10 py-5 shadow-2xl border border-gold/30 flex items-center gap-4 min-w-[280px] justify-center"
          >
            <Star size={16} className="animate-spin-slow text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{cartToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
