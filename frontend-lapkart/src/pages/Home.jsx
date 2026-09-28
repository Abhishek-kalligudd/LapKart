import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/axios';
import Loader from '../components/Loader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch for demonstration if backend is not ready
    const fetchProducts = async () => {
      try {
        const res = await api.get('/public/products');
        setProducts(res.data);
      } catch (err) {
        // Mock data fallback for beautiful UI
        setProducts([
          { id: 1, name: 'MacBook Pro 16"', price: 2499, description: 'M3 Max, 36GB RAM, 1TB SSD', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
          { id: 2, name: 'Dell XPS 15', price: 1899, description: 'Intel i9, 32GB RAM, 1TB NVMe', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800' },
          { id: 3, name: 'ThinkPad X1 Carbon', price: 1699, description: 'Intel i7, 16GB RAM, 512GB SSD', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800' },
          { id: 4, name: 'Razer Blade 14', price: 2199, description: 'Ryzen 9, RTX 4070, 16GB RAM', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))] dark:bg-grid-black/10" />
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Power Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Potential</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Discover the perfect laptop for your workflow. From ultra-light productivity machines to heavy-duty gaming rigs.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Shop Now
          </motion.button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Laptops</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {(Array.isArray(products) ? products : []).map(product => (
            <motion.div 
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={product.productImgs?.[0]?.imageUrl || product.image || 'https://via.placeholder.com/400x300?text=Laptop'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold">${product.price}</span>
                  <button className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
