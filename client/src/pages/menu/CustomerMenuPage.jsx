import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurantMenu } from '../../hooks/useRestaurantMenu';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useCart } from '../../context/CartContext';
import MenuLayout from '../../layouts/MenuLayout';
import MenuHeader from '../../components/menu/MenuHeader';
import HeroCarousel from '../../components/menu/HeroCarousel';
import CategoryNav from '../../components/menu/CategoryNav';
import CategorySection from '../../components/menu/CategorySection';
import ItemDetailSheet from '../../components/menu/ItemDetailSheet';
import BottomNav from '../../components/menu/BottomNav';
import CartDrawer from '../../components/menu/CartDrawer';
import SearchOverlay from '../../components/menu/SearchOverlay';
import Spinner from '../../components/common/Spinner';
import styles from './CustomerMenuPage.module.css';

export default function CustomerMenuPage() {
  const { slug } = useParams();
  const { restaurant, categories, items, loading, error } = useRestaurantMenu(slug);
  const { setRestaurantSlug } = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (slug) setRestaurantSlug(slug);
  }, [slug, setRestaurantSlug]);

  const sectionIds = useMemo(() => categories.map((c) => `category-${c.id}`), [categories]);
  const activeSectionId = useScrollSpy(sectionIds);
  const activeCategoryId = activeSectionId?.replace('category-', '');

  const heroSlides = useMemo(() => {
    const withImages = items.filter((i) => i.available && i.image);
    if (withImages.length > 0) {
      return withImages.map((i) => ({
        id: i.id,
        image: i.image,
        caption: i.name,
        item: i,
      }));
    }
    return (restaurant?.cover || []).map((image, idx) => ({ id: `cover-${idx}`, image, caption: null }));
  }, [items, restaurant]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <Spinner size={30} />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className={styles.notFound}>
        <h1>404</h1>
        <p>{error || 'Restaurant not found.'}</p>
      </div>
    );
  }

  return (
    <MenuLayout theme={restaurant.theme}>
      <MenuHeader restaurant={restaurant} onSearchClick={() => setSearchOpen(true)} />

      <HeroCarousel
        slides={heroSlides}
        onSlideClick={(slide) => slide.item && setSelectedItem(slide.item)}
      />

      <CategoryNav categories={categories} activeId={activeCategoryId} />

      <main>
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            items={items.filter((i) => i.categoryId === category.id)}
            onOpenItem={setSelectedItem}
          />
        ))}
      </main>

      <BottomNav />
      <CartDrawer restaurant={restaurant} />
      <SearchOverlay
        open={searchOpen}
        items={items}
        onClose={() => setSearchOpen(false)}
        onOpenItem={(item) => { setSearchOpen(false); setSelectedItem(item); }}
      />
      <ItemDetailSheet item={selectedItem} onClose={() => setSelectedItem(null)} />

      <footer className={styles.footer}>
        <span>NovaIraq</span>
        <img src="/nova-logo.jpg" alt="Nova" className={styles.footerLogo} />
      </footer>
    </MenuLayout>
  );
}
