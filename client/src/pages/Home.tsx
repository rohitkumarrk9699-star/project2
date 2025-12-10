import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { NewsCard } from "@/components/NewsCard";
import { fetchArticles, Category } from "@/lib/mockData";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [match, params] = useRoute("/category/:category");
  const category = match ? (params?.category as Category) : undefined;

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", category],
    queryFn: () => fetchArticles(category),
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <CategoryNav currentCategory={category} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
              {category ? `${category} News` : "Top Stories"}
            </h1>
            <p className="text-muted-foreground">
              {category 
                ? `The latest updates and breaking news in ${category}.`
                : "Curated headlines from around the globe."}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles?.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 The Daily Pulse. All rights reserved.</p>
          <p className="mt-2 text-xs">This is a mock application for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
}
