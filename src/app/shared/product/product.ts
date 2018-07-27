export interface IProduct {
  categories: object;
  descriptions: object;
  id: string;
  names: object;
  variants: object;
}

export class Product {
  constructor(
    public id: string,
    public categories: object,
    public descriptions: object,
    public names: object,
    public variants: object
  ) { }
}
