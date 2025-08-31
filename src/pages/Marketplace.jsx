
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Temporarily disconnect Base44 data for this screen; use our new server
// import { Store, Product } from '@/api/entities';
import { apiGet } from '@/lib/utils';
import CategoryScroller from '@/components/marketplace/CategoryScroller';
import StoreCard from '@/components/marketplace/StoreCard';

import { Button } from '@/components/ui/button';
import { MoreVertical, Star, Truck, MapPin } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getDistance = (lat1, lon1, lat2, lon2) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

// Mock delivery data generator
const generateMockDeliveryData = (store, distance) => {
    const mockData = {
        // Generate delivery time based on distance
        delivery_time: distance < 5 ? "30-60 דקות" : 
                      distance < 10 ? "1-2 שעות" : 
                      distance < 20 ? "2-4 שעות" : "4-6 שעות",
        
        // Generate delivery cost based on distance and store type
        delivery_fee: distance < 5 ? Math.floor(Math.random() * 10) + 15 : // 15-25 shekels
                     distance < 10 ? Math.floor(Math.random() * 15) + 25 : // 25-40 shekels
                     distance < 20 ? Math.floor(Math.random() * 20) + 35 : // 35-55 shekels
                     Math.floor(Math.random() * 25) + 45, // 45-70 shekels
        
        // Generate rating if not exists
        rating: store.rating || (3.5 + Math.random() * 1.5), // 3.5-5.0 rating
        
        // Add location if not exists (random locations around Tel Aviv)
        location: store.location || {
            lat: 32.0853 + (Math.random() - 0.5) * 0.1, // Random around Tel Aviv
            lng: 34.7818 + (Math.random() - 0.5) * 0.1
        }
    };
    
    return { ...store, ...mockData };
};

// Mock recommended stores data
const getMockStores = () => [
    {
        id: 'mock_1',
        name: 'רלי מרעוע - ציוד מקצועי',
        description: 'ציוד וכלי עבודה מקצועיים במשלוח מהיר.',
        image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
        categories: ['tools'],
        rating: 4.7,
        delivery_time: '45-90 דקות',
        delivery_fee: 20
    },
    {
        id: 'mock_2',
        name: 'גינת עדן - מרכז גינון',
        description: 'הכל לגינה שלכם - צמחים, זרעים, ציוד וגידול.',
        image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80',
        categories: ['gardening'],
        rating: 4.5,
        delivery_time: '1-2 שעות',
        delivery_fee: 25
    },
    {
        id: 'mock_3',
        name: 'אלקטרו פלוס - חשמל ותאורה',
        description: 'ציוד חשמל ותאורה מתקדמים לבית ולעסק.',
        image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=80',
        categories: ['electrical_supplies'],
        rating: 4.8,
        delivery_time: '30-60 דקות',
        delivery_fee: 15
    },
    {
        id: 'mock_4',
        name: 'בניין צבי - חומרי בניין',
        description: 'חומרי בניין איכותיים לכל פרויקט.',
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
        categories: ['building_materials'],
        rating: 4.6,
        delivery_time: '2-4 שעות',
        delivery_fee: 30
    },
    {
        id: 'mock_5',
        name: 'הובלות אקספרס',
        description: 'שירותי הובלה ומשלוחים מהירים בכל הארץ.',
        image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
        categories: ['moving_and_deliveries'],
        rating: 4.4,
        delivery_time: '20-45 דקות',
        delivery_fee: 0
    },
    {
        id: 'mock_6',
        name: 'צבעי פסגה - מרכז צבע',
        description: 'צבעים איכותיים וציוד צביעה מקצועי.',
        image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
        categories: ['painting_supplies'],
        rating: 4.5,
        delivery_time: '1-3 שעות',
        delivery_fee: 18
    },
    {
        id: 'mock_7',
        name: 'חשמלי פלוס - פתרונות חשמל',
        description: 'מוצרי חשמל מתקדמים ושירותי התקנה מקצועיים.',
        image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
        categories: ['electrical_supplies'],
        rating: 4.9,
        delivery_time: '45-90 דקות',
        delivery_fee: 25
    },
    {
        id: 'mock_8',
        name: 'גן עדן - צמחים ועציצים',
        description: 'מגוון רחב של צמחים, עציצים וציוד גינון מקצועי.',
        image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80',
        categories: ['gardening'],
        rating: 4.6,
        delivery_time: '1-2 שעות',
        delivery_fee: 20
    },
    {
        id: 'mock_9',
        name: 'כלים מקצועיים - פרימיום',
        description: 'כלי עבודה איכותיים למקצוענים ולחובבים עם אחריות מלאה.',
        image_url: 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?auto=format&fit=crop&w=400&q=80',
        categories: ['tools'],
        rating: 4.8,
        delivery_time: '2-4 שעות',
        delivery_fee: 15
    }
];

export default function MarketplacePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const category = query.get('category');
    
    const categoryNames = {
        building_materials: "חומרי בניין",
        gardening: "גינון",
        electrical_supplies: "חשמל ותאורה",
        painting_supplies: "צבע",
        tools: "כלי עבודה"
    };

    const [allStores, setAllStores] = useState([]);
    const [displayedStores, setDisplayedStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [storesTitle, setStoresTitle] = useState(() => category ? (categoryNames[category] || "תוצאות") : "חנויות מומלצות");
    const [sortBy, setSortBy] = useState('distance');
    const [showAllStores, setShowAllStores] = useState(false);
    const [overrideCategory, setOverrideCategory] = useState(false);


    useEffect(() => {
        // Use fixed location for testing (Tel Aviv center)
        setUserLocation({
            lat: 32.0853,
            lng: 34.7818
        });

        const fetchData = async () => {
            setLoading(true);
            try {
                const [fetchedStores, fetchedProducts] = await Promise.all([
                    apiGet('/api/stores'),
                    apiGet('/api/products', { limit: 12 })
                ]);
                
                // Filter stores with valid images
                const storesWithImages = fetchedStores.filter(store => store.image_url && store.image_url.startsWith('http'));
                
                // Add mock delivery data to existing stores
                const storesWithDeliveryData = storesWithImages.map(store => {
                    const distance = getDistance(32.0853, 34.7818, 
                        store.location?.lat || 32.0853, 
                        store.location?.lng || 34.7818);
                    return generateMockDeliveryData(store, distance);
                });
                
                // Add mock stores for demo (empty)
                const mockStores = getMockStores();
                let allStoresData = [...storesWithDeliveryData, ...mockStores];

                // Ensure every store has a valid image (http/https). If not – assign random Unsplash image.
                const fallbackImages = [
                    'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=400&q=60',
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=60',
                    'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=400&q=60',
                    'https://images.unsplash.com/photo-1581090700227-5a7a8035f69b?auto=format&fit=crop&w=400&q=60'
                ];
                allStoresData = allStoresData.map((s, idx) => {
                    if (!s.image_url || !(s.image_url.startsWith('http'))) {
                        return {
                            ...s,
                            image_url: fallbackImages[idx % fallbackImages.length]
                        };
                    }
                    return s;
                });
                
                setAllStores(allStoresData);
                // Mock featured products
                const mockProducts = [
                    {
                        id: 'prod-1',
                        name: 'מברגת אימפקט מקצועית',
                        brand: 'DeWalt',
                        price: 349.90,
                        original_price: 429.90,
                        image_url: 'https://images.unsplash.com/photo-1585436232199-bcd77cb436ed?auto=format&fit=crop&w=400&q=60',
                    },
                    {
                        id: 'prod-2',
                        name: 'מסור עגול 7-1/4"',
                        brand: 'Makita',
                        price: 529.00,
                        original_price: 599.00,
                        image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=60',
                    },
                    {
                        id: 'prod-3',
                        name: 'סט מברגים מגנטיים',
                        brand: 'Bosch',
                        price: 89.90,
                        image_url: 'https://images.unsplash.com/photo-1579586337278-3b33ae36c6e0?auto=format&fit=crop&w=400&q=60',
                    },
                ];
                setProducts(mockProducts);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Fallback to mock stores only if API fails
                setAllStores(getMockStores());
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        if (loading) return;

        let storesToDisplay = [...allStores];
        const effectiveCategory = overrideCategory ? null : category;

        // Update the title based on the current category or default
        if (effectiveCategory) {
            setStoresTitle(categoryNames[effectiveCategory] || "תוצאות");
            storesToDisplay = allStores.filter(store => store.categories?.includes(effectiveCategory));
            
            let storesWithCalculatedProps = storesToDisplay.map(store => {
                const distance = userLocation && store.location?.lat && store.location?.lng 
                    ? getDistance(userLocation.lat, userLocation.lng, store.location.lat, store.location.lng) 
                    : Infinity;
                return { ...store, distance };
            });

            // Sorting logic is applied after filtering
            if (sortBy === 'distance') {
                storesWithCalculatedProps.sort((a, b) => a.distance - b.distance);
            } else if (sortBy === 'rating') {
                storesWithCalculatedProps.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else if (sortBy === 'delivery_fee') {
                storesWithCalculatedProps.sort((a, b) => (a.delivery_fee || Infinity) - (b.delivery_fee || Infinity));
            }
            
            setDisplayedStores(storesWithCalculatedProps);
        } else {
            setStoresTitle(showAllStores ? "כל החנויות" : "חנויות מומלצות");
            
            // Add delivery data and calculate distance for all stores
            let storesWithCalculatedProps = storesToDisplay.map(store => {
                const distance = userLocation && store.location?.lat && store.location?.lng 
                    ? getDistance(userLocation.lat, userLocation.lng, store.location.lat, store.location.lng) 
                    : Math.random() * 15; // Random distance for stores without location
                return { ...store, distance };
            });
            
            // Sort by rating for the main recommended view
            storesWithCalculatedProps.sort((a,b) => (b.rating || 0) - (a.rating || 0));
            
            // Show all stores or just recommended ones
            if (showAllStores) {
                setDisplayedStores(storesWithCalculatedProps); // Show all stores
            } else {
                setDisplayedStores(storesWithCalculatedProps.slice(0, 9)); // Show top 9 recommended
            }
        }
    }, [allStores, category, userLocation, loading, sortBy, showAllStores, overrideCategory]);

    // Reset override when category changes (user navigates to a new category)
    useEffect(() => {
        if (category) {
            setOverrideCategory(false);
        }
    }, [category]);

    const sortOptions = [
        { key: 'distance', label: 'מיין לפי מרחק', icon: MapPin },
        { key: 'rating', label: 'מיין לפי דירוג', icon: Star },
        { key: 'delivery_fee', label: 'מיין לפי דמי משלוח', icon: Truck },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground" dir="rtl">
            {/* Static background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-32 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-3/4 right-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-7xl mx-auto py-4 relative z-10">
                
                <div>
                    <CategoryScroller />
                </div>
                


                <section className="px-4 mt-1">
                    <div className="relative mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-right bg-gradient-to-l from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                                {storesTitle}
                            </h2>
                            <div className="absolute -bottom-1 right-0 w-24 h-1 bg-gradient-to-l from-cyan-500 to-transparent rounded-full"></div>
                        </div>
                        
                        {/* Navigation and filter buttons */}
                        <div className="flex items-center gap-3">
                            {/* Navigation buttons */}
                            {(category && !overrideCategory) ? (
                                // When in category view - show buttons to return to general views
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={() => {
                                            setOverrideCategory(true);
                                            setShowAllStores(false);
                                        }}
                                        variant="outline" 
                                        size="sm"
                                        className="border-blue-600 text-blue-700 bg-blue-50 hover:bg-blue-100 shadow-sm dark:bg-blue-600/30 dark:hover:bg-blue-600/40 dark:border-blue-400/70 dark:text-white transition-all duration-300"
                                    >
                                        חנויות מומלצות
                                    </Button>
                                    <Button 
                                        onClick={() => {
                                            setOverrideCategory(true);
                                            setShowAllStores(true);
                                        }}
                                        variant="outline" 
                                        size="sm"
                                        className="border-blue-600 text-blue-700 bg-blue-50 hover:bg-blue-100 shadow-sm dark:bg-blue-600/30 dark:hover:bg-blue-600/40 dark:border-blue-400/70 dark:text-white transition-all duration-300"
                                    >
                                        כל החנויות
                                    </Button>
                                </div>
                            ) : (
                                // When in general view - show toggle button
                                <Button 
                                    onClick={() => setShowAllStores(!showAllStores)}
                                    variant="outline" 
                                    className="border-blue-600 text-blue-800 bg-white hover:bg-blue-50 font-semibold shadow-sm dark:bg-blue-600/30 dark:hover:bg-blue-600/40 dark:border-blue-400/70 dark:text-white transition-all duration-300"
                                >
                                    {showAllStores ? "חנויות מומלצות" : "כל החנויות"}
                                </Button>
                            )}
                            
                            {/* Filter dropdown - show for both category and general views */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                    {sortOptions.map(option => {
                                        const Icon = option.icon;
                                        return (
                                            <DropdownMenuItem 
                                                key={option.key}
                                                onClick={() => setSortBy(option.key)}
                                                className={`cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${
                                                    sortBy === option.key ? 'bg-cyan-600/20 text-cyan-300' : ''
                                                }`}
                                            >
                                                <Icon className="w-4 h-4 ml-2" />
                                                {option.label}
                                            </DropdownMenuItem>
                                        )
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-2xl p-6 h-64 backdrop-blur-sm">
                                    <div className="w-full h-32 bg-gray-700/50 rounded-xl mb-4"></div>
                                    <div className="w-3/4 h-4 bg-gray-700/50 rounded mb-2"></div>
                                    <div className="w-1/2 h-3 bg-gray-700/50 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedStores.map((store, index) => (
                                <div 
                                    key={store.id} 
                                    className="hover:animate-float"
                                >
                                    <StoreCard store={store} />
                                </div>
                            ))}
                        </div>
                    )}
                    {displayedStores.length === 0 && !loading && (
                         <div className="text-center p-12">
                            <div className="text-6xl mb-4">🏪</div>
                            <p className="text-xl text-gray-400">לא נמצאו חנויות בקטגוריה זו.</p>
                         </div>
                    )}
                </section>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float:hover {
                    animation: float 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
