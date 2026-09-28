import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { collections } from '../db.js';

// Real menu photos shipped with the app (server/uploads/seed) — these are
// static assets bundled with the deploy, not user uploads, so they don't
// need to live in Cloudinary.
const PHOTOS = {
  riceQeema: '/uploads/seed/rice-qeema-tray.jpg',
  wholeChicken: '/uploads/seed/charcoal-whole-chicken.jpg',
  kiloKebabChicken: '/uploads/seed/kilo-chicken-kebab.jpg',
  burger: '/uploads/seed/beef-burger-turkish-cheese.jpg',
  kebabKilo: '/uploads/seed/grilled-kebab-kilo.jpg',
  kebabSingle: '/uploads/seed/grilled-kebab-single.jpg',
  tikka: '/uploads/seed/chicken-tikka-skewers.jpg',
  wings: '/uploads/seed/grilled-wings.jpg',
  pizza: '/uploads/seed/pizza-chicken.jpg',
  shawarmaPlate: '/uploads/seed/shawarma-plate.jpg',
  shawarmaWrap: '/uploads/seed/shawarma-wrap.jpg',
};

export async function seedIfEmpty() {
  const existing = await collections.restaurants.countDocuments();
  if (existing > 0) return;

  const restaurantId = nanoid();

  await collections.restaurants.insertOne({
    id: restaurantId,
    slug: 'tannour',
    name: 'مطعم تنور وحطب أبو أسو',
    description: 'مشاوي عراقية أصيلة وخبز طازج وأطباق بيتية، تحضّر يوميًا على الفحم.',
    logo: 'https://placehold.co/200x200/c65332/ffffff?text=T&font=roboto',
    cover: [PHOTOS.kebabKilo, PHOTOS.wholeChicken, PHOTOS.shawarmaPlate],
    phone: '+964 771 717 0392',
    whatsapp: '+964 771 717 0392',
    address: 'حي المنصور، شارع 14، بغداد، العراق',
    social: { instagram: '', facebook: 'https://www.facebook.com/share/1QmotqWYjr/', tiktok: '' },
    googleMapsUrl: 'https://maps.google.com/?q=Al-Mansour,Baghdad',
    telegramBotToken: '',
    telegramChatId: '',
    views: 0,
    theme: {
      primary: '#c1502e',
      secondary: '#8b3a28',
      background: '#f1e6d3',
      surface: '#ffffff',
      text: '#2a1f15',
      buttonText: '#ffffff',
      font: 'Cairo',
      radius: 16,
      cardStyle: 'solid',
    },
    createdAt: new Date().toISOString(),
  });

  await collections.admins.insertOne({
    id: nanoid(),
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10),
    restaurantId,
    name: 'Restaurant Owner',
    createdAt: new Date().toISOString(),
  });

  const categoryDefs = [
    { key: 'main', name: 'الأطباق الرئيسية', image: PHOTOS.riceQeema },
    { key: 'appetizers', name: 'المقبلات', image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1000&q=80' },
    { key: 'grills', name: 'المشاوي', image: PHOTOS.kebabKilo },
    { key: 'pizza', name: 'البيتزا', image: PHOTOS.pizza },
    { key: 'kas', name: 'الكص', image: PHOTOS.shawarmaWrap },
    { key: 'burgers', name: 'البرغر', image: PHOTOS.burger },
    { key: 'drinks', name: 'المشروبات', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1000&q=80' },
    { key: 'desserts', name: 'الحلويات', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80' },
  ];

  const categoryIds = {};
  const categoryDocs = categoryDefs.map((c, i) => {
    const id = nanoid();
    categoryIds[c.key] = id;
    return {
      id,
      restaurantId,
      name: c.name,
      description: '',
      image: c.image,
      active: true,
      sortOrder: i,
      createdAt: new Date().toISOString(),
    };
  });
  await collections.categories.insertMany(categoryDocs);

  const itemDefs = [
    { cat: 'main', name: 'صينية تمن وقيمة', desc: 'صينية تمن بالزعفران مغطاة بقيمة مطبوخة على نار هادئة، تكفي حتى 5 أشخاص.', price: 10000, image: PHOTOS.riceQeema, featured: true },
    { cat: 'grills', name: 'دجاجة كاملة على الفحم', desc: 'دجاجة كاملة مشوية على الفحم، تقدم فوق تمن بالزعفران مع الليمون وصوصات البيت.', price: 15000, image: PHOTOS.wholeChicken, popular: true },
    { cat: 'grills', name: 'كيلو كباب دجاج', desc: 'كيلو كباب دجاج مشوي على الفحم، يقدم مع خبز طازج وسلطة وخضار مشوي.', price: 20000, image: PHOTOS.kiloKebabChicken, featured: true, popular: true },
    { cat: 'burgers', name: 'برغر لحم بالجبنة التركية', desc: 'قرص لحم مشوي مع جبنة تركية ذائبة وبيضة مقلية داخل خبز السمسم.', price: 6000, image: PHOTOS.burger, isNew: true },
    { cat: 'appetizers', name: 'سلطة خضراء', desc: 'خضار طازجة، طماطم، خيار وصلصة ليمون.', price: 3500, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80' },
    { cat: 'main', name: 'صحن شاورما دجاج', desc: 'شاورما دجاج متبلة مع صوص الثوم والمخللات.', price: 10000, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1000&q=80' },
    { cat: 'main', name: 'سلة دجاج مقلي', desc: 'قطع دجاج مقلية مقرمشة تقدم مع البطاطا.', price: 9000, image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1000&q=80', isNew: true },
    { cat: 'grills', name: 'نفر كباب', desc: 'نفر واحد من الكباب المشوي على الفحم.', price: 10000, image: PHOTOS.kebabSingle },
    { cat: 'grills', name: 'كيلو كباب', desc: 'كيلو كباب مشوي على الفحم.', price: 20000, image: PHOTOS.kebabKilo, popular: true },
    { cat: 'grills', name: 'نفر تكه دجاج', desc: 'نفر تكة دجاج مشوية على الفحم.', price: 5000, image: PHOTOS.tikka },
    { cat: 'grills', name: 'كيلو أجنحة', desc: 'كيلو أجنحة دجاج مشوية على الفحم.', price: 20000, image: PHOTOS.wings },
    { cat: 'pizza', name: 'بيتزا', desc: 'بيتزا بالدجاج والخضار والجبن.', price: 5000, image: PHOTOS.pizza },
    { cat: 'kas', name: 'كيلو كص', desc: 'كيلو كص لحم يقدم مع الخضار الطازجة.', price: 20000, image: PHOTOS.shawarmaPlate },
    { cat: 'kas', name: 'كص', desc: 'كص لحم في خبز طازج مع الخضار.', price: 5000, image: PHOTOS.shawarmaWrap },
    { cat: 'burgers', name: 'برغر لحم كلاسيك', desc: 'قرص لحم مشوي مع خس وطماطم وصوص خاص.', price: 6000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80', popular: true },
    { cat: 'desserts', name: 'كيك شوكولاتة', desc: 'كيك شوكولاتة غني بحشوة سائلة.', price: 5000, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80' },
  ];

  const itemDocs = itemDefs.map((it, i) => ({
    id: nanoid(),
    restaurantId,
    categoryId: categoryIds[it.cat],
    name: it.name,
    description: it.desc,
    price: it.price,
    oldPrice: it.oldPrice || null,
    image: it.image,
    available: it.available === undefined ? true : it.available,
    featured: !!it.featured,
    popular: !!it.popular,
    isNew: !!it.isNew,
    discount: it.discount || 0,
    sortOrder: i,
    createdAt: new Date().toISOString(),
  }));
  await collections.items.insertMany(itemDocs);

  console.log('Seeded restaurant "tannour". Admin login: admin / admin123');
}
