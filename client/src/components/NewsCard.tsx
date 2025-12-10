import { Article } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-card">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="font-medium bg-background/90 backdrop-blur-sm shadow-sm">
            {article.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 md:p-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="font-semibold text-primary">{article.source}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
          </span>
        </div>
        <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight group-hover:text-primary/90 transition-colors line-clamp-3">
          {article.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 pt-2 flex-grow">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 md:line-clamp-4">
          {article.content}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 md:p-6 pt-0 mt-auto">
        <a 
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer" 
          className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Read full story <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
}
