import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ManageHotel() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);

  const [room, setRoom] = useState({
    type: "",
    price: "",
    guests: 1,
    image: "",
  });

  // EDIT STATE (must be inside component)
  const [editingIndex, setEditingIndex] = useState(null);
  const [editRoom, setEditRoom] = useState({
    type: "",
    price: "",
    guests: "",
    image: "",
  });

  // ================= FETCH HOTEL =================
  const fetchHotel = () => {
    fetch(`http://localhost:5000/api/hotels/${id}`)
      .then((res) => res.json())
      .then(setHotel);
  };

  useEffect(() => {
    fetchHotel();
  }, [id]);

  // ================= ADD ROOM =================
  const addRoom = async () => {
    const res = await fetch(`http://localhost:5000/api/hotels/${id}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(room),
    });

    if (!res.ok) return alert("Failed to add room");

    alert("Room added");
    setRoom({ type: "", price: "", guests: 1, image: "" });
    fetchHotel();
  };

  // ================= DELETE ROOM =================
  const deleteRoom = async (roomIndex) => {
    const res = await fetch(
      `http://localhost:5000/api/hotels/${id}/rooms/${roomIndex}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
    );

    if (!res.ok) return alert("Delete failed");

    fetchHotel();
  };

  // ================= START EDIT =================
  const startEdit = (room, index) => {
    setEditingIndex(index);
    setEditRoom(room);
  };

  // ================= UPDATE ROOM =================
  const updateRoom = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/hotels/${id}/rooms/${editingIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(editRoom),
        },
      );

      if (!res.ok) return alert("Update failed");

      alert("Room updated");
      setEditingIndex(null);
      fetchHotel();
    } catch (err) {
      console.log(err);
    }
  };

  if (!hotel) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-5">Manage Rooms — {hotel.name}</h1>

      {/* ADD ROOM */}
      <div className="flex gap-3 mb-8">
        <input
          placeholder="Room Type"
          value={room.type}
          onChange={(e) => setRoom({ ...room, type: e.target.value })}
          className="border p-2"
        />

        <input
          placeholder="Price"
          value={room.price}
          onChange={(e) => setRoom({ ...room, price: e.target.value })}
          className="border p-2"
        />

        <select
          value={room.guests}
          onChange={(e) => setRoom({ ...room, guests: e.target.value })}
          className="border p-2"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>

        <input
          placeholder="Image URL"
          value={room.image}
          onChange={(e) => setRoom({ ...room, image: e.target.value })}
          className="border p-2"
        />

        <button
          onClick={addRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </div>

      {/* ROOM LIST */}
      <h2 className="text-xl mb-3">Available Rooms</h2>

      {hotel.rooms?.map((room, index) => (
        <div key={index} className="border p-4 mt-3 rounded">
          {editingIndex === index ? (
            <>
              <input
                value={editRoom.type}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, type: e.target.value })
                }
                className="border p-2 mr-2"
              />

              <input
                value={editRoom.price}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, price: e.target.value })
                }
                className="border p-2 mr-2"
              />

              <select
                value={editRoom.guests}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, guests: e.target.value })
                }
                className="border p-2 mr-2"
              >
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>

              <input
                value={editRoom.image}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, image: e.target.value })
                }
                className="border p-2 mr-2"
              />

              <button
                onClick={updateRoom}
                className="bg-blue-500 text-white px-3 py-1"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <img src={room.image} width="150" alt="room" />

              <p>{room.type}</p>
              <p>₹{room.price}</p>
              <p>Guests: {room.guests}</p>

              <button
                onClick={() => startEdit(room, index)}
                className="bg-yellow-500 text-white px-3 py-1 mr-2"
              >
                Edit
              </button>

              <button
                onClick={() => deleteRoom(index)}
                className="bg-red-500 text-white px-3 py-1"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManageHotel;
