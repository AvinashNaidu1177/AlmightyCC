import React, { useState } from "react";
import { Course, recalcConflicts } from "./FFCSTimetableGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit2, Trash2 } from "lucide-react";

const THEORY_GROUPS = {
 theory: [["A1"], ["B1"], ["C1"], ["D1"], ["E1"], ["F1"], ["G1"], ["A2"], ["B2"], ["C2"], ["D2"], ["E2"], ["F2"], ["G2"]],
 tutorial: [["TA1"], ["TB1"], ["TC1"], ["TD1"], ["TE1"], ["TF1"], ["TG1"], ["TA2"], ["TB2"], ["TC2"], ["TD2"], ["TE2"], ["TF2"], ["TG2"]],
 tutorial2: [["TAA1"], ["TBB1"], ["TCC1"], ["TDD1"], ["TAA2"], ["TBB2"], ["TCC2"], ["TDD2"]],
 special: [["S1"], ["S2"], ["S3"], ["S4"], ["S11"], ["S15"]],
};

const LAB_GROUPS = {
 morning: [["L1", "L2"], ["L3", "L4"], ["L5", "L6"], ["L7", "L8"], ["L9", "L10"], ["L11", "L12"], ["L13", "L14"], ["L15", "L16"], ["L17", "L18"], ["L19", "L20"], ["L21", "L22"], ["L23", "L24"], ["L25", "L26"], ["L27", "L28"], ["L29", "L30"]],
 afternoon: [["L31", "L32"], ["L33", "L34"], ["L35", "L36"], ["L37", "L38"], ["L39", "L40"], ["L41", "L42"], ["L43", "L44"], ["L45", "L46"], ["L47", "L48"], ["L49", "L50"], ["L51", "L52"], ["L53", "L54"], ["L55", "L56"], ["L57", "L58"], ["L59", "L60"]],
};

export default function FFCSControls({ courses, setCourses }: { courses: Course[], setCourses: React.Dispatch<React.SetStateAction<Course[]>> }) {
 // Removed toast
 const [editingId, setEditingId] = useState<string | number | null>(null);
 const [currentPane, setCurrentPane] = useState<"theory" | "lab">("theory");

 const [form, setForm] = useState({
 code: "", name: "", faculty: "", room: "", credits: ""
 });
 const [selectedCombos, setSelectedCombos] = useState<string[][]>([]);

 const handleSelectSlot = (combo: string[]) => {
 let newCombos = [...selectedCombos];

 const comboStr = JSON.stringify(combo);
 const exists = newCombos.some(c => JSON.stringify(c) === comboStr);

 if (exists) {
 newCombos = newCombos.filter(c => JSON.stringify(c) !== comboStr);
 } else {
 // If the user selects a theory or tutorial slot, we shouldn't necessarily wipe out labs. 
 // They are independent. We just add it to the array of selected items.
 newCombos.push(combo);
 }
 setSelectedCombos(newCombos);
 };

 const autoPopulate = () => {
 try {
 const attRaw = localStorage.getItem("attendance");
 if (!attRaw) {
 toast.error("No attendance data found to auto-populate.");
 return;
 }
 const attData = JSON.parse(attRaw);
 if (!attData.attendance || !Array.isArray(attData.attendance)) return;

 let updatedCourses = [...courses];
 let addedCount = 0;

 attData.attendance.forEach((item: any) => {
 const code = item.courseCode;
 const existing = updatedCourses.find(c => c.code.toUpperCase() === code?.toUpperCase());
 if (existing) return; // skip if already added

 if (!item.slotName || item.slotName === "NIL") return; // skip if no slot

 const rawSlots = item.slotName.split("+").map((s: string) => s.trim());
 if (!rawSlots.length) return;

 const credits = item.credits ? Number(item.credits) : 0;
 
 const newCourse: Course = {
 id: Date.now() + Math.random(),
 code: code || "UNKNOWN",
 name: item.courseTitle || "",
 faculty: item.faculty || "",
 room: item.slotVenue || "",
 credits: isNaN(credits) ? 0 : credits,
 slots: rawSlots,
 combos: [rawSlots], // Simplified combination
 hasConflict: false
 };

 updatedCourses.push(newCourse);
 addedCount++;
 });

 if (addedCount > 0) {
 updatedCourses = recalcConflicts(updatedCourses);
 setCourses(updatedCourses);
 toast.success(`Auto-populated ${addedCount} courses from your VTOP data!`);
 } else {
 toast.info("No new courses found to add.");
 }
 } catch (e) {
 console.error(e);
 toast.error("Failed to parse attendance data for auto-population.");
 }
 };

 const executeAddCourse = () => {
 const credits = Number(form.credits);
 if (form.credits.trim() !== "" && (!Number.isInteger(credits) || credits < 0)) {
 toast.error("Invalid credits value.");
 return;
 }

 const allSlots = Array.from(new Set(selectedCombos.flat()));
 if (!allSlots.length) {
 toast.error("Select at least one slot.");
 return;
 }

 const newCourse: Course = {
 id: editingId ? editingId : Date.now(),
 code: form.code.toUpperCase(),
 name: form.name.trim(),
 faculty: form.faculty.trim(),
 room: form.room.trim(),
 credits: form.credits.trim() !== "" ? credits : 0,
 slots: allSlots,
 combos: selectedCombos,
 hasConflict: false
 };

 let updatedCourses = [...courses];
 if (editingId) {
 const idx = updatedCourses.findIndex(c => c.id === editingId);
 if (idx !== -1) updatedCourses[idx] = newCourse;
 } else {
 updatedCourses.push(newCourse);
 }

 updatedCourses = recalcConflicts(updatedCourses);
 setCourses(updatedCourses);
 setForm({ code: "", name: "", faculty: "", room: "", credits: "" });
 setSelectedCombos([]);
 setEditingId(null);
 
 const savedCourse = updatedCourses.find(c => c.id === newCourse.id);
 if (savedCourse && savedCourse.hasConflict) {
 toast.warning(`Warning: ${newCourse.code} added, but there is a time clash!`);
 } else {
 toast.success(`${newCourse.code} ${editingId ? "updated" : "added"}.`);
 }
 };

 const handleAddCourse = () => {
 if (!form.code.trim()) {
 toast.error("Course code is required.");
 return;
 }

 const isDuplicate = courses.some(c => c.code.toUpperCase() === form.code.toUpperCase() && c.id !== editingId);
 if (isDuplicate) {
 toast(`Course code ${form.code} already exists.`, {
 description: "Are you sure you want to add it anyway?",
 action: {
 label: "Confirm",
 onClick: () => executeAddCourse()
 }
 });
 return;
 }
 
 executeAddCourse();
 };

 const editCourse = (c: Course) => {
 setEditingId(c.id);
 setForm({ code: c.code, name: c.name, faculty: c.faculty, room: c.room, credits: c.credits ? c.credits.toString() : "" });
 setSelectedCombos(c.combos || []);
 const isLab = c.slots[0] && c.slots[0].startsWith("L");
 setCurrentPane(isLab ? "lab" : "theory");
 window.scrollTo({ top: 0, behavior: "smooth" });
 };

 const deleteCourse = (id: string | number) => {
 const updated = courses.filter(c => c.id !== id);
 setCourses(recalcConflicts(updated));
 };

 const clearForm = () => {
 setEditingId(null);
 setForm({ code: "", name: "", faculty: "", room: "", credits: "" });
 setSelectedCombos([]);
 };

 const renderSlotGroup = (label: string, groups: string[][]) => (
 <div className="mb-4">
 <div className="text-xs text-gray-500 font-mono mb-2">// {label}</div>
 <div className="flex flex-wrap gap-2">
 {groups.map((combo, i) => {
 const comboStr = JSON.stringify(combo);
 const isSelected = selectedCombos.some(c => JSON.stringify(c) === comboStr);
 return (
 <button
 key={i}
 onClick={() => handleSelectSlot(combo)}
 className={`px-3 py-1.5 text-xs font-mono rounded-full border transition-colors ${isSelected ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/30" : "bg-[#1f2937] border-gray-700 text-gray-300 hover:border-purple-400"}`}
 >
 {combo.join(" + ")}
 </button>
 );
 })}
 </div>
 </div>
 );

 return (
 <div className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2">
 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course Code *</label>
 <Input placeholder="e.g. BCSE205L" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="font-mono uppercase" />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course Name</label>
 <Input placeholder="e.g. Data Structures" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Faculty</label>
 <Input placeholder="Dr. Ramesh Kumar" value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })} />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Room No</label>
 <Input placeholder="AB-4 303" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Credits</label>
 <Input type="number" placeholder="4" min="1" max="10" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} />
 </div>
 </div>

 <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
 <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800">
 <div className="flex bg-gray-800 p-1 rounded-md">
 <button onClick={() => setCurrentPane("theory")} className={`px-4 py-1.5 text-xs font-bold rounded ${currentPane === "theory" ? "bg-gray-700 text-purple-400 shadow-sm" : "text-gray-500"}`}>THEORY</button>
 <button onClick={() => setCurrentPane("lab")} className={`px-4 py-1.5 text-xs font-bold rounded ${currentPane === "lab" ? "bg-gray-700 text-pink-400 shadow-sm" : "text-gray-500"}`}>LAB</button>
 </div>
 {selectedCombos.length > 0 && (
 <div className="text-sm font-mono text-gray-300">
 &gt; <span className="text-purple-400 font-bold">{Array.from(new Set(selectedCombos.flat())).join(" + ")}</span>
 </div>
 )}
 </div>

 {currentPane === "theory" && (
 <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
 {renderSlotGroup("Theory Slots", THEORY_GROUPS.theory)}
 {renderSlotGroup("Tutorial 1 Slots", THEORY_GROUPS.tutorial)}
 {renderSlotGroup("Tutorial 2 Slots", THEORY_GROUPS.tutorial2)}
 {renderSlotGroup("Special Slots", THEORY_GROUPS.special)}
 </div>
 )}
 {currentPane === "lab" && (
 <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
 {renderSlotGroup("Morning Lab Pairs", LAB_GROUPS.morning)}
 {renderSlotGroup("Afternoon Lab Pairs", LAB_GROUPS.afternoon)}
 </div>
 )}
 </div>

 <div className="flex justify-between items-center">
 <div className="flex gap-3">
 <Button onClick={handleAddCourse} className="bg-purple-600 hover:bg-purple-700 text-white font-bold w-40">
 {editingId ? "Update Course" : "Add Course"}
 </Button>
 <Button variant="outline" onClick={clearForm}>Clear</Button>
 </div>
 <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:border-purple-900/50 dark:hover:bg-purple-900/20" onClick={autoPopulate}>
 Auto-Populate from VTOP
 </Button>
 </div>

 {/* Courses List */}
 {courses.length > 0 && (
 <div className="mt-8 border-t border-gray-800 pt-6">
 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Added Courses</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
 {recalcConflicts(courses).map(c => (
 <div key={c.id} className={`p-3 rounded-lg border ${c.hasConflict ? "border-red-500 bg-red-900/10" : "border-gray-800 bg-gray-900"} flex flex-col gap-1`}>
 <div className="flex justify-between items-start">
 <div className={`font-bold font-mono ${c.hasConflict ? "text-red-400" : "text-purple-400"}`}>{c.code}</div>
 <div className="flex gap-1">
 <button onClick={() => editCourse(c)} className="p-1.5 hover:bg-gray-900 dark:hover:bg-gray-800 rounded text-gray-500"><Edit2 className="w-3 h-3" /></button>
 <button onClick={() => deleteCourse(c.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"><Trash2 className="w-3 h-3" /></button>
 </div>
 </div>
 <div className="text-xs text-gray-400 font-mono">{c.slots.join("+")}</div>
 <div className="text-sm truncate">{c.name || "—"}</div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
}
