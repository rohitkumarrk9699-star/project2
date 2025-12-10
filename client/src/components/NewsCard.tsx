import { Article } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useLocation } from "wouter";

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const [, setLocation] = useLocation();
  
  // Use a stripped version of content for the preview card
  const previewContent = article.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "...";

  const handleClick = () => {
    setLocation(`/article/${article.id}`);
  };

  return (
    <Card 
      onClick={handleClick}
      className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-card cursor-pointer transform hover:-translate-y-1"
      data-testid={`card-article-${article.id}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop`;
          }}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="font-medium bg-background/90 backdrop-blur-sm shadow-sm">
            {article.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium tracking-wide uppercase">
          <span className="text-primary">{article.source}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-5 pt-2 flex-grow">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {previewContent}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 mt-auto border-t border-border/50">
        <div className="w-full flex justify-between items-center pt-4">
          <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline underline-offset-4">
            Read Full Story <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
