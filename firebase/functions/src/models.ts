export interface Variant {
    price: number;
}

export interface Product {
    id: number,
    product_type: string,
    variants: Variant[]
}

export interface Body {
    products: Product[],
}

export interface ProductTb {
    id: number,
    cat: string,
    price: number,
}

export interface ProductPromoted extends ProductTb {
    discount: number,
    newPrice: number,
    promoID: {
        birthdayPromo: number,
        directPromo: number,
        giftPromo: number,
        voucherPromo: number
    }
}

export interface Promotion {
    categoryID: number,
    name: string,
    srange: number,
    erange: number,
    discount: number
}
