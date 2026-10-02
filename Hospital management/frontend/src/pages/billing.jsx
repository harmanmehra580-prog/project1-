import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const initialForm = {
    patient: "",
    doctorFee: "",
    medicineFee: "",
    otherCharges: "",
    discount: "",
    paidAmount: ""
};

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState("");
    const [editForm, setEditForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const totals = useMemo(() => {
        const doctorFee = Number(form.doctorFee) || 0;
        const medicineFee = Number(form.medicineFee) || 0;
        const otherCharges = Number(form.otherCharges) || 0;
        const discount = Number(form.discount) || 0;
        const paidAmount = Number(form.paidAmount) || 0;

        const totalAmount = doctorFee + medicineFee + otherCharges - discount;
        const dueAmount = Math.max(totalAmount - paidAmount, 0);

        return {
            totalAmount,
            dueAmount,
            status: dueAmount === 0 ? "Paid" : paidAmount > 0 ? "Partial" : "Unpaid"
        };
    }, [form]);

    const startEdit = (bill) => {
        setEditingId(bill._id);
        setEditForm({
            patient: bill.patient?._id || "",
            doctorFee: bill.doctorFee ?? "",
            medicineFee: bill.medicineFee ?? "",
            otherCharges: bill.otherCharges ?? "",
            discount: bill.discount ?? "",
            paidAmount: bill.paidAmount ?? ""
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const { data } = await api.post("/bills", {
                ...form,
                doctorFee: Number(form.doctorFee) || 0,
                medicineFee: Number(form.medicineFee) || 0,
                otherCharges: Number(form.otherCharges) || 0,
                discount: Number(form.discount) || 0,
                paidAmount: Number(form.paidAmount) || 0
            });

            setBills((current) => [data, ...current]);
            setForm(initialForm);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to create bill.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const { data } = await api.put(`/bills/${editingId}`, {
                ...editForm,
                doctorFee: Number(editForm.doctorFee) || 0,
                medicineFee: Number(editForm.medicineFee) || 0,
                otherCharges: Number(editForm.otherCharges) || 0,
                discount: Number(editForm.discount) || 0,
                paidAmount: Number(editForm.paidAmount) || 0
            });

            setBills((current) => current.map((bill) => (bill._id === editingId ? data : bill)));
            setEditingId("");
            setEditForm(initialForm);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to update bill.");
        }
    };

    const handleDelete = async (billId) => {
        const target = bills.find((bill) => bill._id === billId);
        if (!window.confirm(`Delete bill for ${target?.patient?.name || "this patient"}?`)) return;

        try {
            await api.delete(`/bills/${billId}`);
            setBills((current) => current.filter((bill) => bill._id !== billId));
            if (editingId === billId) {
                setEditingId("");
                setEditForm(initialForm);
            }
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to delete bill.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [billResponse, patientResponse] = await Promise.all([
                    api.get("/bills"),
                    api.get("/patients")
                ]);

                setBills(billResponse.data);
                setPatients(patientResponse.data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to load billing data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main>
            <h1>Billing</h1>

            <form onSubmit={handleSubmit}>
                <h2>Create Bill</h2>

                <select name="patient" value={form.patient} onChange={handleChange} required>
                    <option value="">Select patient</option>
                    {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                            {patient.patientId} - {patient.name}
                        </option>
                    ))}
                </select>

                <input name="doctorFee" type="number" min="0" step="0.01" value={form.doctorFee} onChange={handleChange} placeholder="Doctor fee" />
                <input name="medicineFee" type="number" min="0" step="0.01" value={form.medicineFee} onChange={handleChange} placeholder="Medicine fee" />
                <input name="otherCharges" type="number" min="0" step="0.01" value={form.otherCharges} onChange={handleChange} placeholder="Other charges" />
                <input name="discount" type="number" min="0" step="0.01" value={form.discount} onChange={handleChange} placeholder="Discount" />
                <input name="paidAmount" type="number" min="0" step="0.01" value={form.paidAmount} onChange={handleChange} placeholder="Paid amount" />

                <div>
                    <strong>Total:</strong> ₹{totals.totalAmount.toFixed(2)}
                </div>
                <div>
                    <strong>Due:</strong> ₹{totals.dueAmount.toFixed(2)}
                </div>
                <div>
                    <strong>Status:</strong> {totals.status}
                </div>

                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Create Bill"}
                </button>
            </form>

            {editingId && (
                <form onSubmit={handleUpdate}>
                    <h2>Edit Bill</h2>
                    <select name="patient" value={editForm.patient} onChange={handleEditChange} required>
                        <option value="">Select patient</option>
                        {patients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                                {patient.patientId} - {patient.name}
                            </option>
                        ))}
                    </select>
                    <input name="doctorFee" type="number" min="0" step="0.01" value={editForm.doctorFee} onChange={handleEditChange} placeholder="Doctor fee" />
                    <input name="medicineFee" type="number" min="0" step="0.01" value={editForm.medicineFee} onChange={handleEditChange} placeholder="Medicine fee" />
                    <input name="otherCharges" type="number" min="0" step="0.01" value={editForm.otherCharges} onChange={handleEditChange} placeholder="Other charges" />
                    <input name="discount" type="number" min="0" step="0.01" value={editForm.discount} onChange={handleEditChange} placeholder="Discount" />
                    <input name="paidAmount" type="number" min="0" step="0.01" value={editForm.paidAmount} onChange={handleEditChange} placeholder="Paid amount" />
                    <button type="submit">Update Bill</button>
                    <button type="button" onClick={() => { setEditingId(""); setEditForm(initialForm); }}>Cancel</button>
                </form>
            )}

            {loading && <p>Loading bills...</p>}
            {!loading && !error && bills.length === 0 && <p>No bills found.</p>}

            {!loading && bills.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Due</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr key={bill._id}>
                                <td>{bill.patient?.name || "Unknown"}</td>
                                <td>₹{Number(bill.totalAmount || 0).toFixed(2)}</td>
                                <td>₹{Number(bill.paidAmount || 0).toFixed(2)}</td>
                                <td>₹{Number(bill.dueAmount || 0).toFixed(2)}</td>
                                <td>{bill.status}</td>
                                <td>
                                    <button type="button" onClick={() => startEdit(bill)}>Edit</button>
                                    <button type="button" onClick={() => handleDelete(bill._id)} style={{ marginLeft: "8px" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default Billing;
