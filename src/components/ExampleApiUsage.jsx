import React, { useEffect } from "react";
import useApiStore from "../stores/apiStore";

export default function ExampleComponent() {
  const { data, loading, error, fetchData, postData, putData, deleteData } = useApiStore();

  useEffect(() => {
    // Example GET request
    fetchData("/users");
  }, [fetchData]);

  const handleCreate = () => {
    postData("/users", { name: "John Doe" });
  };

  const handleUpdate = () => {
    putData("/users/1", { name: "Jane Doe" });
  };

  const handleDelete = () => {
    deleteData("/users/1");
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={handleCreate}>Create User</button>
      <button onClick={handleUpdate}>Update User</button>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
}
