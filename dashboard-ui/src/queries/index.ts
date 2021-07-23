import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetProductCategories($name: String, $lowerDate: timestamptz, $upperDate: timestamptz) {
    product_categories(where: {
      _and : [
        {name: {_ilike: $name}},
        {created_at: {_gte: $lowerDate}},
        {created_at: {_lte: $upperDate}}  
      ]
    }
    ){
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

export const GET_PRODUCT = gql`
  query GetProduct($productId: String!){
    products_by_pk(id: $productId){
      title
      categoryId
      product_category{id, name, description}
      brand
      price
      created_at
      product_group{
        name
      }
      status
      isDeleted
      keyFeatures
      description
      manufacturer
      id
      productGroupId
      product_images{
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
      product_variants{
        name
        id
        product {
          title
          brand
          id
        }
        product_images{id, url}
        product_variant_options{
          id
          price
          value
          created_at
          updated_at
          product_images{id, url}
        }
      }
      searchTerms
      vendorId
      characteristics
      user{adress, city, contact, email, id}
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $title: String
    $manufacturer: String
    $brand: String
    $categoryId: String
    $price: bigint
  ) {
    insert_products_one(
      object: {
        title: $title
        manufacturer: $manufacturer
        brand: $brand
        categoryId: $categoryId
        price: $price
      }
    ) {
      title
      categoryId
      product_category{id, name, description}
      brand
      price
      created_at
      product_group{
        name
      }
      status
      isDeleted
      keyFeatures
      description
      manufacturer
      id
      productGroupId
      product_images{
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
      product_variants{
        name
        id
        product {
          title
          brand
          id
        }
        product_images{id, url}
        product_variant_options{
          id
          price
          value
          created_at
          updated_at
          product_images{id, url}
        }
      }
      searchTerms
      vendorId
      characteristics
      user{adress, city, contact, email, id}
    }
  }
`;
export const UPDATE_PRODUCT_GENERAL = gql`
  mutation UpdateProductGeneralInformations(
    $title: String
    $manufacturer: String
    $brand: String
    $categoryId: String
    $price: bigint
    $productId: String!
  ) {
    update_products_by_pk(pk_columns:{id: $productId}, _set:{
      title: $title
      manufacturer: $manufacturer
      brand: $brand
      categoryId: $categoryId
      price: $price
    }){
      title
      categoryId
      product_category{id, name, description}
      brand
      price
      created_at
      product_group{
        name
      }
      status
      isDeleted
      keyFeatures
      description
      manufacturer
      id
      productGroupId
      product_images{
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
      product_variants{
        name
        id
        product {
          title
          brand
          id
        }
        product_images{id, url}
        product_variant_options{
          id
          price
          value
          created_at
          updated_at
          product_images{id, url}
        }
      }
      searchTerms
      vendorId
      characteristics
      user{adress, city, contact, email, id}
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


export const GET_PRODUCTS_ADMIN = gql`

query GetProductsAsAdmin{
    products_aggregate(
      where: { status: { _eq: PENDING } }
      order_by: { created_at: desc }
    ) {
      aggregate {
        count
      }
    }
    products(
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


`


export const GET_PRODUCTS_VENDOR = gql`
  query GetProductsAsVendor($vendorId: String) {
    products_aggregate(
      where: {
        _and : [
          { status: { _eq: PENDING } },
          { vendorId: { _eq: $vendorId } }
        ] 
      },
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

export const GET_FILTERED_PRODUCTS_VENDOR = gql`
  query GetFilteredProductsAsVendor($vendorId: String, $name: String, $statuses: [product_statuses_enum!]!, $lowerDate: timestamptz, $upperDate: timestamptz) {
    products_aggregate(
      where: {
        _and : [
          {created_at: {_gte: $lowerDate}},
          {created_at: {_lte: $upperDate}},
          { status: { _eq: PENDING } },
          { vendorId: { _eq: $vendorId } }
        ] 
      },
      order_by: { created_at: desc }
    ) {
      aggregate {
        count
      }
    }
    products(
      where: {
        _and : [
          {created_at: {_gte: $lowerDate}},
          {created_at: {_lte: $upperDate}},
          {status:{_in: $statuses}},
          {title: {_ilike: $name}},
          { vendorId: { _eq: $vendorId } }
        ] 
      },
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

export const GET_FILTERED_PRODUCTS_ADMIN = gql`
  query GetFilteredProductsAsAdmin($vendor: String, $name: String, $statuses: [product_statuses_enum!]!, $lowerDate: timestamptz, $upperDate: timestamptz) {
    products_aggregate(
      where: {
        _and : [
          {created_at: {_gte: $lowerDate}},
          {created_at: {_lte: $upperDate}},
          {status: { _eq: PENDING }},
        ] 
      },
      order_by: { created_at: desc }
    ) {
      aggregate {
        count
      }
    }
    products(
      where: {
        _and : [
          {created_at: {_gte: $lowerDate}},
          {created_at: {_lte: $upperDate}},
          {status:{_in: $statuses}},
          {title: {_ilike: $name}},
          {user:{displayName:{_ilike: $vendor }}}
        ] 
      },
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


export const GET_USERS = gql`
  query GetUsers($name:String, $role: user_roles_enum){
    users(where:{_and:[
      {displayName:{_ilike: $name}},
      {role:{_eq: $role}}
    ]}){
      id
      displayName
      created_at
      updated_at
      email
      photoUrl
    }
  }





`


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


export const DELETE_PRODUCT_IMAGES = gql`
  mutation deleteProductImages($productId: String!){
    delete_product_images(where:{productId: {_eq: $productId}}){
      returning{id}
    }
  }
`;


export const DELETE_PRODUCT_VARIATION_IMAGES = gql`
  mutation deleteProductVariationsImages($variationOptionId: String!){
    delete_product_images(where:{productVariantOptionId: {_eq: $variationOptionId}}){
      returning{id}
    }
  }
`;


export const UPDATE_PRODUCT_DESCRIPTION = gql`
  mutation UpdateProductDescriptionAndFeatures(
    $description: jsonb
    $productId: String!
    $features: jsonb
    $terms: jsonb
    $characteristics: jsonb
  ) {
    update_products_by_pk(
      pk_columns: { id: $productId }
      _set: {
        description: $description
        keyFeatures: $features
        searchTerms: $terms
        characteristics: $characteristics
      }
    ) {
      title
      categoryId
      product_category{id, name, description}
      brand
      price
      created_at
      product_group{
        name
      }
      status
      isDeleted
      keyFeatures
      description
      manufacturer
      id
      productGroupId
      product_images{
        id
        url
      }
      product_variants{
        name
        id
        product_images{id, url}
        product_variant_options{
          id
          price
          value
          product_images{id, url}
        }
      }
      searchTerms
      vendorId
      characteristics
      user{adress, city, contact, email, id}
    }
  }
`;



export const UPDATE_TERMS_AND_CONDITIONS = gql`
  mutation SaveTerms($vendor: jsonb, $shipper: jsonb, $customer: jsonb, $version: Int){
    insert_terms(objects:[{
      vendor: $vendor,
      shipper: $shipper,
      customer: $customer,
      version: $version
    }],
    on_conflict: {
      constraint: terms_version_key,
      update_columns: [vendor, shipper, customer]
    }
    ){
      returning{
        version
        vendor
        shipper
        customer
        updated_at
        
      }
    }
  }



`;



export const GET_TERMS_AND_CONDITIONS = gql`

  query GetTerms($version: Int){
    terms(where: {version: {_eq: $version}}){
      created_at
      vendor
      shipper
      customer
      version
      updated_at
    }
  }

`;