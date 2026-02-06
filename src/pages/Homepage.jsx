import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NewProductsPage from "./NewProductsPage";
import { stopEditingOrder } from "../store/productSlice";

export default function Homepage() {
  const dispatch = useDispatch();
  const editingOrderId = useSelector((state) => state.product.editingOrderId);

  return (
    <div>
      {editingOrderId && (
        <div
          style={{
            background: "#fff3cd",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 12,
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Editing Order #{editingOrderId}
          <button
            style={{
              border: "none",
              background: "transparent",
              color: "#b45309",
              cursor: "pointer",
              fontWeight: 700,
            }}
            onClick={() => dispatch(stopEditingOrder())}
          >
            Cancel
          </button>
        </div>
      )}

      <NewProductsPage />
    </div>
  );
}
