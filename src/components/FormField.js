function FormField({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={props.rows || 4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...props}
        />
      ) : (
        <input
          type={type}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...props}
        />
      )}
    </div>
  );
}
export default FormField;