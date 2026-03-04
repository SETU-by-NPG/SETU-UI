import { useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  X,
  User,
  Phone,
  Stethoscope,
  Heart,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared";

// ─── Zod Schema ────────────────────────────────────────────────────────────────

const studentEditSchema = z.object({
  // Personal
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  ethnicity: z.string().optional(),
  nationality: z.string().optional(),
  firstLanguage: z.string().optional(),
  eal: z.boolean(),
  // Academic
  upn: z
    .string()
    .min(13, "UPN must be at least 13 characters")
    .max(13, "UPN must be 13 characters"),
  yearGroup: z.string().min(1, "Year group is required"),
  formClass: z.string().optional(),
  // Finance Flags
  pupilPremium: z.boolean(),
  fsm: z.boolean(),
  lookedAfter: z.boolean(),
  // Medical
  medicalNotes: z.string().optional(),
  allergies: z.string().optional(),
  // Contact
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  // SEN
  senType: z.string().optional(),
  senNeeds: z.string().optional(),
});

type StudentEditFormValues = z.infer<typeof studentEditSchema>;

// ─── Default Values (mock — normally fetched by ID) ───────────────────────────

const DEFAULT_VALUES: StudentEditFormValues = {
  firstName: "Emma",
  lastName: "Thompson",
  preferredName: "Em",
  dateOfBirth: "2013-06-14",
  gender: "FEMALE",
  ethnicity: "White British",
  nationality: "British",
  firstLanguage: "English",
  eal: false,
  upn: "A820199011001",
  yearGroup: "Y7",
  formClass: "7A",
  pupilPremium: false,
  fsm: false,
  lookedAfter: false,
  medicalNotes: "",
  allergies: "",
  addressLine1: "14 Maple Street",
  addressLine2: "",
  city: "Bristol",
  postcode: "BS1 4JQ",
  senType: "",
  senNeeds: "",
};

// ─── Reusable Field Components ─────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  children: ReactNode;
}

function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function StudentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<StudentEditFormValues>({
    resolver: zodResolver(studentEditSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (data: StudentEditFormValues) => {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    console.info("Saved student data:", data);
    toast.success("Student profile updated successfully.");
    reset(data); // Mark form as clean
    navigate(`/students/${id}`);
  };

  const handleCancel = () => {
    if (isDirty) {
      setCancelConfirmOpen(true);
    } else {
      navigate(`/students/${id}`);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="gap-1.5 text-gray-500 h-7 -ml-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Profile
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-base font-semibold text-gray-900">
            Edit Student
          </h1>
          {isDirty && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
              Unsaved changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={saving}
          >
            <X className="h-3.5 w-3.5 mr-1.5" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-auto p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* ── Personal ──────────────────────────────────────────────── */}
          <SectionCard
            icon={<User className="h-4 w-4 text-blue-500" />}
            title="Personal Information"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="firstName"
                label="First Name"
                required
                error={errors.firstName?.message}
              >
                <Input id="firstName" {...register("firstName")} />
              </Field>
              <Field
                id="lastName"
                label="Last Name"
                required
                error={errors.lastName?.message}
              >
                <Input id="lastName" {...register("lastName")} />
              </Field>
              <Field
                id="preferredName"
                label="Preferred Name"
                error={errors.preferredName?.message}
              >
                <Input id="preferredName" {...register("preferredName")} />
              </Field>
              <Field
                id="dateOfBirth"
                label="Date of Birth"
                required
                error={errors.dateOfBirth?.message}
              >
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                />
              </Field>
              <Field
                id="gender"
                label="Gender"
                required
                error={errors.gender?.message}
              >
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="NON_BINARY">Non-binary</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field
                id="ethnicity"
                label="Ethnicity"
                error={errors.ethnicity?.message}
              >
                <Input id="ethnicity" {...register("ethnicity")} />
              </Field>
              <Field
                id="nationality"
                label="Nationality"
                error={errors.nationality?.message}
              >
                <Input id="nationality" {...register("nationality")} />
              </Field>
              <Field
                id="firstLanguage"
                label="First Language"
                error={errors.firstLanguage?.message}
              >
                <Input id="firstLanguage" {...register("firstLanguage")} />
              </Field>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Controller
                name="eal"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="eal"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="eal" className="cursor-pointer">
                English as an Additional Language (EAL)
              </Label>
            </div>
          </SectionCard>

          {/* ── Academic ─────────────────────────────────────────────── */}
          <SectionCard
            icon={<GraduationCap className="h-4 w-4 text-indigo-500" />}
            title="Academic"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="upn" label="UPN" required error={errors.upn?.message}>
                <Input id="upn" {...register("upn")} className="font-mono" />
              </Field>
              <Field
                id="yearGroup"
                label="Year Group"
                required
                error={errors.yearGroup?.message}
              >
                <Controller
                  name="yearGroup"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="yearGroup">
                        <SelectValue placeholder="Select year group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Y7", "Y8", "Y9", "Y10", "Y11", "Y12", "Y13"].map(
                          (y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field
                id="formClass"
                label="Form Class"
                error={errors.formClass?.message}
              >
                <Input id="formClass" {...register("formClass")} />
              </Field>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "pupilPremium" as const, label: "Pupil Premium" },
                { name: "fsm" as const, label: "Free School Meals (FSM)" },
                {
                  name: "lookedAfter" as const,
                  label: "Looked After Child (LAC)",
                },
              ].map(({ name, label }) => (
                <div key={name} className="flex items-center gap-2">
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={name} className="cursor-pointer text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── Contact ───────────────────────────────────────────────── */}
          <SectionCard
            icon={<Phone className="h-4 w-4 text-green-500" />}
            title="Address"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="addressLine1"
                label="Address Line 1"
                error={errors.addressLine1?.message}
              >
                <Input id="addressLine1" {...register("addressLine1")} />
              </Field>
              <Field id="addressLine2" label="Address Line 2">
                <Input id="addressLine2" {...register("addressLine2")} />
              </Field>
              <Field id="city" label="City / Town" error={errors.city?.message}>
                <Input id="city" {...register("city")} />
              </Field>
              <Field
                id="postcode"
                label="Postcode"
                error={errors.postcode?.message}
              >
                <Input
                  id="postcode"
                  {...register("postcode")}
                  className="uppercase"
                />
              </Field>
            </div>
          </SectionCard>

          {/* ── Medical ───────────────────────────────────────────────── */}
          <SectionCard
            icon={<Stethoscope className="h-4 w-4 text-red-500" />}
            title="Medical"
          >
            <div className="space-y-4">
              <Field
                id="medicalNotes"
                label="Medical Notes"
                error={errors.medicalNotes?.message}
              >
                <Textarea
                  id="medicalNotes"
                  {...register("medicalNotes")}
                  placeholder="Describe any medical conditions, ongoing treatments, or care plans..."
                  rows={3}
                />
              </Field>
              <Field
                id="allergies"
                label="Known Allergies"
                error={errors.allergies?.message}
              >
                <Input
                  id="allergies"
                  {...register("allergies")}
                  placeholder="e.g. Peanuts, Penicillin (comma-separated)"
                />
              </Field>
            </div>
          </SectionCard>

          {/* ── SEN ───────────────────────────────────────────────────── */}
          <SectionCard
            icon={<Heart className="h-4 w-4 text-purple-500" />}
            title="SEN"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="senType"
                label="Primary SEN Type"
                error={errors.senType?.message}
              >
                <Controller
                  name="senType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="senType">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {[
                          "ADHD",
                          "ASD",
                          "DYSLEXIA",
                          "EAL",
                          "HI",
                          "VI",
                          "MLD",
                          "SLD",
                          "SEMH",
                          "OTHER",
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field
                id="senNeeds"
                label="Additional SEN Needs / Notes"
                error={errors.senNeeds?.message}
              >
                <Textarea
                  id="senNeeds"
                  {...register("senNeeds")}
                  placeholder="Describe specific needs, strategies, or adjustments required..."
                  rows={3}
                />
              </Field>
            </div>
          </SectionCard>

          {/* Bottom action bar */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="gap-1.5 min-w-[130px]"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {/* Cancel confirmation */}
      <ConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        title="Discard unsaved changes?"
        description="You have unsaved changes that will be lost if you leave this page. Are you sure you want to discard them?"
        confirmLabel="Discard Changes"
        cancelLabel="Keep Editing"
        variant="destructive"
        onConfirm={() => navigate(`/students/${id}`)}
      />
    </div>
  );
}
