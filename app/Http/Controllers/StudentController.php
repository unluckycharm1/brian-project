<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('students', [
            'students' => Student::query()->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birthdate' => 'required|date|before:'.today(),
            'email' => 'required|email|unique:students,email',
            'program' => 'required|string|max:60',
            'gender' => 'required|string|max:60',
            'yr_level' => 'required|integer|min:1|max:4',
        ]);

        Student::create($validated);

        return to_route('students.index')->with('success', 'Student added successfully.');
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birthdate' => 'required|date|before:'.today(),
            'email' => 'required|email|unique:students,email,'.$student->id,
            'program' => 'required|string|max:60',
            'yr_level' => 'required|integer|min:1|max:4',
            'gender' => 'required|string|max:60',
        ]);

        $student->update($validated);

        return to_route('students.index')->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();

        return to_route('students.index')->with('success', 'Student deleted successfully.');
    }
}
