"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  changeCustomerRole,
  Customer,
  getCustomers,
} from "@/lib/api/customers-api";

// Types for the customer dat
export default function CustomersPage() {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const queryClient = useQueryClient();

  // Fetch customers with pagination
  const { data, isLoading, error } = useQuery({
    queryKey: ["customers", page, pageSize],
    queryFn: () => getCustomers(page, pageSize),
  });

  // Role change mutation
  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      changeCustomerRole(id, role),
    onSuccess: () => {
      toast.success("Customer role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      toast.error("Failed to update customer role");
    },
  });

  // Handle role change
  const handleRoleChange = (customer: Customer) => {
    const newRole =
      customer.role.role === "ROLE_CUSTOMER" ? "ROLE_ADMIN" : "ROLE_CUSTOMER";

    if (
      confirm(
        `Change ${customer.firstName}'s role to ${newRole.replace(
          "ROLE_",
          ""
        )}?`
      )
    ) {
      roleMutation.mutate({ id: customer.id, role: newRole });
    }
  };

  // Calculate pagination info
  const totalPages = data?.totalPages || 0;
  const customers = data?.content || [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Customers</h1>
        <div className="flex justify-center py-12">
          <div className="animate-pulse">Loading customers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Customers</h1>
        <div className="border rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">Failed to load customers</p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["customers"] })
            }
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.role.role === "ROLE_ADMIN"
                          ? "default"
                          : "outline"
                      }
                    >
                      {customer.role.role === "ROLE_ADMIN"
                        ? "Admin"
                        : "Customer"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={
                        customer.role.role === "ROLE_ADMIN"
                          ? "outline"
                          : "default"
                      }
                      size="sm"
                      onClick={() => {
                        handleRoleChange(customer);
                        console.log(customer);
                      }}
                      disabled={roleMutation.isPending}
                    >
                      {customer.role.role === "ROLE_ADMIN"
                        ? "Demote to Customer"
                        : "Promote to Admin"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
