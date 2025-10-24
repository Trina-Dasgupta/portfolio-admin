import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function FormTextarea({ id, label, value, onChange, placeholder, rows }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground sm:text-base" >{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="resize-none text-sm text-foreground sm:text-base"
        required
      />
    </div>
  );
}
