import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ShoppingBag, Star, Plus, Minus, Trash2, CheckCircle2, QrCode, CreditCard, ShieldCheck, Tag, Sparkles, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  products: Product[];
  onAddPoints: (amount: number, reason: string) => void;
}

export const Marketplace: React.FC<Props> = ({ products, onAddPoints }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[3], quantity: 2 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const filteredProducts = products.filter(
    p => selectedCategory === 'all' || p.category === selectedCategory
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'AUAU35RACAO' || couponCode.toUpperCase() === 'VIPDOG') {
      setDiscountPercent(15);
      confetti({ particleCount: 30, spread: 40 });
    } else {
      alert('Cupom inválido ou expirado. Tente AUAU35RACAO ou resgate na aba de Recompensas!');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 199 ? 0 : 19.90;
  const total = Math.max(0, subtotal - discountAmount + (cart.length > 0 ? shipping : 0));
  const pointsEarned = Math.round(total);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onAddPoints(pointsEarned, `Compra no Marketplace (Pedido #${Math.floor(1000 + Math.random() * 9000)})`);
    setShowCheckoutSuccess(true);
    setCart([]);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div id="marketplace-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20">
              AuAu Pet Store & Farmácia
            </span>
            <span className="text-xs text-amber-100 font-semibold">Frete Grátis acima de R$ 199</span>
          </div>
          <h2 className="text-2xl font-black">Marketplace Oficial para Cães</h2>
          <p className="text-xs text-amber-100 max-w-xl">
            Rações Super Premium, Antipulgas originais com procedência garantida e brinquedos de enriquecimento ambiental. Ganhe 1 AuCoin a cada R$ 1 gasto!
          </p>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-white text-orange-700 hover:bg-amber-50 px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Ver Carrinho ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          <span className="bg-orange-100 px-2 py-0.5 rounded-full text-[11px]">
            R$ {total.toFixed(2)}
          </span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'all', label: 'Todos os Produtos' },
          { id: 'racao', label: 'Rações Super Premium' },
          { id: 'farmacia', label: 'Farmácia & Antipulgas' },
          { id: 'brinquedos', label: 'Brinquedos Interativos' },
          { id: 'petiscos', label: 'Petiscos Naturais' },
          { id: 'acessorios', label: 'Camas & Acessórios' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            id={`product-card-${product.id}`}
            className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-amber-500 text-white text-[10px] font-extrabold uppercase rounded-lg shadow-sm">
                  {product.badge}
                </span>
              )}
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                +{product.pointsEarned} pts
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {product.brand}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 mt-0.5">
                  {product.name}
                </h4>

                <div className="flex items-center gap-1.5 my-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-xs font-bold ml-1 text-slate-800 dark:text-slate-200">{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">({product.reviewsCount})</span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  {product.originalPrice && (
                    <span className="text-[11px] text-slate-400 line-through block">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                  title="Adicionar ao Carrinho"
                >
                  <Plus className="w-4 h-4" />
                  <span>Comprar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer / Slide-Over Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Meu Carrinho</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-700 dark:text-slate-200">Seu carrinho está vazio</p>
                  <p className="text-xs text-slate-400">Adicione rações, petiscos ou brinquedos para seu cãozinho.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.product.name}</h5>
                      <span className="text-xs font-bold text-emerald-600">R$ {item.product.price.toFixed(2)}</span>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 space-y-3">
                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cupom (ex: AUAU35RACAO)"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    Aplicar
                  </button>
                </form>

                {discountPercent > 0 && (
                  <div className="text-xs font-bold text-emerald-600 flex items-center justify-between">
                    <span>Desconto AuCoins Aplicado (15%):</span>
                    <span>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>{shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t">
                    <span>Total a Pagar:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Finalizar Compra (+{pointsEarned} AuCoins)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Pedido Realizado com Sucesso!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Obrigado por comprar no Marketplace AuAu Care. Seus produtos já estão sendo preparados e seus AuCoins foram creditados na sua conta!
            </p>

            <button
              onClick={() => {
                setShowCheckoutSuccess(false);
                setIsCartOpen(false);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
            >
              Continuar Navegando
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
