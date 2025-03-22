import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import OrderImg from "./OrderImg";
import { format, parseISO } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";

const MyOrders = () => {
  const ITEMS_PER_PAGE = 2;
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [currentItems, setCurrentItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  // Fetch all orders for the authenticated user
  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          "http://localhost:8001/api/order/view-order",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedOrders = response.data.data.orders;
        setOrders(fetchedOrders);
        setDisplayedOrders(fetchedOrders.slice(0, ITEMS_PER_PAGE));
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch orders.");
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [isSignedIn, getToken, navigate]);

  const fetchMoreData = () => {
    if (isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      const nextItems = orders.slice(0, currentItems + ITEMS_PER_PAGE);
      setDisplayedOrders(nextItems);
      setCurrentItems(currentItems + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 1500);
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId) => {
    try {
      const token = await getToken();
      await axios.delete(
        `http://localhost:8001/api/order/delete-order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      setDisplayedOrders(updatedOrders.slice(0, currentItems));
      setSuccessMessage("Order deleted successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete order.");
      setSuccessMessage("");
      console.error("Error deleting order:", err);
    }
  };

  // Handle order detail navigation
  const handleViewOrder = (orderId) => {
    navigate(`/account/orders/${orderId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="border-b border-gray-300 pb-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MY ORDERS</h1>
      </div>

      {/* Display orders as cards */}
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <InfiniteScroll
          dataLength={displayedOrders.length}
          next={fetchMoreData}
          hasMore={displayedOrders.length < orders.length}
          loader={
            <div className="text-center py-4">
              <div className="flex flex-col items-center gap-2">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="text-gray-600">Loading more orders...</p>
              </div>
            </div>
          }
          endMessage={
            <p className="text-center text-gray-600 py-4">
              No more orders to load.
            </p>
          }
        >
          <div className="space-y-6">
            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="card bg-base-100 shadow-md border border-gray-200 rounded-lg hover:shadow-xl hover:cursor-pointer transition delay-50 duration-100 ease-in-out hover:scale-101"
                onClick={() => handleViewOrder(order.id)}
              >
                <div className="card-body">
                  {/* Order Header */}
                  <div className="flex justify-between items-center">
                    <h2 className="card-title text-lg font-semibold">
                      Order #{order.id} -{" "}
                      {format(parseISO(order.order_date), "dd/MM/yyyy hh:mm a")}
                    </h2>
                    <div className="flex gap-2">
                      <span
                        className={`badge rounded ${
                          order.shipment_status === "Pending"
                            ? "badge-warning"
                            : order.shipment_status === "Shipped"
                            ? "badge-info"
                            : "badge-success"
                        }`}
                      >
                        Shipment: <strong>{order.shipment_status}</strong>
                      </span>
                      <span
                        className={`badge rounded  ${
                          order.payment_status === "Unpaid"
                            ? "badge-error"
                            : "badge-success"
                        }`}
                      >
                        Payment: <strong>{order.payment_status}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-4">
                    <h3 className="text-md font-medium">Items:</h3>
                    <OrderImg order={order} />
                  </div>

                  {/* Total Amount */}
                  <p className="mt-2 text-md font-medium">
                    Total: ฿{Number(order.total_amount).toLocaleString()}
                  </p>

                  {/* Card Actions */}
                  <div className="card-actions mt-4 flex justify-end">
                    {order.payment_status === "Unpaid" && (
                      <Link to={`/checkout/${order.id}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="btn bg-black btn-sm text-white rounded hover:bg-gray-700 transition delay-50 duration-100 ease-in-out hover:scale-105"
                        >
                          Continue to payment
                        </button>
                      </Link>
                    )}
                    {order.shipment_status === "Pending" &&
                      order.payment_status === "Unpaid" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOrder(order.id);
                          }}
                          className="btn btn-ghost btn-sm bg-gray-300 text-white hover:bg-gray-200 transition delay-50 duration-100 ease-in-out hover:scale-90"
                        >
                          Delete
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}

      {/* Display success or error messages */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mt-4">{successMessage}</p>
      )}
    </div>
  );
};

export default MyOrders;