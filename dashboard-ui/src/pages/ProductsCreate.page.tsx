import React, { useState, useRef } from "react";
import { AuthState } from "src/Auth";
import { Breadcrumb, Tabs } from "antd";
import { Link } from "react-router-dom";
import ProductsGeneral from "@components/ProductsGeneral";
import ProductsVariations from "@components/ProductsVariations";
import ProductsImages from "@components/ProductsImages";
import ProductsDescription from "@components/ProductsDescription";
import { useNavigate } from "react-router-dom";

interface Props {
  authState: AuthState;
}

const ProductsCreatePage: React.FC<Props> = ({ authState }) => {
  const [productId, setProductId] = useState("");
  const [tabActiveKey, setTabActiveKey] = useState("general");
  const navigate = useNavigate();

  const handleTabChange = (key: any) => {
    setTabActiveKey(key);
  };
  const tabRef = useRef(null);
  const sections = [
    {
      name: "general",
      component: (
        <ProductsGeneral
          onNext={() => setTabActiveKey("variations")}
          productId={productId}
          setProductId={setProductId}
        />
      ),
    },
    {
      name: "variations",
      component: (
        <ProductsVariations
          onNext={() => setTabActiveKey("images")}
          productId={productId}
          setProductId={setProductId}
        />
      ),
    },
    {
      name: "images",
      component: (
        <ProductsImages
          onNext={() => setTabActiveKey("description")}
          productId={productId}
        />
      ),
    },
    {
      name: "description",
      component: (
        <ProductsDescription
          onNext={() => navigate("/products")}
          productId={productId}
        />
      ),
    },
  ];

  return (
    <section>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/products">
            <a>products</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>create</Breadcrumb.Item>
      </Breadcrumb>
      <main>
        <Tabs
          activeKey={tabActiveKey}
          onChange={handleTabChange}
          defaultActiveKey="general"
          tabBarStyle={{
            background: "var(--background-darker)",
            width: "70%",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
            margin: "0 auto",
          }}
          centered
        >
          {sections.map((el) => {
            return (
              <Tabs.TabPane
                tab={
                  <span className="text-lg font-semibold text-gray-600">
                    {el.name}
                  </span>
                }
                key={el.name}
              >
                <div className="rounded-md shadow min-h-80 bg-cold-gray-50">
                  {el.component}
                </div>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </main>
    </section>
  );
};

export default ProductsCreatePage;
