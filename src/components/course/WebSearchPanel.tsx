import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, Loader2, X, Globe, GraduationCap, Sparkles, MapPin, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firecrawlApi, type SearchResult } from "@/lib/api/firecrawl";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuery?: string;
  courseTopic?: string;
}

type CollegeCategory = {
  label: string;
  icon: React.ReactNode;
  searchPrefix: string;
};

const collegeCategories: CollegeCategory[] = [
  { label: "Top Colleges", icon: <Trophy className="h-3 w-3" />, searchPrefix: "best colleges for" },
  { label: "Scholarships", icon: <Sparkles className="h-3 w-3" />, searchPrefix: "scholarships for students in" },
  { label: "Courses", icon: <BookOpen className="h-3 w-3" />, searchPrefix: "online courses and certifications in" },
  { label: "Nearby", icon: <MapPin className="h-3 w-3" />, searchPrefix: "colleges and universities offering" },
];

const popularFields = [
  "Computer Science",
  "Data Science",
  "Business Administration",
  "Engineering",
  "Medicine",
  "Law",
  "Psychology",
  "Design",
];

export function WebSearchPanel({ isOpen, onClose, defaultQuery = "", courseTopic = "" }: WebSearchPanelProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<"web" | "colleges">("web");
  const [selectedCategory, setSelectedCategory] = useState<CollegeCategory | null>(null);

  const handleSearch = async (searchQuery?: string, isCollegeSearch?: boolean) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim() || isSearching) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Enhance query for college searches
      let enhancedQuery = finalQuery;
      if (isCollegeSearch || activeTab === "colleges") {
        if (selectedCategory) {
          enhancedQuery = `${selectedCategory.searchPrefix} ${finalQuery}`;
        } else {
          enhancedQuery = `colleges universities programs ${finalQuery}`;
        }
      }

      const response = await firecrawlApi.search(enhancedQuery, { limit: 6 });

      if (response.success && response.data) {
        setResults(response.data);
        if (response.data.length === 0) {
          toast.info("No results found", { description: "Try a different search term" });
        }
      } else {
        toast.error("Search failed", { description: response.error || "Please try again" });
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed", { description: "Please try again later" });
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleCategoryClick = (category: CollegeCategory) => {
    setSelectedCategory(category);
    if (query.trim() || courseTopic) {
      handleSearch(query || courseTopic, true);
    }
  };

  const handleFieldClick = (field: string) => {
    setQuery(field);
    handleSearch(field, true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "web" | "colleges");
    setResults([]);
    setHasSearched(false);
    setSelectedCategory(null);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 z-10 bg-card rounded-xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
            {activeTab === "colleges" ? (
              <GraduationCap className="h-4 w-4 text-accent-foreground" />
            ) : (
              <Globe className="h-4 w-4 text-accent-foreground" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {activeTab === "colleges" ? "College Finder" : "Web Search"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {activeTab === "colleges" 
                ? "Find colleges matching your interests" 
                : "Find learning resources online"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-3 grid w-auto grid-cols-2">
          <TabsTrigger value="web" className="gap-2">
            <Globe className="h-3.5 w-3.5" />
            Web Search
          </TabsTrigger>
          <TabsTrigger value="colleges" className="gap-2">
            <GraduationCap className="h-3.5 w-3.5" />
            Colleges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="web" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for tutorials, articles, videos..."
                  className="pl-10"
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={!query.trim() || isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </form>
          </div>

          {/* Web Results */}
          <div className="flex-1 overflow-y-auto p-4">
            <SearchResults 
              results={results} 
              isSearching={isSearching} 
              hasSearched={hasSearched}
              emptyIcon={<Globe className="h-10 w-10 text-muted-foreground/50" />}
              emptyTitle="Search for learning resources"
              emptyDescription="Find tutorials, articles, and videos to help you learn"
            />
          </div>
        </TabsContent>

        <TabsContent value="colleges" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
          {/* College Search Input */}
          <div className="p-4 border-b border-border space-y-3">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your field of interest..."
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={!query.trim() || isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
              </Button>
            </form>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {collegeCategories.map((category) => (
                <Button
                  key={category.label}
                  variant={selectedCategory?.label === category.label ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* College Results or Suggestions */}
          <div className="flex-1 overflow-y-auto p-4">
            {!hasSearched && !isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <GraduationCap className="h-10 w-10 mx-auto text-primary/60 mb-2" />
                  <p className="text-sm font-medium text-foreground">Find Your Perfect College</p>
                  <p className="text-xs text-muted-foreground">
                    Explore colleges based on your interests and career goals
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Popular Fields of Study</p>
                  <div className="flex flex-wrap gap-2">
                    {popularFields.map((field) => (
                      <motion.button
                        key={field}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFieldClick(field)}
                        className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                      >
                        {field}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {courseTopic && (
                  <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-2">Based on your current topic:</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => handleFieldClick(courseTopic)}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Find colleges for "{courseTopic}"
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <SearchResults 
                results={results} 
                isSearching={isSearching} 
                hasSearched={hasSearched}
                emptyIcon={<GraduationCap className="h-10 w-10 text-muted-foreground/50" />}
                emptyTitle="No colleges found"
                emptyDescription="Try a different field or category"
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

// Extracted SearchResults component for reuse
function SearchResults({ 
  results, 
  isSearching, 
  hasSearched,
  emptyIcon,
  emptyTitle,
  emptyDescription
}: { 
  results: SearchResult[];
  isSearching: boolean;
  hasSearched: boolean;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <AnimatePresence mode="wait">
      {isSearching ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-full gap-3"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Searching...</p>
        </motion.div>
      ) : results.length > 0 ? (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          {results.map((result, index) => (
            <motion.a
              key={result.url}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="block p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {result.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {result.description || result.markdown?.slice(0, 150)}
                  </p>
                  <p className="text-xs text-primary/70 mt-2 line-clamp-1">
                    {result.url}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </motion.a>
          ))}
        </motion.div>
      ) : hasSearched ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-full gap-2 text-center"
        >
          <Search className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{emptyTitle}</p>
          <p className="text-xs text-muted-foreground/70">{emptyDescription}</p>
        </motion.div>
      ) : (
        <motion.div
          key="initial"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-full gap-2 text-center"
        >
          {emptyIcon}
          <p className="text-sm text-muted-foreground">{emptyTitle}</p>
          <p className="text-xs text-muted-foreground/70">{emptyDescription}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
