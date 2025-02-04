import React from 'react'
import { useDispatch } from 'react-redux';
import { addNewOrder,fetchOrderDetails, removeItemFromCart, updateQuantity } from '../store/productSlice';
import "./Cartbasket.css";
export default function Cartbasket({orders,closeModal}) {
 const dispatch=useDispatch();
    function placeOrder(){
        if(orders.length==0)return;
        localStorage.setItem("ordersInCart",[]);
        dispatch(fetchOrderDetails(orders));
        closeModal();
        //console.log("responseForAddedProduct",responseForAddedProduct);
      }
      function cancelOrder(){
        dispatch(addNewOrder([]));
        localStorage.setItem("ordersInCart",[]);
        closeModal();
      }
      const handleQuantityChange = (index, newQuantity) => {
        debugger;
        dispatch(updateQuantity({pid:index,quantity:newQuantity}))
      };
    
      const handleRemoveItem = (product_id) => {
        dispatch(removeItemFromCart(product_id));
      };
    
      const calculateSubtotal = () => {
        return orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
      };
      if(orders.length==0){
        return <div>currently nothing has been added to the Cart.</div>
      }
    
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) => (
            <tr key={index}>
              <td>{item.product_name}</td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  className="quantity"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(item.product_id, e.target.value)
                  }
                />
              </td>
              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  className="remove"
                  onClick={() => handleRemoveItem(item.product_id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
              Subtotal:
            </td>
            <td style={{ fontWeight: "bold" }}>
              ₹{calculateSubtotal().toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div className="action-section">
        <button id="place-order" name="place-order" onClick={placeOrder}>
          Place order
        </button>
        <button id="cancel-order" name="cancel-order" onClick={cancelOrder}>
          Cancel order
        </button>
      </div>
    </div>
  );
}
