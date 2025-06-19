"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function ProfileDetails() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    orders: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ ...parsedUser, password: "" }); // clear password for safety
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
  const userId = localStorage.getItem("token");
  if (!userId) {
    alert("User not logged in.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        name: user.name.trim(),
        email: user.email.trim(),
        password: user.password.trim(), // send empty string if not updating
      }),
    });

    console.log("Update response:", res);
    

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Update failed");
      return;
    }

    setUser({ ...data.user, password: "" });
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Profile updated successfully!");
    window.location.reload(); // reload to reflect changes
  } catch (error) {
    console.error("Update error:", error);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Profile Details
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-black border-b pb-2">Personal Info</h2>
            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-black font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full mt-1 text-black px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-black font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 text-black border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-black font-medium">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="w-full mt-1 text-black px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`w-full text-white font-semibold py-2 px-4 rounded-md transition ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>

          {Array.isArray(user.orders) && user.orders.length === 0 ? (
  <p className="text-gray-600 text-center">No orders found.</p>
) : (
  <ul className="max-w-md mx-auto divide-y divide-gray-200">
    {user.orders?.map((order) => (
      <li key={order.id} className="py-4 flex justify-between">
        <span className="font-medium text-gray-900">{order.id}</span>
        <span className="text-indigo-600 font-semibold">
          ₹{(order.amount / 100).toFixed(2)}
        </span>
      </li>
    ))}
  </ul>
)}

        </div>
      </div>
      <Footer />
    </>
  );
}
