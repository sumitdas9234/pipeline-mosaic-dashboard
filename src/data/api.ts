
import { Product, Release, Build } from '@/types';

export interface ApiProduct {
  name: string;
  product: string;
  hidden?: {
    distro?: boolean;
  };
}

// Function to fetch products and releases from the API
export async function fetchProductsAndReleases(): Promise<ApiProduct[]> {
  try {
    const response = await fetch('https://run.mocky.io/v3/0841e52e-3cc1-44c3-90f9-20a92cabd419');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products and releases data');
    }
    
    const data: ApiProduct[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products and releases:', error);
    return [];
  }
}

// Function to transform API data into our app's data structure
export function transformApiData(apiData: ApiProduct[]): Product[] {
  // Get unique products
  const uniqueProducts = [...new Set(apiData.map(item => item.product))];
  
  // Create Product objects
  return uniqueProducts.map(productName => {
    // Get all releases for this product
    const productReleases = apiData
      .filter(item => item.product === productName)
      .map(item => item.name);
    
    // Create unique releases for this product
    const uniqueReleases = [...new Set(productReleases)];
    
    // Create Release objects
    const releases: Release[] = uniqueReleases.map(releaseName => {
      return {
        id: `${productName}-${releaseName}`,
        name: releaseName,
        builds: [
          {
            id: `${productName}-${releaseName}-build1`,
            buildNumber: 'Latest',
            date: new Date().toISOString(),
            status: 'passed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: ''
          }
        ]
      };
    });
    
    return {
      id: productName,
      name: productName,
      releases
    };
  });
}
