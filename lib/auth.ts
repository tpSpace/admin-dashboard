import { type User } from "./types"; // Create this type file if needed

// Make sure this function accepts the parameters you're passing
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<void> {
  // Implement your login logic here
  // This could be a fetch request to your authentication API
  console.log("Logging in with", email, password);

  // Example implementation
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  // Return nothing or a token if needed
}

// Function to fetch current user data
export async function getCurrentUser(): Promise<User> {
  // Implement your user fetching logic here
  const response = await fetch("/api/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return await response.json();
}
