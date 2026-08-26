<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::all();
    }

    public function create()
    {

    }

    public function store(Request $request) // Fixed 'request' capitalization and '$requst' typo
    {

    }

    public function update(Request $request, Student $student) // Added missing space in 'public function' and capitalized 'Request'
    {

    }

    public function destroy(Student $student)
    {
        
    }
}