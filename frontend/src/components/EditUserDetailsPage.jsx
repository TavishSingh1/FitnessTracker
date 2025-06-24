import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import "./EditUserDetailsPage.css";

const EditUserDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        age: "",
        height: "",
        weight: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        userService.getAllUsers().then((res) => {
            if (res.success) {
                const user = res.data.find((u) => u._id === id);
                if (user) {
                    setForm({
                        username: user.username || "",
                        fullName: user.fullName || "",
                        email: user.email || "",
                        password: "", 
                        age: user.age || "",
                        height: user.height || "",
                        weight: user.weight || "",
                    });
                } else {
                    setError("User not found");
                }
            } else {
                setError(res.error || "Failed to fetch user");
            }
            setLoading(false);
        });
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await userService.updateUser(id, form);
        setLoading(false);
        if (res.success) {
            navigate("/profile");
        } else {
            setError(res.error || "Failed to update user");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
        setLoading(true);
        const res = await userService.deleteUser(id);
        setLoading(false);
        if (res.success) {
            navigate("/login");
        } else {
            setError(res.error || "Failed to delete user");
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div className="edit-user-details-container">
            <h2>Edit User Details</h2>
            <form onSubmit={handleSave} className="edit-user-form">
                <label>Username</label>
                <input name="username" value={form.username} onChange={handleChange} required />
                <label>Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required />
                <label>Email</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email" />
                <label>Password</label>
                <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Enter new password or leave blank to keep current" autoComplete="new-password" />
                <label>Age</label>
                <input name="age" value={form.age} onChange={handleChange} required type="number" />
                <label>Height (cm)</label>
                <input name="height" value={form.height} onChange={handleChange} required type="number" />
                <label>Weight (kg)</label>
                <input name="weight" value={form.weight} onChange={handleChange} required type="number" />
                <div className="edit-user-actions">
                    <button type="submit" disabled={loading}>Save Changes</button>
                    <button type="button" onClick={handleCancel} disabled={loading}>Cancel</button>
                </div>
                <div className="edit-user-delete-row">
                    <button type="button" onClick={handleDelete} disabled={loading} style={{ background: "#e74c3c", color: "#fff" }}>Delete Account</button>
                </div>
            </form>
        </div>
    );
};

export default EditUserDetailsPage;
