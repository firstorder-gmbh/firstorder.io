export interface Defaults {
  image: string; // image key from default variant
  variant: string; // variant key
}

export interface Variant {
  available: number; // available quantity that is not yet reserved
  color: string;
  currency: string; // EUR | USD, or some other
  images: { // multiple images per variant, sorted by key: 01 | 02 | 03 ... 99,
    [key: string]: string // full Download URL
  };
  price: number;
  reserved: number; // reserved quantity in checkout, not yet paid
  size: string; // XS, S, M, L, XL, XLL, or some other
}

// IProduct as an interface
export interface Product {
  _id: string; // document id = autoid
  available: boolean; // if product is available or not
  defaults: Defaults; // see IDefault interface
  descriptions: {
    [key: string]: { // language keys 'ar' | 'en' | 'de'
      [key: string]: string // multiple descriptions per language, sorted by key: 01 | 02 | 03 ... 99,
    };
  };
  names: { // language keys 'ar' | 'en' | 'de'
    [key: string]: string // one name per language
  };
  rating: number;
  tags: { // tags used for search and filter
    [key: string]: boolean; // index key = true
  };
  updated: Date;
  variants: {
    [key: string]: Variant // key = EAN, GTIN, or custom ID, see IVariant interface
  };
}
