import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Upload,
  Camera,
  Info,
  Sparkles,
  X
} from 'lucide-react';
import { diseaseService, aiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const CROPS_LIST = [
  { key: "All", en: "All", hi: "सभी", mr: "सर्व" },
  { key: "Tomato", en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
  { key: "Wheat", en: "Wheat", hi: "गेहूं", mr: "गहू" },
  { key: "Rice / Paddy", en: "Rice / Paddy", hi: "धान / चावल", mr: "भात / धान" },
  { key: "Cotton", en: "Cotton", hi: "कपास", mr: "कापूस" },
  { key: "Chickpea / Gram", en: "Chickpea / Gram", hi: "चना", mr: "हरभरा / चणा" },
  { key: "Onion", en: "Onion", hi: "प्याज", mr: "कांदा" },
];

const TYPES_LIST = [
  { key: "All", en: "All", hi: "सभी", mr: "सर्व" },
  { key: "Fungal", en: "Fungal", hi: "फफूंद जनित", mr: "बुरशीजन्य" },
  { key: "Bacterial", en: "Bacterial", hi: "जीवाणु जनित", mr: "जिवाणूजन्य" },
  { key: "Viral", en: "Viral", hi: "विषाणु जनित", mr: "विषाणूजन्य" },
  { key: "Pest", en: "Pest", hi: "कीट प्रकोप", mr: "कीड प्रादुर्भाव" },
];

export const DiseasesPage = () => {
  const { t, language } = useLanguage();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');

  // AI Image Diagnosis state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [diagnoseError, setDiagnoseError] = useState('');

  const fetchDiseases = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await diseaseService.getDiseases({
        crop_name: selectedCrop !== 'All' ? selectedCrop : undefined,
        disease_type: selectedType !== 'All' ? selectedType : undefined,
        search: search ? search : undefined,
      });
      setDiseases(res.data);
    } catch (err) {
      console.error("Failed to load diseases:", err);
      setError(language === 'hi' ? "कीट व रोग कैटलॉग लोड करने में असमर्थ। कृपया पुनः प्रयास करें।" : language === 'mr' ? "कीड व रोग कॅटलॉग लोड करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा." : "Unable to load pest & disease catalog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, [selectedCrop, selectedType]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setDiagnosisResult(null);
      setDiagnoseError('');
    }
  };

  const handleRunDiagnosis = async () => {
    if (!selectedImage) return;

    setDiagnosing(true);
    setDiagnoseError('');
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      if (selectedCrop !== 'All') {
        formData.append('crop_name', selectedCrop);
      }
      const res = await aiService.diagnose(formData);
      setDiagnosisResult(res.data);
    } catch (err) {
      console.error("Diagnosis error:", err);
      setDiagnoseError(language === 'hi' ? "फोटो से रोग पहचानने में असमर्थ। कृपया पौधे के प्रभावित हिस्से की स्पष्ट फोटो अपलोड करें।" : language === 'mr' ? "फोटोवरून रोग ओळखण्यात अडचण आली. कृपया पिकाच्या बाधित भागाचा स्पष्ट फोटो अपलोड करा." : "Unable to diagnose image. Please try another clear photo of the leaf/fruit.");
    } finally {
      setDiagnosing(false);
    }
  };

  const clearImageUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDiagnosisResult(null);
    setDiagnoseError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>{language === 'hi' ? "पादप रोग विज्ञान एवं एकीकृत कीट प्रबंधन" : language === 'mr' ? "पीक पॅथॉलॉजी व एकात्मिक कीड व्यवस्थापन" : "Crop Pathology & Integrated Pest Management"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t.pestDiagnosisTitle || "Pest & Disease Diagnosis"}
          </h1>
          <p className="text-sm text-gray-700 font-medium max-w-2xl">
            {t.pestDiagnosisSubtitle || "Identify leaf symptoms, fungal blights, viral curl diseases, and insect infestations with certified chemical and biological treatment protocols."}
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchDiseases()}
            placeholder={t.searchSymptoms || "Search symptoms or pests..."}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* AI Image Diagnosis Tool Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-forest-500/10 to-emerald-500/10 border-2 border-amber-300 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-950">{t.aiImageDiagnosis || "AI Crop Image Diagnosis"}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black">
                  {t.instantAI || "Instant AI"}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-800">
                {language === 'hi' ? "रोगग्रस्त पत्ती, तने या फल का फोटो अपलोड करें और तुरंत लक्षण व उपचार पाएं।" : language === 'mr' ? "बाधित पान, खोड किंवा फळाचा फोटो अपलोड करा आणि त्वरित लक्षणे व उपाय मिळवा." : "Upload a photo of an affected leaf, stem, or fruit to receive symptom analysis & remedy steps."}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Interface */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 space-y-3">
            {!imagePreview ? (
              <label className="border-2 border-dashed border-amber-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-100/60 transition bg-white">
                <Upload className="w-10 h-10 text-amber-700 mb-2" />
                <span className="text-sm font-black text-gray-900">{t.uploadCropImage || "Click to upload crop image"}</span>
                <span className="text-xs font-bold text-gray-700 mt-1">{t.supportsFormats || "Supports JPG, PNG, WebP"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white">
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={clearImageUpload}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {imagePreview && !diagnosisResult && (
              <button
                onClick={handleRunDiagnosis}
                disabled={diagnosing}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className={`w-4 h-4 ${diagnosing ? 'animate-spin' : ''}`} />
                <span>{diagnosing ? (language === 'hi' ? 'रोग विश्लेषण हो रहा है...' : language === 'mr' ? 'रोग विश्लेषण सुरू आहे...' : 'Analyzing Disease...') : (language === 'hi' ? 'एआई जांच शुरू करें' : language === 'mr' ? 'AI विश्लेषण सुरू करा' : 'Run AI Analysis')}</span>
              </button>
            )}

            {diagnoseError && (
              <p className="text-xs text-red-600 font-semibold">{diagnoseError}</p>
            )}
          </div>

          {/* Diagnosis Result Box */}
          <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[190px] flex flex-col justify-between">
            {diagnosing ? (
              <div className="text-center py-10 space-y-3">
                <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                <p className="text-sm font-bold text-gray-700">{language === 'hi' ? "एआई विजन इंजन रोग के लक्षणों की जांच कर रहा है..." : language === 'mr' ? "AI व्हिजन इंजिन रोगाच्या लक्षणांची तपासणी करत आहे..." : "AI Vision Engine analyzing plant pathology..."}</p>
                <p className="text-xs text-gray-400">{language === 'hi' ? "राष्ट्रीय कृषि डेटाबेस से लक्षणों का मिलान किया जा रहा है" : language === 'mr' ? "राष्ट्रीय कृषी डेटाबेसशी लक्षणांची जुळवणी केली जात आहे" : "Matching visual disease symptoms with national agri databases"}</p>
              </div>
            ) : diagnosisResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide block">
                      {language === 'hi' ? `फसल: ${diagnosisResult.crop_detected}` : language === 'mr' ? `पीक: ${diagnosisResult.crop_detected}` : `Detected in ${diagnosisResult.crop_detected}`}
                    </span>
                    <h3 className="text-lg font-black text-gray-900">
                      {diagnosisResult.disease_detected}
                    </h3>
                    {diagnosisResult.hindi_name && (
                      <p className="text-xs text-gray-500">{diagnosisResult.hindi_name}</p>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                    {diagnosisResult.severity} {language === 'hi' ? "गंभीरता" : language === 'mr' ? "तीव्रता" : "Severity"}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-gray-900 block mb-0.5">{language === 'hi' ? "पहचाने गए लक्षण:" : language === 'mr' ? "ओळखलेली लक्षणे:" : "Identified Symptoms:"}</strong>
                    <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                      {diagnosisResult.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <strong className="text-forest-800 block mb-0.5">{language === 'hi' ? "अनुशंसित उपचार व रोकथाम:" : language === 'mr' ? "शिफारस केलेले उपाय व नियंत्रण:" : "Recommended Treatment:"}</strong>
                    <ul className="list-disc list-inside text-forest-700 space-y-0.5 font-medium">
                      {diagnosisResult.treatment_steps.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Statutory Farmer Safety Advisory Disclaimer */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{language === 'hi' ? "सलाह / अस्वीकरण:" : language === 'mr' ? "सल्ला / अस्वीकरण:" : "Disclaimer:"}</strong> {diagnosisResult.disclaimer}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 space-y-2">
                <ShieldAlert className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-sm">{language === 'hi' ? "बाईं ओर फोटो अपलोड करें और निदान देखने के लिए 'एआई जांच शुरू करें' पर क्लिक करें।" : language === 'mr' ? "डावीकडे फोटो अपलोड करा आणि निदान पाहण्यासाठी 'AI विश्लेषण सुरू करा' वर क्लिक करा." : 'Upload a photo on the left and click "Run AI Analysis" to view diagnosis.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-900 shrink-0">{t.filterCrop || "Filter Crop"}:</span>
          {CROPS_LIST.map((crop) => (
            <button
              key={crop.key}
              onClick={() => setSelectedCrop(crop.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCrop === crop.key
                  ? 'bg-forest-800 text-white shadow-sm ring-2 ring-forest-800'
                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-forest-600 hover:bg-forest-50'
              }`}
            >
              {crop[language] || crop.en}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-900 shrink-0">{t.diseaseType || "Disease Type"}:</span>
          {TYPES_LIST.map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedType === type.key
                  ? 'bg-amber-700 text-white ring-2 ring-amber-700 shadow-sm'
                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-amber-600 hover:bg-amber-50'
              }`}
            >
              {type[language] || type.en}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDiseases} />}

      {/* Diseases Catalog List */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : diseases.length === 0 ? (
        <EmptyState
          title={language === 'hi' ? "कोई रोग रिकॉर्ड नहीं मिला" : language === 'mr' ? "कोणताही रोग रेकॉर्ड सापडला नाही" : "No disease records found"}
          description={language === 'hi' ? "कृपया फसल या रोग प्रकार के फ़िल्टर रीसेट करें।" : language === 'mr' ? "कृपया पीक किंवा रोगाचे फिल्टर रीसेट करा." : "Try resetting crop and type filters."}
          actionText={language === 'hi' ? "सभी फ़िल्टर रीसेट करें" : language === 'mr' ? "सर्व फिल्टर रीसेट करा" : "Reset All Filters"}
          onAction={() => {
            setSelectedCrop('All');
            setSelectedType('All');
            setSearch('');
            fetchDiseases();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diseases.map((d) => (
            <div
              key={d.id}
              className="p-6 rounded-3xl bg-white border border-gray-200 shadow-soft space-y-4 hover:shadow-card transition"
            >
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-forest-100 text-forest-900 text-xs font-black">
                      {d.crop_name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-black">
                      {d.disease_type}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-950 mt-1">
                    {language === 'hi' && d.hindi_name ? d.hindi_name : d.name}
                  </h3>
                  {d.hindi_name && language !== 'hi' && (
                    <p className="text-xs text-gray-700 font-bold">{d.hindi_name}</p>
                  )}
                </div>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-black shrink-0 border border-red-200">
                  {d.severity} {language === 'hi' ? "जोखिम" : language === 'mr' ? "धोका" : "Risk"}
                </span>
              </div>

              {/* Symptoms */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200">
                  <strong className="text-red-950 block mb-0.5 font-black">{t.symptoms || "Symptoms (लक्षण)"}:</strong>
                  <p className="text-gray-900 font-medium leading-relaxed">{d.symptoms}</p>
                </div>

                {d.causes && (
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <strong className="text-gray-950 block mb-0.5 font-black">{t.causes || "Possible Causes (कारण)"}:</strong>
                    <p className="text-gray-800 font-medium leading-relaxed">{d.causes}</p>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-forest-50/70 border border-forest-200">
                  <strong className="text-forest-950 block mb-0.5 font-black">{t.treatment || "Recommended Treatment (रोकथाम व उपचार)"}:</strong>
                  <p className="text-forest-900 font-semibold leading-relaxed">{d.treatment}</p>
                </div>

                {d.prevention && (
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                    <strong className="text-blue-950 block mb-0.5 font-black">{t.prevention || "Preventative Agronomy (बचाव)"}:</strong>
                    <p className="text-blue-900 font-medium leading-relaxed">{d.prevention}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiseasesPage;
