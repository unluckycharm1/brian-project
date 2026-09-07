import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    GraduationCap,
    Plus,
    UserRound,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type RecentStudent = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    program: string;
    yr_level: number;
};

type Props = {
    studentCount: number;
    programCount: number;
    yearLevelCounts: Record<string, number>;
    recentStudents: RecentStudent[];
};

const statStyles = [
    { label: 'Total students', icon: Users, tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { label: 'Programs', icon: BookOpen, tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { label: 'Year levels', icon: GraduationCap, tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
    { label: 'Latest intake', icon: BarChart3, tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
];

export default function Dashboard({
    studentCount,
    programCount,
    yearLevelCounts,
    recentStudents,
}: Props) {
    const activeYearLevels = Object.keys(yearLevelCounts).length;

    return (
        <>
            <Head title="Dashboard" />
            <main className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 sm:p-6 lg:p-8">
                <section className="relative isolate overflow-hidden rounded-2xl border bg-card px-6 py-7 shadow-sm sm:px-8">
                    <div className="pointer-events-none absolute -right-12 -top-20 -z-10 size-72 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 right-20 -z-10 h-24 w-48 rounded-full bg-emerald-500/10 blur-2xl" />
                    <div className="relative max-w-2xl">
                        <Badge variant="secondary" className="mb-3">Student records</Badge>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Good morning, ready to make an impact?</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Keep your directory accurate, discover trends, and make every student record easy to find.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href="/students?create=1"><Plus /> Add student</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/students"><Users /> Browse directory</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="absolute bottom-6 right-8 hidden items-end gap-2 opacity-90 md:flex" aria-hidden="true">
                        <div className="h-16 w-28 -rotate-6 rounded-md border-2 border-primary/30 bg-primary/10 shadow-sm" />
                        <div className="h-20 w-32 rotate-3 rounded-md border-2 border-primary/50 bg-primary/20 shadow-sm" />
                        <GraduationCap className="mb-2 size-12 text-primary" />
                    </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {statStyles.map(({ label, icon: Icon, tone }, index) => {
                        const value = [studentCount, programCount, activeYearLevels, recentStudents.length][index];
                        const detail = ['Across all programs', 'Represented in your directory', 'With active records', 'Shown in this snapshot'][index];

                        return (
                            <Card key={label} className="gap-3 py-4">
                                <CardHeader className="px-4">
                                    <div className="flex items-center justify-between">
                                        <CardDescription>{label}</CardDescription>
                                        <div className={`rounded-lg p-2 ${tone}`}><Icon className="size-4" /></div>
                                    </div>
                                    <CardTitle className="text-3xl">{value}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 text-xs text-muted-foreground">{detail}</CardContent>
                            </Card>
                        );
                    })}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Recent students</CardTitle>
                            <CardDescription>The latest records added to your directory.</CardDescription>
                            <CardAction>
                                <Button asChild variant="ghost" size="sm"><Link href="/students">View all <ArrowRight /></Link></Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/40 text-xs text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Student</th>
                                            <th className="px-6 py-3 font-medium">Program</th>
                                            <th className="px-6 py-3 text-right font-medium">Level</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {recentStudents.map((student) => (
                                            <tr key={student.id} className="transition-colors hover:bg-muted/30">
                                                <td className="px-6 py-3">
                                                    <div className="flex min-w-48 items-center gap-3">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                            {student.first_name[0]}{student.last_name[0]}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium">{student.first_name} {student.last_name}</p>
                                                            <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3"><Badge variant="outline">{student.program}</Badge></td>
                                                <td className="px-6 py-3 text-right text-muted-foreground">Year {student.yr_level}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {recentStudents.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No students have been added yet.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Quick access</CardTitle>
                            <CardDescription>Common directory actions.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 p-4">
                            <Link href="/students?create=1" className="group flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50">
                                <span className="rounded-lg bg-primary/10 p-2 text-primary"><Plus className="size-5" /></span>
                                <span className="flex-1"><span className="block font-medium">Add a student</span><span className="text-xs text-muted-foreground">Create a new record</span></span>
                                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link href="/students" className="group flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50">
                                <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600"><UserRound className="size-5" /></span>
                                <span className="flex-1"><span className="block font-medium">Review directory</span><span className="text-xs text-muted-foreground">Search and edit records</span></span>
                                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </Link>
                            <div className="mt-2 rounded-xl bg-muted/50 p-4">
                                <div className="mb-3 flex items-center justify-between text-sm font-medium"><span>Directory coverage</span><span>{studentCount > 0 ? 'Active' : 'Empty'}</span></div>
                                <div className="h-2 overflow-hidden rounded-full bg-border"><div className="h-full w-full rounded-full bg-primary" /></div>
                                <p className="mt-2 text-xs text-muted-foreground">Your student data is connected to MySQL.</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
