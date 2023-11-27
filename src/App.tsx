import React from "react";
import { Route, BrowserRouter, Routes, Outlet } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { Header, ProtectedRoute } from "./components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartContextProvider } from "./context/CartContext";

const Login = React.lazy(() => import("./pages/Login"));
const ProductList = React.lazy(() => import("./pages/ProductList"));
const Cart = React.lazy(() => import("./pages/Cart"));

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000
    }
  }
});

const LayoutWithHeader = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <AuthContextProvider>
          <CartContextProvider>
            <React.Suspense fallback={<>Loading...</>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<ProtectedRoute />}>
                  <Route element={<LayoutWithHeader />}>
                    <Route path="products" element={<ProductList />} />
                    <Route path="cart" element={<Cart />} />
                  </Route>

                  <Route
                    path="*"
                    element={
                      <>
                        <h1>404</h1>
                      </>
                    }
                  />
                </Route>

                <Route
                  path="*"
                  element={
                    <>
                      <h1>404</h1>
                    </>
                  }
                />
              </Routes>
            </React.Suspense>
          </CartContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
