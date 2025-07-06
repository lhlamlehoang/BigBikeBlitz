import React, { useState, useEffect, useRef } from 'react';
import { Input, List, Card, Typography, Tag, Space, Button, Divider } from 'antd';
import { SearchOutlined, FireOutlined, ClockCircleOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../auth/authFetch';

const { Search } = Input;
const { Text, Title } = Typography;

interface Bike {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  type: string;
  popularity?: number;
  views?: number;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'bike' | 'brand' | 'category' | 'popular';
  bike?: Bike;
  count?: number;
}

interface SearchSuggestionsProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSearch,
  placeholder = "Search motorcycles, brands, or models...",
  showSuggestions = true
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allBikes, setAllBikes] = useState<Bike[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    loadRecentSearches();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = async () => {
    try {
      const response = await api.get('/api/bikes/all');
      setAllBikes(response.data);
      
      // Generate popular searches based on bike data
      const popular = [
        'BMW S1000RR',
        'Honda Gold Wing',
        'Yamaha R1',
        'Kawasaki Ninja',
        'Sport Bikes',
        'Adventure Bikes',
        'Touring Motorcycles',
        'Cruiser Bikes'
      ];
      setPopularSearches(popular);
    } catch (error) {
      console.error('Failed to load search data:', error);
    }
  };

  const loadRecentSearches = () => {
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  };

  const saveRecentSearch = (query: string) => {
    const recent = [...recentSearches.filter(s => s !== query), query].slice(0, 5);
    setRecentSearches(recent);
    localStorage.setItem('recentSearches', JSON.stringify(recent));
  };

  const generateSuggestions = (query: string): SearchSuggestion[] => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // Bike name matches
    const bikeMatches = allBikes
      .filter(bike => 
        bike.name.toLowerCase().includes(normalizedQuery) ||
        bike.brand.toLowerCase().includes(normalizedQuery) ||
        bike.type.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 5)
      .map(bike => ({
        id: `bike-${bike.id}`,
        text: bike.name,
        type: 'bike' as const,
        bike,
        count: bike.views || 0
      }));

    suggestions.push(...bikeMatches);

    // Brand matches
    const brands = [...new Set(allBikes.map(bike => bike.brand))];
    const brandMatches = brands
      .filter(brand => brand.toLowerCase().includes(normalizedQuery))
      .slice(0, 3)
      .map(brand => ({
        id: `brand-${brand}`,
        text: `${brand} Motorcycles`,
        type: 'brand' as const,
        count: allBikes.filter(bike => bike.brand === brand).length
      }));

    suggestions.push(...brandMatches);

    // Category matches
    const categories = [...new Set(allBikes.map(bike => bike.type))];
    const categoryMatches = categories
      .filter(category => category.toLowerCase().includes(normalizedQuery))
      .slice(0, 3)
      .map(category => ({
        id: `category-${category}`,
        text: `${category} Bikes`,
        type: 'category' as const,
        count: allBikes.filter(bike => bike.type === category).length
      }));

    suggestions.push(...categoryMatches);

    // Popular search matches
    const popularMatches = popularSearches
      .filter(popular => popular.toLowerCase().includes(normalizedQuery))
      .slice(0, 3)
      .map(popular => ({
        id: `popular-${popular}`,
        text: popular,
        type: 'popular' as const
      }));

    suggestions.push(...popularMatches);

    return suggestions.slice(0, 10);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    
    if (value.trim() && showSuggestions) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      saveRecentSearch(value);
      onSearch(value);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'bike' && suggestion.bike) {
      navigate(`/product/${suggestion.bike.id}`);
    } else {
      handleSearch(suggestion.text);
    }
    setShowDropdown(false);
  };

  const handleRecentSearchClick = (search: string) => {
    handleSearch(search);
  };

  const handlePopularSearchClick = (search: string) => {
    handleSearch(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'bike': return <EyeOutlined />;
      case 'brand': return <StarOutlined />;
      case 'category': return <SearchOutlined />;
      case 'popular': return <FireOutlined />;
      default: return <SearchOutlined />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'bike': return 'blue';
      case 'brand': return 'green';
      case 'category': return 'orange';
      case 'popular': return 'red';
      default: return 'default';
    }
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
      <Search
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        onSearch={handleSearch}
        enterButton={<SearchOutlined />}
        size="large"
        style={{ borderRadius: 8 }}
        onFocus={() => {
          if (searchValue.trim() || recentSearches.length > 0) {
            setShowDropdown(true);
          }
        }}
      />

      {/* Search Suggestions Dropdown */}
      {showDropdown && showSuggestions && (
        <Card
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: 4,
            borderRadius: 8,
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            maxHeight: 400,
            overflow: 'auto'
          }}
        >
          {/* Search Suggestions */}
          {searchValue.trim() && suggestions.length > 0 && (
            <>
              <Title level={5} style={{ marginBottom: 12 }}>
                Search Results
              </Title>
              <List
                dataSource={suggestions}
                renderItem={(suggestion) => (
                  <List.Item
                    style={{ 
                      padding: '8px 0', 
                      cursor: 'pointer',
                      borderRadius: 4
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                      <div style={{ color: '#1677ff' }}>
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{suggestion.text}</div>
                        {suggestion.bike && (
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {suggestion.bike.brand} • ${suggestion.bike.price?.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <Tag color={getSuggestionColor(suggestion.type)}>
                        {suggestion.type}
                      </Tag>
                      {suggestion.count && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {suggestion.count}
                        </Text>
                      )}
                    </div>
                  </List.Item>
                )}
              />
              <Divider style={{ margin: '12px 0' }} />
            </>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchValue.trim() && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0 }}>
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  Recent Searches
                </Title>
                <Button 
                  type="text" 
                  size="small" 
                  onClick={clearRecentSearches}
                >
                  Clear
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    size="small"
                    onClick={() => handleRecentSearchClick(search)}
                    style={{ borderRadius: 16 }}
                  >
                    {search}
                  </Button>
                ))}
              </div>
              <Divider style={{ margin: '12px 0' }} />
            </>
          )}

          {/* Popular Searches */}
          {popularSearches.length > 0 && !searchValue.trim() && (
            <>
              <Title level={5} style={{ marginBottom: 12 }}>
                <FireOutlined style={{ marginRight: 8 }} />
                Popular Searches
              </Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {popularSearches.map((search, index) => (
                  <Button
                    key={index}
                    size="small"
                    onClick={() => handlePopularSearchClick(search)}
                    style={{ borderRadius: 16 }}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </>
          )}

          {/* No Results */}
          {searchValue.trim() && suggestions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No results found for "{searchValue}"
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Try different keywords or browse our categories
              </Text>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SearchSuggestions; 