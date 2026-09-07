import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowUpDown, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Student = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    program: string;
    gender: string;
    birthdate: string;
    yr_level: number;
};

type Props = {
    students: Student[];
};

type PageProps = {
    flash?: {
        success?: string;
    };
};

type StudentForm = {
    first_name: string;
    last_name: string;
    email: string;
    program: string;
    gender: string;
    birthdate: string;
    yr_level: string;
};

type SortOrder = 'name-asc' | 'name-desc' | 'year-asc' | 'year-desc';

const emptyForm: StudentForm = {
    first_name: '',
    last_name: '',
    email: '',
    program: '',
    gender: '',
    birthdate: '',
    yr_level: '1',
};

export default function Students({ students }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return new URLSearchParams(window.location.search).get('create') === '1';
    });
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');
    const form = useForm<StudentForm>(emptyForm);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);
    const normalizedSearch = search.trim().toLowerCase();
    const filteredStudents = students
        .filter((student) =>
            [
                student.first_name,
                student.last_name,
                student.email,
                student.program,
                student.gender,
                student.birthdate,
                student.yr_level,
            ].some((value) => String(value).toLowerCase().includes(normalizedSearch)),
        )
        .sort((firstStudent, secondStudent) => {
            if (sortOrder === 'year-asc' || sortOrder === 'year-desc') {
                return sortOrder === 'year-asc'
                    ? firstStudent.yr_level - secondStudent.yr_level
                    : secondStudent.yr_level - firstStudent.yr_level;
            }

            const firstName = `${firstStudent.last_name} ${firstStudent.first_name}`;
            const secondName = `${secondStudent.last_name} ${secondStudent.first_name}`;
            const nameComparison = firstName.localeCompare(secondName);

            return sortOrder === 'name-asc' ? nameComparison : -nameComparison;
        });

    const openCreate = () => {
        setEditingStudent(null);
        form.reset();
        form.setData('yr_level', '1');
        setIsFormOpen(true);
    };

    const openEdit = (student: Student) => {
        setEditingStudent(student);
        setIsFormOpen(true);
        form.setData({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            program: student.program,
            gender: student.gender,
            birthdate: student.birthdate.slice(0, 10),
            yr_level: String(student.yr_level),
        });
    };

    const closeForm = () => {
        setEditingStudent(null);
        setIsFormOpen(false);
        form.reset();
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const options = {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                setEditingStudent(null);
                setIsFormOpen(false);
                form.reset();
            },
            onError: () => {
                toast.error('Please check the highlighted fields and try again.');
            },
        };

        if (editingStudent) {
            form.put(`/students/${editingStudent.id}`, options);
        } else {
            form.post('/students', options);
        }
    };

    const remove = (student: Student) => {
        if (window.confirm(`Delete ${student.first_name} ${student.last_name}?`)) {
            form.delete(`/students/${student.id}`);
        }
    };

    return (
        <>
            <Head title="Students" />
            <main className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
                        <p className="text-muted-foreground">Manage student records in your database.</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus />
                        Add student
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <InputGroup className="max-w-xl flex-1">
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupInput
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search students..."
                            aria-label="Search students"
                        />
                        <InputGroupAddon align="inline-end">
                            {filteredStudents.length} {filteredStudents.length === 1 ? 'result' : 'results'}
                        </InputGroupAddon>
                    </InputGroup>

                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
                        <Label htmlFor="student-sort" className="sr-only">Sort students</Label>
                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                            <SelectTrigger id="student-sort" className="w-full sm:w-44" aria-label="Sort students">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name-asc">Name A to Z</SelectItem>
                                <SelectItem value="name-desc">Name Z to A</SelectItem>
                                <SelectItem value="year-asc">Year 1 to 4</SelectItem>
                                <SelectItem value="year-desc">Year 4 to 1</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingStudent ? 'Edit student' : 'Add student'}</DialogTitle>
                            <DialogDescription>
                                {editingStudent ? 'Update this student record.' : 'Add a new student to the directory.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                                {Object.keys(form.errors).length > 0 && (
                                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2">
                                        Please correct the highlighted fields before saving.
                                    </p>
                                )}
                                {[
                                    ['first_name', 'First name', 'text'],
                                    ['last_name', 'Last name', 'text'],
                                    ['email', 'Email', 'email'],
                                    ['program', 'Program', 'text'],
                                    ['gender', 'Gender', 'text'],
                                    ['birthdate', 'Birthdate', 'date'],
                                ].map(([name, label, type]) => (
                                    <div className="grid gap-2" key={name}>
                                        <Label htmlFor={name}>{label}</Label>
                                        <Input
                                            id={name}
                                            type={type}
                                            value={form.data[name as keyof StudentForm]}
                                            onChange={(event) => form.setData(name as keyof StudentForm, event.target.value)}
                                            required
                                        />
                                        <InputError message={form.errors[name as keyof StudentForm]} />
                                    </div>
                                ))}
                                <div className="grid gap-2">
                                    <Label htmlFor="yr_level">Year level</Label>
                                    <Input id="yr_level" type="number" min="1" max="4" value={form.data.yr_level} onChange={(event) => form.setData('yr_level', event.target.value)} required />
                                    <InputError message={form.errors.yr_level} />
                                </div>
                                <div className="flex gap-2 sm:col-span-2">
                                    <Button type="submit" disabled={form.processing}>
                                        {editingStudent ? 'Save changes' : 'Add student'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={closeForm}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>

                <Card>
                    <CardContent className="overflow-x-auto p-0">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/40 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">Program</th>
                                    <th className="px-4 py-3 font-medium">Year</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{student.email}</td>
                                        <td className="px-4 py-3">{student.program}</td>
                                        <td className="px-4 py-3">{student.yr_level}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(student)} aria-label={`Edit ${student.first_name} ${student.last_name}`}><Pencil /></Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => remove(student)} aria-label={`Delete ${student.first_name} ${student.last_name}`}><Trash2 /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && <p className="p-8 text-center text-muted-foreground">No students found.</p>}
                    </CardContent>
                </Card>
            </main>
        </>
    );
}

Students.layout = {
    breadcrumbs: [{ title: 'Students', href: '/students' }],
};
