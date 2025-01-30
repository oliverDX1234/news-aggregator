import React from "react";
import { Card } from "@/components/ui/card";

import { ArticlePropsType } from "@/types/types";

const Article: React.FC<ArticlePropsType> = ({
  title,
  content,
  published_at,
  source,
}) => {
  return (
    <Card className="p-4 shadow-md bg-primary-50">
      <h2 className="text-lg font-bold text-neutral-800 mb-2">{title}</h2>
      <p className="text-sm text-neutral-600 mb-4">
        {content?.slice(0, 100)}...
      </p>
      <p className="text-xs text-neutral-500">
        Published on {new Date(published_at).toLocaleDateString()} by {source}
      </p>
    </Card>
  );
};

export default Article;
