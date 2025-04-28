// "use client";

// import { useState } from "react";
// import { useGetOrders } from "@/lib/api/orders-api";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";

// export default function OrdersPage() {
//   const [page, setPage] = useState(0);
//   const pageSize = 10;

//   const { data, isLoading, error } = useGetOrders(page, pageSize);
//   const orders = data?.content || [];
//   const totalPages = data?.totalPages || 0;

//   if (isLoading) return <p>Loading orders…</p>;
//   if (error) return <p>Error loading orders</p>;

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-xl font-bold mb-4">My Orders</h1>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Total</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {orders.map((o) => (
//             <TableRow key={o.id}>
//               <TableCell>{o.id}</TableCell>
//               <TableCell>
//                 {new Date(o.orderDate).toLocaleDateString()}
//               </TableCell>
//               <TableCell>{o.status}</TableCell>
//               <TableCell>${o.total.toFixed(2)}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       <div className="flex justify-center space-x-2 mt-4">
//         <Button
//           disabled={page === 0}
//           onClick={() => setPage((p) => Math.max(0, p - 1))}
//         >
//           Previous
//         </Button>
//         <span className="px-4 py-1">
//           Page {page + 1} of {totalPages}
//         </span>
//         <Button
//           disabled={page + 1 >= totalPages}
//           onClick={() => setPage((p) => p + 1)}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
