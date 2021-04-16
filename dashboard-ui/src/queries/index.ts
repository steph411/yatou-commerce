import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetProductCategories {
    product_categories {
      name
      id
      image
      description
      parentCategory {
        id
        name
      }
      created_at
      updated_at
      categories {
        id
        name
        image
        description
        created_at
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateProductCategory(
    $name: String!
    $description: String!
    $parentCategoryId: String
  ) {
    insert_product_categories_one(
      object: {
        name: $name
        description: $description
        parent_category_id: $parentCategoryId
      }
    ) {
      id
      name
      description
      created_at
      updated_at
      parent_category_id
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $title: String
    $manufacturer: String
    $brand: String
    $categoryId: String
  ) {
    insert_products_one(
      object: {
        title: $title
        manufacturer: $manufacturer
        brand: $brand
        categoryId: $categoryId
      }
    ) {
      id
      manufacturer
      brand
      product_category {
        id
        name
      }
      vendorId
      created_at
    }
  }
`;

export const GET_PRODUCT_VARIATIONS = gql`
  query GetProductVariations($productId: String) {
    product_variants(where: { productId: { _eq: $productId } }) {
      name
      id
      product {
        title
        brand
        id
      }
      product_variant_options {
        id
        value
        price
        created_at
        updated_at
        product_images {
          id
          url
        }
      }
    }
  }
`;

export const ADD_PRODUCT_VARIATIONS = gql`
  mutation AddProductVariations(
    $productId: String
    $name: String
    $options: product_variant_options_arr_rel_insert_input
  ) {
    insert_product_variants_one(
      object: {
        name: $name
        productId: $productId
        product_variant_options: $options
      }
    ) {
      id
      name
      created_at
      product_variant_options {
        id
        value
        price
        product_images {
          id
          url
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($vendorId: String) {
    products_aggregate(
      where: { status: { _eq: PENDING } }
      order_by: { created_at: desc }
    ) {
      aggregate {
        count
      }
    }
    products(
      where: { vendorId: { _eq: $vendorId } }
      order_by: { created_at: desc }
    ) {
      id
      title
      description
      manufacturer
      brand
      created_at
      vendorId
      status
      product_category {
        id
        name
      }
      user {
        id
        displayName
        email
        contact
        city
        country
        created_at
      }
    }
  }
`;

export const APPROVE_PRODUCTS = gql`
  mutation ApproveProducts($productIds: [String!]!) {
    update_products(
      _set: { status: APPROVED }
      where: { id: { _in: $productIds } }
    ) {
      returning {
        id
        title
        description
        manufacturer
        brand
        created_at
        vendorId
        status
        user {
          id
          displayName
          email
          contact
          city
          country
          created_at
        }
      }
    }
  }
`;

export const REJECT_PRODUCTS = gql`
  mutation RejectProducts($productIds: [String!]!) {
    update_products(
      _set: { status: REJECTED }
      where: { id: { _in: $productIds } }
    ) {
      returning {
        id
        title
        description
        manufacturer
        brand
        created_at
        vendorId
        status
        user {
          id
          displayName
          email
          contact
          city
          country
          created_at
        }
      }
    }
  }
`;

export const ADD_PRODUCT_VARIATION_IMAGES = gql`
  mutation AddProductVariationImages($images: [product_images_insert_input!]!) {
    insert_product_images(objects: $images) {
      returning {
        id
        url
        productVariantOptionId
        product_variant {
          name
          id
        }
      }
    }
  }
`;

export const ADD_PRODUCT_IMAGES = gql`
  mutation AddProductImages($images: [product_images_insert_input!]!) {
    insert_product_images(objects: $images) {
      returning {
        id
        url
        productId
        productVariantId
        product_variant {
          name
          id
        }
      }
    }
  }
`;

export const GET_PRODUCT_IMAGES = gql`
  query GetProductImages($productId: String) {
    product_images(where: { productId: { _eq: $productId } }) {
      id
      url
      created_at
      product {
        id
        title
        created_at
        user {
          id
          displayName
          email
        }
      }
    }
  }
`;

export const UPDATE_PRODUCT_DESCRIPTION = gql`
  mutation UpdateProductDescriptionAndFeatures(
    $description: jsonb
    $productId: String!
    $features: jsonb
    $terms: jsonb
  ) {
    update_products_by_pk(
      pk_columns: { id: $productId }
      _set: {
        description: $description
        keyFeatures: $features
        searchTerms: $terms
      }
    ) {
      id
      title
      description
      searchTerms
      brand
      manufacturer
      product_group {
        name
        id
      }
      status
      product_images {
        id
        url
      }
      product_variants {
        id
        name
        created_at
        updated_at
        product_variant_options {
          id
          value
          created_at
          product_images {
            id
            url
          }
        }
      }
      keyFeatures
      created_at
      updated_at
      user {
        email
        id
        displayName
      }
    }
  }
`;
