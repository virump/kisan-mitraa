import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { newsService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  { key: "All", en: "All", hi: "सभी", mr: "सर्व" },
  { key: "Government", en: "Government", hi: "सरकारी नीतियां", mr: "शासकीय धोरणे" },
  { key: "Weather", en: "Weather", hi: "मौसम चेतावनी", mr: "हवामान इशारा" },
  { key: "Crop Alert", en: "Crop Alert", hi: "फसल एडवाइजरी", mr: "पीक सल्ला" },
  { key: "Market", en: "Market", hi: "मंडी व एमएसपी", mr: "बाजार व हमीभाव" },
  { key: "Technology", en: "Technology", hi: "कृषि तकनीक", mr: "कृषी तंत्रज्ञान" }
];

export const NewsPage = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await newsService.getNews({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search ? search : undefined,
      });
      setNews(res.data);
    } catch (err) {
      console.error("Failed to load news:", err);
      setError(language === 'hi' ? "कृषि समाचार लोड करने में असमर्थ। कृपया पुनः प्रयास करें।" : language === 'mr' ? "कृषी बातम्या लोड करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा." : "Unable to load agriculture news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNews();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-forest-700 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>{language === 'hi' ? "राष्ट्रीय कृषि मौसम एवं नीति बुलेटिन" : language === 'mr' ? "राष्ट्रीय कृषी हवामान व धोरण बुलेटिन" : "National Agromet & Policy Bulletins"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t.latestBulletins || "Agriculture News & Alerts"}
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl">
            {t.bulletinSubtitle || "Verified updates on MSP announcements, weather alerts, pest scouting reports, and market advisories."}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? "समाचार या बुलेटिन खोजें..." : language === 'mr' ? "बातम्या किंवा बुलेटिन शोधा..." : "Search news & advisories..."}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </form>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-gray-500 shrink-0">{t.category || "Category"}:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat.key
                ? 'bg-forest-700 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-forest-50'
            }`}
          >
            {cat[language] || cat.en}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchNews} />}

      {/* News Cards Grid */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : news.length === 0 ? (
        <EmptyState
          title={language === 'hi' ? "कोई समाचार नहीं मिला" : language === 'mr' ? "कोणतीही बातमी सापडली नाही" : "No news articles found"}
          description={language === 'hi' ? "कृपया श्रेणी बदलें या खोज शब्द बदलें।" : language === 'mr' ? "कृपया वेगळा प्रवर्ग निवडा किंवा शोध बदला." : "Try choosing a different category or clearing your search."}
          actionText={t.resetFilters || "Reset Filter"}
          onAction={() => {
            setSelectedCategory('All');
            setSearch('');
            fetchNews();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white border border-gray-100 shadow-soft hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-700 font-bold">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.published_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug">
                  {item.title}
                </h3>
                {item.hindi_name && (
                  <p className="text-xs text-gray-500 mb-2">{item.hindi_name}</p>
                )}

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {item.summary}
                </p>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {item.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="font-semibold">{language === 'hi' ? "स्रोत:" : language === 'mr' ? "स्रोत:" : "Source:"} {item.source}</span>
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-forest-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'hi' ? "आधिकारिक पढ़ें" : language === 'mr' ? "अधिकृत वाचा" : "Read official"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
