
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProductInfoCardProps {
  productInfo: {
    product: string;
    release: string;
  };
}

export function ProductInfoCard({ productInfo }: ProductInfoCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Product</span>
            <span className="font-medium">{productInfo.product}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Release</span>
            <span className="font-medium">{productInfo.release}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
