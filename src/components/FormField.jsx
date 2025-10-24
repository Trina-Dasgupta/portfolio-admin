import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function FormField({ type='text', id, label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground sm:text-base">{label}</Label>
      <Input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="text-sm text-foreground sm:text-base"
        required
      />
    </div>
  );
}